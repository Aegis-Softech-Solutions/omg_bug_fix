import React from "react";

import PageWrapper from "../components/PageWrapper";
import SearchList from "../sections/leaderboard/SearchList";
import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  VOTING_PHASE_CUSTOMERS_BY_SEARCH,
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
            data.votingPhaseCustomersBySearch.votingPhaseCustomersBySearch
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

  let votingPhaseCustomersBySearchResponse;

  try {
    votingPhaseCustomersBySearchResponse = await apolloClient.query({
      query: VOTING_PHASE_CUSTOMERS_BY_SEARCH,
      variables: {
        searchTerm: search ? search : "",
        gender: gender === "f" ? "f" : gender === "m" ? "m" : "h",
        offset: 0,
      },
    });
  } catch (error) {
    votingPhaseCustomersBySearchResponse = null;
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
        votingPhaseCustomersBySearch: votingPhaseCustomersBySearchResponse
          ? votingPhaseCustomersBySearchResponse.data
          : null,
        searchTerm: search ? search : "",
        gender: gender === "f" ? "f" : gender === "m" ? "m" : "h",
        contestStages: contestStagesResponse
          ? contestStagesResponse.data
          : null,
      },
    },
  };
}

export default Leaderboard;
