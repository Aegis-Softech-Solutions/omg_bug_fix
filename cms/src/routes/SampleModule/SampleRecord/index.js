import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";

import SampleRecordTable from "./DisplayTable";
import SampleRecordForm from "./Form";

const SampleRecord = props => {
  // const { userPermissions } = props;

  const { useraction, id } = props.match.params;

  switch (useraction) {
    case "create":
      // if (userPermissions.includes("viewSettings")) {
      return (
        <div>
          <SampleRecordForm
            sample_record_id={id}
            page_history={props.history}
            crud="create"
          />
        </div>
      );
    // } else {
    //   props.history.push("/error-404");
    //   return null;
    // }

    case "read":
      if (id) {
        return (
          <div>
            <SampleRecordForm
              sample_record_id={id}
              page_history={props.history}
              crud="read"
            />
          </div>
        );
      } else {
        props.history.push("/error-404");
        return null;
      }

    case "update":
      if (id) {
        return (
          <div>
            <SampleRecordForm
              sample_record_id={id}
              page_history={props.history}
              crud="update"
            />
          </div>
        );
      } else {
        props.history.push("/error-404");
        return null;
      }

    default:
      return (
        <Row>
          <Col span={24}>
            <SampleRecordTable />
          </Col>
        </Row>
      );
  }
};

//get the mapStateToProps
const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);

  return { userPermissions };
};

export default connect(mapStateToProps)(SampleRecord);
