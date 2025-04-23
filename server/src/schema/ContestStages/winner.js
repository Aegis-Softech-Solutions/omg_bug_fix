import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    winnerProfiles(gender: String): [Profile]
    winnerIDs(gender: String): [Profile]
    winnerDataByCustomerId(customer_id: ID): Profile
    winnerLeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    startWinnerActivity(status: Boolean!): Boolean!
    finaliseWinner(add_customer_ids: [ID]!, delete_customer_ids: [ID]!): Boolean
    uploadWinnerVideo(video: Upload): Boolean!
    upsertWinnerVideoFromCMS(customer_id: ID!, video: Upload!): Boolean!
    scoreWinnerVideo(customer_id: ID!, score: Float!): Boolean!
  }
`;
