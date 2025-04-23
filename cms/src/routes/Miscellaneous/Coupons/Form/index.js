import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { ADD_COUPON, UPDATE_COUPON, COUPON } from "../queries";
import PixForm from "../../../../pixelsComponents/PixForm";
import _ from "lodash";

const formFieldData = [
  {
    key: 1,
    fieldName: "code",
    title: "Coupon Code",
    fieldType: "Input",
    isRequired: "Y",
    validationArrayItem: {
      fieldName: "code",
      checkNotEmpty: "Y"
    }
  },
  {
    key: 3,
    fieldName: "value",
    title: "Value",
    fieldType: "Input",
    inputType: "number",
    inputValueType: "float",
    isRequired: "Y",
    validationArrayItem: {
      fieldName: "value",
      checkNotEmpty: "Y"
    }
  }
];

const initialFormData = { id: 0, code: "", value: 0 };

//Component to force refetch on mount
class ForceRefetch extends React.Component {
  componentDidMount() {
    this.props.refetch();
  }
  render() {
    return null;
  }
}

class CouponForm extends Component {
  getFormData = props => {};

  render() {
    const { coupon_id, crud, page_history } = this.props;

    return (
      <Mutation mutation={UPDATE_COUPON}>
        {updateCoupon => (
          <Mutation mutation={ADD_COUPON}>
            {addCoupon => (
              <Query query={COUPON} variables={{ id: coupon_id || 0 }}>
                {({ loading, error, data, refetch }) => {
                  if (loading) return "Loading...";
                  if (error) return `Error! ${error.message}`;

                  const mainData = data.coupon;

                  return (
                    <div>
                      <ForceRefetch refetch={refetch} />

                      <PixForm
                        formTitle="Coupon"
                        formFieldData={formFieldData}
                        initialFormData={
                          crud === "create" ? initialFormData : mainData
                        }
                        formMutation={
                          crud === "create" ? addCoupon : updateCoupon
                        }
                        executeMutation="Y"
                        callBackFromPixForm={this.getFormData}
                        page_history={page_history}
                        redirectStringOnSuccess="/misc/coupons"
                        redirectStringOnCancel={
                          "/misc/coupons/read/" + coupon_id
                        }
                        redirectStringOnBack="/misc/coupons"
                        redirectStringOnEdit={
                          "/misc/coupons/update/" + coupon_id
                        }
                        crud={crud}
                        showButtons="Y"
                      />
                    </div>
                  );
                }}
              </Query>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default CouponForm;
