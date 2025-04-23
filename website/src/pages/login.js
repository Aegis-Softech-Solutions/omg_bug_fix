import React from "react";

import PageWrapper from "../components/PageWrapper";
import LoginForm from "../sections/login/LoginForm";

import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import { CUSTOMER_DETAILS } from "../pageQueries/queries";

function Login({ data }) {
  return (
    <>
      <PageWrapper
        headerDark
        footerDark
        customerDetails={
          data.customerDetails &&
          data.customerDetails.customerDetails &&
          data.customerDetails.customerDetails.payment_made === "Yes"
            ? data.customerDetails.customerDetails
            : null
        }
      >
        <LoginForm
          customerDetails={
            data.customerDetails &&
            data.customerDetails.customerDetails &&
            data.customerDetails.customerDetails.payment_made === "Yes"
              ? data.customerDetails.customerDetails
              : null
          }
        />
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

export default Login;
