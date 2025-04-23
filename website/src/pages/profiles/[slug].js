import React from "react";

import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";
import ProfileForm from "../../sections/search-profiles/ProfilePage";
import Head from "next/head";
import { parseCookies } from "nookies";
import { initializeApollo } from "../../utils/apollo-ssr-client";
import {
  CUSTOMER_DETAILS,
  CUSTOMER_BY_SLUG,
  CONTEST_STAGES,
} from "../../pageQueries/queries";
import { Section, Box, Text, Button } from "../../components/Core";
import { Container, Row, Col } from "react-bootstrap";

function ProfileFormPage({ data }) {
  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@omgfoy" />
        <meta
          name="twitter:title"
          content={
            "Profile - " + data.customerDetails &&
            data.customerDetails.customerDetails &&
            data.customerDetails.customerDetails.full_name
              ? data.customerDetails.customerDetails.full_name
              : ""
          }
        />
        <meta
          name="twitter:text:title"
          content={
            "Profile - " + data.customerDetails &&
            data.customerDetails.customerDetails &&
            data.customerDetails.customerDetails.full_name
              ? data.customerDetails.customerDetails.full_name
              : ""
          }
        />
        <meta name="twitter:description" content="Profile page" />
        <meta
          name="twitter:image"
          content={
            data.customerBySlug &&
            data.customerBySlug.customerBySlug &&
            data.customerBySlug.customerBySlug.pic1
              ? process.env.REACT_APP_IMAGE_URL +
                process.env.REACT_APP_PROFILE_IMAGE_PATH +
                data.customerBySlug.customerBySlug.pic1
              : ""
          }
        />
        {/* Open Graph */}
        <meta
          property="og:url"
          content={
            process.env.CLIENT_URL + "profiles/" + data.customerDetails &&
            data.customerDetails.customerDetails &&
            data.customerDetails.customerDetails.slug
              ? data.customerDetails.customerDetails.slug
              : ""
          }
          key="ogurl"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            data.customerBySlug &&
            data.customerBySlug.customerBySlug &&
            data.customerBySlug.customerBySlug.pic1
              ? process.env.REACT_APP_IMAGE_URL +
                process.env.REACT_APP_PROFILE_IMAGE_PATH +
                data.customerBySlug.customerBySlug.share_pic
              : ""
          }
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content="omgfaceoftheyear"
          key="ogsitename"
        />
        <meta
          property="og:title"
          content={
            "Profile - " + data.customerDetails &&
            data.customerDetails.customerDetails &&
            data.customerDetails.customerDetails.full_name
              ? data.customerDetails.customerDetails.full_name
              : ""
          }
          key="ogtitle"
        />
        <meta property="og:description" content="Profile Page" key="ogdesc" />
      </Head>
      <PageWrapper
        customerDetails={
          data.customerDetails &&
          data.customerDetails.customerDetails &&
          data.customerDetails.customerDetails.payment_made === "Yes"
            ? data.customerDetails.customerDetails
            : null
        }
      >
        {data.customerBySlug &&
        data.customerBySlug.customerBySlug &&
        data.customerBySlug.customerBySlug.id ? (
          <ProfileForm
            customerBySlug={
              data.customerBySlug && data.customerBySlug.customerBySlug
                ? data.customerBySlug.customerBySlug
                : null
            }
            contestStages={
              data.contestStages && data.contestStages.contestStages
                ? data.contestStages.contestStages
                : null
            }
            loggedInUserId={
              data.customerDetails &&
              data.customerDetails.customerDetails &&
              data.customerDetails.customerDetails.id
                ? data.customerDetails.customerDetails.id
                : 0
            }
          />
        ) : (
          <div style={{ minHeight: "85vh" }}>
            <Section pb={"0px"}>
              <Box
                // mb={"40px"}
                // mt={"40px"}
                pb={"0px"}
                pt={"40px"}
                pl={"10px"}
                pr={"10px"}
              >
                <Container>
                  <Text variant="bold" color="#000000" className="mb-4">
                    Hey there!
                  </Text>
                  <Text variant="bold" color="#000000" className="mb-5">
                    This profile is currently under review. Please check back
                    again soon.
                  </Text>
                  <Row className="text-center">
                    <Col xs={12}>
                      <Link href="/home">
                        <a>
                          <Button
                            width="100%"
                            type="submit"
                            variant="custom"
                            borderRadius={10}
                          >
                            Home
                          </Button>
                        </a>
                      </Link>
                    </Col>
                  </Row>
                </Container>
              </Box>
            </Section>
          </div>
        )}
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  const { slug } = ctx.query;
  const apolloClient = initializeApollo(cookies.token ? cookies.token : null);

  let customerDetailsResponse;

  try {
    customerDetailsResponse = await apolloClient.query({
      query: CUSTOMER_DETAILS,
    });
  } catch (error) {
    customerDetailsResponse = null;
  }

  let customerBySlugResponse;

  try {
    customerBySlugResponse = await apolloClient.query({
      query: CUSTOMER_BY_SLUG,
      variables: { slug: slug },
    });
  } catch (error) {
    console.log("error", error);
    customerBySlugResponse = null;
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
        customerBySlug: customerBySlugResponse
          ? customerBySlugResponse.data
          : null,
        contestStages: contestStagesResponse
          ? contestStagesResponse.data
          : null,
      },
    },
  };
}

export default ProfileFormPage;
