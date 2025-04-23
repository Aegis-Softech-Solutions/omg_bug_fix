import gql from "graphql-tag";

export const LATEST_ARTICLES = gql`
  query {
    latestArticles(sort_order: "latest") {
      id
      title
      featured_image
      default_category_image
      publish_at
      slug
      tags {
        id
        name
      }
      categories {
        name
        slug
      }
    }
  }
`;

export const CUSTOMER_DETAILS = gql`
  query {
    customerDetails {
      id
      slug
      full_name
      state
      city
      email
      phone
      phone_string
      gender
      profile_pic
    }
  }
`;

export const PROFILE_BY_CUSTOMER_ID = gql`
  query {
    profileByCustomerId {
      id
      customer_id
      dob
      bio
      insta_link
      fb_link
      height
      weight
      pic1
      pic2
      pic3
      pic4
      intro_video
      personality_meaning
      full_name
      email
      phone
      gender
      state
      city
      pincode
      share_pic
    }
  }
`;
