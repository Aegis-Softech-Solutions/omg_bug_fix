import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    top10Profiles(gender: String): [Profile]
    top10IDs(gender: String): [Profile]
    top10DataByCustomerId(customer_id: ID): Profile
    top10LeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    startTop10Activity(status: Boolean!): Boolean!
    stopTop10Activity: Boolean!
    finaliseTop10(add_customer_ids: [ID]!, delete_customer_ids: [ID]!): Boolean
    uploadTop10Video(video: Upload): Boolean!
    upsertTop10VideoFromCMS(customer_id: ID!, video: Upload!): Boolean!
    scoreTop10Video(customer_id: ID!, score: Float!): Boolean!
  }
`;
