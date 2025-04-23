import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    contactUsMessages: [ContactUsMessage!]
    contactUsMessageById(id: ID!): ContactUsMessage
  }

  extend type Mutation {
    addContactUsMessage(name: String!, email: String!, phone: String!, subject: String!, message: String!): Boolean
    changeContactUsMessageReadStatus(message_id: ID!, status: Boolean!): Boolean
    replyToMessage(message_id: ID!, reply_message: String!, reply_subject: String!): Boolean
  }

  type ContactUsMessage {
    id: ID
    name: String
    email: String
    phone: String
    subject: String
    message: String
    has_read: Boolean
    active: Boolean
    createdAt: String
  }
`;
