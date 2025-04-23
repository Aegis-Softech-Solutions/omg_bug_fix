import gql from "graphql-tag";

export const TRANSACTIONS = gql`
  query($dateRange: [String]) {
    transactions(dateRange: $dateRange) {
      id
      customer_id
      full_name
      email
      phone
      payment_id
      order_id
      order_name
      amount
      active
      createdAt
      created_at_transformed
      month
      source
      utm_referrer
      utm_source
      utm_medium
      utm_campaign
      utm_adgroup
      utm_content
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation($customer_id: ID!, $amount: Float!) {
    addOfflineTransaction(customer_id: $customer_id, amount: $amount)
  }
`;
