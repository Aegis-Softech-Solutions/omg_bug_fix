import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import schedule from 'node-schedule';
import axios from 'axios';
import { sendEmail } from '../../services/awsSES';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
	Query: {
		contestStages: async (parent, args, { models }) =>
			await models.ContestStage.findAll({ attributes: ['id', 'stage', 'active'] }),

		activeContestStages: async (parent, args, { models }) =>
			await sequelize
				.query(`select array(select stage from contest_stages where active is true) as stages`, {
					raw: true,
					type: sequelize.QueryTypes.SELECT,
				})
				.then((res) => res[0].stages),
		//  models.ContestStage.findAll({ attributes: ['id', 'stage'], where: { active: true } }),

		approvedProfilesForVoting: combineResolvers(isAuthenticated, async (parent, { gender }) => {
			if (gender && gender !== 'm' && gender !== 'f')
				throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f".');

			return await sequelize
				.query(
					`
            select
              online_votes.customer_id as id, full_name, email, phone, votes,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic,
              dense_rank () over (order by votes desc) votes_rank
            from
              online_votes
              left outer join customers on customers.id = online_votes.customer_id
              left outer join profiles on profiles.customer_id = online_votes.customer_id
            where
              online_votes.active is true
              ${gender ? `and online_votes.gender = '${gender}'` : ''}
            order by votes desc, online_votes.customer_id desc
          `
				)
				.then((res) => res[0]);
		}),

		votesByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
			const foundVotes = await models.OnlineVote.findOne({
				attributes: ['votes'],
				where: { customer_id: Number(customer_id), active: true },
			});
			return foundVotes ? foundVotes.votes : null;
		}),

		top500Profiles: combineResolvers(isAuthenticated, async (parent, { gender }) => {
			if (gender && gender !== 'm' && gender !== 'f')
				throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f".');

			return await sequelize
				.query(
					`
            select
              top_500s.customer_id as id, full_name, email, phone, slug, score, votes,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic,
              dense_rank () over (order by votes desc) votes_rank,
              dense_rank () over (order by (((votes :: decimal / 50) * 0.4) + (score * 0.6)) desc) as top_500_final_rank
            from
              top_500s
              left outer join online_votes on online_votes.customer_id = top_500s.customer_id
              left outer join customers on customers.id = top_500s.customer_id
              left outer join profiles on profiles.customer_id = top_500s.customer_id
            where
              top_500s.active is true
              ${gender ? `and top_500s.gender = '${gender}'` : ''}
            order by top_500_final_rank, votes_rank, top_500s.customer_id desc
          `
				)
				.then((res) => res[0]);
		}),

		top500ScoreByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
			const foundScore = await models.Top500.findOne({
				attributes: ['score'],
				where: { customer_id: Number(customer_id), active: true },
			});
			return foundScore ? foundScore.score : null;
		}),

		votesLeaderboard: combineResolvers(isAuthenticated, async (parent, { gender }) => {
			if (gender && gender !== 'm' && gender !== 'f')
				throw new UserInputError('Invalid arguments provided: "gender" must be either "m" or "f".');

			return await sequelize
				.query(
					`
            select
              online_votes.customer_id as id, full_name, votes, slug,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic,
              dense_rank () over (order by votes desc) votes_rank
            from
              online_votes
              left outer join customers on customers.id = online_votes.customer_id
              left outer join profiles on profiles.customer_id = online_votes.customer_id
            where
              online_votes.active is true
              ${gender ? `and online_votes.gender = '${gender}'` : ''}
            order by votes desc, online_votes.customer_id desc
          `
				)
				.then((res) => res[0]);
		}),

		votingPhaseCustomersBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
			return await sequelize
				.query(
					`
            select
              votes_table.customer_id as id, full_name, email, slug, votes, votes_rank,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              online_votes as votes_table
              left outer join customers on customers.id = votes_table.customer_id
              left outer join profiles on profiles.customer_id = votes_table.customer_id
              left outer join (
                select
                  customer_id,
                  dense_rank () over (order by votes desc) votes_rank
                from online_votes as inner_votes_table
                ${gender ? `where inner_votes_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = votes_table.customer_id
            where
              votes_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and votes_table.gender = '${gender}'` : ''}
            order by votes desc, votes_table.customer_id desc
            limit ${limit} offset ${offset}
          `
				)
				.then((res) => res[0]);
		},

		top500LeaderboardBySearch: async (parent, { gender, searchTerm, limit = 20, offset = 0 }) => {
			return await sequelize
				.query(
					`
            select
              top500_table.customer_id as id, full_name, email, slug, votes, score, top_500_final_rank,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                else null end
              ) end as profile_pic
            from
              top_500s as top500_table
              left outer join online_votes as outer_votes on outer_votes.customer_id = top500_table.customer_id
              left outer join customers on customers.id = top500_table.customer_id
              left outer join profiles on profiles.customer_id = top500_table.customer_id
              left outer join (
                select
                  inner_top500_table.customer_id,
                  dense_rank () over (order by (((votes :: decimal / 50) * 0.4) + (score * 0.6)) desc) as top_500_final_rank
                from
                  top_500s as inner_top500_table
                  left outer join online_votes as inner_votes on inner_votes.customer_id = inner_top500_table.customer_id
                ${gender ? `where inner_top500_table.gender = '${gender}'` : ''}
              ) as rank_table on rank_table.customer_id = top500_table.customer_id
            where
              top500_table.active is true
              ${searchTerm ? `and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')` : ''}
              ${gender ? `and top500_table.gender = '${gender}'` : ''}
            order by (((votes :: decimal / 50) * 0.4) + (score * 0.6)) desc, top500_table.customer_id desc
            limit ${limit} offset ${offset}
          `
				)
				.then((res) => res[0]);
		},
	},

	Mutation: {
		activateOnlineVoting: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
			if (status !== true && status !== false)
				throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

			const nextStageStatus = await models.ContestStage.findOne({ attributes: ['active'], where: { stage: 'top500' } });
			if (status === false && nextStageStatus.active)
				throw new UserInputError('Next stage of the contest is already active. Cannot disable a previous stage.');

			await models.ContestStage.update({ active: status }, { where: { stage: 'online_voting' } }).catch((error) => {
				throw new ApolloError(error.message, 'MUTATION_ERROR');
			});

			if (status) {
				const approvedFemales = await sequelize.query(
					`
            select customer_id, full_name, email, phone
            from
              profiles
              left outer join customers on customers.id = customer_id
            where
              customers.active is true
              and gender = 'f'
              and final_status = 'approved'
          `,
					{ raw: true, type: sequelize.QueryTypes.SELECT }
				);

				for await (const female of approvedFemales) {
					const foundFemale = await models.OnlineVote.findOne({
						attributes: ['id'],
						where: { customer_id: Number(female.customer_id) },
					});
					if (foundFemale)
						await foundFemale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
					else
						await models.OnlineVote.create({
							customer_id: Number(female.customer_id),
							gender: 'f',
							votes: 0,
							active: true,
							created_by: Number(me.id),
						}).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
				}

				const approvedMales = await sequelize.query(
					`
            select customer_id, full_name, email, phone
            from
              profiles
              left outer join customers on customers.id = customer_id
            where
              customers.active is true
              and gender = 'm'
              and final_status = 'approved'
          `,
					{ raw: true, type: sequelize.QueryTypes.SELECT }
				);

				for await (const male of approvedMales) {
					const foundMale = await models.OnlineVote.findOne({
						attributes: ['id'],
						where: { customer_id: Number(male.customer_id) },
					});
					if (foundMale)
						await foundMale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
					else
						await models.OnlineVote.create({
							customer_id: Number(male.customer_id),
							gender: 'm',
							votes: 0,
							active: true,
							created_by: Number(me.id),
						}).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
				}

				// const notApprovedContestants = await sequelize.query(
				//   `select customer_id from profiles where final_status <> 'approved'`,
				//   { raw: true, type: sequelize.QueryTypes.SELECT }
				// );

				// let notApprovedIDs = [];
				// if (notApprovedContestants) notApprovedIDs = notApprovedContestants.map(({ customer_id }) => customer_id);

				// const noProfileContestants = await sequelize.query(
				//   `
				//     select customers.id
				//     from
				//       customers
				//       left outer join profiles on profiles.customer_id = customers.id
				//     where transaction_id is null or customer_id is null
				//   `,
				//   { raw: true, type: sequelize.QueryTypes.SELECT }
				// );
				// if (noProfileContestants)
				//   notApprovedIDs = [...notApprovedIDs, ...noProfileContestants.map(({ id }) => Number(id))];

				// if (notApprovedIDs.length)
				//   await models.Customer.update({ active: false }, { where: { id: notApprovedIDs } }).catch((error) => {
				//     throw new ApolloError(error.message, 'MUTATION_ERROR');
				//   });

				const approvedForVoting = [...approvedFemales, ...approvedMales];

				schedule.scheduleJob(`sendMail-votingStarted`, new Date(Date.now() + 2000), async () => {
					for await (const approved of approvedForVoting) {
						const sendEmailArgs = {
							templateName: 'votingStarted',
							templateData: { name: approved.full_name.split(' ')[0] },
							toAddress: approved.email.toLowerCase(),
							subject: 'The Leader Board Race | OMG – Face Of The Year 2025',
						};
						sendEmail(sendEmailArgs).then(
							() => console.log(`Voting started mail successfully sent to: ${approved.email.toLowerCase()}.`),
							(err) => {
								console.log(`Error while sending voting started mail to: ${approved.email.toLowerCase()}.`);
								console.dir(err.message);
							}
						);

						const smsText =
							'Dear Candidate,%0aCongratulations!!%0aYour profile is live to share. Please check your mail for further details.%0aRegards,%0aOMG - Face Of The Year 2025';
						await axios
							.post(
								`https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${approved.phone}&message=${smsText}&sender=OMGFOY&route=4`
							)
							.then((res) => console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${approved.phone} : `, res.data))
							.catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${approved.phone} : `, err));
					}
				});
			} else
				await models.ContestStage.update({ active: !status }, { where: { stage: 'stop_online_voting' } }).catch(
					(error) => {
						throw new ApolloError(error.message, 'MUTATION_ERROR');
					}
				);

			return true;
		}),

		stopOnlineVoting: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
			const prevStageStatus = await models.ContestStage.findOne({
				attributes: ['active'],
				where: { stage: 'online_voting' },
			});
			if (!prevStageStatus.active) throw new UserInputError('Please start the "Online Voting" stage first.');

			// await models.ContestStage.update({ active: false }, { where: { stage: 'online_voting' } }).catch((error) => {
			//   throw new ApolloError(error.message, 'MUTATION_ERROR');
			// });

			await models.ContestStage.update({ active: true }, { where: { stage: 'stop_online_voting' } }).catch((error) => {
				throw new ApolloError(error.message, 'MUTATION_ERROR');
			});

			return true;
		}),

		finaliseTop500: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
			if (status !== true && status !== false)
				throw new UserInputError('Invalid arguments provided: "status" must be either true or false.');

			const prevStageStatus = await models.ContestStage.findOne({
				attributes: ['active'],
				where: { stage: 'stop_online_voting' },
			});
			if (status === true && !prevStageStatus.active)
				throw new UserInputError('Please turn-off "Online Voting" stage first.');

			const nextStageStatus = await models.ContestStage.findOne({ attributes: ['active'], where: { stage: 'top150' } });
			if (status === false && nextStageStatus.active)
				throw new UserInputError('Next stage of the contest is already active. Cannot disable a previous stage.');

			await models.ContestStage.update({ active: status }, { where: { stage: 'top500' } }).catch((error) => {
				throw new ApolloError(error.message, 'MUTATION_ERROR');
			});

			if (status) {
				const top500Females = await sequelize.query(
					`
            select customer_id
            from
              online_votes
              left outer join customers on customers.id = customer_id
            where
              online_votes.active is true
              and online_votes.gender = 'f'
              and customers.active is true
            order by votes desc
            limit 500
          `,
					{ raw: true, type: sequelize.QueryTypes.SELECT }
				);

				for await (const female of top500Females) {
					const foundFemale = await models.Top500.findOne({
						attributes: ['id'],
						where: { customer_id: Number(female.customer_id) },
					});
					if (foundFemale)
						await foundFemale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
					else
						await models.Top500.create({
							customer_id: Number(female.customer_id),
							gender: 'f',
							score: 0,
							active: true,
							created_by: Number(me.id),
						}).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
				}

				const top500Males = await sequelize.query(
					`
            select customer_id
            from
              online_votes
              left outer join customers on customers.id = customer_id
            where
              online_votes.active is true
              and online_votes.gender = 'm'
              and customers.active is true
            order by votes desc
            limit 500
          `,
					{ raw: true, type: sequelize.QueryTypes.SELECT }
				);

				for await (const male of top500Males) {
					const foundMale = await models.Top500.findOne({
						attributes: ['id'],
						where: { customer_id: Number(male.customer_id) },
					});
					if (foundMale)
						await foundMale.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
					else
						await models.Top500.create({
							customer_id: Number(male.customer_id),
							gender: 'm',
							score: 0,
							active: true,
							created_by: Number(me.id),
						}).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
				}
			} else
				await models.ContestStage.update({ active: !status }, { where: { stage: 'stop_top500' } }).catch((error) => {
					throw new ApolloError(error.message, 'MUTATION_ERROR');
				});

			return true;
		}),

		stopTop500Activity: combineResolvers(isAuthenticated, async (parent, { status }, { models, me }) => {
			const prevStageStatus = await models.ContestStage.findOne({
				attributes: ['active'],
				where: { stage: 'top500' },
			});
			if (!prevStageStatus.active) throw new UserInputError('Please finalise top-500 candidates first.');

			// await models.ContestStage.update({ active: false }, { where: { stage: 'top500' } }).catch((error) => {
			//   throw new ApolloError(error.message, 'MUTATION_ERROR');
			// });

			await models.ContestStage.update({ active: true }, { where: { stage: 'stop_top500' } }).catch((error) => {
				throw new ApolloError(error.message, 'MUTATION_ERROR');
			});

			return true;
		}),

		addProfileLike: async (parent, { customer_id }, { models, ip_address }) => {
			const incomingIP = ip_address.split(':').pop();
			const foundIP = await models.IPAddress.findOne({
				attributes: ['id', 'voted_customers'],
				where: { ip_address: { [Op.iLike]: incomingIP } },
			});

			if (foundIP && foundIP.id && foundIP.voted_customers.includes(Number(customer_id))) {
				console.log(`IP-Address ${incomingIP} has already voted for customer-ID ${customer_id}`);
				throw new UserInputError('Your vote has already been recorded for the profile. Thank you.');
			} else {
				if (foundIP && foundIP.id) {
					let voted_customers = foundIP.voted_customers;
					voted_customers.push(Number(customer_id));
					await foundIP
						.update({
							last_vote_at: String(new Date().getTime()),
							voted_customers,
						})
						.catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
				} else
					await models.IPAddress.create({
						ip_address: incomingIP.toLowerCase(),
						last_vote_at: String(new Date().getTime()),
						voted_customers: [Number(customer_id)],
						active: true,
						created_by: 0,
					}).catch((error) => {
						throw new ApolloError(error.message, 'MUTATION_ERROR');
					});

				const foundCustomer = await models.Customer.findOne({
					attributes: ['id', 'gender'],
					where: { id: Number(customer_id) },
				});
				if (!foundCustomer) throw new UserInputError('Invalid contestant.');

				const foundVote = await models.OnlineVote.findOne({
					attributes: ['id', 'votes'],
					where: { customer_id: Number(customer_id) },
				});
				if (foundVote) await foundVote.update({ votes: foundVote.votes + 1 });
				else {
					const isApproved = await models.Profile.findOne({
						attributes: ['id', 'final_status'],
						where: { customer_id: Number(customer_id) },
					});

					if (isApproved && isApproved.final_status === 'approved')
						await models.OnlineVote.create({
							customer_id: Number(customer_id),
							gender: foundCustomer.gender,
							votes: 1,
							active: true,
							created_by: 0,
						}).catch((error) => {
							throw new ApolloError(error.message, 'MUTATION_ERROR');
						});
				}

				return true;
			}
		},

		upsertProfileVotesCMS: combineResolvers(isAuthenticated, async (parent, { customer_id, votes }, { models }) => {
			const foundCustomer = await models.Customer.findOne({
				attributes: ['id', 'gender'],
				where: { id: Number(customer_id) },
			});
			if (!foundCustomer) throw new UserInputError('Invalid contestant.');

			const foundVote = await models.OnlineVote.findOne({
				attributes: ['id', 'votes'],
				where: { customer_id: Number(customer_id) },
			});
			if (foundVote) await foundVote.update({ votes });
			else
				await models.OnlineVote.create({
					customer_id: Number(customer_id),
					gender: foundCustomer.gender,
					votes,
					active: true,
					created_by: 0,
				}).catch((error) => {
					throw new ApolloError(error.message, 'MUTATION_ERROR');
				});

			return true;
		}),

		addScoreToTop500: combineResolvers(isAuthenticated, async (parent, { customer_id, score }, { models }) => {
			const foundCustomer = await models.Customer.findOne({
				attributes: ['id'],
				where: { id: Number(customer_id), active: true },
			});
			if (!foundCustomer) throw new UserInputError('Invalid contestant.');

			const foundScore = await models.Top500.findOne({
				attributes: ['id', 'score'],
				where: { customer_id: Number(customer_id), active: true },
			});
			if (foundScore)
				await foundScore.update({ score }).catch((error) => {
					throw new ApolloError(error.message, 'MUTATION_ERROR');
				});

			return true;
		}),
	},
};
