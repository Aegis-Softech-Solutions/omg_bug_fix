import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import { Tabs } from "antd";
import Auxiliary from "util/Auxiliary";
import Top500Table from "./DisplayTable";
import CustomerViewForm from "../Customers/ViewForm";

const TabPane = Tabs.TabPane;

const Top500 = props => {
  const { userPermissions } = props;
  const { useraction, id } = props.match.params;

  switch (useraction) {
    case "read":
      if (
        id &&
        (userPermissions.includes("readCustomer") ||
          userPermissions.includes("readProfile") ||
          userPermissions.includes("readTop500") ||
          userPermissions.includes("updateTop500"))
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
      if (userPermissions.includes("readTop500")) {
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Females" key="1">
              <Row>
                <Col span={24}>
                  <Top500Table gender="f" />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Males" key="2">
              <Row>
                <Col span={24}>
                  <Top500Table gender="m" />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Hairstylist" key="3">
              <Row>
                <Col span={24}>
                  <Top500Table gender="h" />
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

export default connect(mapStateToProps)(Top500);
