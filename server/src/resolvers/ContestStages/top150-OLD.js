import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import schedule from 'node-schedule';
import { UploadAndSetData } from '../../services/uploadS3Bucket';
import { sendEmail } from '../../services/awsSES';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    top150Profiles: combineResolvers(isAuthenticated, async (parent, { gender }) => {
      if (gender && gender !== 'm' && gender !== 'f')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f".');

      return await sequelize
        .query(
          `
            select
              top_150s.customer_id as id,
              full_name, email, phone, score, top_500_final_rank, is_scored,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic,
              case when video is null then 'No' else 'Yes' end as video,
              dense_rank () over (order by score desc) top_150_rank
            from
              top_150s
              left outer join customers on customers.id = top_150s.customer_id
              left outer join profiles on profiles.customer_id = top_150s.customer_id
            where
              top_150s.active is true
              ${gender ? `and top_150s.gender = '${gender}'` : ''}
            order by score desc, top_500_final_rank, top_150s.customer_id desc
          `
        )
        .then((res) => res[0]);
    }),

    top150DataByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      return await sequelize
        .query(
          `
            select video, score, top_500_final_rank, top_150_rank
            from
              top_150s as outer_top_150_table
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_150_rank
                from
                  top_150s as inner_top_150_table
                  left outer join customers on customers.id = ${customer_id}
                where inner_top_150_table.gender = customers.gender
              ) as rank_table on rank_table.customer_id = outer_top_150_table.customer_id
            where
              outer_top_150_table.active is true
              and outer_top_150_table.customer_id = ${customer_id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    top150LeaderboardBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              top150_table.customer_id as id, full_name, email, slug, score, top_150_rank,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              top_150s as top150_table
              left outer join customers on customers.id = top150_table.customer_id
              left outer join profiles on profiles.customer_id = top150_table.customer_id
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_150_rank
                from top_150s as inner_top150_table
                ${gender ? `where inner_top150_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = top150_table.customer_id
            where
              top150_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and top150_table.gender = '${gender}'` : ''}
            order by score desc, top150_table.customer_id desc
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },
  },

  Mutation: {
    finaliseTop150: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
      if (status !== true && status !== false)
        throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'stop_top500' },
      });
      if (status === true && !prevStageStatus.active)
        throw new UserInputError('Please turn-off the activity of top-500 candidates first.');

      const nextStageStatus = await models.ContestStage.findOne({ attributes: ['active'], where: { stage: 'top30' } });
      if (status === false && nextStageStatus.active)
        throw new UserInputError('Next stage of the contest is already active. Cannot disable a previous stage.');

      await models.ContestStage.update({ active: status }, { where: { stage: 'top150' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (status) {
        const top150Females = await sequelize.query(
          `
            select
              top_500s.customer_id,
              (((votes :: decimal / 50) * 0.4) + (score * 0.6)) as avg_score
            from
              top_500s
              left outer join online_votes on online_votes.customer_id = top_500s.customer_id
              left outer join customers on customers.id = top_500s.customer_id
            where
              top_500s.active is true
              and top_500s.gender = 'f'
              and customers.active is true
            order by avg_score desc
            limit 150
        `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        );

        let femaleRank = 1;
        for await (const female of top150Females) {
          const foundFemale = await models.Top150.findOne({
            attributes: ['id'],
            where: { customer_id: Number(female.customer_id) },
          });
          if (foundFemale)
            await foundFemale
              .update({ top_500_final_rank: femaleRank, active: true, updated_by: Number(me.id) })
              .catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
          else
            await models.Top150.create({
              customer_id: Number(female.customer_id),
              gender: 'f',
              top_500_final_rank: femaleRank,
              score: 0,
              active: true,
              created_by: Number(me.id),
            }).catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });
          femaleRank++;
        }

        const top150Males = await sequelize.query(
          `
            select
              top_500s.customer_id,
              (((votes :: decimal / 50) * 0.4) + (score * 0.6)) as avg_score
            from
              top_500s
              left outer join online_votes on online_votes.customer_id = top_500s.customer_id
              left outer join customers on customers.id = top_500s.customer_id
            where
              top_500s.active is true
              and top_500s.gender = 'm'
              and customers.active is true
            order by avg_score desc
            limit 150
        `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        );

        let maleRank = 1;
        for await (const male of top150Males) {
          const foundMale = await models.Top150.findOne({
            attributes: ['id'],
            where: { customer_id: Number(male.customer_id) },
          });
          if (foundMale)
            await foundMale
              .update({ top_500_final_rank: maleRank, active: true, updated_by: Number(me.id) })
              .catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
          else
            await models.Top150.create({
              customer_id: Number(male.customer_id),
              gender: 'm',
              top_500_final_rank: maleRank,
              score: 0,
              active: true,
              created_by: Number(me.id),
            }).catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });
          maleRank++;
        }

        // const finalTop150 = [...top150Females, ...top150Males];

        // schedule.scheduleJob(`sendMail-top150`, new Date(Date.now() + 2000), async () => {
        //   for await (const contestant of finalTop150) {
        //     const sendEmailArgs = {
        //       templateName: 'votingStarted',
        //       templateData: { name: contestant.full_name.split(' ')[0] },
        //       toAddress: contestant.email.toLowerCase(),
        //       subject: 'The Leader Board Race | OMG – Face Of The Year 2025',
        //     };
        //     sendEmail(sendEmailArgs).then(
        //       () => console.log(`Voting started mail successfully sent to: ${contestant.email.toLowerCase()}.`),
        //       (err) => {
        //         console.log(`Error while sending voting started mail to: ${contestant.email.toLowerCase()}.`);
        //         console.dir(err.message);
        //       }
        //     );

        //     // const smsText =
        //     //   'Dear Candidate,%0aThank you for registering with OMG. Your registration was successful and payment has been received.%0aRegards,%0aOMG - Face Of The Year 2025';
        //     // await axios
        //     //   .post(
        //     //     `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${phone}&message=${smsText}&sender=OMGFOY&route=4`
        //     //   )
        //     //   .then((res) => console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${phone} : `, res.data))
        //     //   .catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${phone} : `, err));
        //   }
        // });
      } else
        await models.ContestStage.update({ active: !status }, { where: { stage: 'stop_top150' } }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    stopTop150Activity: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'top150' },
      });
      if (!prevStageStatus.active) throw new UserInputError('Please finalise top-150 candidates first.');

      // await models.ContestStage.update({ active: false }, { where: { stage: 'top150' } }).catch((error) => {
      //   throw new ApolloError(error.message, 'MUTATION_ERROR');
      // });

      await models.ContestStage.update({ active: true }, { where: { stage: 'stop_top150' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    uploadTop150Video: combineResolvers(isAuthenticated, async (parent, { video }, { models, me }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'gender', 'slug'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      if (video) {
        const updateVideo = await UploadAndSetData({
          file: video,
          variable: 'file',
          uploadFolder: 'top-150',
          isVideo: true,
          appendSlug: foundCustomer.slug || `customer-id-${incomingCustomerId}`,
        });

        const isTop150 = await models.Top150.findOne({
          attributes: ['id', 'score', 'is_scored'],
          where: { customer_id: Number(me.id) },
        });
        if (isTop150 && !isTop150.is_scored) await isTop150.update({ video: updateVideo.file });
        else if (isTop150 && isTop150.is_scored)
          throw new UserInputError('Previous video has already been scored and cannot be changed.');
        else
          await models.Top150.create({
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
    }),

    scoreTop150Video: combineResolvers(isAuthenticated, async (parent, { customer_id, score }, { models }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id'],
        where: { id: Number(customer_id), active: true },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      const foundScore = await models.Top150.findOne({
        attributes: ['id', 'score'],
        where: { customer_id: Number(customer_id), active: true },
      });
      if (foundScore)
        await foundScore.update({ score, is_scored: true }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),
  },
};
