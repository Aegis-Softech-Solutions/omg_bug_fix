import gql from "graphql-tag";

export const TOP_30_PROFILES = gql`
  query($gender: String) {
    top30Profiles(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      video
      score
      is_scored
      top_75_final_rank
      top_30_rank
    }
  }
`;

export const TOP_20_IDS = gql`
  query($gender: String) {
    top20IDs(gender: $gender) {
      customer_id
    }
  }
`;

export const FINALISE_20 = gql`
  mutation($add_customer_ids: [ID]!, $delete_customer_ids: [ID]!) {
    finaliseTop20(
      add_customer_ids: $add_customer_ids
      delete_customer_ids: $delete_customer_ids
    )
  }
`;
