import gql from "graphql-tag";

export const SAMPLE_RECORDS = gql`
  query {
    sampleRecords {
      id
      sample_record_name
    }
  }
`;

export const SAMPLE_RECORD = gql`
  query($id: ID!) {
    sampleRecord(id: $id) {
      id
      sample_record_name
    }
  }
`;

export const ADD_SAMPLE_RECORD = gql`
  mutation($sample_record_name: String!) {
    addSampleRecord(sample_record_name: $sample_record_name) {
      id
    }
  }
`;
export const UPDATE_SAMPLE_RECORD = gql`
  mutation($id: ID!, $sample_record_name: String!) {
    updateSampleRecord(id: $id, sample_record_name: $sample_record_name) {
      id
    }
  }
`;
