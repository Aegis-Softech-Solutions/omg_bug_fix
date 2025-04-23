import gql from "graphql-tag";

export const SEND_OTP_LOGIN = gql`
  mutation($cred: String!) {
    sendOTPLogin(cred: $cred) {
      request_id
    }
  }
`;

export const VERIFY_OTP_LOGIN = gql`
  mutation($cred: String!, $otp: String!) {
    verifyOTPLogin(cred: $cred, otp: $otp) {
      token
    }
  }
`;
