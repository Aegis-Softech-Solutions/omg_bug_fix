import gql from "graphql-tag";

export const GET_VERIFY_TOKEN = gql`
  query($token: String) {
    customerByVerifyToken(token: $token) {
      id
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation($customer_id: ID!) {
    verifyCustomerEmail(customer_id: $customer_id)
  }
`;
