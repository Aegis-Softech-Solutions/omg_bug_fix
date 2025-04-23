import gql from "graphql-tag";

export const SEND_OTP_REGISTER = gql`
  mutation(
    $full_name: String!
    $email: String!
    $phone: Float!
    $gender: String!
    $utm_referrer: String
    $utm_source: String
    $utm_medium: String
    $utm_adgroup: String
    $utm_content: String
  ) {
    sendOTPRegister(
      full_name: $full_name
      email: $email
      phone: $phone
      gender: $gender
      utm_referrer: $utm_referrer
      utm_source: $utm_source
      utm_medium: $utm_medium
      utm_adgroup: $utm_adgroup
      utm_content: $utm_content
    ) {
      request_id
    }
  }
`;

export const VERIFY_OTP_REGISTER = gql`
  mutation($phone: Float!, $otp: String!) {
    verifyOTPRegister(phone: $phone, otp: $otp) {
      token
    }
  }
`;

export const GENERATE_RAZORPAY_ORDER_ID = gql`
  mutation($amount: Int!) {
    generateRazorpayOrderId(amount: $amount) {
      id
    }
  }
`;

export const ADD_PAYMENT = gql`
  mutation($payment_id: String!, $order_id: String!, $amount: Float!) {
    addPayment(payment_id: $payment_id, order_id: $order_id, amount: $amount)
  }
`;

export const PAYMENT_FAILED = gql`
  mutation {
    paymentFailed
  }
`;
