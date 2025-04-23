import gql from "graphql-tag";

export const GET_CUSTOMER_PASSWORD_TOKEN = gql`
  query($token: String) {
    customerByResetPasswordToken(token: $token) {
      id
      full_name
    }
  }
`;

export const RESET_CUSTOMER_PASSWORD = gql`
  mutation($customer_id: ID!, $password: String!) {
    resetCustomerPassword(customer_id: $customer_id, password: $password)
  }
`;
