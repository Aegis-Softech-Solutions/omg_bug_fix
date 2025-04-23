import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allNews: [NewsPR!]
    newsPRList(limit: Int, offset: Int): [NewsPR!]
    newsPRListWithCount(limit: Int, offset: Int): NewsPRWithCount!
    newsById(id: ID!): NewsPR
    newsBySlug(slug: String!): NewsPR
  }

  extend type Mutation {
    doesSlugExist(type: String, id: ID, slug: String!): DoesSlugExist
    upsertNews(upsertType: String!, wasActive: Boolean, newsData: NewsData!): Boolean!
    uploadImages(image: Upload!): ImageName!
    changeNewsStatus(news_id: ID!, status: Boolean!): Boolean!
  }

  type NewsPR {
    id: ID
    title: String
    slug: String
    media_type: String
    featured_image: String
    html_content: String
    excerpt: String
    publish_at: String
    active: Boolean
    createdAt: String
  }

  type NewsPRWithCount {
    count: Int
    rows: [NewsPR]
  }

  input NewsData {
    id: ID
    title: String!
    slug: String!
    media_type: String
    featured_image: Upload
    html_content: String
    excerpt: String
    publish_at: String!
  }

  type DoesSlugExist {
    slugExists: Boolean!
  }

  type ImageName {
    imgName: String
  }
`;
