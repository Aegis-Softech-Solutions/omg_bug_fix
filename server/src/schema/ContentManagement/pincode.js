import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allPincodes: [Pincode!]
    activePincodes: [Pincode!]
    pincode(pincode: Int!): Pincode
  }
  type Pincode {
    id: ID
    pincode: Int
    state: String
    district: String
    active: Boolean
  }
`;
