import gql from "graphql-tag";

export const UPSERT_COMPETITION_SUBMISSION = gql`
  mutation($competition_id: ID!, $customer_id: ID!, $media: Upload!) {
    upsertCompetitionSubmission(
      competition_id: $competition_id
      customer_id: $customer_id
      media: $media
    )
  }
`;

export const VOTING_PHASE_CUSTOMERS_BY_SEARCH = gql`
  query($gender: String, $searchTerm: String, $offset: Int) {
    competitionSubmissionBySearch(
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

export const COMPETITION_SUBMISSION_BY_SEARCH = gql`
  query($search_term: String, $offset: Int) {
    competitionSubmissionBySearch(search_term: $search_term, offset: $offset) {
      id
      competition_id
      competition_name
      customer_id
      upload_type
      media
      full_name
      email
      slug
      profile_pic
      share_pic
    }
  }
`;
