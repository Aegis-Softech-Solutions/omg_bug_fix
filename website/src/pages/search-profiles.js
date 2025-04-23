import React from "react";

import PageWrapper from "../components/PageWrapper";
import SearchList from "../sections/search-profiles/SearchList";

import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  APPROVED_CUSTOMERS_BY_SEARCH,
  CUSTOMER_DETAILS,
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
        <SearchList
          approvedCustomersBySearch={data.approvedCustomersBySearch}
          searchTerm={data.searchTerm}
        />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { search } = ctx.query;
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

  let approvedCustomersBySearchResponse;

  try {
    approvedCustomersBySearchResponse = await apolloClient.query({
      query: APPROVED_CUSTOMERS_BY_SEARCH,
      variables: { searchTerm: search ? search : "", offset: 0 },
    });
  } catch (error) {
    approvedCustomersBySearchResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        approvedCustomersBySearch: approvedCustomersBySearchResponse
          ? approvedCustomersBySearchResponse.data
          : null,
        searchTerm: search ? search : "",
      },
    },
  };
}

export default NewsAndPR;
