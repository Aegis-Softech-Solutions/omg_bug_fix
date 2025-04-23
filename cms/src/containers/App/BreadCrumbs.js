import React from "react";
import { Link } from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import { Breadcrumb } from "antd";

import UserProfile from "../Sidebar/UserProfile";
// const style = {
//   // marginTop: "70px",
//   width: "100%",
//   zIndex: "100",
//   // position: "fixed",
//   padding: "10px",
//   borderRadius: "0px"
// };

const notificationStyle = {
  float: "right",
  paddingRight: "20px"
};

const PureBreadcrumbs = ({ breadcrumbs }) => (

  <Breadcrumb>
    <span className="breadcrumb-text">
      {breadcrumbs.map(({ breadcrumb, match }, index) => {

        return (
          <Breadcrumb.Item key={match.url}>
            <Link
              className="gx-link"
              to={match.url || ""}
              style={{ textTransform: "capitalize" }}
            >
              {breadcrumb.props.children.replace("-", " ")}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </span>
    {/* <i className="icon icon-notification" style={notificationStyle}/> */}
    <span style={notificationStyle}>
      <UserProfile/>
    </span>
  </Breadcrumb>

);

export default withBreadcrumbs()(PureBreadcrumbs);
