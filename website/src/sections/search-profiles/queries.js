import gql from "graphql-tag";

export const ADD_PROFILE_LIKE = gql`
  mutation ($customer_id: ID, $ip_address: String) {
    addProfileLike(customer_id: $customer_id, ip_address: $ip_address)
  }
`;
