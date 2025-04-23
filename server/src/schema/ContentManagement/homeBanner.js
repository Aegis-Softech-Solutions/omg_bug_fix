import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allHomeBanners: [HomeBanner!]
    activeHomeBanners: [HomeBanner!]
    homeBanner(id: ID!): HomeBanner
  }

  extend type Mutation {
    addHomeBanner(image: Upload!, text: String!): Boolean!
    updateHomeBanner(id: ID!, image: Upload!, text: String!): Boolean!
    changeHomeBannerStatus(banner_id: ID!, status: Boolean!): Boolean!
  }

  type HomeBanner {
    id: ID
    image: String
    text: String
    active: Boolean
  }
`;
