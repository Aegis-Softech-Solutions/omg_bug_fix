import gql from "graphql-tag";

export const CONTENT_STAGES = gql`
  query {
    contestStages {
      id
      stage
      active
    }
  }
`;

export const ACTIVATE_ONLINE_VOTING = gql`
  mutation($status: Boolean!) {
    activateOnlineVoting(status: $status)
  }
`;

export const STOP_ONLINE_VOTING = gql`
  mutation {
    stopOnlineVoting
  }
`;

export const FINALISE_500 = gql`
  mutation($status: Boolean!) {
    finaliseTop500(status: $status)
  }
`;

export const STOP_TOP_500_ACTIVITIES = gql`
  mutation {
    stopTop500Activity
  }
`;

export const START_TOP_150_ACTIVITIES = gql`
  mutation($status: Boolean!) {
    startTop150Activity(status: $status)
  }
`;

export const STOP_TOP_150_ACTIVITIES = gql`
  mutation {
    stopTop150Activity
  }
`;

export const START_TOP_75_ACTIVITIES = gql`
  mutation($status: Boolean!) {
    startTop75Activity(status: $status)
  }
`;

export const STOP_TOP_75_ACTIVITIES = gql`
  mutation {
    stopTop75Activity
  }
`;

export const START_TOP_30_ACTIVITIES = gql`
  mutation($status: Boolean!) {
    startTop30Activity(status: $status)
  }
`;

export const STOP_TOP_30_ACTIVITIES = gql`
  mutation {
    stopTop30Activity
  }
`;

export const START_TOP_20_ACTIVITIES = gql`
  mutation($status: Boolean!) {
    startTop20Activity(status: $status)
  }
`;

export const STOP_TOP_20_ACTIVITIES = gql`
  mutation {
    stopTop20Activity
  }
`;

export const START_TOP_10_ACTIVITIES = gql`
  mutation($status: Boolean!) {
    startTop10Activity(status: $status)
  }
`;

export const STOP_TOP_10_ACTIVITIES = gql`
  mutation {
    stopTop10Activity
  }
`;

export const START_TOP_5_ACTIVITIES = gql`
  mutation($status: Boolean!) {
    startTop5Activity(status: $status)
  }
`;

export const STOP_TOP_5_ACTIVITIES = gql`
  mutation {
    stopTop5Activity
  }
`;
