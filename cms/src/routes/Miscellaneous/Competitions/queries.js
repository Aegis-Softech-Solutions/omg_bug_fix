import gql from "graphql-tag";

export const ALL_COMPETITIONS = gql`
  query {
    allCompetitions {
      id
      name
      description
      upload_type
      active
    }
  }
`;

export const COMPETITION = gql`
  query($id: ID!) {
    competition(id: $id) {
      id
      name
      description
      upload_type
      active
    }
  }
`;

export const ADD_COMPETITION = gql`
  mutation($name: String!, $description: String!, $uploadType: String!) {
    addCompetition(
      name: $name
      description: $description
      uploadType: $uploadType
    )
  }
`;

export const UPDATE_COMPETITION = gql`
  mutation(
    $id: ID!
    $name: String!
    $description: String!
    $uploadType: String!
  ) {
    updateCompetition(
      id: $id
      name: $name
      description: $description
      uploadType: $uploadType
    )
  }
`;

export const CHANGE_STATUS = gql`
  mutation($competition_id: ID!, $status: Boolean!) {
    changeCompetitionStatus(competition_id: $competition_id, status: $status)
  }
`;

export const ALL_COMPETITION_SUBMISSIONS = gql`
  query($competition_id: ID!) {
    competitionSubmissions(competition_id: $competition_id) {
      id
      customer_id
      media
      action_taken
      full_name
      email
      profile_pic
      active
    }
  }
`;

export const UPSERT_SUBMISSION = gql`
  mutation($competition_id: ID!, $customer_id: ID!, $media: Upload!) {
    upsertCompetitionSubmission(
      competition_id: $competition_id
      customer_id: $customer_id
      media: $media
    )
  }
`;

export const CHANGE_SUBMISSION_STATUS = gql`
  mutation($submission_id: ID!, $status: Boolean!) {
    changeCompetitionSubmissionStatus(
      submission_id: $submission_id
      status: $status
    )
  }
`;

export const CHANGE_SUBMISSION_ACTION_TAKEN = gql`
  mutation($submission_id: ID!, $status: Boolean!) {
    changeCompetitionSubmissionActionTaken(
      submission_id: $submission_id
      status: $status
    )
  }
`;

export const DELETE_SUBMISSION = gql`
  mutation($submission_id: ID!) {
    deleteCompetitionSubmission(submission_id: $submission_id)
  }
`;

export const COMPETITION_WINNERS = gql`
  query($competition_id: ID!) {
    competitionWinnerIDsByCompetitionID(competition_id: $competition_id) {
      winner_customer_ids
      runner_up_1_customer_ids
      runner_up_2_customer_ids
    }
  }
`;

export const CHOOSE_WINNERS = gql`
  mutation(
    $competition_id: ID!
    $winner_customer_ids: [Int]
    $runner_up_1_customer_ids: [Int]
    $runner_up_2_customer_ids: [Int]
  ) {
    upsertCompetitionWinners(
      competition_id: $competition_id
      winner_customer_ids: $winner_customer_ids
      runner_up_1_customer_ids: $runner_up_1_customer_ids
      runner_up_2_customer_ids: $runner_up_2_customer_ids
    )
  }
`;
