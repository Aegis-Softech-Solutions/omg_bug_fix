import React from "react";

import PageWrapper from "../components/PageWrapper";
import ChallengeWinners from "../sections/challenge/ChallengeWinners";
import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import { CUSTOMER_DETAILS, COMPETITION_WINNERS } from "../pageQueries/queries";

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
        <ChallengeWinners
          competitionWinners={
            data.competitionWinners &&
            data.competitionWinners.competitionWinners
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

  let competitionWinnersResponse;

  try {
    competitionWinnersResponse = await apolloClient.query({
      query: COMPETITION_WINNERS,
    });
  } catch (error) {
    competitionWinnersResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        competitionWinners: competitionWinnersResponse
          ? competitionWinnersResponse.data
          : null,
      },
    },
  };
}

export default ChallengesSubmissionList;
