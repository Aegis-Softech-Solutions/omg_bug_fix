import gql from "graphql-tag";

export const CUSTOMERS = gql`
  query($final_status: String) {
    customers(final_status: $final_status) {
      id
      full_name
      email
      phone_string
      insta_verified_string
      gender
      state
      city
      profile_pic
      payment_made_date
      utm_referrer
      utm_source
      utm_medium
      utm_campaign
      utm_adgroup
      utm_content
      active
    }
  }
`;

export const PARTIAL_PROFILE_CUSTOMERS = gql`
  query {
    partialProfileCustomers {
      id
      full_name
      email
      phone_string
      gender
      insta_verified_string
      state
      city
      profile_pic
      payment_made_date
      utm_referrer
      utm_source
      utm_medium
      utm_campaign
      utm_adgroup
      utm_content
      active
    }
  }
`;

export const UNPAID_CUSTOMERS = gql`
  query {
    unpaidCustomers {
      id
      full_name
      email
      phone_string
      gender
      insta_verified_string
      state
      city
      profile_pic
      payment_made_date
      utm_referrer
      utm_source
      utm_medium
      utm_campaign
      utm_adgroup
      utm_content
      active
    }
  }
`;

export const CUSTOMER = gql`
  query($customer_id: ID) {
    customerDetailsById(customer_id: $customer_id) {
      id
      full_name
      email
      phone
      is_email_verified
      profile_pic
      active
      gender
      payment_made
      payment_id
      transaction_id
      payment_made_date
    }
  }
`;

export const ALL_CUSTOMERS_LIST_BY_SEARCH = gql`
  query($searchTerm: String) {
    customersNamesListBySearch(searchTerm: $searchTerm) {
      id
      full_name
      email
    }
  }
`;

export const ADD_CUSTOMER = gql`
  mutation(
    $email: String!
    $full_name: String!
    $phone: Float!
    $gender: String!
    $payment_made: String
  ) {
    addCustomer(
      email: $email
      full_name: $full_name
      phone: $phone
      gender: $gender
      payment_made: $payment_made
    )
  }
`;

export const EDIT_CUSTOMER = gql`
  mutation(
    $id: ID
    $email: String
    $full_name: String
    $phone: Float
    $is_email_verified: String
    $gender: String
    $payment_made: String
    $fromCMS: Boolean
  ) {
    editCustomerDetails(
      id: $id
      email: $email
      full_name: $full_name
      phone: $phone
      is_email_verified: $is_email_verified
      gender: $gender
      payment_made: $payment_made
      fromCMS: $fromCMS
    ) {
      id
    }
  }
`;

export const PROFILE = gql`
  query($customer_id: ID!) {
    profileByCustomerId(customer_id: $customer_id) {
      id
      customer_id
      state
      city
      pincode
      dob
      bio
      insta_link
      fb_link
      height
      weight
      personality_meaning
      pic1
      pic1_status
      pic1_score
      pic2
      pic2_status
      pic2_score
      pic3
      pic3_status
      pic3_score
      intro_video
      intro_video_status
      reject_reason
      final_status
      active
      createdAt
    }
  }
`;

export const UPSERT_PROFILE = gql`
  mutation(
    $customer_id: ID
    $state: String!
    $city: String!
    $pincode: Int!
    $dob: String!
    $bio: String
    $insta_link: String
    $fb_link: String
    $height: String
    $weight: Int
    $pic1: Upload
    $pic2: Upload
    $pic3: Upload
    $pic1_status: String
    $pic1_score: Int
    $pic2_status: String
    $pic2_score: Int
    $pic3_status: String
    $pic3_score: Int
    $intro_video: Upload
    $intro_video_status: String
    $deletedFiles: DeletedFiles
    $fromCMS: Boolean
  ) {
    upsertProfile(
      customer_id: $customer_id
      dob: $dob
      state: $state
      city: $city
      pincode: $pincode
      bio: $bio
      insta_link: $insta_link
      fb_link: $fb_link
      height: $height
      weight: $weight
      pic1: $pic1
      pic2: $pic2
      pic3: $pic3
      pic1_status: $pic1_status
      pic1_score: $pic1_score
      pic2_status: $pic2_status
      pic2_score: $pic2_score
      pic3_status: $pic3_status
      pic3_score: $pic3_score
      intro_video: $intro_video
      intro_video_status: $intro_video_status
      deletedFiles: $deletedFiles
      fromCMS: $fromCMS
    )
  }
`;

export const CHANGE_PROFILE_STATUS_SCORE = gql`
  mutation(
    $customer_id: ID!
    $pic1_status: String
    $pic1_score: Int
    $pic2_status: String
    $pic2_score: Int
    $pic3_status: String
    $pic3_score: Int
    $intro_video_status: String
    $reject_reason: String
    $final_status: String
  ) {
    updateProfileStatusScore(
      customer_id: $customer_id
      pic1_status: $pic1_status
      pic1_score: $pic1_score
      pic2_status: $pic2_status
      pic2_score: $pic2_score
      pic3_status: $pic3_status
      pic3_score: $pic3_score
      intro_video_status: $intro_video_status
      reject_reason: $reject_reason
      final_status: $final_status
    )
  }
`;

export const CHANGE_STATUS = gql`
  mutation($customer_id: ID!, $status: Boolean!) {
    changeCustomerStatus(customer_id: $customer_id, status: $status)
  }
`;

