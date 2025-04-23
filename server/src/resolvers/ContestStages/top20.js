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
    top20Profiles: combineResolvers(isAuthenticated, async (parent, { gender }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h". ');

      return await sequelize
        .query(
          `
            select
              top_20s.customer_id as id,
              full_name, email, phone, score, top_30_final_rank, is_scored,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic,
              case when video is null then 'No' else 'Yes' end as video,
              dense_rank () over (order by score desc) top_20_rank
            from
              top_20s
              left outer join customers on customers.id = top_20s.customer_id
              left outer join profiles on profiles.customer_id = top_20s.customer_id
            where
              top_20s.active is true
              ${gender ? `and top_20s.gender = '${gender}'` : ''}
            order by score desc, top_30_final_rank, top_20s.customer_id desc
          `
        )
        .then((res) => res[0]);
    }),

    top20IDs: combineResolvers(isAuthenticated, async (parent, { gender }, { models }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h". ');

      return await models.Top20.findAll({ attributes: ['customer_id'], where: { active: true, gender } });
    }),

    top20DataByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      return await sequelize
        .query(
          `
            select video, score, top_30_final_rank, top_20_rank
            from
              top_20s as outer_top_20_table
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_20_rank
                from
                  top_20s as inner_top_20_table
                  left outer join customers on customers.id = ${customer_id}
                where inner_top_20_table.gender = customers.gender
              ) as rank_table on rank_table.customer_id = outer_top_20_table.customer_id
            where
              outer_top_20_table.active is true
              and outer_top_20_table.customer_id = ${customer_id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    top20LeaderboardBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              top20_table.customer_id as id, full_name, email, slug, score, top_20_rank, city,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic
            from
              top_20s as top20_table
              left outer join customers on customers.id = top20_table.customer_id
              left outer join profiles on profiles.customer_id = top20_table.customer_id
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_20_rank
                from top_20s as inner_top20_table
                ${gender ? `where inner_top20_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = top20_table.customer_id
            where
              top20_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and top20_table.gender = '${gender}'` : ''}
            order by full_name
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },
  },

  Mutation: {
    startTop20Activity: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
      if (status !== true && status !== false)
        throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'stop_top30' },
      });
      if (status === true && !prevStageStatus.active)
        throw new UserInputError('Please turn-off the activity of top-30 candidates first.');

      const nextStageStatus = await models.ContestStage.findOne({ attributes: ['active'], where: { stage: 'top10' } });
      if (status === false && nextStageStatus.active)
        throw new UserInputError('Next stage of the contest is already active. Cannot disable a previous stage.');

      await models.ContestStage.update({ active: status }, { where: { stage: 'top20' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (status) {
        const top20All = await sequelize.query(
          `
            select customer_id, email, phone, full_name
            from
              top_20s
              left outer join customers on customers.id = customer_id
            where
              top_20s.active is true
              and customers.active is true
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        );

        let top20AllIDs = [];

        if (top20All && top20All.length) {
          top20AllIDs = top20All.map(({ customer_id }) => customer_id);

          const disqualified = await sequelize.query(
            `
              select customer_id, email, full_name
              from
                top_30s
                left outer join customers on customers.id = customer_id
              where
                top_30s.active is true
                and top_30s.customer_id not in (${top20AllIDs})
                and customers.active is true
            `,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

          // Send e-mail & SMS to Top-20 winners
          schedule.scheduleJob(`sendMail-top20Winners`, new Date(Date.now() + 2000), async () => {
            for await (const contestant of top20All) {
              const sendEmailArgs = {
                templateName: 'top20Winners',
                templateData: { name: contestant.full_name.split(' ')[0] },
                toAddress: contestant.email.toLowerCase(),
                subject: 'Congratulations you are in Top 40 | OMG – Face Of The Year 2025',
              };
              sendEmail(sendEmailArgs).then(
                () => console.log(`Top-20 mail successfully sent to: ${contestant.email.toLowerCase()}.`),
                (err) => {
                  console.log(`Error while sending top-20 mail to: ${contestant.email.toLowerCase()}.`);
                  console.dir(err.message);
                }
              );

              const smsText =
                'Dear Candidate,%0aCongratulations! You have been shortlisted in our Top 40. Hop into your glamorous outfits and get ready for the next round. Stay tuned for more updates.%0aRegards,%0aOMG - Face Of The Year 2025';
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

          // Send e-mail to disqualified from Top-20
          if (disqualified && disqualified.length) {
            schedule.scheduleJob(`sendMail-top20Losers`, new Date(Date.now() + 2000), async () => {
              for await (const contestant of disqualified) {
                const sendEmailArgs = {
                  templateName: 'top20Losers',
                  templateData: { name: contestant.full_name.split(' ')[0] },
                  toAddress: contestant.email.toLowerCase(),
                  subject: 'Important News from OMG – Face Of The Year 2025',
                };
                sendEmail(sendEmailArgs).then(
                  () =>
                    console.log(
                      `Mail to disqualified from Top-20 successfully sent to: ${contestant.email.toLowerCase()}.`
                    ),
                  (err) => {
                    console.log(
                      `Error while sending disqualified from top-20 mail to: ${contestant.email.toLowerCase()}.`
                    );
                    console.dir(err.message);
                  }
                );
              }
            });
          }
        }
      } else
        await models.ContestStage.update({ active: !status }, { where: { stage: 'stop_top20' } }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    stopTop20Activity: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'top20' },
      });
      if (!prevStageStatus.active) throw new UserInputError('Please finalise top-20 candidates first.');

      await models.ContestStage.update({ active: true }, { where: { stage: 'stop_top20' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    uploadTop20Video: combineResolvers(isAuthenticated, async (parent, { video }, { models, me }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'gender', 'slug'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      if (video) {
        const updateVideo = await UploadAndSetData({
          file: video,
          variable: 'file',
          uploadFolder: 'top-20',
          isVideo: true,
          appendSlug: foundCustomer.slug || `customer-id-${me.id}`,
        });

        const isTop20 = await models.Top20.findOne({
          attributes: ['id', 'score', 'is_scored', 'video'],
          where: { customer_id: Number(me.id) },
        });

        if (updateVideo.file && isTop20 && !isTop20.is_scored) {
          if (isTop20.video)
            await UnlinkFile(isTop20.video, 'top-20').catch((err) =>
              console.log('Error while deleting video from Top-20 profile: ', err)
            );

          await isTop20.update({ video: updateVideo.file });
        } else if (isTop20 && isTop20.is_scored) {
          throw new UserInputError('Previous video has already been scored and cannot be changed.');
        } else
          await models.Top20.create({
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

    upsertTop20VideoFromCMS: combineResolvers(
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
            uploadFolder: 'top-20',
            isVideo: true,
            appendSlug: foundCustomer.slug || `customer-id-${customer_id}`,
          });

          const isTop20 = await models.Top20.findOne({
            attributes: ['id', 'score', 'is_scored', 'video'],
            where: { customer_id: Number(customer_id) },
          });

          if (updateVideo.file && isTop20) {
            if (isTop20.video)
              await UnlinkFile(isTop20.video, 'top-20').catch((err) =>
                console.log('Error while deleting video from Top-20 profile: ', err)
              );

            await isTop20.update({ video: updateVideo.file });
          } else if (updateVideo.file)
            await models.Top20.create({
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

    scoreTop20Video: combineResolvers(isAuthenticated, async (parent, { customer_id, score }, { models }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id'],
        where: { id: Number(customer_id), active: true },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      const foundScore = await models.Top20.findOne({
        attributes: ['id', 'score'],
        where: { customer_id: Number(customer_id), active: true },
      });
      if (foundScore)
        await foundScore.update({ score, is_scored: true }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    finaliseTop20: combineResolvers(
      isAuthenticated,
      async (parent, { add_customer_ids, delete_customer_ids }, { models, me }) => {
        if (!add_customer_ids.length && !delete_customer_ids.length)
          throw new UserInputError('Please SELECT / DE-SELECT a few contestants before proceeding.');

        const finalisedFemales = await models.Top20.count({ where: { gender: 'f', active: true } });

        let addFemales = null;
        if (add_customer_ids.length)
          addFemales = await sequelize.query(
            `
							select customer_id
							from
								top_30s
								left outer join customers on customers.id = customer_id
							where
								top_30s.active is true
								and customer_id in (${add_customer_ids})
								and top_30s.gender = 'f'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addFemales && addFemales.length) {
          let deleteFemales = null;
          if (delete_customer_ids.length)
            deleteFemales = await sequelize.query(
              `
								select customer_id from top_20s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'f'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteFemalesLength = deleteFemales ? deleteFemales.length : 0;

          if (!deleteFemalesLength && finalisedFemales && finalisedFemales >= 20)
            throw new UserInputError(
              'Top-20 female contestants have already been finalised. More females cannot be added.'
            );

          const remainingToAdd = 20 - (finalisedFemales || 0) + deleteFemalesLength;
          if (addFemales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 20) female contestants can be added in Top-20, and ${addFemales.length} females were selected.`
            );
        }

        const finalisedMales = await models.Top20.count({ where: { gender: 'm', active: true } });

        let addMales = null;
        if (add_customer_ids.length)
          addMales = await sequelize.query(
            `
							select customer_id
							from
								top_30s
								left outer join customers on customers.id = customer_id
							where
								top_30s.active is true
								and customer_id in (${add_customer_ids})
								and top_30s.gender = 'm'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addMales && addMales.length) {
          let deleteMales = null;
          if (delete_customer_ids.length)
            deleteMales = await sequelize.query(
              `
								select customer_id from top_20s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'm'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteMalesLength = deleteMales ? deleteMales.length : 0;

          if (!deleteMalesLength && finalisedMales && finalisedMales >= 20)
            throw new UserInputError(
              'Top-20 male contestants have already been finalised. More males cannot be added.'
            );

          const remainingToAdd = 20 - (finalisedMales || 0) + deleteMalesLength;
          if (addMales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 20) male contestants can be added in Top-20, and ${addMales.length} males were selected.`
            );
        }

        if (addFemales && addFemales.length) {
          for await (const female of addFemales) {
            const foundFemale = await models.Top20.findOne({
              attributes: ['id'],
              where: { customer_id: Number(female.customer_id) },
            });
            if (foundFemale)
              await foundFemale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top20.create({
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
            const foundMale = await models.Top20.findOne({
              attributes: ['id'],
              where: { customer_id: Number(male.customer_id) },
            });
            if (foundMale)
              await foundMale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top20.create({
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

        const finalisedHairstylists = await models.Top20.count({ where: { gender: 'h', active: true } });

let addHairstylists = null;
if (add_customer_ids.length) {
  addHairstylists = await sequelize.query(
    `
      SELECT customer_id
      FROM top_30s
      LEFT OUTER JOIN customers ON customers.id = customer_id
      WHERE top_30s.active IS TRUE
        AND customer_id IN (${add_customer_ids})
        AND top_30s.gender = 'h'
        AND customers.active IS TRUE
    `,
    { raw: true, type: sequelize.QueryTypes.SELECT }
  );
}

if (addHairstylists && addHairstylists.length) {
  let deleteHairstylists = null;
  if (delete_customer_ids.length) {
    deleteHairstylists = await sequelize.query(
      `
        SELECT customer_id
        FROM top_20s
        WHERE active IS TRUE
          AND customer_id IN (${delete_customer_ids})
          AND gender = 'h'
      `,
      { raw: true, type: sequelize.QueryTypes.SELECT }
    );
  }

  const deleteHairLength = deleteHairstylists ? deleteHairstylists.length : 0;

  if (!deleteHairLength && finalisedHairstylists >= 20) {
    throw new UserInputError(
      'Top-20 hairstylist contestants have already been finalised. More hairstylists cannot be added.'
    );
  }

  const remainingToAdd = 20 - (finalisedHairstylists || 0) + deleteHairLength;
  if (addHairstylists.length > remainingToAdd) {
    throw new UserInputError(
      `Only ${remainingToAdd} (out of 20) hairstylist contestants can be added in Top-20, and ${addHairstylists.length} hairstylists were selected.`
    );
  }
}

if (addHairstylists && addHairstylists.length) {
  for await (const hairstylist of addHairstylists) {
    const foundHairstylist = await models.Top20.findOne({
      attributes: ['id'],
      where: { customer_id: Number(hairstylist.customer_id) },
    });
    if (foundHairstylist) {
      await foundHairstylist.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    } else {
      await models.Top20.create({
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
}

        if (delete_customer_ids && delete_customer_ids.length)
          await models.Top20.destroy({ where: { customer_id: delete_customer_ids } }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    ),
  },
};
