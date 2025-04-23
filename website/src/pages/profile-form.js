import React from "react";

import PageWrapper from "../components/PageWrapper";
import ProfileForm from "../sections/profile-form/ProfileForm";

import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  PROFILE_BY_CUSTOMER_ID,
  CONTEST_STAGES,
} from "../pageQueries/queries";
import LoginForm from "../sections/login/LoginForm";

import { Container } from "react-bootstrap";
import { Box, Text } from "../components/Core";

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
        {/* <Box pb={"60px"} pt={"120px"} style={{ background: "#ffffff" }}>
          <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
            <Text
              fontSize="18px"
              as="h4"
              className="mb-3"
              variant="custom-title"
            >
              Profile cannot be edited as Levels of OMG are in progress
            </Text>
          </Container>
        </Box> */}

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
          contestStages={
            data.contestStages && data.contestStages.contestStages
              ? data.contestStages.contestStages
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

  let contestStagesResponse;

  try {
    contestStagesResponse = await apolloClient.query({
      query: CONTEST_STAGES,
    });
  } catch (error) {
    contestStagesResponse = null;
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
        contestStages: contestStagesResponse
          ? contestStagesResponse.data
          : null,
      },
    },
  };
}

export default ProfileFormPage;
