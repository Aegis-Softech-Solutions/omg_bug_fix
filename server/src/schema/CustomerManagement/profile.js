import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    profileByCustomerId(customer_id: ID!): Profile
    exportAllProfiles(final_status: String): [Profile]
    exportPartialProfiles: [Profile]
    exportUnpaidCustomers: [Profile]
    randomApprovedProfiles: [Profile]
  }

  extend type Mutation {
    upsertProfile(
      customer_id: ID
      profile_pic: String
      dob: String
      bio: String
      insta_link: String
      insta_verified: Boolean
      fb_link: String
      height: String
      weight: Int
      state: String
      city: String
      pincode: Int
      personality_meaning: [String]
      pic1: Upload
      pic2: Upload
      pic3: Upload
      pic4: Upload
      pic1_status: String
      pic1_score: Int
      pic2_status: String
      pic2_score: Int
      pic3_status: String
      pic3_score: Int
      pic4_status: String
      pic4_score: Int
      intro_video: Upload
      intro_video_status: String
      final_status: String
      deletedFiles: DeletedFiles
      fromCMS: Boolean
    ): Boolean

    updateProfileStatusScore(
      customer_id: ID!
      pic1_status: String
      pic1_score: Int
      pic2_status: String
      pic2_score: Int
      pic3_status: String
      pic3_score: Int
      pic4_status: String
      pic4_score: Int
      intro_video_status: String
      reject_reason: String
      final_status: String
    ): Boolean

    setShareProfilePic: Boolean
  }

  type Profile {
    id: ID
    customer_id: Int
    customerData: Customer
    dob: String
    bio: String
    insta_link: String
    insta_verified: Boolean
    insta_verified_string: String
    fb_link: String
    height: String
    weight: Int
    personality_meaning: [String]
    share_pic: String
    profile_pic: String
    pic1: String
    pic1_status: String
    pic1_score: Int
    pic2: String
    pic2_status: String
    pic2_score: Int
    pic3: String
    pic3_status: String
    pic3_score: Int
    pic4: String
    pic4_status: String
    pic4_score: Int
    intro_video: String
    intro_video_status: String
    reject_reason: String
    final_status: String
    active: Boolean
    createdAt: String
    full_name: String
    email: String
    phone: Float
    gender: String
    state: String
    city: String
    pincode: Int
    not_verified: String
    payment_made: String
    payment_made_date: String
    payment_id: String
    slug: String
    utm_referrer: String
    utm_source: String
    utm_medium: String
    utm_campaign: String
    utm_adgroup: String
    utm_content: String
    votes: Int
    score: Float
    is_scored: Boolean
    video: String
    votes_rank: Int
    score_rank: Int
    is_in_top500: Boolean
    top_500_final_rank: Int
    is_in_top150: Boolean
    top_150_final_rank: Int
    top_150_rank: Int
    top_150_video_link: String
    is_in_top75: Boolean
    top_75_final_rank: Int
    top_75_rank: Int
    top_75_video_link: String
    is_in_top30: Boolean
    top_30_final_rank: Int
    top_30_rank: Int
    top_30_video_link: String
    is_in_top20: Boolean
    top_20_final_rank: Int
    top_20_rank: Int
    top_20_video_link: String
    is_in_top10: Boolean
    top_10_final_rank: Int
    top_10_rank: Int
    top_10_video_link: String
    is_in_top5: Boolean
    top_5_final_rank: Int
    top_5_rank: Int
    top_5_video_link: String
    is_winner: Boolean
  }

  input DeletedFiles {
    pic1: Boolean
    pic2: Boolean
    pic3: Boolean
    intro_video: Boolean
  }
`;
