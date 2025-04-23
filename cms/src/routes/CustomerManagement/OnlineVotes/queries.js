import gql from "graphql-tag";

export const APPROVED_PROFILES = gql`
  query($gender: String) {
    approvedProfilesForVoting(gender: $gender) {
      id
      full_name
      email
      phone
      profile_pic
      votes
      votes_rank
    }
  }
`;

export const VOTING_SEARCH = gql`
  query($gender: String, $limit: Int, $offset: Int) {
    votingPhaseCustomersBySearch(
      gender: $gender
      limit: $limit
      offset: $offset
    ) {
      id
      full_name
      slug
      votes
      votes_rank
    }
  }
`;
