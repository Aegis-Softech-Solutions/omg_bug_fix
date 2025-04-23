import React from "react";

import PageWrapper from "../../components/PageWrapper";
import NewsAndPRDetail from "../../sections/pr-and-media/NewsAndPRDetail";

import { parseCookies } from "nookies";
import { initializeApollo } from "../../utils/apollo-ssr-client";
import { CUSTOMER_DETAILS, NEWS_BY_SLUG } from "../../pageQueries/queries";

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
        <NewsAndPRDetail newsBySlug={data.newsBySlug} />
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

  let newsBySlugResponse;

  try {
    newsBySlugResponse = await apolloClient.query({
      query: NEWS_BY_SLUG,
      variables: { slug: slug },
    });
  } catch (error) {
    newsBySlugResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        newsBySlug: newsBySlugResponse ? newsBySlugResponse.data : null,
      },
    },
  };
}

export default NewsAndPR;
