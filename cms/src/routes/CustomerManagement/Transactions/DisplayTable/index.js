import React, { useState } from "react";
import { connect } from "react-redux";
import { DatePicker } from "antd";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";
import { TRANSACTIONS } from "../queries";

const Transactions = () => {
  const [dateRange, setDateRange] = useState([]);
  const [value, setValue] = useState([]);

  const columnList = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      filterableYN: "Y",
      sortableYN: "Y",
      redirectYN: "N"
    },
    {
      title: "Date",
      dataIndex: "created_at_transformed",
      key: "created_at_transformed",
      filterableYN: "N",
      sortableYN: "Y",
      width: 200
    },
    {
      title: "Contestant Name",
      dataIndex: "full_name",
      key: "full_name",
      filterableYN: "N",
      sortableYN: "N",
      redirectYN: "Y",
      redirectString: "/contestant-management/contestants/read/",
      redirectStringConcatId: "customer_id"
    },
    {
      title: "e-mail",
      dataIndex: "email",
      key: "email",
      filterableYN: "N",
      sortableYN: "N",
      ellipsis: true,
      width: 100
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      filterableYN: "N",
      sortableYN: "Y",
      render: text => `₹ ${text}`
    },
    {
      title: "Initiated From",
      dataIndex: "source",
      key: "source",
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
      title: "Razorpay Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
      filterableYN: "N",
      sortableYN: "N"
    },
    {
      title: "Razorpay Order ID",
      dataIndex: "order_name",
      key: "order_name",
      filterableYN: "N",
      sortableYN: "Y"
    }
  ];

  const rangePicker = (
    <DatePicker.RangePicker
      value={value}
      onChange={(value, dateString) => {
        setValue(value);
        setDateRange(dateString[0] ? dateString : []);
      }}
    />
  );

  return (
    <div>
      <DisplayTable
        columns={columnList}
        selectQuery={TRANSACTIONS}
        selectQueryVariables={["dateRange"]}
        selectQueryVariablesValue={[dateRange]}
        title="Transactions"
        showCreateButton="Y"
        createLink="/contestant-management/transactions/create/"
        additionalComponents={[rangePicker]}
        showCSVButton="Y"
        csvFilename="transactions"
      />

      {/* <Card className="gx-card">
        <Row>
          <Col span={15}>
            <Query query={BUSINESS_DATA} variables={{ dateRange }}>
              {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                const { sales, commissions } = data.businessData;
                return (
                  <BusinessDataCard
                    salesSum={Number(sales)}
                    commissionsSum={Number(commissions)}
                  />
                );
              }}
            </Query>
          </Col>
        </Row>
      </Card> */}
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Transactions);
