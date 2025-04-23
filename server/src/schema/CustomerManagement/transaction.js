import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    transactions(dateRange: [String]): [Transaction]!
  }

  extend type Mutation {
    addOfflineTransaction(customer_id: ID!, amount: Float!): Boolean
  }

  type Transaction {
    id: ID
    customer_id: Int
    full_name: String
    email: String
    phone: String
    payment_id: String
    order_id: String
    order_name: String
    amount: Float
    active: Boolean
    created_by: Int
    updated_by: Int
    createdAt: String
    created_at_transformed: String
    month: String
    source: String
    utm_referrer: String
    utm_source: String
    utm_medium: String
    utm_campaign: String
    utm_adgroup: String
    utm_content: String
  }
`;
