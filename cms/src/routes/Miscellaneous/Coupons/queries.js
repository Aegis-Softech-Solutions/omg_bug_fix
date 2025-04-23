import gql from "graphql-tag";

export const COUPONS = gql`
  query {
    coupons {
      id
      code
      value
      active
    }
  }
`;

export const COUPON = gql`
  query($id: ID!) {
    coupon(id: $id) {
      id
      code
      value
      active
    }
  }
`;

export const ADD_COUPON = gql`
  mutation($code: String!, $value: Float!) {
    addCoupon(code: $code, value: $value)
  }
`;

export const UPDATE_COUPON = gql`
  mutation($id: ID!, $code: String!, $value: Float!) {
    updateCoupon(id: $id, code: $code, value: $value)
  }
`;

export const CHANGE_STATUS = gql`
  mutation($coupon_id: ID!, $status: Boolean!) {
    changeCouponStatus(coupon_id: $coupon_id, status: $status)
  }
`;
