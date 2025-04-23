import React from "react";

import PageWrapper from "../components/PageWrapper";
import SearchList from "../sections/challenge/SearchList";
import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  COMPETITION_SUBMISSION_BY_SEARCH,
  CONTEST_STAGES,
  ACTIVE_COMPETITIONS,
} from "../pageQueries/queries";
import UploadButtonFloating from "../sections/challenge/UploadButtonFloating";
import moment from "moment";

function ChallengesSubmissionList({ data }) {
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
        {/* <SearchList
          searchTerm={data.searchTerm}
          gender={data.gender}
          initialData={
            data.competitionSubmissionBySearch.competitionSubmissionBySearch
          }
          showMessage={
            data.activeCompetitions &&
            data.activeCompetitions.activeCompetitions &&
            data.activeCompetitions.activeCompetitions.length > 0
          }
        /> */}
        <div style={{ minHeight: "80vh" }} />
        <UploadButtonFloating />
        {/* {data.customerDetails &&
          data.customerDetails.customerDetails &&
          data.customerDetails.customerDetails.payment_made === "Yes" && (
            <UploadButtonFloating />
          )} */}
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

  let competitionSubmissionBySearchResponse;

  try {
    competitionSubmissionBySearchResponse = await apolloClient.query({
      query: COMPETITION_SUBMISSION_BY_SEARCH,
      variables: {
        search_term: search ? search : "",
        offset: 0,
      },
    });
  } catch (error) {
    competitionSubmissionBySearchResponse = null;
  }

  let contestStagesResponse;

  try {
    contestStagesResponse = await apolloClient.query({
      query: CONTEST_STAGES,
    });
  } catch (error) {
    contestStagesResponse = null;
  }

  let activeCompetitionsResponse;

  try {
    activeCompetitionsResponse = await apolloClient.query({
      query: ACTIVE_COMPETITIONS,
    });
  } catch (error) {
    activeCompetitionsResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        competitionSubmissionBySearch: competitionSubmissionBySearchResponse
          ? competitionSubmissionBySearchResponse.data
          : null,
        searchTerm: search ? search : "",
        gender: gender ? gender : "m",
        contestStages: contestStagesResponse
          ? contestStagesResponse.data
          : null,
        activeCompetitions: activeCompetitionsResponse
          ? activeCompetitionsResponse.data
          : [],
      },
    },
  };
}

export default ChallengesSubmissionList;
