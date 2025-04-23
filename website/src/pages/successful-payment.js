import React from "react";

import Head from "next/head";
import PageWrapper from "../components/PageWrapper";
import SuccessfulRegistrationComponent from "../sections/successful-registration/SuccessfulRegistration";

function SuccessfulRegistration({ data }) {
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '582955268888858');
    fbq('track', 'CompleteRegistration', {
      value: 499.00,
      currency: 'INR'
      });
  `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=582955268888858&ev=PageView&noscript=1"
          />
        </noscript>

        <script
          dangerouslySetInnerHTML={{
            __html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '570595444663020');
    fbq('track', 'CompleteRegistration', {
      value: 499.00,
      currency: 'INR'
      });
  `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=570595444663020&ev=PageView&noscript=1"
          />
        </noscript>
      </Head>
      <PageWrapper>
        <SuccessfulRegistrationComponent orderId={data.orderId} />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { orderId } = ctx.query;

  return {
    props: {
      data: {
        orderId: orderId ? orderId : null,
      },
    },
  };
}

export default SuccessfulRegistration;
