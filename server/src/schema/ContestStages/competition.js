import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		allCompetitions: [Competition!]
		activeCompetitions: [Competition!]
		competition(id: ID!): Competition
		allActiveSubmissions(limit: Int, offset: Int): [CompetitionSubmission]
		allSubmissionsOfCustomer(customer_id: ID): [CompetitionSubmission]
		competitionSubmissions(competition_id: ID!): [CompetitionSubmission]
		activeCompetitionSubmissions(competition_id: Int!, limit: Int, offset: Int): [CompetitionSubmission]
		competitionSubmissionBySearch(search_term: String, limit: Int, offset: Int): [CompetitionSubmission]
		competitionSubmissionById(id: ID!): CompetitionSubmission
		competitionWinners: [CompetitionWinners]
		competitionWinnerIDsByCompetitionID(competition_id: ID!): CompetitionWinners
	}

	extend type Mutation {
		addCompetition(name: String!, description: String!, uploadType: String!): Boolean!
		updateCompetition(id: ID!, name: String!, description: String!, uploadType: String!): Boolean!
		changeCompetitionStatus(competition_id: ID!, status: Boolean!): Boolean!
		upsertCompetitionSubmission(competition_id: ID!, customer_id: ID!, media: Upload!): Boolean
		changeCompetitionSubmissionStatus(submission_id: ID!, status: Boolean!): Boolean!
		changeCompetitionSubmissionActionTaken(submission_id: ID!, status: Boolean!): Boolean!
		deleteCompetitionSubmission(submission_id: ID!): Boolean!
		upsertCompetitionWinners(
			competition_id: ID!
			winner_customer_ids: [Int]
			runner_up_1_customer_ids: [Int]
			runner_up_2_customer_ids: [Int]
		): Boolean
	}

	type Competition {
		id: ID
		description: String
		name: String
		upload_type: String
		ended_on: String
		active: Boolean
	}

	type CompetitionSubmission {
		id: ID
		competition_id: Int
		competition_name: String
		description: String
		customer_id: Int
		action_taken: Boolean
		upload_type: String
		media: String
		full_name: String
		email: String
		slug: String
		profile_pic: String
		share_pic: String
		active: Boolean
	}

	type CompetitionWinners {
		id: ID
		competition_id: Int
		competition_name: String
		description: String
		upload_type: String
		ended_on: String
		winner_customer_ids: [Int]
		winners: [CompetitionSubmission]
		runner_up_1_customer_ids: [Int]
		firstRunnerUps: [CompetitionSubmission]
		runner_up_2_customer_ids: [Int]
		secondRunnerUps: [CompetitionSubmission]
	}
`;
