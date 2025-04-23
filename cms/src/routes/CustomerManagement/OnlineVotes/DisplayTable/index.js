import React, { useState } from "react";
import { Query, Mutation } from "react-apollo";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { APPROVED_PROFILES, VOTING_SEARCH } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";
import ExportApolloHook from "../../../../pixelsComponents/ExportApolloHook";
import csvHeaders from "./csvHeaders";

// import InfiniteScroll from "react-infinite-scroll-component";

const Customers = props => {
  const { userPermissions, gender } = props;
  // const [scrollLimit, setScrollLimit] = useState(8);
  // const [exportClicked, setExportClicked] = useState(false);
  // const changeExportState = () => setExportClicked(false);
  // console.log(" scrollLimit ==> ", scrollLimit);

  const columnList = [
    {
      title: "Rank",
      dataIndex: "votes_rank",
      key: "votes_rank",
      filterableYN: "N",
      sortableYN: "Y"
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
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
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
    }
  ];

  // const exportButton = (
  //   <span>
  //     {!exportClicked ? (
  //       <Button
  //         onClick={() => setExportClicked(true)}
  //         style={{ marginBottom: "0px" }}
  //       >
  //         <Icon
  //           type="file-excel"
  //           theme="twoTone"
  //           twoToneColor="#52c41a"
  //         />
  //         Export
  //       </Button>
  //     ) : null}
  //     {exportClicked ? (
  //       <Button style={{ marginBottom: "0px" }}>
  //         <Icon
  //           type="file-excel"
  //           theme="twoTone"
  //           twoToneColor="#52c41a"
  //         />
  //         <ExportApolloHook
  //           csvFilename={`${customerStatus} profiles`}
  //           csvHeaders={csvHeaders}
  //           selectQuery={
  //             customerStatus === "partialProfiles"
  //               ? EXPORT_PARTIAL_PROFILES
  //               : customerStatus === "unpaidCustomers"
  //               ? EXPORT_UNPAID_CUSTOMERS
  //               : EXPORT_PROFILES
  //           }
  //           queryVariables={
  //             customerStatus === "partialProfiles" ||
  //             customerStatus === "unpaidCustomers"
  //               ? {}
  //               : { final_status: customerStatus }
  //           }
  //           changeExportState={changeExportState}
  //         />
  //       </Button>
  //     ) : null}
  //   </span>
  // );

  return (
    <div>
      <DisplayTable
        columns={columnList}
        selectQuery={APPROVED_PROFILES}
        selectQueryVariables={["gender"]}
        selectQueryVariablesValue={[gender]}
        title="Approved Profiles for Online Voting"
        showCreateButton="N"
        createLink=""
        // additionalComponents={[exportButton]}
      />

      {/* <Query
        query={VOTING_SEARCH}
        variables={{ limit: scrollLimit, offset: 0 }}
      >
        {({ loading, error, data }) => {
          console.log("HERE");
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          const list = data.votingPhaseCustomersBySearch;
          console.log(" LIST ==> ", list);
          console.log(" scrollLimit ==> ", scrollLimit);

          return (
            <InfiniteScroll
              dataLength={list.length} // This is important field to render the next data
              next={() => {
                console.log("NEXT");
                setScrollLimit(scrollLimit + 3);
              }}
              hasMore={true}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              // below props only if you need pull down functionality
              refreshFunction={() => {
                console.log("NEXT");
                setScrollLimit(scrollLimit + 3);
              }}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              pullDownToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                  &#8595; Pull down to refresh
                </h3>
              }
              releaseToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                  &#8593; Release to refresh
                </h3>
              }
            >
              {list.map(item => (
                <div style={{ height: "100px", borderStyle: "solid" }}>
                  ITEM
                </div>
              ))}
            </InfiniteScroll>
          );
        }}
      </Query> */}
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Customers);
