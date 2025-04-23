import React from "react";

import PageWrapper from "../components/PageWrapper";
import WebinarDetail from "../sections/webinar/WebinarDetail";

import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import { CUSTOMER_DETAILS, ACTIVE_WEBINARS } from "../pageQueries/queries";

function Webinar({ data }) {
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
        <WebinarDetail activeWebinars={data.activeWebinars} />
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

  let activeWebinarsResponse;

  try {
    activeWebinarsResponse = await apolloClient.query({
      query: ACTIVE_WEBINARS,
    });
  } catch (error) {
    activeWebinarsResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        activeWebinars: activeWebinarsResponse
          ? activeWebinarsResponse.data
          : null,
      },
    },
  };
}

export default Webinar;
