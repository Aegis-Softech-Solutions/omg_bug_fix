import gql from "graphql-tag";

export const ALL_NEWS = gql`
  query {
    allNews {
      id
      title
      slug
      media_type
      featured_image
      html_content
      excerpt
      publish_at
      active
      createdAt
    }
  }
`;

export const NEWS_BY_ID = gql`
  query($id: ID!) {
    newsById(id: $id) {
      id
      title
      slug
      media_type
      featured_image
      html_content
      excerpt
      publish_at
      active
      createdAt
    }
  }
`;

export const UPLOAD_IMAGES = gql`
  mutation($image: Upload!) {
    uploadImages(image: $image) {
      imgName
    }
  }
`;

export const UPSERT_NEWS = gql`
  mutation($upsertType: String!, $newsData: NewsData!) {
    upsertNews(upsertType: $upsertType, newsData: $newsData)
  }
`;

export const CHANGE_NEWS_STATUS = gql`
  mutation($news_id: ID!, $status: Boolean!) {
    changeNewsStatus(news_id: $news_id, status: $status)
  }
`;

export const DOES_SLUG_EXIST = gql`
  mutation($type: String, $id: ID, $slug: String!) {
    doesSlugExist(type: $type, id: $id, slug: $slug) {
      slugExists
    }
  }
`;
