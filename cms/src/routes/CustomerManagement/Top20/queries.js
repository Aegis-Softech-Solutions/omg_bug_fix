import gql from "graphql-tag";

export const TOP_20_PROFILES = gql`
  query($gender: String) {
    top20Profiles(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      video
      score
      is_scored
      top_30_final_rank
      top_20_rank
    }
  }
`;

export const TOP_10_IDS = gql`
  query($gender: String) {
    top10IDs(gender: $gender) {
      customer_id
    }
  }
`;

export const FINALISE_10 = gql`
  mutation($add_customer_ids: [ID]!, $delete_customer_ids: [ID]!) {
    finaliseTop10(
      add_customer_ids: $add_customer_ids
      delete_customer_ids: $delete_customer_ids
    )
  }
`;
