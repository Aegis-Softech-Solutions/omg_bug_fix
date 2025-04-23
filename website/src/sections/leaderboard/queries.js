import gql from "graphql-tag";

export const VOTING_PHASE_CUSTOMERS_BY_SEARCH = gql`
  query($gender: String, $searchTerm: String, $offset: Int) {
    votingPhaseCustomersBySearch(
      gender: $gender
      searchTerm: $searchTerm
      offset: $offset
    ) {
      id
      full_name
      slug
      votes
      votes_rank
      profile_pic
    }
  }
`;
