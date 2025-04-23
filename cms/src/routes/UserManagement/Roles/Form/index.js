import React from "react";
import { Col, Row } from "antd";
import RoleForm from "./RoleForm";
import { Query } from "react-apollo";
import { ROLE, UPDATE_ROLE, ADD_ROLE } from "../queries";

const initialState = {
  id: "",
  title: "",
  permissions: "[]" //empty array because on json parse we need empty array to push permissions
};

const Role = props => {
  const role_id = props.role_id;

  return role_id ? (
    <Row>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <Query query={ROLE} variables={{ id: role_id }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            let formdataValues = Object.values(data);
            let formdata = formdataValues[0];
            return (
              <RoleForm
                id={role_id}
                roleMutation={UPDATE_ROLE}
                initialState={formdata}
                page_history={props.page_history}
              />
            );
          }}
        </Query>
      </Col>
    </Row>
  ) : (
    <Row>
      <Col span={24}>
        <RoleForm
          roleMutation={ADD_ROLE}
          initialState={initialState}
          page_history={props.page_history}
        />
      </Col>
    </Row>
  );
};

export default Role;
