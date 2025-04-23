import gql from "graphql-tag";

export const TOP_5_PROFILES = gql`
  query($gender: String) {
    top5Profiles(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      video
      score
      is_scored
      top_10_final_rank
      top_5_rank
    }
  }
`;

export const WINNER_IDS = gql`
  query($gender: String) {
    winnerIDs(gender: $gender) {
      customer_id
    }
  }
`;

export const FINALISE_WINNER = gql`
  mutation($add_customer_ids: [ID]!, $delete_customer_ids: [ID]!) {
    finaliseWinner(
      add_customer_ids: $add_customer_ids
      delete_customer_ids: $delete_customer_ids
    )
  }
`;
