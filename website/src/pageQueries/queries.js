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
      payment_made
    }
  }
`;

export const PROFILE_BY_CUSTOMER_ID = gql`
  query ($customer_id: ID!) {
    profileByCustomerId(customer_id: $customer_id) {
      id
      customer_id
      dob
      bio
      insta_link
      insta_verified
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
      final_status
      share_pic
      is_in_top500
      is_in_top150
      is_in_top75
      is_in_top30
      is_in_top20
      is_in_top10
      is_in_top5
      top_150_video_link
      top_75_video_link
      top_30_video_link
      top_20_video_link
    }
  }
`;

export const NEWS_PR_LIST = gql`
  query ($offset: Int) {
    newsPRList(offset: $offset, limit: 10) {
      id
      title
      slug
      featured_image
      excerpt
      publish_at
      media_type
    }
  }
`;

export const NEWS_PR_LIST_WITH_COUNT = gql`
  query {
    newsPRListWithCount {
      count
    }
  }
`;

export const NEWS_BY_SLUG = gql`
  query ($slug: String!) {
    newsBySlug(slug: $slug) {
      id
      title
      slug
      featured_image
      html_content
      excerpt
      publish_at
      media_type
    }
  }
`;

export const APPROVED_CUSTOMERS_BY_SEARCH = gql`
  query ($searchTerm: String!, $limit: Int, $offset: Int) {
    approvedCustomersBySearch(
      searchTerm: $searchTerm
      limit: $limit
      offset: $offset
    ) {
      id
      full_name
      slug
      profile_pic
    }
  }
`;

export const CUSTOMER_BY_SLUG = gql`
  query ($slug: String!) {
    customerBySlug(slug: $slug) {
      id
      full_name
      email
      phone
      gender
      state
      city
      pincode
      dob
      bio
      insta_link
      insta_verified
      fb_link
      height
      weight
      pic1
      pic2
      pic3
      pic4
      intro_video
      personality_meaning
      slug
      share_pic
      is_in_top500
      is_in_top150
      top_150_video_link
      is_in_top75
      is_in_top30
      is_in_top20
      is_in_top10
      is_in_top5
      top_75_video_link
      top_30_video_link
      top_20_video_link
    }
  }
`;

export const RANDOM_APPROVED_PROFILES = gql`
  query {
    randomApprovedProfiles {
      id
      full_name
      city
      pic1
    }
  }
`;

export const VOTING_PHASE_CUSTOMERS_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String) {
    votingPhaseCustomersBySearch(gender: $gender, searchTerm: $searchTerm) {
      id
      full_name
      slug
      votes
      votes_rank
      profile_pic
      city
    }
  }
`;

export const TOP_500_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String) {
    top500LeaderboardBySearch(gender: $gender, searchTerm: $searchTerm) {
      id
      full_name
      slug
      votes
      top_500_final_rank
      profile_pic
      city
    }
  }
`;

export const TOP_150_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String) {
    top150LeaderboardBySearch(gender: $gender, searchTerm: $searchTerm) {
      id
      full_name
      slug
      votes
      profile_pic
      city
    }
  }
`;

export const TOP_75_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String) {
    top75LeaderboardBySearch(gender: $gender, searchTerm: $searchTerm) {
      id
      full_name
      slug
      votes
      profile_pic
      city
    }
  }
`;

export const TOP_30_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String) {
    top30LeaderboardBySearch(gender: $gender, searchTerm: $searchTerm) {
      id
      full_name
      slug
      votes
      profile_pic
      city
    }
  }
`;

export const TOP_20_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String) {
    top20LeaderboardBySearch(gender: $gender, searchTerm: $searchTerm) {
      id
      full_name
      slug
      votes
      profile_pic
      city
    }
  }
`;

export const TOP_5_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String) {
    top5LeaderboardBySearch(gender: $gender, searchTerm: $searchTerm) {
      id
      full_name
      slug
      votes
      profile_pic
      city
    }
  }
`;

export const CONTEST_STAGES = gql`
  query {
    contestStages {
      stage
      active
    }
  }
`;

export const ACTIVE_WEBINARS = gql`
  query {
    activeWebinars {
      id
      title
      link
    }
  }
`;

export const ACTIVE_COMPETITIONS = gql`
  query {
    activeCompetitions {
      id
      name
    }
  }
`;

export const ALL_SUBMISSIONS_OF_CUSTOMER = gql`
  query ($customer_id: ID) {
    allSubmissionsOfCustomer(customer_id: $customer_id) {
      competition_id
      competition_name
      customer_id
      upload_type
      media
      full_name
      email
      slug
      profile_pic
      share_pic
      description
      active
    }
  }
`;

export const COMPETITION_SUBMISSION_BY_SEARCH = gql`
  query ($search_term: String, $offset: Int) {
    competitionSubmissionBySearch(search_term: $search_term, offset: $offset) {
      id
      competition_id
      competition_name
      customer_id
      upload_type
      media
      full_name
      email
      slug
      profile_pic
      share_pic
    }
  }
`;

export const COMPETITION_SUBMISSION_BY_ID = gql`
  query ($id: ID!) {
    competitionSubmissionById(id: $id) {
      id
      competition_id
      competition_name
      customer_id
      upload_type
      media
      full_name
      email
      slug
      profile_pic
      share_pic
    }
  }
`;

export const COMPETITION_WINNERS = gql`
  query {
    competitionWinners {
      id
      competition_id
      competition_name
      upload_type
      ended_on

      winners {
        full_name
        media
        slug
        share_pic
        profile_pic
      }

      firstRunnerUps {
        full_name
        media
        slug
        share_pic
        profile_pic
      }

      secondRunnerUps {
        full_name
        media
        slug
        share_pic
        profile_pic
      }
    }
  }
`;
