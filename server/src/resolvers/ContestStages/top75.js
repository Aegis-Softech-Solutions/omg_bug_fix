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
    top75Profiles: combineResolvers(isAuthenticated, async (parent, { gender }) => {
      if (gender && gender !== 'm' && gender !== 'f')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f".');

      return await sequelize
        .query(
          `
            select
              top_75s.customer_id as id,
              full_name, email, phone, score, top_150_final_rank, is_scored,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic,
              case when video is null then 'No' else 'Yes' end as video,
              dense_rank () over (order by score desc) top_75_rank
            from
              top_75s
              left outer join customers on customers.id = top_75s.customer_id
              left outer join profiles on profiles.customer_id = top_75s.customer_id
            where
              top_75s.active is true
              ${gender ? `and top_75s.gender = '${gender}'` : ''}
            order by score desc, top_150_final_rank, top_75s.customer_id desc
          `
        )
        .then((res) => res[0]);
    }),

    top75IDs: combineResolvers(isAuthenticated, async (parent, { gender }, { models }) => {
      if (gender && gender !== 'm' && gender !== 'f')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f".');

      return await models.Top75.findAll({ attributes: ['customer_id'], where: { active: true, gender } });
    }),

    top75DataByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      return await sequelize
        .query(
          `
            select video, score, top_150_final_rank, top_75_rank
            from
              top_75s as outer_top_75_table
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_75_rank
                from
                  top_75s as inner_top_75_table
                  left outer join customers on customers.id = ${customer_id}
                where inner_top_75_table.gender = customers.gender
              ) as rank_table on rank_table.customer_id = outer_top_75_table.customer_id
            where
              outer_top_75_table.active is true
              and outer_top_75_table.customer_id = ${customer_id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    top75LeaderboardBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              top75_table.customer_id as id, full_name, email, slug, score, top_75_rank, city,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              top_75s as top75_table
              left outer join customers on customers.id = top75_table.customer_id
              left outer join profiles on profiles.customer_id = top75_table.customer_id
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_75_rank
                from top_75s as inner_top75_table
                ${gender ? `where inner_top75_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = top75_table.customer_id
            where
              top75_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and top75_table.gender = '${gender}'` : ''}
            order by full_name
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },
  },

  Mutation: {
    startTop75Activity: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
      if (status !== true && status !== false)
        throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'stop_top150' },
      });
      if (status === true && !prevStageStatus.active)
        throw new UserInputError('Please turn-off the activity of top-150 candidates first.');

      const nextStageStatus = await models.ContestStage.findOne({ attributes: ['active'], where: { stage: 'top30' } });
      if (status === false && nextStageStatus.active)
        throw new UserInputError('Next stage of the contest is already active. Cannot disable a previous stage.');

      await models.ContestStage.update({ active: status }, { where: { stage: 'top75' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (status) {
        const top75All = await sequelize.query(
          `
            select customer_id, email, phone, full_name
            from
              top_75s
              left outer join customers on customers.id = customer_id
            where
              top_75s.active is true
              and customers.active is true
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        );

        let top75AllIDs = [];

        if (top75All && top75All.length) {
          top75AllIDs = top75All.map(({ customer_id }) => customer_id);

          const disqualified = await sequelize.query(
            `
              select customer_id, email, full_name
              from
                top_150s
                left outer join customers on customers.id = customer_id
              where
                top_150s.active is true
                and top_150s.customer_id not in (${top75AllIDs})
                and customers.active is true
            `,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

          // Send e-mail & SMS to Top-75 winners
          schedule.scheduleJob(`sendMail-top75Winners`, new Date(Date.now() + 2000), async () => {
            for await (const contestant of top75All) {
              const sendEmailArgs = {
                templateName: 'top75Winners',
                templateData: { name: contestant.full_name.split(' ')[0] },
                toAddress: contestant.email.toLowerCase(),
                subject: 'Congratulations you are in Top 150 | OMG – Face Of The Year 2025',
              };
              sendEmail(sendEmailArgs).then(
                () => console.log(`Top-75 mail successfully sent to: ${contestant.email.toLowerCase()}.`),
                (err) => {
                  console.log(`Error while sending top-75 mail to: ${contestant.email.toLowerCase()}.`);
                  console.dir(err.message);
                }
              );

              const smsText =
                'Dear Candidate,%0aCongratulations! You have been shortlisted in our Top 150. Get ready for the next round.%0aRegards,%0aOMG - Face Of The Year 2025';
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

          // Send e-mail to disqualified from Top-75
          if (disqualified && disqualified.length) {
            schedule.scheduleJob(`sendMail-top75Losers`, new Date(Date.now() + 2000), async () => {
              for await (const contestant of disqualified) {
                const sendEmailArgs = {
                  templateName: 'top75Losers',
                  templateData: { name: contestant.full_name.split(' ')[0] },
                  toAddress: contestant.email.toLowerCase(),
                  subject: 'Important News from OMG – Face Of The Year 2025',
                };
                sendEmail(sendEmailArgs).then(
                  () =>
                    console.log(
                      `Disqualified from Top-75 mail successfully sent to: ${contestant.email.toLowerCase()}.`
                    ),
                  (err) => {
                    console.log(
                      `Error while sending disqualified from top-75 mail to: ${contestant.email.toLowerCase()}.`
                    );
                    console.dir(err.message);
                  }
                );
              }
            });
          }
        }
      } else
        await models.ContestStage.update({ active: !status }, { where: { stage: 'stop_top75' } }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    stopTop75Activity: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'top75' },
      });
      if (!prevStageStatus.active) throw new UserInputError('Please finalise top-75 candidates first.');

      await models.ContestStage.update({ active: true }, { where: { stage: 'stop_top75' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    uploadTop75Video: combineResolvers(isAuthenticated, async (parent, { video }, { models, me }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'gender', 'slug'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      if (video) {
        const updateVideo = await UploadAndSetData({
          file: video,
          variable: 'file',
          uploadFolder: 'top-75',
          isVideo: true,
          appendSlug: foundCustomer.slug || `customer-id-${me.id}`,
        });

        const isTop75 = await models.Top75.findOne({
          attributes: ['id', 'score', 'is_scored', 'video'],
          where: { customer_id: Number(me.id) },
        });

        if (updateVideo.file && isTop75 && !isTop75.is_scored) {
          if (isTop75.video)
            await UnlinkFile(isTop75.video, 'top-75').catch((err) =>
              console.log('Error while deleting video from Top-75 profile: ', err)
            );

          await isTop75.update({ video: updateVideo.file });
        } else if (isTop75 && isTop75.is_scored) {
          throw new UserInputError('Previous video has already been scored and cannot be changed.');
        } else
          await models.Top75.create({
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

    upsertTop75VideoFromCMS: combineResolvers(
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
            uploadFolder: 'top-75',
            isVideo: true,
            appendSlug: foundCustomer.slug || `customer-id-${customer_id}`,
          });

          const isTop75 = await models.Top75.findOne({
            attributes: ['id', 'score', 'is_scored', 'video'],
            where: { customer_id: Number(customer_id) },
          });

          if (updateVideo.file && isTop75) {
            if (isTop75.video)
              await UnlinkFile(isTop75.video, 'top-75').catch((err) =>
                console.log('Error while deleting video from Top-75 profile: ', err)
              );

            await isTop75.update({ video: updateVideo.file });
          } else if (updateVideo.file)
            await models.Top75.create({
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

    scoreTop75Video: combineResolvers(isAuthenticated, async (parent, { customer_id, score }, { models }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id'],
        where: { id: Number(customer_id), active: true },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      const foundScore = await models.Top75.findOne({
        attributes: ['id', 'score'],
        where: { customer_id: Number(customer_id), active: true },
      });
      if (foundScore)
        await foundScore.update({ score, is_scored: true }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    finaliseTop75: combineResolvers(
      isAuthenticated,
      async (parent, { add_customer_ids, delete_customer_ids }, { models, me }) => {
        if (!add_customer_ids.length && !delete_customer_ids.length)
          throw new UserInputError('Please SELECT / DE-SELECT a few contestants before proceeding.');

        const finalisedFemales = await models.Top75.count({ where: { gender: 'f', active: true } });

        let addFemales = null;
        if (add_customer_ids.length)
          addFemales = await sequelize.query(
            `
							select customer_id
							from
								top_150s
								left outer join customers on customers.id = customer_id
							where
								top_150s.active is true
								and customer_id in (${add_customer_ids})
								and top_150s.gender = 'f'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addFemales && addFemales.length) {
          let deleteFemales = null;
          if (delete_customer_ids.length)
            deleteFemales = await sequelize.query(
              `
								select customer_id from top_75s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'f'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteFemalesLength = deleteFemales ? deleteFemales.length : 0;

          if (!deleteFemalesLength && finalisedFemales && finalisedFemales >= 75)
            throw new UserInputError(
              'Top-75 female contestants have already been finalised. More females cannot be added.'
            );

          const remainingToAdd = 75 - (finalisedFemales || 0) + deleteFemalesLength;
          if (addFemales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 75) female contestants can be added in Top-75, and ${addFemales.length} females were selected.`
            );
        }

        const finalisedMales = await models.Top75.count({ where: { gender: 'm', active: true } });

        let addMales = null;
        if (add_customer_ids.length)
          addMales = await sequelize.query(
            `
							select customer_id
							from
								top_150s
								left outer join customers on customers.id = customer_id
							where
								top_150s.active is true
								and customer_id in (${add_customer_ids})
								and top_150s.gender = 'm'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addMales && addMales.length) {
          let deleteMales = null;
          if (delete_customer_ids.length)
            deleteMales = await sequelize.query(
              `
								select customer_id from top_75s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'm'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteMalesLength = deleteMales ? deleteMales.length : 0;

          if (!deleteMalesLength && finalisedMales && finalisedMales >= 75)
            throw new UserInputError(
              'Top-75 male contestants have already been finalised. More males cannot be added.'
            );

          const remainingToAdd = 75 - (finalisedMales || 0) + deleteMalesLength;
          if (addMales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 75) male contestants can be added in Top-75, and ${addMales.length} males were selected.`
            );
        }

        if (addFemales && addFemales.length) {
          for await (const female of addFemales) {
            const foundFemale = await models.Top75.findOne({
              attributes: ['id'],
              where: { customer_id: Number(female.customer_id) },
            });
            if (foundFemale)
              await foundFemale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top75.create({
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
            const foundMale = await models.Top75.findOne({
              attributes: ['id'],
              where: { customer_id: Number(male.customer_id) },
            });
            if (foundMale)
              await foundMale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top75.create({
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

             const finalisedHairstylist = await models.Top75.count({ 
                  where: { gender: 'h', active: true } 
                });
                
                let addHairstylist = null;
                if (add_customer_ids.length) {
                  addHairstylist = await sequelize.query(
                    `
                      SELECT customer_id
                      FROM top_150s
                      LEFT OUTER JOIN customers ON customers.id = customer_id
                      WHERE top_150s.active IS TRUE
                        AND customer_id IN (${add_customer_ids})
                        AND top_150s.gender = 'h'
                        AND customers.active IS TRUE
                    `,
                    { raw: true, type: sequelize.QueryTypes.SELECT }
                  );
                }
                
                if (addHairstylist && addHairstylist.length) {
                  let deleteHairstylist = null;
                  if (delete_customer_ids.length) {
                    deleteHairstylist = await sequelize.query(
                      `
                        SELECT customer_id FROM top_75s
                        WHERE active IS TRUE
                          AND customer_id IN (${delete_customer_ids})
                          AND gender = 'h'
                      `,
                      { raw: true, type: sequelize.QueryTypes.SELECT }
                    );
                  }
                
                  const deleteHairstylistLength = deleteHairstylist ? deleteHairstylist.length : 0;
                
                  if (!deleteHairstylistLength && finalisedHairstylist >= 75) {
                    throw new UserInputError(
                      'Top-75 Hairstylist contestants have already been finalised. More Hairstylists cannot be added.'
                    );
                  }
                
                  const remainingToAdd = 75 - finalisedHairstylist + deleteHairstylistLength;
                  if (addHairstylist.length > remainingToAdd) {
                    throw new UserInputError(
                      `Only ${remainingToAdd} (out of 75) Hairstylist slots available, ${addHairstylist.length} selected`
                    );
                  }
                }
                
                if (addHairstylist && addHairstylist.length) {
                  for await (const hairstylist of addHairstylist) {
                    const foundHairstylist = await models.Top75.findOne({
                      where: { customer_id: Number(hairstylist.customer_id) }
                    });
                    
                    if (foundHairstylist) {
                      await foundHairstylist.update({ 
                        active: true, 
                        updated_by: me.id 
                      }).catch((error) => {
                        throw new ApolloError(error.message, 'MUTATION_ERROR');
                      });
                    } else {
                      await models.Top75.create({
                        customer_id: Number(hairstylist.customer_id),
                        gender: 'h',
                        score: 0,
                        active: true,
                        created_by: me.id
                      }).catch((error) => {
                        throw new ApolloError(error.message, 'MUTATION_ERROR');
                      });
                    }
                  }
                }
                
                
        

        if (delete_customer_ids && delete_customer_ids.length)
          await models.Top75.destroy({ where: { customer_id: delete_customer_ids } }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    ),
  },
};
