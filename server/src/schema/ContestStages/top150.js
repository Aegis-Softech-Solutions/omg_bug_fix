import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    top150Profiles(gender: String): [Profile]
    top150IDs(gender: String): [Profile]
    top150DataByCustomerId(customer_id: ID): Profile
    top150LeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    startTop150Activity(status: Boolean!): Boolean!
    stopTop150Activity: Boolean!
    finaliseTop150(add_customer_ids: [ID]!, delete_customer_ids: [ID]!): Boolean
    uploadTop150Video(video: Upload): Boolean!
    upsertTop150VideoFromCMS(customer_id: ID!, video: Upload!): Boolean!
    scoreTop150Video(customer_id: ID!, score: Float!): Boolean!
  }
`;
