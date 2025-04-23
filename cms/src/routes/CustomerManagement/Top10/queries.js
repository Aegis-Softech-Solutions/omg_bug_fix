import gql from "graphql-tag";

export const TOP_10_PROFILES = gql`
  query($gender: String) {
    top10Profiles(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      video
      score
      is_scored
      top_30_final_rank
      top_10_rank
    }
  }
`;

export const TOP_5_IDS = gql`
  query($gender: String) {
    top5IDs(gender: $gender) {
      customer_id
    }
  }
`;

export const FINALISE_5 = gql`
  mutation($add_customer_ids: [ID]!, $delete_customer_ids: [ID]!) {
    finaliseTop5(
      add_customer_ids: $add_customer_ids
      delete_customer_ids: $delete_customer_ids
    )
  }
`;
