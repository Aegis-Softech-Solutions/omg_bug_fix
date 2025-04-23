import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    top5Profiles(gender: String): [Profile]
    top5IDs(gender: String): [Profile]
    top5DataByCustomerId(customer_id: ID): Profile
    top5LeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    startTop5Activity(status: Boolean!): Boolean!
    stopTop5Activity: Boolean!
    finaliseTop5(add_customer_ids: [ID]!, delete_customer_ids: [ID]!): Boolean
    uploadTop5Video(video: Upload): Boolean!
    upsertTop5VideoFromCMS(customer_id: ID!, video: Upload!): Boolean!
    scoreTop5Video(customer_id: ID!, score: Float!): Boolean!
  }
`;
