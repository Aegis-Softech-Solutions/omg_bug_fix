import React from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { ROLES } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";

const RoleTable = props => {
  const { userPermissions } = props;

  let columnList = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filterableYN: "N",
      sortableYN: "Y",
      sortableNumber: "Y"
    },
    {
      title: "Role Title",
      dataIndex: "title",
      key: "title",
      filterableYN: "N",
      sortableYN: "Y",
      redirectYN: "Y",
      redirectString: "/user-management/roles/read/"
    }
    // {
    //   title: "Active",
    //   dataIndex: "active",
    //   key: "active",
    //   fieldType: "mutationSwitch",
    //   mutation: changeStatus,
    //   variables: [{ varName: "role_id", varValue: "id" }],
    //   statusVariableName: "status",
    //   disabled: !(
    //     userPermissions && userPermissions.includes("updateRole")
    //   ),
    //   filterableYN: "N",
    //   sortableYN: "N"
    // }
  ];

  return (
    <DisplayTable
      columns={columnList}
      selectQuery={ROLES}
      title="Roles"
      showCreateButton="Y"
      createLink="/user-management/roles/create/"
    />
  );
};

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(RoleTable);
