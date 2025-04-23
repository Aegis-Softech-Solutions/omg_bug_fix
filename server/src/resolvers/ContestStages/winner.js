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
    winnerProfiles: combineResolvers(isAuthenticated, async (parent, { gender }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h".');

      return await sequelize
        .query(
          `
            select
              winners.customer_id as id,
              full_name, email, phone, score, top_5_final_rank, is_scored,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic,
              case when video is null then 'No' else 'Yes' end as video,
              dense_rank () over (order by score desc) winner_rank
            from
              winners
              left outer join customers on customers.id = winners.customer_id
              left outer join profiles on profiles.customer_id = winners.customer_id
            where
              winners.active is true
              ${gender ? `and winners.gender = '${gender}'` : ''}
            order by score desc, top_5_final_rank, winners.customer_id desc
          `
        )
        .then((res) => res[0]);
    }),

    winnerIDs: combineResolvers(isAuthenticated, async (parent, { gender }, { models }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h".');
      return await models.Winner.findAll({ attributes: ['customer_id'], where: { active: true, gender } });
    }),

    winnerDataByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      return await sequelize
        .query(
          `
            select video, score, top_5_final_rank, winner_rank
            from
              winners as outer_winner_table
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) winner_rank
                from
                  winners as inner_winner_table
                  left outer join customers on customers.id = ${customer_id}
                where inner_winner_table.gender = customers.gender
              ) as rank_table on rank_table.customer_id = outer_winner_table.customer_id
            where
              outer_winner_table.active is true
              and outer_winner_table.customer_id = ${customer_id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    winnerLeaderboardBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              winner_table.customer_id as id, full_name, email, slug, score, winner_rank, city,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic
            from
              winners as winner_table
              left outer join customers on customers.id = winner_table.customer_id
              left outer join profiles on profiles.customer_id = winner_table.customer_id
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) winner_rank
                from winners as inner_winner_table
                ${gender ? `where inner_winner_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = winner_table.customer_id
            where
              winner_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and winner_table.gender = '${gender}'` : ''}
            order by full_name
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },
  },

  Mutation: {
    startWinnerActivity: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
      if (status !== true && status !== false)
        throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'stop_top5' },
      });
      if (status === true && !prevStageStatus.active)
        throw new UserInputError('Please turn-off the activity of top-5 candidates first.');

      await models.ContestStage.update({ active: status }, { where: { stage: 'winner' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (status) {
        // const allWinners = await sequelize.query(
        //   `
        //     select customer_id, email, phone, full_name
        //     from
        //       winners
        //       left outer join customers on customers.id = customer_id
        //     where
        //       winners.active is true
        //       and customers.active is true
        //   `,
        //   { raw: true, type: sequelize.QueryTypes.SELECT }
        // );
        // let allWinnerIDs = [];
        // if (allWinners && allWinners.length) {
        //   allWinnerIDs = allWinners.map(({ customer_id }) => customer_id);
        //   const disqualified = await sequelize.query(
        //     `
        //       select customer_id, email, full_name
        //       from
        //         top_5s
        //         left outer join customers on customers.id = customer_id
        //       where
        //         top_5s.active is true
        //         and top_5s.customer_id not in (${allWinnerIDs})
        //         and customers.active is true
        //     `,
        //     { raw: true, type: sequelize.QueryTypes.SELECT }
        //   );
        //   // Send e-mail & SMS to final winners
        //   schedule.scheduleJob(`sendMail-finalWinners`, new Date(Date.now() + 2000), async () => {
        //     for await (const contestant of allWinners) {
        //       const sendEmailArgs = {
        //         templateName: 'finalWinners',
        //         templateData: { name: contestant.full_name.split(' ')[0] },
        //         toAddress: contestant.email.toLowerCase(),
        //         subject: 'Congratulations you are in Top 20 | OMG – Face Of The Year 2025',
        //       };
        //       sendEmail(sendEmailArgs).then(
        //         () => console.log(`Final winner mail successfully sent to: ${contestant.email.toLowerCase()}.`),
        //         (err) => {
        //           console.log(`Error while sending winner mail to: ${contestant.email.toLowerCase()}.`);
        //           console.dir(err.message);
        //         }
        //       );
        //       const smsText =
        //         'Dear Candidate,%0aCongratulations! You have been shortlisted in our Top 20. Get ready for the next round.%0aRegards,%0aOMG - Face Of The Year 2025';
        //       await axios
        //         .post(
        //           `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${contestant.phone}&message=${smsText}&sender=OMGFOY&route=4`
        //         )
        //         .then((res) =>
        //           console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${contestant.phone} : `, res.data)
        //         )
        //         .catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${contestant.phone} : `, err));
        //     }
        //   });
        //   // Send e-mail to final disqualified
        //   if (disqualified && disqualified.length) {
        //     schedule.scheduleJob(`sendMail-finalLosers`, new Date(Date.now() + 2000), async () => {
        //       for await (const contestant of disqualified) {
        //         const sendEmailArgs = {
        //           templateName: 'finalLosers',
        //           templateData: { name: contestant.full_name.split(' ')[0] },
        //           toAddress: contestant.email.toLowerCase(),
        //           subject: 'Important News from OMG – Face Of The Year 2025',
        //         };
        //         sendEmail(sendEmailArgs).then(
        //           () =>
        //             console.log(
        //               `Final disqualified mail successfully sent to: ${contestant.email.toLowerCase()}.`
        //             ),
        //           (err) => {
        //             console.log(
        //               `Error while sending final disqualified mail to: ${contestant.email.toLowerCase()}.`
        //             );
        //             console.dir(err.message);
        //           }
        //         );
        //       }
        //     });
        //   }
        // }
      }

      return true;
    }),

    uploadWinnerVideo: combineResolvers(isAuthenticated, async (parent, { video }, { models, me }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'gender', 'slug'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      if (video) {
        const updateVideo = await UploadAndSetData({
          file: video,
          variable: 'file',
          uploadFolder: 'winner',
          isVideo: true,
          appendSlug: foundCustomer.slug || `customer-id-${me.id}`,
        });

        const isWinner = await models.Winner.findOne({
          attributes: ['id', 'score', 'is_scored', 'video'],
          where: { customer_id: Number(me.id) },
        });

        if (updateVideo.file && isWinner && !isWinner.is_scored) {
          if (isWinner.video)
            await UnlinkFile(isWinner.video, 'winner').catch((err) =>
              console.log('Error while deleting video from winner profile: ', err)
            );

          await isWinner.update({ video: updateVideo.file });
        } else if (isWinner && isWinner.is_scored) {
          throw new UserInputError('Previous video has already been scored and cannot be changed.');
        } else
          await models.Winner.create({
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

    upsertWinnerVideoFromCMS: combineResolvers(
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
            uploadFolder: 'winner',
            isVideo: true,
            appendSlug: foundCustomer.slug || `customer-id-${customer_id}`,
          });

          const isWinner = await models.Winner.findOne({
            attributes: ['id', 'score', 'is_scored', 'video'],
            where: { customer_id: Number(customer_id) },
          });

          if (updateVideo.file && isWinner) {
            if (isWinner.video)
              await UnlinkFile(isWinner.video, 'winner').catch((err) =>
                console.log('Error while deleting video from winner profile: ', err)
              );

            await isWinner.update({ video: updateVideo.file });
          } else if (updateVideo.file)
            await models.Winner.create({
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

    scoreWinnerVideo: combineResolvers(isAuthenticated, async (parent, { customer_id, score }, { models }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id'],
        where: { id: Number(customer_id), active: true },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      const foundScore = await models.Winner.findOne({
        attributes: ['id', 'score'],
        where: { customer_id: Number(customer_id), active: true },
      });
      if (foundScore)
        await foundScore.update({ score, is_scored: true }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    finaliseWinner: combineResolvers(
      isAuthenticated,
      async (parent, { add_customer_ids, delete_customer_ids }, { models, me }) => {
        if (!add_customer_ids.length && !delete_customer_ids.length)
          throw new UserInputError('Please SELECT / DE-SELECT a few contestants before proceeding.');

        const finalisedFemales = await models.Winner.count({ where: { gender: 'f', active: true } });

        let addFemales = null;
        if (add_customer_ids.length)
          addFemales = await sequelize.query(
            `
							select customer_id
							from
								top_5s
								left outer join customers on customers.id = customer_id
							where
								top_5s.active is true
								and customer_id in (${add_customer_ids})
								and top_5s.gender = 'f'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addFemales && addFemales.length) {
          let deleteFemales = null;
          if (delete_customer_ids.length)
            deleteFemales = await sequelize.query(
              `
								select customer_id from winners
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'f'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteFemalesLength = deleteFemales ? deleteFemales.length : 0;

          if (!deleteFemalesLength && finalisedFemales && finalisedFemales >= 1)
            throw new UserInputError(
              'Winner female contestants have already been finalised. More females cannot be added.'
            );

          const remainingToAdd = 1 - (finalisedFemales || 0) + deleteFemalesLength;
          if (addFemales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 1) female contestants can be added as winner, and ${addFemales.length} females were selected.`
            );
        }

        const finalisedMales = await models.Winner.count({ where: { gender: 'm', active: true } });

        let addMales = null;
        if (add_customer_ids.length)
          addMales = await sequelize.query(
            `
							select customer_id
							from
								top_5s
								left outer join customers on customers.id = customer_id
							where
								top_5s.active is true
								and customer_id in (${add_customer_ids})
								and top_5s.gender = 'm'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addMales && addMales.length) {
          let deleteMales = null;
          if (delete_customer_ids.length)
            deleteMales = await sequelize.query(
              `
								select customer_id from winners
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'm'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteMalesLength = deleteMales ? deleteMales.length : 0;

          if (!deleteMalesLength && finalisedMales && finalisedMales >= 1)
            throw new UserInputError(
              'Winner male contestants have already been finalised. More males cannot be added.'
            );

          const remainingToAdd = 1 - (finalisedMales || 0) + deleteMalesLength;
          if (addMales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 1) male contestants can be added as winner, and ${addMales.length} males were selected.`
            );
        }

        if (addFemales && addFemales.length) {
          for await (const female of addFemales) {
            const foundFemale = await models.Winner.findOne({
              attributes: ['id'],
              where: { customer_id: Number(female.customer_id) },
            });
            if (foundFemale)
              await foundFemale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Winner.create({
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
            const foundMale = await models.Winner.findOne({
              attributes: ['id'],
              where: { customer_id: Number(male.customer_id) },
            });
            if (foundMale)
              await foundMale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Winner.create({
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
        const finalisedHairstylists = await models.Winner.count({ where: { gender: 'h', active: true } });

let addHairstylists = null;
if (add_customer_ids.length) {
  addHairstylists = await sequelize.query(
    `
      SELECT customer_id 
      FROM top_5s 
      LEFT OUTER JOIN customers ON customers.id = customer_id 
      WHERE top_5s.active IS TRUE 
        AND customer_id IN (${add_customer_ids}) 
        AND top_5s.gender = 'h' 
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
        SELECT customer_id FROM winners 
        WHERE active IS TRUE 
          AND customer_id IN (${delete_customer_ids}) 
          AND gender = 'h'
      `,
      { raw: true, type: sequelize.QueryTypes.SELECT }
    );
  }

  const deleteHairLength = deleteHairstylists ? deleteHairstylists.length : 0;

  if (!deleteHairLength && finalisedHairstylists >= 1)
    throw new UserInputError('Winner hairstylist contestants have already been finalised. More hairstylists cannot be added.');

  const remainingToAdd = 1 - finalisedHairstylists + deleteHairLength;
  if (addHairstylists.length > remainingToAdd)
    throw new UserInputError(
      `Only ${remainingToAdd} (out of 1) hairstylist contestants can be added as a winner.`
    );
}

if (addHairstylists && addHairstylists.length) {
  for await (const hairstylist of addHairstylists) {
    const foundHairstylist = await models.Winner.findOne({
      attributes: ['id'],
      where: { customer_id: Number(hairstylist.customer_id) },
    });

    if (foundHairstylist) {
      await foundHairstylist.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    } else {
      await models.Winner.create({
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
          await models.Winner.destroy({ where: { customer_id: delete_customer_ids } }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    ),
  },
};
