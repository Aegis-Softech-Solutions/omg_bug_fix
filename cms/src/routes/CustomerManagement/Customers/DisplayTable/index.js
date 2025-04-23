import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import {
  CUSTOMERS,
  PARTIAL_PROFILE_CUSTOMERS,
  UNPAID_CUSTOMERS,
  CHANGE_STATUS,
  EXPORT_PROFILES,
  EXPORT_PARTIAL_PROFILES,
  EXPORT_UNPAID_CUSTOMERS
} from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";
import ExportApolloHook from "../../../../pixelsComponents/ExportApolloHook";
import csvHeaders from "./csvHeaders";

const Customers = props => {
  const { userPermissions, customerStatus } = props;

  const [exportClicked, setExportClicked] = useState(false);
  const changeExportState = () => setExportClicked(false);

  // const [incompleteProfiles, setIncompleteProfiles] = useState(false);

  return (
    <Mutation mutation={CHANGE_STATUS}>
      {changeStatus => {
        const columnList = [
          // {
          //   title: "Sr. No.",
          //   dataIndex: "id",
          //   key: "id",
          //   filterableYN: "N",
          //   sortableYN: "N",
          //   render: (text, record, index) => index + 1
          // },
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
            title: "e-mail",
            dataIndex: "email",
            key: "email",
            filterableYN: "N",
            sortableYN: "Y"
          },
          {
            title: "Phone No.",
            dataIndex: "phone_string",
            key: "phone_string",
            filterableYN: "N",
            sortableYN: "Y"
          },
          {
            title: "Insta Verified?",
            dataIndex: "insta_verified_string",
            key: "insta_verified_string",
            filterableYN: "N",
            sortableYN: "Y"
          },
          {
            title: "Category",
            dataIndex: "gender",
            key: "gender",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "State",
            dataIndex: "state",
            key: "state",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "City",
            dataIndex: "city",
            key: "city",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "UTM Referrer",
            dataIndex: "utm_referrer",
            key: "utm_referrer",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "UTM Source",
            dataIndex: "utm_source",
            key: "utm_source",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "UTM Medium",
            dataIndex: "utm_medium",
            key: "utm_medium",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "UTM Campaign",
            dataIndex: "utm_campaign",
            key: "utm_campaign",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "UTM Adgroup",
            dataIndex: "utm_adgroup",
            key: "utm_adgroup",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title: "UTM Content",
            dataIndex: "utm_content",
            key: "utm_content",
            filterableYN: "Y",
            sortableYN: "Y"
          },
          {
            title:
              customerStatus === "unpaidCustomers"
                ? "Account Created On"
                : "Joined On",
            dataIndex: "payment_made_date",
            key: "payment_made_date",
            filterableYN: "Y",
            sortableYN: "N"
          },
          {
            title: "Active",
            dataIndex: "active",
            key: "active",
            fieldType: "mutationSwitch",
            mutation: changeStatus,
            variables: [{ varName: "customer_id", varValue: "id" }],
            statusVariableName: "status",
            disabled: !(
              userPermissions && userPermissions.includes("updateCustomer")
            ),
            filterableYN: "N",
            sortableYN: "N"
          }
        ];

        const exportButton = (
          <span>
            {!exportClicked ? (
              <Button
                onClick={() => setExportClicked(true)}
                style={{ marginBottom: "0px" }}
              >
                <Icon
                  type="file-excel"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                />
                Export
              </Button>
            ) : null}
            {exportClicked ? (
              <Button style={{ marginBottom: "0px" }}>
                <Icon
                  type="file-excel"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                />
                <ExportApolloHook
                  csvFilename={`${customerStatus} profiles`}
                  csvHeaders={csvHeaders}
                  selectQuery={
                    customerStatus === "partialProfiles"
                      ? EXPORT_PARTIAL_PROFILES
                      : customerStatus === "unpaidCustomers"
                      ? EXPORT_UNPAID_CUSTOMERS
                      : EXPORT_PROFILES
                  }
                  queryVariables={
                    customerStatus === "partialProfiles" ||
                    customerStatus === "unpaidCustomers"
                      ? {}
                      : { final_status: customerStatus }
                  }
                  changeExportState={changeExportState}
                />
              </Button>
            ) : null}
          </span>
        );

        let selectQueryVariables = [];
        let selectQueryVariablesValue = [];

        if (
          customerStatus !== "partialProfiles" &&
          customerStatus !== "unpaidCustomers"
        ) {
          selectQueryVariables = ["final_status"];
          selectQueryVariablesValue = [customerStatus];
        }

        return (
          <DisplayTable
            columns={columnList}
            selectQuery={
              customerStatus === "partialProfiles"
                ? PARTIAL_PROFILE_CUSTOMERS
                : customerStatus === "unpaidCustomers"
                ? UNPAID_CUSTOMERS
                : CUSTOMERS
            }
            selectQueryVariables={selectQueryVariables}
            selectQueryVariablesValue={selectQueryVariablesValue}
            title="Contestants"
            showCreateButton="Y"
            createLink="/contestant-management/contestants/create/"
            additionalComponents={[exportButton]}
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

export default connect(mapStateToProps)(Customers);
