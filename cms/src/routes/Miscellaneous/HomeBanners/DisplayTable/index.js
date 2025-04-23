import React from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { ALL_HOME_BANNERS, CHANGE_STATUS } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";

const Banners = props => {
  const { userPermissions } = props;

  return (
    <Mutation mutation={CHANGE_STATUS}>
      {changeStatus => {
        const columnList = [
          {
            title: "Banner",
            dataIndex: "image",
            key: "image",
            width: 200,
            filterableYN: "N",
            sortableYN: "N",
            fieldType: "image",
            imgFolderUrl: process.env.REACT_APP_BANNER_URL,
            placeholderType: "general", // values to be passed: "general", or, "profile"
            imgHeight: 100,
            redirectYN: "Y",
            redirectString: "/misc/homeBanners/read/"
          },
          {
            title: "Text",
            dataIndex: "text",
            key: "text",
            filterableYN: "N",
            sortableYN: "N"
          },
          {
            title: "Active",
            dataIndex: "active",
            key: "active",
            fieldType: "mutationSwitch",
            mutation: changeStatus,
            variables: [{ varName: "banner_id", varValue: "id" }],
            statusVariableName: "status",
            disabled: !(
              userPermissions && userPermissions.includes("updateBanner")
            ),
            filterableYN: "N",
            sortableYN: "N"
          }
        ];

        return (
          <DisplayTable
            columns={columnList}
            selectQuery={ALL_HOME_BANNERS}
            title="Home Page Banners"
            showCreateButton="Y"
            createLink="/misc/homeBanners/create/"
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

export default connect(mapStateToProps)(Banners);
