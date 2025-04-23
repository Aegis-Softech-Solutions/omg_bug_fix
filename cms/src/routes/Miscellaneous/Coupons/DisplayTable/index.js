import React from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { COUPONS, CHANGE_STATUS } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";

const Coupons = props => {
  const { userPermissions } = props;

  return (
    <Mutation mutation={CHANGE_STATUS}>
      {changeStatus => {
        const columnList = [
          {
            title: "Code",
            dataIndex: "code",
            key: "code",
            filterableYN: "N",
            sortableYN: "Y",
            sortableNumber: "Y",
            redirectYN: "Y",
            redirectString: "/misc/coupons/read/"
          },
          {
            title: "Discount",
            dataIndex: "value",
            key: "value",
            filterableYN: "N",
            sortableYN: "Y",
            render: text => `₹ ${text}`
          },
          {
            title: "Active",
            dataIndex: "active",
            key: "active",
            fieldType: "mutationSwitch",
            mutation: changeStatus,
            variables: [{ varName: "coupon_id", varValue: "id" }],
            statusVariableName: "status",
            disabled: !(
              userPermissions && userPermissions.includes("updateCoupon")
            ),
            filterableYN: "N",
            sortableYN: "N"
          }
        ];

        return (
          <DisplayTable
            columns={columnList}
            selectQuery={COUPONS}
            title="Coupons"
            showCreateButton="Y"
            createLink="/misc/coupons/create/"
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

export default connect(mapStateToProps)(Coupons);
