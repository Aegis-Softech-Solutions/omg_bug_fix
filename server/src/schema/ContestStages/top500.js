import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    contestStages: [ContestStage]
    activeContestStages: [String]
    approvedProfilesForVoting(gender: String): [Profile]
    votesByCustomerId(customer_id: ID): Int
    top500Profiles(gender: String): [Profile]
    top500ScoreByCustomerId(customer_id: ID): Int
    votesLeaderboard(gender: String): [Profile]
    votingPhaseCustomersBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
    top500LeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    activateOnlineVoting(status: Boolean!): Boolean!
    stopOnlineVoting: Boolean!
    finaliseTop500(status: Boolean!): Boolean!
    stopTop500Activity: Boolean!
    addProfileLike(customer_id: ID, ip_address: String): Boolean!
    upsertProfileVotesCMS(customer_id: ID!, votes: Int!): Boolean!
    addScoreToTop500(customer_id: ID!, score: Float!): Boolean!
  }

  type ContestStage {
    id: ID
    stage: String
    active: Boolean
  }
`;
