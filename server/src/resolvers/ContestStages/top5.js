import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import schedule from 'node-schedule';
import axios from 'axios';
import { UploadAndSetData, UnlinkFile } from '../../services/uploadS3Bucket';
import { sendEmail } from '../../services/awsSES';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    top5Profiles: combineResolvers(isAuthenticated, async (parent, { gender }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h". ');

      return await sequelize
        .query(
          `
            select
              top_5s.customer_id as id,
              full_name, email, phone, score, top_10_final_rank, is_scored,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic,
              case when video is null then 'No' else 'Yes' end as video,
              dense_rank () over (order by score desc) top_5_rank
            from
              top_5s
              left outer join customers on customers.id = top_5s.customer_id
              left outer join profiles on profiles.customer_id = top_5s.customer_id
            where
              top_5s.active is true
              ${gender ? `and top_5s.gender = '${gender}'` : ''}
            order by score desc, top_10_final_rank, top_5s.customer_id desc
          `
        )
        .then((res) => res[0]);
    }),

    top5IDs: combineResolvers(isAuthenticated, async (parent, { gender }, { models }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h". ');

      return await models.Top5.findAll({ attributes: ['customer_id'], where: { active: true, gender } });
    }),

    top5DataByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      return await sequelize
        .query(
          `
            select video, score, top_10_final_rank, top_5_rank
            from
              top_5s as outer_top_5_table
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_5_rank
                from
                  top_5s as inner_top_5_table
                  left outer join customers on customers.id = ${customer_id}
                where inner_top_5_table.gender = customers.gender
              ) as rank_table on rank_table.customer_id = outer_top_5_table.customer_id
            where
              outer_top_5_table.active is true
              and outer_top_5_table.customer_id = ${customer_id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    top5LeaderboardBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              top5_table.customer_id as id, full_name, email, slug, score, top_5_rank, city,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic
            from
              top_5s as top5_table
              left outer join customers on customers.id = top5_table.customer_id
              left outer join profiles on profiles.customer_id = top5_table.customer_id
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_5_rank
                from top_5s as inner_top5_table
                ${gender ? `where inner_top5_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = top5_table.customer_id
            where
              top5_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and top5_table.gender = '${gender}'` : ''}
            order by full_name
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },
  },

  Mutation: {
    startTop5Activity: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
      if (status !== true && status !== false)
        throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'stop_top10' },
      });
      if (status === true && !prevStageStatus.active)
        throw new UserInputError('Please turn-off the activity of top-10 candidates first.');

      const nextStageStatus = await models.ContestStage.findOne({ attributes: ['active'], where: { stage: 'winner' } });
      if (status === false && nextStageStatus.active)
        throw new UserInputError('Next stage of the contest is already active. Cannot disable a previous stage.');

      await models.ContestStage.update({ active: status }, { where: { stage: 'top5' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (status) {
        const top5All = await sequelize.query(
          `
            select customer_id, email, phone, full_name
            from
              top_5s
              left outer join customers on customers.id = customer_id
            where
              top_5s.active is true
              and customers.active is true
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        );

        let top5AllIDs = [];

        if (top5All && top5All.length) {
          top5AllIDs = top5All.map(({ customer_id }) => customer_id);

          const disqualified = await sequelize.query(
            `
              select customer_id, email, full_name
              from
                top_20s
                left outer join customers on customers.id = customer_id
              where
                top_20s.active is true
                and top_20s.customer_id not in (${top5AllIDs})
                and customers.active is true
            `,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

          // Send e-mail & SMS to Top-5 winners
          schedule.scheduleJob(`sendMail-top5Winners`, new Date(Date.now() + 2000), async () => {
            for await (const contestant of top5All) {
              const sendEmailArgs = {
                templateName: 'top5Winners',
                templateData: { name: contestant.full_name.split(' ')[0] },
                toAddress: contestant.email.toLowerCase(),
                subject: 'Congratulations you are in Top 10 | OMG – Face Of The Year 2025',
              };
              sendEmail(sendEmailArgs).then(
                () => console.log(`Top-5 mail successfully sent to: ${contestant.email.toLowerCase()}.`),
                (err) => {
                  console.log(`Error while sending top-5 mail to: ${contestant.email.toLowerCase()}.`);
                  console.dir(err.message);
                }
              );

              const smsText =
                'Dear Candidate,%0aCongratulations! You have made it to Grand Finale of OMG face of the Year. Hop into your glamorous outfits and be ready for the G Finale.%0aRegards,%0aOMG - Face Of The Year 2025';
              await axios
                .post(
                  `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${contestant.phone}&message=${smsText}&sender=OMGFOY&route=4`
                )
                .then((res) =>
                  console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${contestant.phone} : `, res.data)
                )
                .catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${contestant.phone} : `, err));
            }
          });

          // Send e-mail to disqualified from Top-5
          if (disqualified && disqualified.length) {
            schedule.scheduleJob(`sendMail-top5Losers`, new Date(Date.now() + 2000), async () => {
              for await (const contestant of disqualified) {
                const sendEmailArgs = {
                  templateName: 'top5Losers',
                  templateData: { name: contestant.full_name.split(' ')[0] },
                  toAddress: contestant.email.toLowerCase(),
                  subject: 'Important News from OMG – Face Of The Year 2025',
                };
                sendEmail(sendEmailArgs).then(
                  () =>
                    console.log(
                      `Disqualified from Top-5 mail successfully sent to: ${contestant.email.toLowerCase()}.`
                    ),
                  (err) => {
                    console.log(
                      `Error while sending disqualified from top-5 mail to: ${contestant.email.toLowerCase()}.`
                    );
                    console.dir(err.message);
                  }
                );
              }
            });
          }
        }
      } else
        await models.ContestStage.update({ active: !status }, { where: { stage: 'stop_top5' } }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    stopTop5Activity: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'top5' },
      });
      if (!prevStageStatus.active) throw new UserInputError('Please finalise top-5 candidates first.');

      await models.ContestStage.update({ active: true }, { where: { stage: 'stop_top5' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    uploadTop5Video: combineResolvers(isAuthenticated, async (parent, { video }, { models, me }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'gender', 'slug'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      if (video) {
        const updateVideo = await UploadAndSetData({
          file: video,
          variable: 'file',
          uploadFolder: 'top-5',
          isVideo: true,
          appendSlug: foundCustomer.slug || `customer-id-${me.id}`,
        });

        const isTop5 = await models.Top5.findOne({
          attributes: ['id', 'score', 'is_scored', 'video'],
          where: { customer_id: Number(me.id) },
        });

        if (updateVideo.file && isTop5 && !isTop5.is_scored) {
          if (isTop5.video)
            await UnlinkFile(isTop5.video, 'top-5').catch((err) =>
              console.log('Error while deleting video from Top-5 profile: ', err)
            );

          await isTop5.update({ video: updateVideo.file });
        } else if (isTop5 && isTop5.is_scored) {
          throw new UserInputError('Previous video has already been scored and cannot be changed.');
        } else
          await models.Top5.create({
            customer_id: Number(me.id),
            gender: foundCustomer.gender,
            video: updateVideo.file,
            score: 0,
            active: true,
            created_by: 0,
          }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });
      }

      return true;
    }),

    upsertTop5VideoFromCMS: combineResolvers(
      isAuthenticated,
      async (parent, { video, customer_id }, { models, me }) => {
        const foundCustomer = await models.Customer.findOne({
          attributes: ['id', 'gender', 'slug'],
          where: { id: Number(customer_id) },
        });
        if (!foundCustomer) throw new UserInputError('Invalid contestant.');

        if (video) {
          const updateVideo = await UploadAndSetData({
            file: video,
            variable: 'file',
            uploadFolder: 'top-5',
            isVideo: true,
            appendSlug: foundCustomer.slug || `customer-id-${customer_id}`,
          });

          const isTop5 = await models.Top5.findOne({
            attributes: ['id', 'score', 'is_scored', 'video'],
            where: { customer_id: Number(customer_id) },
          });

          if (updateVideo.file && isTop5) {
            if (isTop5.video)
              await UnlinkFile(isTop5.video, 'top-5').catch((err) =>
                console.log('Error while deleting video from Top-5 profile: ', err)
              );

            await isTop5.update({ video: updateVideo.file });
          } else if (updateVideo.file)
            await models.Top5.create({
              customer_id: Number(customer_id),
              gender: foundCustomer.gender,
              video: updateVideo.file,
              score: 0,
              active: true,
              created_by: 0,
            }).catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });
        }

        return true;
      }
    ),

    scoreTop5Video: combineResolvers(isAuthenticated, async (parent, { customer_id, score }, { models }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id'],
        where: { id: Number(customer_id), active: true },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      const foundScore = await models.Top5.findOne({
        attributes: ['id', 'score'],
        where: { customer_id: Number(customer_id), active: true },
      });
      if (foundScore)
        await foundScore.update({ score, is_scored: true }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    finaliseTop5: combineResolvers(
      isAuthenticated,
      async (parent, { add_customer_ids, delete_customer_ids }, { models, me }) => {
        if (!add_customer_ids.length && !delete_customer_ids.length)
          throw new UserInputError('Please SELECT / DE-SELECT a few contestants before proceeding.');

        const finalisedFemales = await models.Top5.count({ where: { gender: 'f', active: true } });

        let addFemales = null;
        if (add_customer_ids.length)
          addFemales = await sequelize.query(
            `
							select customer_id
							from
								top_10s
								left outer join customers on customers.id = customer_id
							where
								top_10s.active is true
								and customer_id in (${add_customer_ids})
								and top_10s.gender = 'f'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addFemales && addFemales.length) {
          let deleteFemales = null;
          if (delete_customer_ids.length)
            deleteFemales = await sequelize.query(
              `
								select customer_id from top_5s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'f'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteFemalesLength = deleteFemales ? deleteFemales.length : 0;

          if (!deleteFemalesLength && finalisedFemales && finalisedFemales >= 5)
            throw new UserInputError(
              'Top-5 female contestants have already been finalised. More females cannot be added.'
            );

          const remainingToAdd = 5 - (finalisedFemales || 0) + deleteFemalesLength;
          if (addFemales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 5) female contestants can be added in Top-5, and ${addFemales.length} females were selected.`
            );
        }

        const finalisedMales = await models.Top5.count({ where: { gender: 'm', active: true } });
    
        let addMales = null;
        if (add_customer_ids.length)
          addMales = await sequelize.query(
            `
							select customer_id
							from
								top_10s
								left outer join customers on customers.id = customer_id
							where
								top_10s.active is true
								and customer_id in (${add_customer_ids})
								and top_10s.gender = 'm'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addMales && addMales.length) {
          let deleteMales = null;
          if (delete_customer_ids.length)
            deleteMales = await sequelize.query(
              `
								select customer_id from top_5s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'm'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteMalesLength = deleteMales ? deleteMales.length : 0;

          if (!deleteMalesLength && finalisedMales && finalisedMales >= 5)
            throw new UserInputError('Top-5 male contestants have already been finalised. More males cannot be added.');

          const remainingToAdd = 5 - (finalisedMales || 0) + deleteMalesLength;
          if (addMales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 5) male contestants can be added in Top-5, and ${addMales.length} males were selected.`
            );
        }

        
        

        if (addFemales && addFemales.length) {
          for await (const female of addFemales) {
            const foundFemale = await models.Top5.findOne({
              attributes: ['id'],
              where: { customer_id: Number(female.customer_id) },
            });
            if (foundFemale)
              await foundFemale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top5.create({
                customer_id: Number(female.customer_id),
                gender: 'f',
                score: 0,
                active: true,
                created_by: Number(me.id),
              }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
          }
        }

        if (addMales && addMales.length) {
          for await (const male of addMales) {
            const foundMale = await models.Top5.findOne({
              attributes: ['id'],
              where: { customer_id: Number(male.customer_id) },
            });
            if (foundMale)
              await foundMale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top5.create({
                customer_id: Number(male.customer_id),
                gender: 'm',
                score: 0,
                active: true,
                created_by: Number(me.id),
              }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
          }
        }

        const finalisedHairstylist = await models.Top5.count({ where: { gender: 'h', active: true } });
    
        let addHairstylist = null;
        if (add_customer_ids.length)
          addHairstylist = await sequelize.query(
            `
							select customer_id
							from
								top_10s
								left outer join customers on customers.id = customer_id
							where
								top_10s.active is true
								and customer_id in (${add_customer_ids})
								and top_10s.gender = 'h'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addHairstylist && addHairstylist.length) {
          let deleteHairstylist = null;
          if (delete_customer_ids.length)
            deleteHairstylist = await sequelize.query(
              `
								select customer_id from top_5s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'h'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteHairstylistLength = deleteHairstylist ? deleteHairstylist.length : 0;

          if (!deleteHairstylistLength && finalisedHairstylist && finalisedHairstylist >= 5)
            throw new UserInputError('Top-5 HairStylist contestants have already been finalised. More HairStylist cannot be added.');

          const remainingToAdd = 5 - (finalisedHairstylist || 0) + deleteHairstylistLength;
          if (addHairstylist.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 5) HairStylist contestants can be added in Top-5, and ${addHairstylist.length} HairStylist were selected.`
            );
        }


        if (addHairstylist && addHairstylist.length) {
          for await (const hairstylist of addHairstylist) {
            const foundHairstylist = await models.Top5.findOne({
              attributes: ['id'],
              where: { customer_id: Number(hairstylist.customer_id) },
            });
            if (foundHairstylist)
              await foundHairstylist.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top5.create({
                customer_id: Number(hairstylist.customer_id),
                gender: 'h',
                score: 0,
                active: true,
                created_by: Number(me.id),
              }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
          }
        }


        if (delete_customer_ids && delete_customer_ids.length)
          await models.Top5.destroy({ where: { customer_id: delete_customer_ids } }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    ),
  },
};
