import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import Auxiliary from "util/Auxiliary";
import CompetitionTable from "./DisplayTable";
import CompetitionForm from "./Form";

const Competition = props => {
  const { userPermissions } = props;

  const { useraction, id } = props.match.params;

  switch (useraction) {
    case "create":
      if (userPermissions.includes("createCompetition")) {
        return (
          <Auxiliary>
            <CompetitionForm
              competition_id={id}
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
      if (id && userPermissions.includes("readCompetition")) {
        return (
          <Auxiliary>
            <CompetitionForm
              competition_id={id}
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
      if (id && userPermissions.includes("updateCompetition")) {
        return (
          <Auxiliary>
            <CompetitionForm
              competition_id={id}
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
      if (userPermissions.includes("readCompetition")) {
        return (
          <Row>
            <Col span={24}>
              <CompetitionTable />
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

export default connect(mapStateToProps)(Competition);
