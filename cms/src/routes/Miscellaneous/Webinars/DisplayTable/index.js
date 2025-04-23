import React from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { ALL_WEBINARS, CHANGE_STATUS } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";

const Webinars = props => {
  const { userPermissions } = props;

  return (
    <Mutation mutation={CHANGE_STATUS}>
      {changeStatus => {
        const columnList = [
          {
            title: "Webinar",
            dataIndex: "title",
            key: "title",
            filterableYN: "N",
            sortableYN: "Y",
            redirectYN: "Y",
            redirectString: "/misc/webinars/read/"
          },
          {
            title: "Link",
            dataIndex: "link",
            key: "link",
            filterableYN: "N",
            sortableYN: "N"
          },
          {
            title: "Active",
            dataIndex: "active",
            key: "active",
            fieldType: "mutationSwitch",
            mutation: changeStatus,
            variables: [{ varName: "webinar_id", varValue: "id" }],
            statusVariableName: "status",
            disabled: !(
              userPermissions && userPermissions.includes("updateWebinar")
            ),
            filterableYN: "N",
            sortableYN: "N"
          }
        ];

        return (
          <DisplayTable
            columns={columnList}
            selectQuery={ALL_WEBINARS}
            title="Webinars"
            showCreateButton="Y"
            createLink="/misc/webinars/create/"
          />
        );
      }}
    </Mutation>
  );
};

//get the mapStateToProps
const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Webinars);
