import React, { Component } from "react";
import { connect } from "react-redux";
import { Query, Mutation } from "react-apollo";
import { SIGN_UP, UPDATE_USER, USER, ROLES } from "../queries";
import PixForm from "../../../../pixelsComponents/PixForm";

//Component to force refetch on mount
class ForceRefetch extends React.Component {
  componentDidMount() {
    this.props.refetch();
  }
  render() {
    return null;
  }
}

class UserForm extends Component {
  getFormData = () => {};

  render() {
    const {
      user_id,
      crud,
      page_history,
      userPermissions,
      authUser
    } = this.props;

    const initialFormData = {
      id: 0,
      first_name: "",
      last_name: "",
      role_id: 0,
      phone: "",
      email: "",
      profile_pic: null
    };

    const formFieldData = [
      {
        key: 1,
        fieldName: "profile_pic",
        title: "Profile Pic",
        fieldType: "Image",
        imgFolderUrl: process.env.REACT_APP_ADMIN_URL,
        placeholderType: "profile", // values to be passed: "general", or, "profile"
        isRequired: "N",
        validationArrayItem: { fieldName: "profile_pic", checkNotEmpty: "N" }
      },
      {
        key: 2,
        fieldName: "first_name",
        title: "First Name",
        fieldType: "Input",
        isRequired: "Y",
        validationArrayItem: { fieldName: "first_name", checkNotEmpty: "Y" }
      },
      {
        key: 3,
        fieldName: "last_name",
        title: "Last Name",
        fieldType: "Input",
        isRequired: "Y",
        validationArrayItem: { fieldName: "last_name", checkNotEmpty: "Y" }
      },
      {
        key: 4,
        fieldName: "title", // key in dataSource that stores value, OR, state variable --> used in validations
        title: "Role",
        fieldType: "Select",
        disabled: !userPermissions.includes("updateRole"),
        isRequired: "Y",
        validationArrayItem: { fieldName: "title", checkNotEmpty: "Y" },
        // For Select
        fieldIDName: "role_id", // this variable will be used in mutations
        selectDataIDName: "id",
        selectDataIdentifier: "roles",
        selectQuery: ROLES
      },
      {
        key: 5,
        fieldName: "email",
        title: "e-mail",
        fieldType: "Input",
        isRequired: "Y",
        disabled: !userPermissions.includes("updateUser"),
        validationArrayItem: {
          fieldName: "email",
          checkNotEmpty: "Y",
          checkEmail: "Y"
        }
      },
      {
        key: 6,
        fieldName: "phone",
        title: "Phone",
        fieldType: "Input",
        isRequired: "Y",
        validationArrayItem: {
          fieldName: "phone",
          checkNotEmpty: "Y",
          checkNumericOnly: "Y",
          checkLength: "Y",
          exactLength: 10
        }
      },
      {
        key: 7,
        fieldName: "password",
        title: "Password",
        fieldType: "Input",
        inputType: "password",
        disabled: !(
          userPermissions.includes("updateUser") ||
          Number(authUser) === Number(user_id)
        ),
        isRequired: "Y",
        validationArrayItem: {
          fieldName: "password",
          checkNotEmpty: "Y",
          minLength: 7,
          maxLength: 40
        }
      }
    ];

    return (
      <Mutation mutation={crud === "create" ? SIGN_UP : UPDATE_USER}>
        {upsertUser => {
          return (
            <Query query={USER} variables={{ id: user_id ? user_id : 0 }}>
              {({ loading, error, data, refetch }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                return (
                  <div>
                    <ForceRefetch refetch={refetch} />
                    <PixForm
                      formTitle="Admin"
                      formFieldData={formFieldData}
                      initialFormData={
                        crud === "create" ? initialFormData : data.user
                      }
                      formMutation={upsertUser}
                      executeMutation="Y"
                      callBackFromPixForm={this.getFormData}
                      page_history={page_history}
                      redirectStringOnSuccess="/user-management/users"
                      redirectStringOnCancel={
                        "/user-management/users/read/" + user_id
                      }
                      redirectStringOnBack="/user-management/users"
                      redirectStringOnEdit={
                        "/user-management/users/update/" + user_id
                      }
                      crud={crud}
                    />
                  </div>
                );
              }}
            </Query>
          );
        }}
      </Mutation>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  let authUser = auth.authUser;
  return { userPermissions, authUser };
};

export default connect(mapStateToProps)(UserForm);
