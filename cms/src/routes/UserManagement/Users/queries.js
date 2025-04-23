//import gql
import gql from "graphql-tag";

export const USERS = gql`
  query {
    users {
      id
      first_name
      last_name
      full_name
      role_id
      title
      permissions
      email
      password
      profile_pic
      active
    }
  }
`;

export const USER = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      first_name
      last_name
      role_id
      title
      permissions
      email
      password
      phone
      profile_pic
      active
    }
  }
`;

export const UPDATE_USER = gql`
  mutation(
    $id: ID!
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
    $phone: String!
    $role_id: ID!
    $profile_pic: Upload
  ) {
    updateUser(
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
      phone: $phone
      role_id: $role_id
      id: $id
      profile_pic: $profile_pic
    )
  }
`;

export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const SIGN_UP = gql`
  mutation(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
    $role_id: ID!
    $phone: String!
    $profile_pic: Upload
  ) {
    signUp(
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
      role_id: $role_id
      phone: $phone
      profile_pic: $profile_pic
    ) {
      token
    }
  }
`;

export const CHANGE_STATUS = gql`
  mutation($id: ID!, $status: Boolean!) {
    changeUserStatus(id: $id, status: $status)
  }
`;

//ROLES QUERY START
export const ROLES = gql`
  query {
    roles {
      id
      title
      permissions
    }
  }
`;
