import gql from "graphql-tag";

export const ROLES = gql`
  query roles {
    roles {
      id
      permissions
      title
    }
  }
`;

export const ROLE = gql`
  query role($id: ID!) {
    role(id: $id) {
      id
      permissions
      title
    }
  }
`;

export const ADD_ROLE = gql`
  mutation addRole($title: String!, $permissions: String!) {
    addRole(title: $title, permissions: $permissions) {
      id
      permissions
      title
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation updateRole($id: ID!, $title: String!, $permissions: String!) {
    updateRole(id: $id, title: $title, permissions: $permissions) {
      id
      title
      permissions
    }
  }
`;
