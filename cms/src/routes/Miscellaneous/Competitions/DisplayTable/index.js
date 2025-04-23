import React from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { ALL_COMPETITIONS, CHANGE_STATUS } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";

const Competitions = props => {
  const { userPermissions } = props;

  return (
    <Mutation mutation={CHANGE_STATUS}>
      {changeStatus => {
        const columnList = [
          {
            title: "Competition",
            dataIndex: "name",
            key: "name",
            filterableYN: "N",
            sortableYN: "Y",
            redirectYN: "Y",
            redirectString: "/misc/competitions/read/"
          },
          {
            title: "Upload Type",
            dataIndex: "upload_type",
            key: "upload_type",
            filterableYN: "N",
            sortableYN: "N",
            render: text => text[0].toUpperCase() + text.substr(1).toLowerCase()
          },
          {
            title: "Active",
            dataIndex: "active",
            key: "active",
            fieldType: "mutationSwitch",
            mutation: changeStatus,
            variables: [{ varName: "competition_id", varValue: "id" }],
            statusVariableName: "status",
            disabled: !(
              userPermissions && userPermissions.includes("updateCompetition")
            ),
            filterableYN: "N",
            sortableYN: "N"
          }
        ];

        return (
          <DisplayTable
            columns={columnList}
            selectQuery={ALL_COMPETITIONS}
            title="Competitions"
            showCreateButton="Y"
            createLink="/misc/competitions/create/"
          />
        );
      }}
    </Mutation>
  );
};

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Competitions);
