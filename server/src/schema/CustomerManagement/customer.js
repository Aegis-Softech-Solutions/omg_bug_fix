import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    customers(final_status: String): [Customer!]
    partialProfileCustomers: [Customer!]
    unpaidCustomers: [Customer!]
    customerDetails: Customer
    customerDetailsById(customer_id: ID): Customer
    customerNameById(customer_id: ID): CustomerName
    approvedCustomersBySearch(searchTerm: String, limit: Int, offset: Int): [Customer!]
    customersNamesListBySearch(searchTerm: String): [Customer!]
    customerBySlug(slug: String): Profile
    customerByVerifyToken(token: String): Customer
    customerByResetPasswordToken(token: String): Customer
  }

  extend type Mutation {
    addCustomer(email: String!, full_name: String!, phone: Float!, gender: String!, payment_made: String): Boolean
    resendEmailVerification(email: String!): Boolean!
    sendOTPRegister(
      full_name: String!
      email: String!
      phone: Float!
      gender: String!
      utm_referrer: String
      utm_source: String
      utm_medium: String
      utm_campaign: String
      utm_adgroup: String
      utm_content: String
    ): OTPObj
    verifyOTPRegister(customer_id: ID, phone: Float!, otp: String!): AuthObject
    sendOTPLogin(cred: String!): OTPObj
    verifyOTPLogin(cred: String!, otp: String!): AuthObject
    sendOTPEditPhone(phone: Float!): OTPObj
    verifyOTPEditPhone(phone: Float!, otp: String!): Boolean!
    editCustomerDetails(
      id: ID
      email: String
      full_name: String
      phone: Float
      is_email_verified: String
      is_phone_verified: String
      gender: String
      payment_made: String
      fromCMS: Boolean
    ): Customer!
    changeCustomerPassword(customer_id: ID, current_password: String!, password: String!): Boolean!
    resetCustomerPasswordRequest(email: String!): Boolean!
    resetCustomerPassword(customer_id: ID!, password: String!): Boolean!
    updateCustomerPhone(customer_id: ID!, phone: String!): Boolean!
    changeCustomerStatus(customer_id: ID!, status: Boolean!): Boolean!
    generateRazorpayOrderId(amount: Int!): RazorpayOrder!
    addPayment(payment_id: String!, order_id: String!, amount: Float!): Boolean!
    paymentFailed: Boolean!
    referOthersMail: Boolean!
    sesTest: Boolean
    initialDataSeed: Boolean
  }

  type Customer {
    id: ID
    new_user: Boolean
    slug: String
    full_name: String
    state: String
    city: String
    email: String
    password: String
    phone: Float
    phone_string: String
    is_email_verified: Boolean
    is_phone_verified: Boolean
    not_verified: String
    insta_verified_string: String
    gender: String
    profile_pic: String
    transaction_id: Int
    payment_made: String
    payment_id: String
    payment_made_date: String
    utm_referrer: String
    utm_source: String
    utm_medium: String
    utm_campaign: String
    utm_adgroup: String
    utm_content: String
    active: Boolean
    createdAt: String
    month: String
    transactionData: Transaction
  }

  type CustomerToken {
    token: String!
  }

  type CustomerName {
    full_name: String
  }

  type AuthObject {
    token: String!
    customerDetails: Customer
  }

  type OTPObj {
    request_id: String
  }

  type RazorpayOrder {
    id: String
    entity: String
    amount: Float
    amount_paid: Float
    amount_due: Float
    currency: String
    receipt: String
    offer_id: String
    status: String
    attempts: Int
    notes: [String]
    created_at: Int
  }
`;
