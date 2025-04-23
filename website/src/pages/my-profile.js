import React from "react";
import { NextSeo } from "next-seo";
import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import PageWrapper from "../components/PageWrapper";
import ProfileForm from "../sections/profile-page/ProfilePage";
import {
  CUSTOMER_DETAILS,
  PROFILE_BY_CUSTOMER_ID,
} from "../pageQueries/queries";

function ProfileFormPage({ data }) {
  {if (data.customerDetails && data.customerDetails.customerDetails && data.customerDetails.customerDetails.gender === "h") {
    data.customerDetails.customerDetails.payment_made = "Yes"
  }};
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
        <ProfileForm
          customerDetails={
            data.customerDetails &&
            data.customerDetails.customerDetails &&
            data.customerDetails.customerDetails.payment_made === "Yes"
              ? data.customerDetails.customerDetails
              : null
          }
          profileByCustomerId={
            data.profileByCustomerId &&
            data.profileByCustomerId.profileByCustomerId
              ? data.profileByCustomerId.profileByCustomerId
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

  let profileByCustomerIdResponse;

  try {
    profileByCustomerIdResponse = await apolloClient.query({
      query: PROFILE_BY_CUSTOMER_ID,
      variables: {
        customer_id:
          customerDetailsResponse.data &&
          customerDetailsResponse.data.customerDetails
            ? customerDetailsResponse.data.customerDetails.id
            : null,
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
        profileByCustomerId: profileByCustomerIdResponse
          ? profileByCustomerIdResponse.data
          : null,
      },
    },
  };
}

export default ProfileFormPage;
