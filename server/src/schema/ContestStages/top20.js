import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    top20Profiles(gender: String): [Profile]
    top20IDs(gender: String): [Profile]
    top20DataByCustomerId(customer_id: ID): Profile
    top20LeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    startTop20Activity(status: Boolean!): Boolean!
    stopTop20Activity: Boolean!
    finaliseTop20(add_customer_ids: [ID]!, delete_customer_ids: [ID]!): Boolean
    uploadTop20Video(video: Upload): Boolean!
    upsertTop20VideoFromCMS(customer_id: ID!, video: Upload!): Boolean!
    scoreTop20Video(customer_id: ID!, score: Float!): Boolean!
  }
`;
