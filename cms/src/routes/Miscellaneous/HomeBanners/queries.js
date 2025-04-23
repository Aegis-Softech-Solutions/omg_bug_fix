import gql from "graphql-tag";

export const ALL_HOME_BANNERS = gql`
  query {
    allHomeBanners {
      id
      image
      text
      active
    }
  }
`;

export const HOME_BANNER = gql`
  query($id: ID!) {
    homeBanner(id: $id) {
      id
      image
      text
      active
    }
  }
`;

export const ADD_HOME_BANNER = gql`
  mutation($image: Upload!, $text: String!) {
    addHomeBanner(image: $image, text: $text)
  }
`;

export const UPDATE_HOME_BANNER = gql`
  mutation($id: ID!, $image: Upload!, $text: String!) {
    updateHomeBanner(id: $id, image: $image, text: $text)
  }
`;

export const CHANGE_STATUS = gql`
  mutation($banner_id: ID!, $status: Boolean!) {
    changeHomeBannerStatus(banner_id: $banner_id, status: $status)
  }
`;
