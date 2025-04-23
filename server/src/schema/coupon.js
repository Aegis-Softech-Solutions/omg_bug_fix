import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    coupons: [Coupon]!
    coupon(id: ID!): Coupon!
  }

  extend type Mutation {
    addCoupon(code: String!, value: Float!): Boolean!
    updateCoupon(id: ID!, code: String!, value: Float!): Boolean!
    changeCouponStatus(coupon_id: ID!, status: Boolean!): Boolean!
  }

  type Coupon {
    id: ID
    code: String
    value: Float
    active: Boolean
  }
`;
