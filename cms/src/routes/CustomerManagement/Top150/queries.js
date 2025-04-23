import gql from "graphql-tag";

export const TOP_150_PROFILES = gql`
  query($gender: String) {
    top150Profiles(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      video
      score
      is_scored
      top_500_final_rank
      top_150_rank
    }
  }
`;

export const TOP_75_IDS = gql`
  query($gender: String) {
    top75IDs(gender: $gender) {
      customer_id
    }
  }
`;

export const FINALISE_75 = gql`
  mutation($add_customer_ids: [ID]!, $delete_customer_ids: [ID]!) {
    finaliseTop75(
      add_customer_ids: $add_customer_ids
      delete_customer_ids: $delete_customer_ids
    )
  }
`;