export const UPSERT_VOTES = gql`
  mutation($customer_id: ID!, $votes: Int!) {
    upsertProfileVotesCMS(customer_id: $customer_id, votes: $votes)
  }
`;

export const CUST_VOTE = gql`
  query($customer_id: ID) {
    votesByCustomerId(customer_id: $customer_id)
  }
`;

export const TOP_500_SCORE_CUST = gql`
  query($customer_id: ID) {
    top500ScoreByCustomerId(customer_id: $customer_id)
  }
`;

export const ADD_TOP_500_SCORE = gql`
  mutation($customer_id: ID!, $score: Float!) {
    addScoreToTop500(customer_id: $customer_id, score: $score)
  }
`;

export const TOP_150_CUST_DATA = gql`
  query($customer_id: ID) {
    top150DataByCustomerId(customer_id: $customer_id) {
      video
      score
      top_500_final_rank
      top_150_rank
    }
  }
`;

export const ADD_TOP_150_SCORE = gql`
  mutation($customer_id: ID!, $score: Float!) {
    scoreTop150Video(customer_id: $customer_id, score: $score)
  }
`;

export const UPSERT_TOP_150_VIDEO = gql`
  mutation($customer_id: ID!, $video: Upload!) {
    upsertTop150VideoFromCMS(customer_id: $customer_id, video: $video)
  }
`;

export const TOP_75_CUST_DATA = gql`
  query($customer_id: ID) {
    top75DataByCustomerId(customer_id: $customer_id) {
      video
      score
      top_150_rank
      top_75_rank
    }
  }
`;

export const ADD_TOP_75_SCORE = gql`
  mutation($customer_id: ID!, $score: Float!) {
    scoreTop75Video(customer_id: $customer_id, score: $score)
  }
`;

export const UPSERT_TOP_75_VIDEO = gql`
  mutation($customer_id: ID!, $video: Upload!) {
    upsertTop75VideoFromCMS(customer_id: $customer_id, video: $video)
  }
`;

export const TOP_30_CUST_DATA = gql`
  query($customer_id: ID) {
    top30DataByCustomerId(customer_id: $customer_id) {
      video
      score
      top_75_rank
      top_30_rank
    }
  }
`;

export const ADD_TOP_30_SCORE = gql`
  mutation($customer_id: ID!, $score: Float!) {
    scoreTop30Video(customer_id: $customer_id, score: $score)
  }
`;

export const UPSERT_TOP_30_VIDEO = gql`
  mutation($customer_id: ID!, $video: Upload!) {
    upsertTop30VideoFromCMS(customer_id: $customer_id, video: $video)
  }
`;

export const TOP_20_CUST_DATA = gql`
  query($customer_id: ID) {
    top20DataByCustomerId(customer_id: $customer_id) {
      video
      score
      top_30_rank
      top_20_rank
    }
  }
`;

export const ADD_TOP_20_SCORE = gql`
  mutation($customer_id: ID!, $score: Float!) {
    scoreTop20Video(customer_id: $customer_id, score: $score)
  }
`;

export const UPSERT_TOP_20_VIDEO = gql`
  mutation($customer_id: ID!, $video: Upload!) {
    upsertTop20VideoFromCMS(customer_id: $customer_id, video: $video)
  }
`;

export const TOP_10_CUST_DATA = gql`
  query($customer_id: ID) {
    top10DataByCustomerId(customer_id: $customer_id) {
      video
      score
      top_20_rank
      top_10_rank
    }
  }
`;

export const ADD_TOP_10_SCORE = gql`
  mutation($customer_id: ID!, $score: Float!) {
    scoreTop10Video(customer_id: $customer_id, score: $score)
  }
`;

export const UPSERT_TOP_10_VIDEO = gql`
  mutation($customer_id: ID!, $video: Upload!) {
    upsertTop10VideoFromCMS(customer_id: $customer_id, video: $video)
  }
`;

export const EXPORT_PROFILES = gql`
  query($final_status: String) {
    exportAllProfiles(final_status: $final_status) {
      id
      full_name
      email
      phone
      gender
      insta_verified_string
      dob
      state
      city
      pincode
      not_verified
      payment_made
      payment_made_date
      payment_id
      bio
      insta_link
      fb_link
      height
      weight
      personality_meaning
      utm_referrer
      utm_source
      utm_medium
      utm_campaign
      utm_adgroup
      utm_content
      active
    }
  }
`;

export const EXPORT_PARTIAL_PROFILES = gql`
  query {
    exportPartialProfiles {
      id
      full_name
      email
      phone
      gender
      insta_verified_string
      dob
      state
      city
      pincode
      not_verified
      payment_made
      payment_made_date
      payment_id
      bio
      insta_link
      fb_link
      height
      weight
      personality_meaning
      utm_referrer
      utm_source
      utm_medium
      utm_campaign
      utm_adgroup
      utm_content
      active
    }
  }
`;

export const EXPORT_UNPAID_CUSTOMERS = gql`
  query {
    exportUnpaidCustomers {
      id
      full_name
      email
      phone
      gender
      insta_verified_string
      dob
      state
      city
      pincode
      not_verified
      payment_made
      payment_made_date
      payment_id
      bio
      insta_link
      fb_link
      height
      weight
      personality_meaning
      utm_referrer
      utm_source
      utm_medium
      utm_campaign
      utm_adgroup
      utm_content
      active
    }
  }
`;
