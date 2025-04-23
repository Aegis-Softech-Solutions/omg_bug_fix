import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { TOP_150_PROFILES, TOP_75_IDS, FINALISE_75 } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";
import ExportApolloHook from "../../../../pixelsComponents/ExportApolloHook";
import csvHeaders from "./csvHeaders";

const Top150 = props => {
  const { userPermissions, gender } = props;
  // const [exportClicked, setExportClicked] = useState(false);
  // const changeExportState = () => setExportClicked(false);

  const columnList = [
    {
      title: "Current Rank (Based on video score)",
      dataIndex: "top_150_rank",
      key: "top_150_rank",
      filterableYN: "N",
      sortableYN: "Y",
      width: "15%"
    },
    {
      title: "Profile Pic",
      dataIndex: "profile_pic",
      key: "profile_pic",
      width: "6%",
      filterableYN: "N",
      sortableYN: "N",
      fieldType: "image",
      imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
      placeholderType: "general" // values to be passed: "general", or, "profile"
    },
    {
      title: "Customer Name",
      dataIndex: "full_name",
      key: "full_name",
      filterableYN: "N",
      sortableYN: "Y",
      redirectYN: "Y",
      redirectString: "/contestant-management/contestants/read/"
    },
    {
      title: "e-mail",
      dataIndex: "email",
      key: "email",
      filterableYN: "N",
      sortableYN: "N"
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
      filterableYN: "N",
      sortableYN: "N"
    },
    {
      title: "Video Uploaded?",
      dataIndex: "video",
      key: "video",
      filterableYN: "Y",
      sortableYN: "Y",
      render: text => text
    },
    {
      title: "Video Score",
      dataIndex: "score",
      key: "score",
      filterableYN: "N",
      sortableYN: "Y",
      render: (text, record) =>
        record.is_scored ? (
          text
        ) : (
          <span className="error-below-input">- Not scored -</span>
        )
    },
    {
      title: "Previous Stage Rank (60-40 Formula)",
      dataIndex: "top_500_final_rank",
      key: "top_500_final_rank",
      filterableYN: "N",
      sortableYN: "Y",
      width: "15%"
    }
  ];

  const Top75ButtonParams = {
    title: `Finalise Top 75 ${gender === "f" ? "Females" : "Males"}`
  };

  return (
    <Mutation mutation={FINALISE_75}>
      {finalise75 => (
        <Query query={TOP_75_IDS} variables={{ gender }}>
          {({ loading, error, data, refetch }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            const ids =
              data && data.top75IDs && data.top75IDs.length
                ? data.top75IDs.map(obj => obj.customer_id)
                : [];

            return (
              <DisplayTable
                columns={columnList}
                selectQuery={TOP_150_PROFILES}
                selectQueryVariables={["gender"]}
                selectQueryVariablesValue={[gender]}
                title="Top 300 Contestants"
                showCreateButton="N"
                createLink=""
                checkboxButton={Top75ButtonParams}
                checkboxButtonMutation={finalise75}
                checkboxRefetch={refetch}
                checkedIDs={ids}
              />
            );
          }}
        </Query>
      )}
    </Mutation>
  );
};

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Top150);
