import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";

import Auxiliary from "util/Auxiliary";
import HomeBannerTable from "./DisplayTable";
import HomeBannerForm from "./Form";

const Banner = props => {
  const { userPermissions } = props;

  const { useraction, id } = props.match.params;

  switch (useraction) {
    case "create":
      if (userPermissions.includes("createBanner")) {
        return (
          <Auxiliary>
            <HomeBannerForm
              banner_id={id}
              page_history={props.history}
              crud="create"
            />
          </Auxiliary>
        );
      } else {
        props.history.push("/error-404");
        return null;
      }

    case "read":
      if (id && userPermissions.includes("readBanner")) {
        return (
          <Auxiliary>
            <HomeBannerForm
              banner_id={id}
              page_history={props.history}
              crud="read"
            />
          </Auxiliary>
        );
      } else {
        props.history.push("/error-404");
        return null;
      }

    case "update":
      if (id && userPermissions.includes("updateBanner")) {
        return (
          <Auxiliary>
            <HomeBannerForm
              banner_id={id}
              page_history={props.history}
              crud="update"
            />
          </Auxiliary>
        );
      } else {
        props.history.push("/error-404");
        return null;
      }

    default:
      if (userPermissions.includes("readBanner")) {
        return (
          <Row>
            <Col span={24}>
              <HomeBannerTable />
            </Col>
          </Row>
        );
      } else {
        props.history.push("/error-404");
        return null;
      }
  }
};

//get the mapStateToProps
const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Banner);
