import React from "react";

import PageWrapper from "../../components/PageWrapper";
import SubmissionDetail from "../../sections/challenge/SubmissionDetail";

import { parseCookies } from "nookies";
import { initializeApollo } from "../../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  COMPETITION_SUBMISSION_BY_ID,
} from "../../pageQueries/queries";

function Submission({ data }) {
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
        <SubmissionDetail
          competitionSubmissionById={data.competitionSubmissionById}
        />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { page, slug } = ctx.query;
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

  let competitionSubmissionByIdResponse;

  try {
    competitionSubmissionByIdResponse = await apolloClient.query({
      query: COMPETITION_SUBMISSION_BY_ID,
      variables: { id: slug },
    });
  } catch (error) {
    competitionSubmissionByIdResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        competitionSubmissionById: competitionSubmissionByIdResponse
          ? competitionSubmissionByIdResponse.data
          : null,
      },
    },
  };
}

export default Submission;
