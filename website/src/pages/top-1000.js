import React from "react";

import PageWrapper from "../components/PageWrapper";
import SearchList from "../sections/top-1000/SearchListAlternate";
import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  TOP_500_LEADERBOARD_BY_SEARCH,
  CONTEST_STAGES,
} from "../pageQueries/queries";
import moment from "moment";

function Leaderboard({ data }) {
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
        {/* <InfiniteExample /> */}
        <SearchList
          searchTerm={data.searchTerm}
          gender={data.gender}
          initialData={
            (data &&
              data.top500LeaderboardBySearch &&
              data.top500LeaderboardBySearch.top500LeaderboardBySearch) ||
            []
          }
        />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { search, gender } = ctx.query;
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

  let top500LeaderboardBySearchResponse;

  try {
    top500LeaderboardBySearchResponse = await apolloClient.query({
      query: TOP_500_LEADERBOARD_BY_SEARCH,
      variables: {
        searchTerm: search ? search : "",
        gender: gender === "f" ? "f" : "m",
        offset: 0,
      },
    });
  } catch (error) {
    top500LeaderboardBySearchResponse = null;
  }

  let contestStagesResponse;

  try {
    contestStagesResponse = await apolloClient.query({
      query: CONTEST_STAGES,
    });
  } catch (error) {
    contestStagesResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        top500LeaderboardBySearch: top500LeaderboardBySearchResponse
          ? top500LeaderboardBySearchResponse.data
          : null,
        searchTerm: search ? search : "",
        gender: gender ? gender : "m",
        contestStages: contestStagesResponse
          ? contestStagesResponse.data
          : null,
      },
    },
  };
}

export default Leaderboard;
