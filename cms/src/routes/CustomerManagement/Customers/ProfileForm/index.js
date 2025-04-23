import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { connect } from "react-redux";
import { CUSTOMER, PROFILE, UPSERT_PROFILE } from "../queries";
import PixForm from "../../../../pixelsComponents/PixForm";
import states from "./states";

const selectDataState = states.map(state => {
  return { id: state, name: state };
});

class ProfileForm extends Component {
  getFormData = props => {};

  render() {
    const { customer_id, crud, page_history } = this.props;

    return (
      <Mutation mutation={UPSERT_PROFILE}>
        {upsertProfile => (
          <Query query={PROFILE} variables={{ customer_id }}>
            {({ loading: pLoad, error: pErr, data: profile }) => (
              <Query query={CUSTOMER} variables={{ customer_id }}>
                {({ loading: cLoad, error: cErr, data: customer }) => {
                  if (cLoad || pLoad) return "Loading...";
                  if (cErr) return `Error! ${cErr.message}`;
                  if (pErr) return `Error! ${pErr.message}`;

                  const customerData = customer.customerDetailsById;

                  let profileData = { customer_id, fromCMS: true };
                  if (profile.profileByCustomerId) {
                    profileData = {
                      ...profileData,
                      ...profile.profileByCustomerId
                    };
                  }

                  const formFieldData = [
                    {
                      key: 1,
                      fieldName: "dob",
                      title: "Date of Birth",
                      fieldType: "Date",
                      isRequired: "Y",
                      validationArrayItem: {
                        fieldName: "dob",
                        checkNotEmpty: "Y"
                      }
                    },
                    {
                      key: 2,
                      fieldName: "state", // key in dataSource that stores value, OR, state variable --> used in validations
                      title: "State",
                      fieldType: "NormalSelect",
                      isRequired: "Y",
                      validationArrayItem: {
                        fieldName: "state",
                        checkNotEmpty: "Y"
                      },
                      // For Select
                      fieldIDName: "state", // this variable will be used in mutations
                      selectDataIDName: "id", // used as "key" in "Option" of "Select" dropdown
                      selectDataFieldName: "name", // display-name of "Option" of "Select" dropdown
                      selectData: selectDataState
                    },
                    {
                      key: 3,
                      fieldName: "city",
                      title: "City",
                      fieldType: "Input",
                      isRequired: "Y",
                      validationArrayItem: {
                        fieldName: "city",
                        checkNotEmpty: "Y"
                      }
                    },
                    {
                      key: 4,
                      fieldName: "pincode",
                      title: "Pincode",
                      fieldType: "Input",
                      inputType: "number",
                      isRequired: "Y",
                      validationArrayItem: {
                        fieldName: "pincode",
                        checkNotEmpty: "Y"
                      }
                    },
                    {
                      key: 5,
                      fieldName: "bio",
                      title: "Bio",
                      fieldType: "Input",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "bio",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 6,
                      fieldName: "insta_link",
                      title: "Instagram Link",
                      fieldType: "Input",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "insta_link",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 7,
                      fieldName: "fb_link",
                      title: "Facebook Link",
                      fieldType: "Input",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "fb_link",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 8,
                      fieldName: "height",
                      title: "Height",
                      fieldType: "Input",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "height",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 9,
                      fieldName: "weight",
                      title: "Weight (kg.)",
                      fieldType: "Input",
                      inputType: "number",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "weight",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 10,
                      fieldName: "pic1",
                      title: "Picture 1",
                      fieldType: "Image",
                      imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
                      placeholderType: "profile", // values to be passed: "general", or, "profile"
                      // evaluatePic: true,
                      // evaluateStatusVar: "pic1_status",
                      // evaluateScoreVar: "pic1_score",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "pic1",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 11,
                      fieldName: "pic2",
                      title: "Picture 2",
                      fieldType: "Image",
                      imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
                      placeholderType: "profile", // values to be passed: "general", or, "profile"
                      // evaluatePic: true,
                      // evaluateStatusVar: "pic2_status",
                      // evaluateScoreVar: "pic2_score",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "pic2",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 12,
                      fieldName: "pic3",
                      title: "Picture 3",
                      fieldType: "Image",
                      imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
                      placeholderType: "profile", // values to be passed: "general", or, "profile"
                      // evaluatePic: true,
                      // evaluateStatusVar: "pic3_status",
                      // evaluateScoreVar: "pic3_score",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "pic3",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 14,
                      fieldName: "pic4",
                      title: "Picture 4",
                      fieldType: "Image",
                      imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
                      placeholderType: "profile", // values to be passed: "general", or, "profile"
                      // evaluatePic: true,
                      // evaluateStatusVar: "pic3_status",
                      // evaluateScoreVar: "pic3_score",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "pic4",
                        checkNotEmpty: "N"
                      }
                    },
                    {
                      key: 13,
                      fieldName: "intro_video",
                      title: "Intro Video",
                      fieldType: "Image",
                      uploadFileType: "video",
                      imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
                      placeholderType: "general", // values to be passed: "general", or, "profile"
                      // evaluatePic: true,
                      // evaluateStatusVar: "intro_video_status",
                      // evaluateScoreVar: "intro_video_score",
                      isRequired: "N",
                      validationArrayItem: {
                        fieldName: "intro_video",
                        checkNotEmpty: "N"
                      }
                    }
                  ];

                  const initialFormData = { id: 0, fromCMS: true };

                  return (
                    <div>
                      <PixForm
                        formTitle={`Customer Profile : ${customerData.full_name}`}
                        formFieldData={formFieldData}
                        initialFormData={profileData || initialFormData}
                        setSelectStateValues={{
                          initalValues: ["state"],
                          mutationValues: ["state"],
                          selectOptions: [selectDataState]
                        }}
                        formMutation={upsertProfile}
                        executeMutation="Y"
                        callBackFromPixForm={this.getFormData}
                        page_history={page_history}
                        redirectStringOnSuccess="/contestant-management/contestants"
                        redirectStringOnCancel={
                          "/contestant-management/contestants/read/" +
                          customer_id
                        }
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
          </Query>
        )}
      </Mutation>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  let authUser = auth.authUser;
  return { userPermissions, authUser };
};

export default connect(mapStateToProps)(ProfileForm);
