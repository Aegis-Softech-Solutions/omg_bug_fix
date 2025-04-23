import React from "react";
import Head from "next/head";
import PageWrapper from "../components/PageWrapper";
import RegistrationForm from "../sections/registration/RegistrationForm";
import WhatsappFloatingButton from "../sections/common/WhatsappFloatingButton";
import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import { CUSTOMER_DETAILS } from "../pageQueries/queries";

function Registration({ data }) {
  return (
    <>
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>
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
        <WhatsappFloatingButton delay="0" />
        <RegistrationForm
          customerDetails={
            data.customerDetails &&
            data.customerDetails.customerDetails &&
            data.customerDetails.customerDetails.payment_made === "Yes"
              ? data.customerDetails.customerDetails
              : null
          }
          utm_campaign={data.utm_campaign}
          utm_referrer={data.utm_referrer}
          utm_source={data.utm_source}
          utm_medium={data.utm_medium}
          utm_adgroup={data.utm_adgroup}
          utm_content={data.utm_content}
        />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  const apolloClient = initializeApollo(cookies.token ? cookies.token : null);
  const utm_referrer = cookies.utm_campaign ? cookies.utm_campaign : null;

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
        utm_referrer: utm_referrer,

        utm_campaign:
          ctx && ctx.query && ctx.query.utm_campaign
            ? ctx.query.utm_campaign
            : "",

        utm_source:
          ctx && ctx.query && ctx.query.utm_source ? ctx.query.utm_source : "",

        utm_medium:
          ctx && ctx.query && ctx.query.utm_medium ? ctx.query.utm_medium : "",

        utm_adgroup:
          ctx && ctx.query && ctx.query.utm_adgroup
            ? ctx.query.utm_adgroup
            : "",

        utm_content:
          ctx && ctx.query && ctx.query.utm_content
            ? ctx.query.utm_content
            : "",
      },
    },
  };
}

export default Registration;
