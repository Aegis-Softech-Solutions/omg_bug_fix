import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    adminProfilePic: User
  }

  extend type Mutation {
    signUp(
      first_name: String!
      last_name: String!
      email: String!
      phone: String!
      password: String!
      role_id: ID!
      profile_pic: Upload
    ): Token!
    signIn(email: String!, password: String!): loginSuccessObject!
    updateUser(
      id: ID!
      first_name: String!
      last_name: String!
      email: String!
      role_id: ID!
      phone: String!
      password: String!
      profile_pic: Upload
    ): Boolean!
    deleteUser(id: ID!): Boolean!
    uploadImage(file: Upload!): Boolean
    changeUserStatus(id: ID!, status: Boolean!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID
    first_name: String
    last_name: String
    full_name: String
    email: String
    password: String
    phone: String
    profile_pic: String
    role_id: Int
    active: Boolean
    title: String
    permissions: String
  }

  type loginSuccessObject {
    token: String!
    userDetails: User!
  }
`;
