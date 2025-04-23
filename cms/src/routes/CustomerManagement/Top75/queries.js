import gql from "graphql-tag";

export const TOP_75_PROFILES = gql`
  query($gender: String) {
    top75Profiles(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      video
      score
      is_scored
      top_150_final_rank
      top_75_rank
    }
  }
`;

export const TOP_30_IDS = gql`
  query($gender: String) {
    top30IDs(gender: $gender) {
      customer_id
    }
  }
`;

export const FINALISE_30 = gql`
  mutation($add_customer_ids: [ID]!, $delete_customer_ids: [ID]!) {
    finaliseTop30(
      add_customer_ids: $add_customer_ids
      delete_customer_ids: $delete_customer_ids
    )
  }
`;
