import React from "react";

import PageWrapper from "../components/PageWrapper";
import SuccessfulSubmissionComponent from "../sections/successful-submission/SuccessfulSubmission";

function SuccessfulSubmission({ data }) {
  return (
    <>
      <PageWrapper>
        <SuccessfulSubmissionComponent />
      </PageWrapper>
    </>
  );
}

export default SuccessfulSubmission;
