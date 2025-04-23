import React from "react";
import { Link } from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import { Breadcrumb } from "antd";

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
              {breadcrumb.props.children.replace("-", " ")} /{" "}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </span>
  </Breadcrumb>
);

export default withBreadcrumbs()(PureBreadcrumbs);
