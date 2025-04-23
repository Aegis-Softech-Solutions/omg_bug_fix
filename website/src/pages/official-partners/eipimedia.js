import React from "react";

import PageWrapper from "../../components/PageWrapper";
import PartnersPage from "../../sections/official-partners/Eipimedia";

import { parseCookies } from "nookies";
import { initializeApollo } from "../../utils/apollo-ssr-client";
import { CUSTOMER_DETAILS } from "../../pageQueries/queries";

function Partners({ data }) {
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
        <PartnersPage />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
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

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
      },
    },
  };
}

export default Partners;
