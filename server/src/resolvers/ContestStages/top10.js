import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import { UploadAndSetData, UnlinkFile } from '../../services/uploadS3Bucket';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    top10Profiles: combineResolvers(isAuthenticated, async (parent, { gender }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h". ');

      return await sequelize
        .query(
          `
            select
              top_10s.customer_id as id,
              full_name, email, phone, score, top_20_final_rank, is_scored,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic,
              case when video is null then 'No' else 'Yes' end as video,
              dense_rank () over (order by score desc) top_10_rank
            from
              top_10s
              left outer join customers on customers.id = top_10s.customer_id
              left outer join profiles on profiles.customer_id = top_10s.customer_id
            where
              top_10s.active is true
              ${gender ? `and top_10s.gender = '${gender}'` : ''}
            order by score desc, top_20_final_rank, top_10s.customer_id desc
          `
        )
        .then((res) => res[0]);
    }),

    top10IDs: combineResolvers(isAuthenticated, async (parent, { gender }, { models }) => {
      if (gender && gender !== 'm' && gender !== 'f' && gender !== 'h')
        throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f" or "h". ');

      return await models.Top10.findAll({ attributes: ['customer_id'], where: { active: true, gender } });
    }),

    top10DataByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      return await sequelize
        .query(
          `
            select video, score, top_20_final_rank, top_10_rank
            from
              top_10s as outer_top_10_table
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_10_rank
                from
                  top_10s as inner_top_10_table
                  left outer join customers on customers.id = ${customer_id}
                where inner_top_10_table.gender = customers.gender
              ) as rank_table on rank_table.customer_id = outer_top_10_table.customer_id
            where
              outer_top_10_table.active is true
              and outer_top_10_table.customer_id = ${customer_id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    top10LeaderboardBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              top10_table.customer_id as id, full_name, email, slug, score, top_10_rank, city,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              top_10s as top10_table
              left outer join customers on customers.id = top10_table.customer_id
              left outer join profiles on profiles.customer_id = top10_table.customer_id
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by score desc) top_10_rank
                from top_10s as inner_top10_table
                ${gender ? `where inner_top10_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = top10_table.customer_id
            where
              top10_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and top10_table.gender = '${gender}'` : ''}
            order by full_name
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },
  },

  Mutation: {
    startTop10Activity: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
      if (status !== true && status !== false)
        throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'stop_top20' },
      });
      if (status === true && !prevStageStatus.active)
        throw new UserInputError('Please turn-off the activity of top-20 candidates first.');

      const nextStageStatus = await models.ContestStage.findOne({ attributes: ['active'], where: { stage: 'top5' } });
      if (status === false && nextStageStatus.active)
        throw new UserInputError('Next stage of the contest is already active. Cannot disable a previous stage.');

      await models.ContestStage.update({ active: status }, { where: { stage: 'top10' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!status)
        await models.ContestStage.update({ active: !status }, { where: { stage: 'stop_top10' } }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    stopTop10Activity: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      const prevStageStatus = await models.ContestStage.findOne({
        attributes: ['active'],
        where: { stage: 'top10' },
      });
      if (!prevStageStatus.active) throw new UserInputError('Please finalise top-10 candidates first.');

      await models.ContestStage.update({ active: true }, { where: { stage: 'stop_top10' } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    uploadTop10Video: combineResolvers(isAuthenticated, async (parent, { video }, { models, me }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'gender', 'slug'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      if (video) {
        const updateVideo = await UploadAndSetData({
          file: video,
          variable: 'file',
          uploadFolder: 'top-10',
          isVideo: true,
          appendSlug: foundCustomer.slug || `customer-id-${me.id}`,
        });

        const isTop10 = await models.Top10.findOne({
          attributes: ['id', 'score', 'is_scored', 'video'],
          where: { customer_id: Number(me.id) },
        });

        if (updateVideo.file && isTop10 && !isTop10.is_scored) {
          if (isTop10.video)
            await UnlinkFile(isTop10.video, 'top-10').catch((err) =>
              console.log('Error while deleting video from Top-10 profile: ', err)
            );

          await isTop10.update({ video: updateVideo.file });
        } else if (isTop10 && isTop10.is_scored) {
          throw new UserInputError('Previous video has already been scored and cannot be changed.');
        } else
          await models.Top10.create({
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

    upsertTop10VideoFromCMS: combineResolvers(
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
            uploadFolder: 'top-10',
            isVideo: true,
            appendSlug: foundCustomer.slug || `customer-id-${customer_id}`,
          });

          const isTop10 = await models.Top10.findOne({
            attributes: ['id', 'score', 'is_scored', 'video'],
            where: { customer_id: Number(customer_id) },
          });

          if (updateVideo.file && isTop10) {
            if (isTop10.video)
              await UnlinkFile(isTop10.video, 'top-10').catch((err) =>
                console.log('Error while deleting video from Top-10 profile: ', err)
              );

            await isTop10.update({ video: updateVideo.file });
          } else if (updateVideo.file)
            await models.Top10.create({
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

    scoreTop10Video: combineResolvers(isAuthenticated, async (parent, { customer_id, score }, { models }) => {
      const foundCustomer = await models.Customer.findOne({
        attributes: ['id'],
        where: { id: Number(customer_id), active: true },
      });
      if (!foundCustomer) throw new UserInputError('Invalid contestant.');

      const foundScore = await models.Top10.findOne({
        attributes: ['id', 'score'],
        where: { customer_id: Number(customer_id), active: true },
      });
      if (foundScore)
        await foundScore.update({ score, is_scored: true }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    finaliseTop10: combineResolvers(
      isAuthenticated,
      async (parent, { add_customer_ids, delete_customer_ids }, { models, me }) => {
        if (!add_customer_ids.length && !delete_customer_ids.length)
          throw new UserInputError('Please SELECT / DE-SELECT a few contestants before proceeding.');

        const finalisedFemales = await models.Top10.count({ where: { gender: 'f', active: true } });

        let addFemales = null;
        if (add_customer_ids.length)
          addFemales = await sequelize.query(
            `
							select customer_id
							from
								top_20s
								left outer join customers on customers.id = customer_id
							where
								top_20s.active is true
								and customer_id in (${add_customer_ids})
								and top_20s.gender = 'f'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addFemales && addFemales.length) {
          let deleteFemales = null;
          if (delete_customer_ids.length)
            deleteFemales = await sequelize.query(
              `
								select customer_id from top_10s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'f'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteFemalesLength = deleteFemales ? deleteFemales.length : 0;

          if (!deleteFemalesLength && finalisedFemales && finalisedFemales >= 10)
            throw new UserInputError(
              'Top-10 female contestants have already been finalised. More females cannot be added.'
            );

          const remainingToAdd = 10 - (finalisedFemales || 0) + deleteFemalesLength;
          if (addFemales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 10) female contestants can be added in Top-10, and ${addFemales.length} females were selected.`
            );
        }

        const finalisedMales = await models.Top10.count({ where: { gender: 'm', active: true } });

        let addMales = null;
        if (add_customer_ids.length)
          addMales = await sequelize.query(
            `
							select customer_id
							from
								top_20s
								left outer join customers on customers.id = customer_id
							where
								top_20s.active is true
								and customer_id in (${add_customer_ids})
								and top_20s.gender = 'm'
								and customers.active is true
						`,
            { raw: true, type: sequelize.QueryTypes.SELECT }
          );

        if (addMales && addMales.length) {
          let deleteMales = null;
          if (delete_customer_ids.length)
            deleteMales = await sequelize.query(
              `
								select customer_id from top_10s
								where
									active is true
									and customer_id in (${delete_customer_ids})
									and gender = 'm'
							`,
              { raw: true, type: sequelize.QueryTypes.SELECT }
            );

          const deleteMalesLength = deleteMales ? deleteMales.length : 0;

          if (!deleteMalesLength && finalisedMales && finalisedMales >= 10)
            throw new UserInputError(
              'Top-10 male contestants have already been finalised. More males cannot be added.'
            );

          const remainingToAdd = 10 - (finalisedMales || 0) + deleteMalesLength;
          if (addMales.length > remainingToAdd)
            throw new UserInputError(
              `Only ${remainingToAdd} (out of 10) male contestants can be added in Top-10, and ${addMales.length} males were selected.`
            );
        }

        if (addFemales && addFemales.length) {
          for await (const female of addFemales) {
            const foundFemale = await models.Top10.findOne({
              attributes: ['id'],
              where: { customer_id: Number(female.customer_id) },
            });
            if (foundFemale)
              await foundFemale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top10.create({
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
            const foundMale = await models.Top10.findOne({
              attributes: ['id'],
              where: { customer_id: Number(male.customer_id) },
            });
            if (foundMale)
              await foundMale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else
              await models.Top10.create({
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
        // Add hairstylist counters and checks
        const finalisedHairstylists = await models.Top10.count({
          where: { gender: 'h', active: true }
        });

        let addHairstylists = null;
        if (add_customer_ids.length)
          addHairstylists = await sequelize.query(`
    select customer_id
    from top_20s
    left outer join customers on customers.id = customer_id
    where
      top_20s.active is true
      and customer_id in (${add_customer_ids})
      and top_20s.gender = 'h'
      and customers.active is true
  `, { raw: true, type: sequelize.QueryTypes.SELECT });

        // Hairstylist validation logic
        if (addHairstylists && addHairstylists.length) {
          let deleteHairstylists = null;
          if (delete_customer_ids.length)
            deleteHairstylists = await sequelize.query(`
      select customer_id from top_10s
      where
        active is true
        and customer_id in (${delete_customer_ids})
        and gender = 'h'
    `, { raw: true, type: sequelize.QueryTypes.SELECT });

          const deleteHairLength = deleteHairstylists ? deleteHairstylists.length : 0;

          if (!deleteHairLength && finalisedHairstylists && finalisedHairstylists >= 10)
            throw new UserInputError(
              'Top-10 hairstylists have already been finalised. More hairstylists cannot be added.'
            );
          const remainingHair = 10 - (finalisedHairstylists || 0) + deleteHairLength;

          if (addHairstylists.length > remainingHair)
            throw new UserInputError(
              `Only ${remainingHair} hairstylist slots available, but ${addHairstylists.length} selected`
            );
        }

        // Hairstylist creation/update logic
        if (addHairstylists && addHairstylists.length) {
          for await (const hairstylist of addHairstylists) {
            const found = await models.Top10.findOne({
              attributes: ['id'],
              where: { customer_id: Number(hairstylist.customer_id) }
            });

            if (found) {
              await found.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            } else {
              await models.Top10.create({
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
          await models.Top10.destroy({ where: { customer_id: delete_customer_ids } }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    ),
  },
};
