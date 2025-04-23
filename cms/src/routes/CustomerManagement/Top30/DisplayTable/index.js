import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { TOP_30_PROFILES, TOP_20_IDS, FINALISE_20 } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";
import ExportApolloHook from "../../../../pixelsComponents/ExportApolloHook";
import csvHeaders from "./csvHeaders";

const Top30 = props => {
  const { userPermissions, gender } = props;
  // const [exportClicked, setExportClicked] = useState(false);
  // const changeExportState = () => setExportClicked(false);

  const columnList = [
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
    }
  ];

  const Top20ButtonParams = {
    title: `Finalise Top 20 ${gender === "f" ? "Females" : "Males"}`
  };

  return (
    <Mutation mutation={FINALISE_20}>
      {finalise20 => (
        <Query query={TOP_20_IDS} variables={{ gender }}>
          {({ loading, error, data, refetch }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            const ids =
              data && data.top20IDs && data.top20IDs.length
                ? data.top20IDs.map(obj => obj.customer_id)
                : [];

            return (
              <DisplayTable
                columns={columnList}
                selectQuery={TOP_30_PROFILES}
                selectQueryVariables={["gender"]}
                selectQueryVariablesValue={[gender]}
                title="Top 60 Contestants"
                showCreateButton="N"
                createLink=""
                checkboxButton={Top20ButtonParams}
                checkboxButtonMutation={finalise20}
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

export default connect(mapStateToProps)(Top30);
