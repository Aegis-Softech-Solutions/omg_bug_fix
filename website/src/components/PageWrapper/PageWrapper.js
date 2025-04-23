import React, { useEffect, useContext } from "react";

import GlobalContext from "../../context/GlobalContext";
import GA from "../../sections/common/GA";

const PageWrapper = ({
  children,
  headerDark = false,
  footerDark = false,
  customerDetails,
  homepage = false,
}) => {
  const gContext = useContext(GlobalContext);

  useEffect(() => {
    if (headerDark) {
      gContext.goHeaderDark();
    } else {
      gContext.goHeaderLight();
    }

    if (footerDark) {
      gContext.goFooterDark();
    } else {
      gContext.goFooterLight();
    }

    gContext.setCustomerDetails(customerDetails);
    gContext.setHomepageFlag(homepage);
  }, [gContext, headerDark, footerDark]);

  return <GA>{children}</GA>;
};

export default PageWrapper;
