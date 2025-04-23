import React from "react";

import PageWrapper from "../components/PageWrapper";
import SuccessfulRegistrationComponent from "../sections/thank-you/SuccessfulRegistration";

function SuccessfulRegistration({ data }) {
  return (
    <>
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
