import gql from "graphql-tag";

//sign in mutation
export const SIGN_IN = gql`
  mutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      userDetails {
        id
        first_name
        last_name
        email
        role_id
        title
        permissions
      }
    }
  }
`;

export const LAYOUT_SETTINGS = gql`
  query layoutSettings {
    layoutSettings
  }
`;
