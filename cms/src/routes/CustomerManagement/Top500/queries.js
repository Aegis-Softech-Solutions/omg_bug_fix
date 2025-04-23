import gql from "graphql-tag";

export const TOP_500_PROFILES = gql`
  query($gender: String) {
    top500Profiles(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      score
      votes
      votes_rank
      top_500_final_rank
    }
  }
`;

export const TOP_150_IDS = gql`
  query($gender: String) {
    top150IDs(gender: $gender) {
      customer_id
    }
  }
`;

export const FINALISE_150 = gql`
  mutation($add_customer_ids: [ID]!, $delete_customer_ids: [ID]!) {
    finaliseTop150(
      add_customer_ids: $add_customer_ids
      delete_customer_ids: $delete_customer_ids
    )
  }
`;
