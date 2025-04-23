import React, { useState } from "react";
import { Query, Mutation } from "react-apollo";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { TOP_500_PROFILES, TOP_150_IDS, FINALISE_150 } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";
import ExportApolloHook from "../../../../pixelsComponents/ExportApolloHook";
import csvHeaders from "./csvHeaders";

const Top500 = props => {
  const { userPermissions, gender } = props;
  // const [exportClicked, setExportClicked] = useState(false);
  // const changeExportState = () => setExportClicked(false);

  const columnList = [
    {
      // prettier-ignore
      title: <div>Current Rank<br/>(60-40 Formula)</div>,
      dataIndex: "top_500_final_rank",
      key: "top_500_final_rank",
      filterableYN: "N",
      sortableYN: "Y",
      width: "15%"
    },
    {
      title: "Profile Pic",
      dataIndex: "profile_pic",
      key: "profile_pic",
      width: 100,
      filterableYN: "N",
      sortableYN: "N",
      fieldType: "image",
      imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
      placeholderType: "general", // values to be passed: "general", or, "profile"
      width: "6%"
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
      title: "Admin Score",
      dataIndex: "score",
      key: "score",
      filterableYN: "N",
      sortableYN: "Y"
    },
    {
      title: "e-mail",
      dataIndex: "email",
      key: "email",
      filterableYN: "N",
      sortableYN: "Y"
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
      filterableYN: "N",
      sortableYN: "N"
    },
    {
      title: "Total online votes",
      dataIndex: "votes",
      key: "votes",
      filterableYN: "N",
      sortableYN: "Y"
    },
    {
      title: "Previous Stage Rank (Based on online votes)",
      dataIndex: "votes_rank",
      key: "votes_rank",
      filterableYN: "N",
      sortableYN: "Y",
      width: "15%"
    }
  ];

  const Top150ButtonParams = {
    title: `Finalise Top 150 ${gender === "f" ? "Females" : "Males"}`
  };

  return (
    <Mutation mutation={FINALISE_150}>
      {finalise150 => (
        <Query query={TOP_150_IDS} variables={{ gender }}>
          {({ loading, error, data, refetch }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            const ids =
              data && data.top150IDs && data.top150IDs.length
                ? data.top150IDs.map(obj => obj.customer_id)
                : [];

            return (
              <DisplayTable
                columns={columnList}
                selectQuery={TOP_500_PROFILES}
                selectQueryVariables={["gender"]}
                selectQueryVariablesValue={[gender]}
                title="Top 1000 Contestants"
                showCreateButton="N"
                createLink=""
                checkboxButton={Top150ButtonParams}
                checkboxButtonMutation={finalise150}
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

export default connect(mapStateToProps)(Top500);
