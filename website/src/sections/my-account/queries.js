import gql from "graphql-tag";

export const SEND_OTP_REGISTER = gql`
  mutation(
    $full_name: String!
    $email: String!
    $phone: Float!
    $gender: String!
  ) {
    sendOTPRegister(
      full_name: $full_name
      email: $email
      phone: $phone
      gender: $gender
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

export const EDIT_CUSTOMER_DETAILS = gql`
  mutation($full_name: String!, $email: String!, $phone: Float!) {
    editCustomerDetails(full_name: $full_name, email: $email, phone: $phone) {
      id
    }
  }
`;
