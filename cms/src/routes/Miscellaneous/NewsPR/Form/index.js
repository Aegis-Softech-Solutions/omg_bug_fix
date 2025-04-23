import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import {
  NEWS_BY_ID,
  UPLOAD_IMAGES,
  UPSERT_NEWS,
  DOES_SLUG_EXIST
} from "../queries";
import NewsItemForm from "./form";

class NewsPRFormPage extends Component {
  render() {
    const { news_id, crud, page_history } = this.props;
    return (
      <Mutation mutation={UPSERT_NEWS}>
        {upsertNews => (
          <Mutation mutation={UPLOAD_IMAGES}>
            {uploadImages => (
              <Mutation mutation={DOES_SLUG_EXIST}>
                {doesSlugExist => (
                  <Query query={NEWS_BY_ID} variables={{ id: news_id || 0 }}>
                    {({ loading, error, data }) => {
                      if (loading) return "Loading...";
                      if (error) return `Error! ${error.message}`;

                      const newsData = data.newsById;

                      return (
                        <NewsItemForm
                          crud={crud}
                          news_id={news_id}
                          newsData={newsData}
                          upsertNews={upsertNews}
                          uploadImages={uploadImages}
                          doesSlugExist={doesSlugExist}
                          page_history={page_history}
                        />
                      );
                    }}
                  </Query>
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default NewsPRFormPage;
