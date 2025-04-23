import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allWebinars: [Webinar!]
    activeWebinars: [Webinar!]
    webinar(id: ID!): Webinar
  }

  extend type Mutation {
    addWebinar(title: String!, link: String!): Boolean!
    updateWebinar(id: ID!, title: String!, link: String!): Boolean!
    changeWebinarStatus(webinar_id: ID!, status: Boolean!): Boolean!
  }

  type Webinar {
    id: ID
    title: String
    link: String
    active: Boolean
  }
`;
