import React from "react";
import SplashScreenWithLogo from "../sections/splashscreen/SplashScreenWithLogo";
import PageWrapper from "../components/PageWrapper";
import Head from "next/head";

function Splashscreen({ data }) {
  return (
    <>
      <Head>
        <meta
          name="facebook-domain-verification"
          content="321o4tkkuvqhs6s9k3k2rzl802nr8m"
        />
      </Head>
      <PageWrapper
        homepage={true}
        headerDark
        customerDetails={null}
        style={{ height: "100%" }}
      >
        <SplashScreenWithLogo
          utm_campaign={data.utm_campaign}
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
  return {
    props: {
      data: {
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

export default Splashscreen;
