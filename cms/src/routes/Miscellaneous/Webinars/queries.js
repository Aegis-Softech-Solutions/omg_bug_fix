import gql from "graphql-tag";

export const ALL_WEBINARS = gql`
  query {
    allWebinars {
      id
      title
      link
      active
    }
  }
`;

export const WEBINAR = gql`
  query($id: ID!) {
    webinar(id: $id) {
      id
      title
      link
      active
    }
  }
`;

export const ADD_WEBINAR = gql`
  mutation($title: String!, $link: String!) {
    addWebinar(title: $title, link: $link)
  }
`;

export const UPDATE_WEBINAR = gql`
  mutation($id: ID!, $title: String!, $link: String!) {
    updateWebinar(id: $id, title: $title, link: $link)
  }
`;

export const CHANGE_STATUS = gql`
  mutation($webinar_id: ID!, $status: Boolean!) {
    changeWebinarStatus(webinar_id: $webinar_id, status: $status)
  }
`;
