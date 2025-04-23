import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { connect } from "react-redux";
import { CUSTOMER, ADD_CUSTOMER, EDIT_CUSTOMER } from "../queries";
import PixForm from "../../../../pixelsComponents/PixForm";

const selectDataGender = [
  { id: "m", name: "Male" },
  { id: "f", name: "Female" },
  { id: "h", name: "HairStylist"},

];

const selectDataVerify = [
  { id: "yes", name: "Yes" },
  { id: "no", name: "No" }
];

class BasicDetailsForm extends Component {
  getFormData = props => {};

  render() {
    const { customer_id, crud, page_history, userPermissions } = this.props;

    const formFieldData = [
      {
        key: 1,
        fieldName: "full_name",
        title: "Customer Name",
        fieldType: "Input",
        isRequired: "Y",
        validationArrayItem: { fieldName: "full_name", checkNotEmpty: "Y" }
      },
      {
        key: 2,
        fieldName: "email",
        title: "e-mail",
        fieldType: "Input",
        isRequired: "Y",
        validationArrayItem: { fieldName: "email", checkNotEmpty: "Y" }
      },
      {
        key: 3,
        fieldName: "phone",
        title: "Phone No.",
        fieldType: "Input",
        inputType: "number",
        isRequired: "Y",
        validationArrayItem: { fieldName: "phone", checkNotEmpty: "Y" }
      },
      {
        key: 4,
        fieldName: "genderValue", // key in dataSource that stores value, OR, state variable --> used in validations
        title: "Gender",
        fieldType: "NormalSelect",
        isRequired: "Y",
        validationArrayItem: { fieldName: "gender", checkNotEmpty: "Y" },
        // For Select
        fieldIDName: "gender", // this variable will be used in mutations
        selectDataIDName: "id", // used as "key" in "Option" of "Select" dropdown
        selectDataFieldName: "name", // display-name of "Option" of "Select" dropdown
        selectData: selectDataGender
      },
      // {
      //   key: 9,
      //   fieldName: "password",
      //   title: "Password",
      //   fieldType: "Input",
      //   inputType: "password",
      //   disabled: !userPermissions.includes("updateUser"),
      //   isRequired: "Y",
      //   validationArrayItem: {
      //     fieldName: "password",
      //     checkNotEmpty: "Y",
      //     minLength: 7,
      //     maxLength: 40
      //   }
      // },
      {
        key: 5,
        fieldName: "paymentMadeValue", // key in dataSource that stores value, OR, state variable --> used in validations
        title: "Payment Made ?",
        fieldType: "NormalSelect",
        isRequired: "Y",
        validationArrayItem: { fieldName: "payment_made", checkNotEmpty: "Y" },
        // For Select
        fieldIDName: "payment_made", // this variable will be used in mutations
        selectDataIDName: "id", // used as "key" in "Option" of "Select" dropdown
        selectDataFieldName: "name", // display-name of "Option" of "Select" dropdown
        selectData: selectDataVerify
      }
    ];

    // if (crud === "update") {
    // formFieldData.splice(2, 0, {
    //   key: 21,
    //   fieldName: "emailVerified",
    //   title: "e-mail Verified ?",
    //   fieldType: "NormalSelect",
    //   isRequired: "Y",
    //   validationArrayItem: {
    //     fieldName: "is_email_verified",
    //     checkNotEmpty: "Y"
    //   },
    //   // For Select
    //   fieldIDName: "is_email_verified", // this variable will be used in mutations
    //   selectDataIDName: "id", // used as "key" in "Option" of "Select" dropdown
    //   selectDataFieldName: "name", // display-name of "Option" of "Select" dropdown
    //   selectData: selectDataVerify
    // });

    // formFieldData.splice(4, 0, {
    //   key: 31,
    //   fieldName: "phoneVerified",
    //   title: "Phone Verified ?",
    //   fieldType: "NormalSelect",
    //   isRequired: "Y",
    //   validationArrayItem: {
    //     fieldName: "is_phone_verified",
    //     checkNotEmpty: "Y"
    //   },
    //   // For Select
    //   fieldIDName: "is_phone_verified", // this variable will be used in mutations
    //   selectDataIDName: "id", // used as "key" in "Option" of "Select" dropdown
    //   selectDataFieldName: "name", // display-name of "Option" of "Select" dropdown
    //   selectData: selectDataVerify
    // });
    // }

    const initialFormData = {
      id: 0,
      paymentMadeValue: "Yes",
      payment_made: "yes"
    };

    return (
      <Mutation mutation={ADD_CUSTOMER}>
        {addCustomer => (
          <Mutation mutation={EDIT_CUSTOMER}>
            {editCustomer => (
              <Query query={CUSTOMER} variables={{ customer_id }}>
                {({ loading, error, data }) => {
                  if (loading) return "Loading...";
                  if (error) return `Error! ${error.message}`;

                  const custData = data.customerDetailsById;
                  let mainData = {};
                  if (custData && Object.keys(custData).length)
                    mainData = {
                      ...custData,
                      fromCMS: true,
                      genderValue: custData.gender
                        ? selectDataGender.find(
                            obj => obj.id === custData.gender
                          ).name
                        : null,
                      emailVerified: custData.is_email_verified ? "Yes" : "No",
                      paymentMadeValue: custData.payment_made
                    };

                  // prettier-ignore
                  return (
                    <div>
                      <PixForm
                        formTitle="Contestant Basic Info"
                        formFieldData={formFieldData}
                        initialFormData={crud === "create" ? initialFormData : mainData}
                        setSelectStateValues={{
                          initalValues: ["genderValue", "emailVerified", "paymentMadeValue"],
                          mutationValues: ["gender", "is_email_verified", "payment_made"],
                          selectOptions: [selectDataGender, selectDataVerify, selectDataVerify]
                        }}
                        formMutation={crud === "create" ? addCustomer : editCustomer}
                        executeMutation="Y"
                        callBackFromPixForm={this.getFormData}
                        page_history={page_history}
                        redirectStringOnSuccess="/contestant-management/contestants"
                        redirectStringOnCancel={"/contestant-management/contestants/read/" + customer_id}
                        redirectStringOnBack="/contestant-management/contestants"
                        redirectStringOnEdit=""
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

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(BasicDetailsForm);
