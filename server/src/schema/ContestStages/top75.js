import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    top75Profiles(gender: String): [Profile]
    top75IDs(gender: String): [Profile]
    top75DataByCustomerId(customer_id: ID): Profile
    top75LeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    startTop75Activity(status: Boolean!): Boolean!
    stopTop75Activity: Boolean!
    finaliseTop75(add_customer_ids: [ID]!, delete_customer_ids: [ID]!): Boolean
    uploadTop75Video(video: Upload): Boolean!
    upsertTop75VideoFromCMS(customer_id: ID!, video: Upload!): Boolean!
    scoreTop75Video(customer_id: ID!, score: Float!): Boolean!
  }
`;
