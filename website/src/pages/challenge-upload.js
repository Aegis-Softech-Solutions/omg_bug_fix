import React from "react";

import PageWrapper from "../components/PageWrapper";
import ChallengeUpload from "../sections/challenge/ChallengeUpload";
import ChallengeUploadNotEligible from "../sections/challenge/ChallengeUploadNotEligible";
import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  ALL_SUBMISSIONS_OF_CUSTOMER,
  PROFILE_BY_CUSTOMER_ID,
} from "../pageQueries/queries";

function Challenges({ data }) {
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
        {data &&
        data.profileByCustomerId &&
        data.profileByCustomerId.profileByCustomerId &&
        data.profileByCustomerId.profileByCustomerId.final_status ===
          "approved" ? (
          <ChallengeUpload
            allSubmissionsOfCustomer={data.allSubmissionsOfCustomer}
            customerID={
              data.customerDetails &&
              data.customerDetails.customerDetails &&
              data.customerDetails.customerDetails.payment_made === "Yes"
                ? data.customerDetails.customerDetails.id
                : null
            }
          />
        ) : (
          <ChallengeUploadNotEligible />
        )}
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

  let allSubmissionsOfCustomerResponse;

  try {
    allSubmissionsOfCustomerResponse = await apolloClient.query({
      query: ALL_SUBMISSIONS_OF_CUSTOMER,
      variables: {
        customer_id:
          customerDetailsResponse &&
          customerDetailsResponse.data &&
          customerDetailsResponse.data.customerDetails &&
          customerDetailsResponse.data.customerDetails.id
            ? customerDetailsResponse.data.customerDetails.id
            : 0,
      },
    });
  } catch (error) {
    allSubmissionsOfCustomerResponse = null;
  }

  let profileByCustomerIdResponse;

  try {
    profileByCustomerIdResponse = await apolloClient.query({
      query: PROFILE_BY_CUSTOMER_ID,
      variables: {
        customer_id:
          customerDetailsResponse &&
          customerDetailsResponse.data &&
          customerDetailsResponse.data.customerDetails &&
          customerDetailsResponse.data.customerDetails.id
            ? customerDetailsResponse.data.customerDetails.id
            : 0,
      },
    });
  } catch (error) {
    profileByCustomerIdResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        allSubmissionsOfCustomer: allSubmissionsOfCustomerResponse
          ? allSubmissionsOfCustomerResponse.data
          : null,
        profileByCustomerId: profileByCustomerIdResponse
          ? profileByCustomerIdResponse.data
          : null,
      },
    },
  };
}

export default Challenges;
