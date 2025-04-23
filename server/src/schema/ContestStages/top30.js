import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    top30Profiles(gender: String): [Profile]
    top30IDs(gender: String): [Profile]
    top30DataByCustomerId(customer_id: ID): Profile
    top30LeaderboardBySearch(gender: String, searchTerm: String, limit: Int, offset: Int): [Profile]
  }

  extend type Mutation {
    startTop30Activity(status: Boolean!): Boolean!
    stopTop30Activity: Boolean!
    finaliseTop30(add_customer_ids: [ID]!, delete_customer_ids: [ID]!): Boolean
    uploadTop30Video(video: Upload): Boolean!
    upsertTop30VideoFromCMS(customer_id: ID!, video: Upload!): Boolean!
    scoreTop30Video(customer_id: ID!, score: Float!): Boolean!
  }
`;
