import React from "react";
import PageWrapper from "../components/PageWrapper";

import RegisterButtonFloating from "../sections/homepage/RegisterButtonFloating";
import WhatsappFloatingButton from "../sections/common/WhatsappFloatingButton";
import Head from "next/head";

// import Hero from "../sections/homepage/Hero";
// import HeroVideo from "../sections/homepage/HeroVideo";
// import AboutUs from "../sections/homepage/AboutUs";
// import Winners from "../sections/homepage/Winners";
// import Jury from "../sections/homepage/Jury";
// import Sponsors from "../sections/homepage/Sponsors";
// import PRAndMedia from "../sections/homepage/PRAndMedia";
// import Instagram from "../sections/homepage/Instagram";

// import BannerText from "../sections/homepage-v2/BannerText";
// import Jury from "../sections/homepage-v2/Jury";
// import Sponsors from "../sections/homepage-v2/Sponsors";

import Hero from "../sections/homepage-v3/Hero";
import BannerText from "../sections/homepage-v3/BannerText";
import Jury from "../sections/homepage-v3/Jury";
import Sponsors from "../sections/homepage-v3/Sponsors";
import WhyRegister from "../sections/homepage-v3/WhyRegister";

import topupBanner from "../assets/image/homepage/banners/topup.jpeg";

import { parseCookies } from "nookies";
import { initializeApollo } from "../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  NEWS_PR_LIST,
  RANDOM_APPROVED_PROFILES,
  VOTING_PHASE_CUSTOMERS_BY_SEARCH,
} from "../pageQueries/queries";

function Homepage({ data }) {
  const maleLeaderboardData =
    data &&
    data.maleLeaderboard &&
    data.maleLeaderboard.votingPhaseCustomersBySearch
      ? data.maleLeaderboard.votingPhaseCustomersBySearch.slice(0, 10)
      : [];
  const femaleLeaderboardData =
    data &&
    data.femaleLeaderboard &&
    data.femaleLeaderboard.votingPhaseCustomersBySearch
      ? data.femaleLeaderboard.votingPhaseCustomersBySearch.slice(0, 10)
      : [];

  return (
    <>
      <Head>
        <meta
          name="facebook-domain-verification"
          content="321o4tkkuvqhs6s9k3k2rzl802nr8m"
        />
      </Head>
      <PageWrapper
        homepage={
          data.customerDetails &&
          data.customerDetails.customerDetails &&
          data.customerDetails.customerDetails.payment_made === "Yes"
            ? false
            : true
        }
        headerDark
        customerDetails={
          data.customerDetails &&
          data.customerDetails.customerDetails &&
          data.customerDetails.customerDetails.payment_made === "Yes"
            ? data.customerDetails.customerDetails
            : null
        }
      >
        {data.customerDetails &&
        data.customerDetails.customerDetails &&
        (data.customerDetails.customerDetails.payment_made === "Yes") ? null : (
          <RegisterButtonFloating />
        )}

        {/* <HeroVideo />
        <WhatsappFloatingButton />
        <AboutUs />
        <Winners />
        <Jury />
        <Sponsors />
        <PRAndMedia newsPRList={data.newsPRList} />
        <Instagram /> */}

        {/* <BannerText /
        <WhatsappFloatingButton />
        <Jury />
        <Sponsors /> */}

        {/* <a href="https://topupnutrition.com/" target="_blank">
          <img
            src={topupBanner}
            style={{ maxWidth: "100%", paddingTop: "70px" }}
          />
        </a> */}

        {/* <HeroVideo /> */}
        <Hero />
        <BannerText
          // randomApproved={
          //   data.randomApprovedProfiles &&
          //   data.randomApprovedProfiles.randomApprovedProfiles
          //     ? data.randomApprovedProfiles.randomApprovedProfiles
          //     : null
          // }

          maleLeaderboardData={maleLeaderboardData}
          femaleLeaderboardData={femaleLeaderboardData}
        />

        {/* <Jury /> */}
        <Sponsors />
        {/* <WhyRegister /> */}
        <WhatsappFloatingButton />
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

  let randomApprovedProfilesResponse;

  try {
    randomApprovedProfilesResponse = await apolloClient.query({
      query: RANDOM_APPROVED_PROFILES,
    });
  } catch (error) {
    randomApprovedProfilesResponse = null;
  }

  let newsPRListResponse;

  try {
    newsPRListResponse = await apolloClient.query({
      query: NEWS_PR_LIST,
      variables: { offset: 0 },
    });
  } catch (error) {
    newsPRListResponse = null;
  }

  let maleLeaderboardResponse;

  try {
    maleLeaderboardResponse = await apolloClient.query({
      query: VOTING_PHASE_CUSTOMERS_BY_SEARCH,
      variables: {
        searchTerm: "",
        gender: "m",
        offset: 0,
      },
    });
  } catch (error) {
    maleLeaderboardResponse = null;
  }

  let femaleLeaderboardResponse;

  try {
    femaleLeaderboardResponse = await apolloClient.query({
      query: VOTING_PHASE_CUSTOMERS_BY_SEARCH,
      variables: {
        searchTerm: "",
        gender: "f",
        offset: 0,
      },
    });
  } catch (error) {
    femaleLeaderboardResponse = null;
  }
  let hairstylistLeaderboardResponse;

  try {
    hairstylistLeaderboardResponse = await apolloClient.query({
      query: VOTING_PHASE_CUSTOMERS_BY_SEARCH,
      variables: {
        searchTerm: "",
        gender: "h",
        offset: 0,
      },
    });
  } catch (error) {
    hairstylistLeaderboardResponse = null;
  }

  return {
    props: {
      data: {
        customerDetails: customerDetailsResponse
          ? customerDetailsResponse.data
          : null,
        newsPRList: newsPRListResponse ? newsPRListResponse.data : null,
        randomApprovedProfiles: randomApprovedProfilesResponse
          ? randomApprovedProfilesResponse.data
          : null,
        maleLeaderboard: maleLeaderboardResponse
          ? maleLeaderboardResponse.data
          : null,
        femaleLeaderboard: femaleLeaderboardResponse
          ? femaleLeaderboardResponse.data
          : null,
        hairstylistLeaderboard: hairstylistLeaderboardResponse
          ? hairstylistLeaderboardResponse.data
          : null,
      },
    },
  };
}

export default Homepage;
