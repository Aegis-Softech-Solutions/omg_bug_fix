import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import sequelize from '../../services/sequelizeConfig';
import { UploadAndSetData, UnlinkFile } from '../../services/uploadS3Bucket';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    allCompetitions: async (parent, args, { models }) => {
      return await models.Competition.findAll({ order: [['id', 'desc']] }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    activeCompetitions: async (parent, args, { models }) => {
      return await models.Competition.findAll({
        where: { active: true },
        order: [['id', 'desc']],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    competition: combineResolvers(isAuthenticated, async (parent, { id }, { models }) => {
      if (!id || Number(id) === 0) return {};
      return await sequelize
        .query(`select *, initcap(upload_type) as upload_type from competitions where id = ${id}`, {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        })
        .then((res) => res[0])
        .catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
    }),

    // This gives all competition submissions, without taking any competition-ID as argument.
    allActiveSubmissions: async (parent, { limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              competition_submissions.id as id, media, upload_type, full_name, slug,
              name as competition_name,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              competition_submissions
              left outer join customers on customers.id = competition_submissions.customer_id
              left outer join profiles on profiles.customer_id = competition_submissions.customer_id
              left outer join competitions on competitions.id = competition_id
            where competition_submissions.active is true
            order by competition_submissions.id desc
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0])
        .catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
    },

    allSubmissionsOfCustomer: async (parent, { customer_id }) => {
      if (!customer_id || Number(customer_id) === 0) return [];
      return await sequelize
        .query(
          `
            select
              competition_submissions.id as id,
              competitions.id as competition_id,
              name as competition_name,
              competitions.active,
              description, media, upload_type, full_name, slug,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              competitions
              left outer join competition_submissions on (
                competition_id = competitions.id
                and competition_submissions.customer_id = ${customer_id}
                and competition_submissions.active is true
              )
              left outer join customers on customers.id = competition_submissions.customer_id
              left outer join profiles on profiles.customer_id = competition_submissions.customer_id
            order by competitions.id desc
          `
        )
        .then((res) => res[0])
        .catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
    },

    competitionSubmissions: async (parent, { competition_id }) => {
      return await sequelize
        .query(
          `
            select
              competition_submissions.id as id,
              competition_submissions.customer_id,
              competition_submissions.active,
              action_taken, media, full_name, email,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              competition_submissions
              left outer join customers on customers.id = competition_submissions.customer_id
              left outer join profiles on profiles.customer_id = competition_submissions.customer_id
              left outer join competitions on competitions.id = competition_id
            where competition_id = ${competition_id}
            order by competition_submissions.id desc
          `
        )
        .then((res) => res[0])
        .catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
    },

    activeCompetitionSubmissions: async (parent, { competition_id, limit = 20, offset = 0 }) => {
      return await sequelize
        .query(
          `
            select
              competition_submissions.id as id, media, upload_type, full_name, slug,
              name as competition_name,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              competition_submissions
              left outer join customers on customers.id = competition_submissions.customer_id
              left outer join profiles on profiles.customer_id = competition_submissions.customer_id
              left outer join competitions on competitions.id = competition_id
            where
              competition_submissions.active is true
              and competition_id = ${competition_id}
            order by competition_submissions.id desc
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0])
        .catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
    },

    competitionSubmissionBySearch: async (parent, { search_term, limit = 20, offset = 0 }, { models }) => {
      const latestCompetition = await models.Competition.findOne({
        attributes: ['id', 'active'],
        order: [['id', 'DESC']],
      });

      let winnersDeclared = null;
      if (!latestCompetition.active) {
        winnersDeclared = await models.CompetitionWinner.findOne({
          attributes: ['id'],
          where: { competition_id: Number(latestCompetition.id), active: true },
        });
      }

      if (winnersDeclared && winnersDeclared.id) return [];
      return await sequelize
        .query(
          `
            select
              competition_submissions.id as id, competition_id, media, upload_type, full_name, slug,
              name as competition_name,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              competition_submissions
              left outer join customers on customers.id = competition_submissions.customer_id
              left outer join profiles on profiles.customer_id = competition_submissions.customer_id
              left outer join competitions on competitions.id = competition_id
            where
							competitions.id = ${latestCompetition.id}
              and competition_submissions.active is true
              ${
                search_term
                  ? `and (full_name ilike '%${search_term}%' or email ilike '%${search_term}%'  or name ilike '%${search_term}%')`
                  : ''
              }
            order by competition_submissions.id desc
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },

    competitionSubmissionById: async (parent, { id }) => {
      if (!id || Number(id) === 0) return null;
      return await sequelize
        .query(
          `
            select
              competition_submissions.id as id, media, upload_type, full_name, slug, share_pic,
              name as competition_name,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              competition_submissions
              left outer join customers on customers.id = competition_submissions.customer_id
              left outer join profiles on profiles.customer_id = competition_submissions.customer_id
              left outer join competitions on competitions.id = competition_id
            where
              competition_submissions.active is true
              and competition_submissions.id = ${id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    },

    competitionWinners: async () =>
      await sequelize
        .query(
          `
            select
              competitions.id as id, competition_id,
              winner_customer_ids, runner_up_1_customer_ids, runner_up_2_customer_ids,
              name as competition_name, upload_type, ended_on
            from
              competition_winners
              left outer join competitions on competitions.id = competition_id
            where competition_winners.active is true
						order by competition_id desc
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then(async (mainResponse) => {
          if (mainResponse && mainResponse.length) {
            const newResponse = mainResponse.map(async (res) => {
              const winners = [];
              const firstRunnerUps = [];
              const secondRunnerUps = [];

              if (res.winner_customer_ids && res.winner_customer_ids.length) {
                for await (const winnerID of res.winner_customer_ids) {
                  const winnerObj = await sequelize
                    .query(
                      `
									select
										customers.id, full_name, media, slug, share_pic,
										case when profile_pic is null then null else (
											case
												when profile_pic = 'pic1' then pic1
												when profile_pic = 'pic2' then pic2
												when profile_pic = 'pic3' then pic3
											else null end
										) end as profile_pic
									from
										customers
										left outer join profiles on profiles.customer_id = customers.id
										left outer join competition_submissions on (
											competition_submissions.customer_id = customers.id
											and competition_submissions.competition_id = ${res.competition_id}
										)
									where
										customers.id = ${winnerID}
										and customers.active is true
								`,
                      { raw: true, type: sequelize.QueryTypes.SELECT }
                    )
                    .then((winnersResult) => winnersResult[0]);
                  winners.push(winnerObj);
                }
              }

              if (res.runner_up_1_customer_ids && res.runner_up_1_customer_ids.length) {
                for await (const runnerUp1ID of res.runner_up_1_customer_ids) {
                  const runnerUp1Obj = await sequelize
                    .query(
                      `
									select
										customers.id, full_name, media, slug, share_pic,
										case when profile_pic is null then null else (
											case
												when profile_pic = 'pic1' then pic1
												when profile_pic = 'pic2' then pic2
												when profile_pic = 'pic3' then pic3
											else null end
										) end as profile_pic
									from
										customers
										left outer join profiles on profiles.customer_id = customers.id
										left outer join competition_submissions on (
											competition_submissions.customer_id = customers.id
											and competition_submissions.competition_id = ${res.competition_id}
										)
									where
										customers.id = ${runnerUp1ID}
										and customers.active is true
								`,
                      { raw: true, type: sequelize.QueryTypes.SELECT }
                    )
                    .then((firstRunnerUpsResult) => firstRunnerUpsResult[0]);
                  firstRunnerUps.push(runnerUp1Obj);
                }
              }

              if (res.runner_up_2_customer_ids && res.runner_up_2_customer_ids.length) {
                for await (const runnerUp2ID of res.runner_up_2_customer_ids) {
                  const runnerUp2Obj = await sequelize
                    .query(
                      `
									select
										customers.id, full_name, media, slug, share_pic,
										case when profile_pic is null then null else (
											case
												when profile_pic = 'pic1' then pic1
												when profile_pic = 'pic2' then pic2
												when profile_pic = 'pic3' then pic3
											else null end
										) end as profile_pic
									from
										customers
										left outer join profiles on profiles.customer_id = customers.id
										left outer join competition_submissions on (
											competition_submissions.customer_id = customers.id
											and competition_submissions.competition_id = ${res.competition_id}
										)
									where
										customers.id = ${runnerUp2ID}
										and customers.active is true
								`,
                      { raw: true, type: sequelize.QueryTypes.SELECT }
                    )
                    .then((secondRunnerUpsResult) => secondRunnerUpsResult[0]);
                  secondRunnerUps.push(runnerUp2Obj);
                }
              }

              return { ...res, winners, firstRunnerUps, secondRunnerUps };
            });
            return newResponse;
          }
          return [];
        }),

    competitionWinnerIDsByCompetitionID: combineResolvers(
      isAuthenticated,
      async (parent, { competition_id }, { models }) => {
        if (!competition_id || Number(competition_id) === 0) return null;
        return await models.CompetitionWinner.findOne({
          attributes: ['winner_customer_ids', 'runner_up_1_customer_ids', 'runner_up_2_customer_ids'],
          where: { competition_id, active: true },
        });
      }
    ),
  },

  Mutation: {
    addCompetition: combineResolvers(
      isAuthenticated,
      async (parent, { name, description, uploadType }, { models, me }) => {
        if (!name) throw new UserInputError("Invalid argument provided: 'name'");
        if (!description) throw new UserInputError("Invalid argument provided: 'description'");
        if (uploadType !== 'Image' && uploadType !== 'Video')
          throw new UserInputError(
            "Invalid argument provided: 'uploadType'. It's value should be either 'image' or 'video'."
          );

        await models.Competition.create({
          name,
          description,
          upload_type: uploadType.toLowerCase(),
          active: true,
          created_by: Number(me.id),
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        return true;
      }
    ),

    updateCompetition: combineResolvers(
      isAuthenticated,
      async (parent, { id, name, description, uploadType }, { models, me }) => {
        if (!id || Number(id) === 0) throw new UserInputError("Invalid argument provided: 'id'");
        if (!name) throw new UserInputError("Invalid argument provided: 'name'");
        if (!description) throw new UserInputError("Invalid argument provided: 'description'");
        if (uploadType !== 'Image' && uploadType !== 'Video')
          throw new UserInputError(
            "Invalid argument provided: 'uploadType'. It's value should be either 'image' or 'video'."
          );

        await models.Competition.update(
          {
            name,
            description,
            upload_type: uploadType.toLowerCase(),
            updated_by: Number(me.id),
          },
          { where: { id } }
        ).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        return true;
      }
    ),

    changeCompetitionStatus: combineResolvers(
      isAuthenticated,
      async (parent, { competition_id, status }, { models, me }) => {
        if (!competition_id || Number(competition_id) === 0)
          throw new UserInputError("Invalid argument provided: 'competition_id'");
        if (status !== true && status !== false)
          throw new UserInputError(
            "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
          );

        const foundCompetition = await models.Competition.findOne({
          where: { id: competition_id },
          attributes: ['id'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (!foundCompetition) throw new UserInputError('Given competition does not exist.');
        else {
          let endedOnObj = {};
          if (!status) endedOnObj = { ended_on: String(new Date().getTime()) };

          await foundCompetition
            .update({
              active: status,
              ...endedOnObj,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

          return true;
        }
      }
    ),

    upsertCompetitionSubmission: combineResolvers(
      isAuthenticated,
      async (parent, { competition_id, customer_id, media }, { models, me }) => {
        if (!competition_id || Number(competition_id) === 0)
          throw new UserInputError("Invalid argument provided: 'competition_id'");
        if (!customer_id || Number(customer_id) === 0)
          throw new UserInputError("Invalid argument provided: 'customer_id'");
        if (!media) throw new UserInputError("Invalid argument provided: 'media'");

        const foundCustomer = await models.Customer.findOne({
          where: { id: customer_id },
          attributes: ['id', 'slug'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
        if (!foundCustomer) throw new UserInputError('Given customer does not exist.');

        const foundCompetition = await models.Competition.findOne({
          where: { id: competition_id },
          attributes: ['id', 'upload_type'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
        if (!foundCompetition) throw new UserInputError('Given competition does not exist.');

        let upsertObj = { competition_id: Number(competition_id), customer_id: Number(customer_id) };

        if (media && typeof media === 'object') {
          const updateMedia = await UploadAndSetData({
            file: media,
            variable: 'file',
            uploadFolder: 'customer-profile-pic',
            isVideo: foundCompetition.upload_type === 'video' ? true : false,
            appendSlug: foundCustomer.slug || `customer-id-${customer_id}`,
          });
          upsertObj = {
            ...upsertObj,
            media: updateMedia.file,
          };
        }

        const foundSubmission = await models.CompetitionSubmission.findOne({
          where: { competition_id, customer_id },
          attributes: ['id', 'media'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (foundSubmission && foundSubmission.id) {
          if (foundSubmission.media)
            await UnlinkFile(foundSubmission.media, 'customer-profile-pic').catch((err) =>
              console.log('Error while deleting submission media: ', err)
            );

          await foundSubmission
            .update({
              ...upsertObj,
              active: true,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });
        } else
          await models.CompetitionSubmission.create({
            ...upsertObj,
            action_taken: false,
            active: true,
            created_by: Number(me.id),
          }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    ),

    changeCompetitionSubmissionStatus: combineResolvers(
      isAuthenticated,
      async (parent, { submission_id, status }, { models, me }) => {
        if (!submission_id || Number(submission_id) === 0)
          throw new UserInputError("Invalid argument provided: 'submission_id'");
        if (status !== true && status !== false)
          throw new UserInputError(
            "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
          );

        const foundSubmission = await models.CompetitionSubmission.findOne({
          where: { id: submission_id },
          attributes: ['id'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (!foundSubmission) throw new UserInputError('Given submission does not exist.');
        else {
          await foundSubmission
            .update({
              active: status,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

          return true;
        }
      }
    ),

    changeCompetitionSubmissionActionTaken: combineResolvers(
      isAuthenticated,
      async (parent, { submission_id, status }, { models, me }) => {
        if (!submission_id || Number(submission_id) === 0)
          throw new UserInputError("Invalid argument provided: 'submission_id'");
        if (status !== true && status !== false)
          throw new UserInputError(
            "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
          );

        const foundSubmission = await models.CompetitionSubmission.findOne({
          where: { id: submission_id },
          attributes: ['id'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (!foundSubmission) throw new UserInputError('Given submission does not exist.');
        else {
          await foundSubmission
            .update({
              action_taken: status,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

          return true;
        }
      }
    ),

    deleteCompetitionSubmission: combineResolvers(
      isAuthenticated,
      async (parent, { submission_id }, { models, me }) => {
        if (!submission_id || Number(submission_id) === 0)
          throw new UserInputError("Invalid argument provided: 'submission_id'");

        const foundSubmission = await models.CompetitionSubmission.findOne({
          where: { id: submission_id },
          attributes: ['id', 'media'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (foundSubmission && foundSubmission.media) {
          await UnlinkFile(foundSubmission.media, 'customer-profile-pic').catch((err) =>
            console.log('Error while deleting submission media: ', err)
          );
          await models.CompetitionSubmission.destroy({ where: { id: submission_id } });
        }

        return true;
      }
    ),

    upsertCompetitionWinners: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { competition_id, winner_customer_ids = [], runner_up_1_customer_ids = [], runner_up_2_customer_ids = [] },
        { models, me }
      ) => {
        if (!competition_id || Number(competition_id) === 0)
          throw new UserInputError("Invalid argument provided: 'competition_id'");

        const foundCompetition = await models.Competition.findOne({
          where: { id: competition_id },
          attributes: ['id'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });
        if (!foundCompetition) throw new UserInputError('Given competition does not exist.');

        let upsertObj = {
          competition_id: Number(competition_id),
          winner_customer_ids,
          runner_up_1_customer_ids,
          runner_up_2_customer_ids,
        };

        const foundWinners = await models.CompetitionWinner.findOne({
          where: { competition_id },
          attributes: ['id'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (foundWinners && foundWinners.id)
          await foundWinners
            .update({
              ...upsertObj,
              active: true,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });
        else
          await models.CompetitionWinner.create({
            ...upsertObj,
            active: true,
            created_by: Number(me.id),
          }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    ),
  },
};
