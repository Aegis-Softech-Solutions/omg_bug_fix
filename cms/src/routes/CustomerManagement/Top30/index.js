import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import { Tabs } from "antd";
import Auxiliary from "util/Auxiliary";
import Top30Table from "./DisplayTable";
import CustomerViewForm from "../Customers/ViewForm";

const TabPane = Tabs.TabPane;

const Top30 = props => {
  const { userPermissions } = props;
  const { useraction, id } = props.match.params;

  switch (useraction) {
    case "read":
      if (
        id &&
        (userPermissions.includes("readCustomer") ||
          userPermissions.includes("readProfile") ||
          userPermissions.includes("readTop30") ||
          userPermissions.includes("updateTop30"))
      ) {
        return (
          <Auxiliary>
            <CustomerViewForm
              customer_id={id}
              page_history={props.history}
              crud="read"
            />
          </Auxiliary>
        );
      } else {
        props.history.push("/error-404");
        return null;
      }

    default:
      if (userPermissions.includes("readTop30")) {
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Females" key="1">
              <Row>
                <Col span={24}>
                  <Top30Table gender="f" />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Males" key="2">
              <Row>
                <Col span={24}>
                  <Top30Table gender="m" />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
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

export default connect(mapStateToProps)(Top30);
