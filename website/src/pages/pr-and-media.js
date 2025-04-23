import React from "react";

import PageWrapper from "../components/PageWrapper";
import NewsAndPRList from "../sections/pr-and-media/NewsAndPRList";

import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  NEWS_PR_LIST,
  NEWS_PR_LIST_WITH_COUNT,
} from "../pageQueries/queries";

function NewsAndPR({ data }) {
  return (
    <>
      <PageWrapper
        customerDetails={
          data.customerDetails &&
          data.customerDetails.customerDetails &&
          data.customerDetails.customerDetails.payment_made === "Yes"
            ? data.customerDetails.customerDetails
            : null
        }
      >
        <NewsAndPRList
          newsPRList={data.newsPRList}
          newsPRListCount={
            data.newsPRListCount.newsPRListWithCount &&
            data.newsPRListCount.newsPRListWithCount.count
              ? data.newsPRListCount.newsPRListWithCount.count
              : 0
          }
        />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { page } = ctx.query;
  const cookies = parseCookies(ctx);
  const apolloClient = initializeApollo(cookies.token ? cookies.token : null);

  let customerDetailsResponse;

  try {
    customerDetailsResponse = await apolloClient.query({
      query: CUSTOMER_DETAILS,
    });
  } catch (error) {
    customerDetailsResponse = null;
  }

  let newsPRListResponse;

  try {
    newsPRListResponse = await apolloClient.query({
      query: NEWS_PR_LIST,
      variables: { offset: page ? (parseInt(page, 10) - 1) * 10 : 0 },
    });
  } catch (error) {
    newsPRListResponse = null;
  }

  let newsPRListCountResponse;

  try {
    newsPRListCountResponse = await apolloClient.query({
      query: NEWS_PR_LIST_WITH_COUNT,
    });
  } catch (error) {
    newsPRListCountResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        newsPRList: newsPRListResponse ? newsPRListResponse.data : null,
        newsPRListCount: newsPRListCountResponse
          ? newsPRListCountResponse.data
          : null,
      },
    },
  };
}

export default NewsAndPR;
