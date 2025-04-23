import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { HOME_BANNER, ADD_HOME_BANNER, UPDATE_HOME_BANNER } from "../queries";
import PixForm from "../../../../pixelsComponents/PixForm";

const initialFormData = { id: 0 };

const formFieldData = [
  {
    key: 1,
    fieldName: "image",
    title: "Banner",
    fieldType: "Image",
    imgFolderUrl: process.env.REACT_APP_BANNER_URL,
    placeholderType: "general", // values to be passed: "general", or, "profile"
    isRequired: "Y",
    validationArrayItem: { fieldName: "image", checkNotEmpty: "Y" }
  },
  {
    key: 2,
    fieldName: "text",
    title: "Text",
    fieldType: "Input",
    isRequired: "Y",
    validationArrayItem: {
      fieldName: "text",
      checkNotEmpty: "Y"
    }
  }
];

//Component to force refetch on mount
class ForceRefetch extends React.Component {
  componentDidMount() {
    this.props.refetch();
  }
  render() {
    return null;
  }
}

class BannerForm extends Component {
  render() {
    const { banner_id, crud, page_history } = this.props;

    return (
      <Mutation
        mutation={crud === "create" ? ADD_HOME_BANNER : UPDATE_HOME_BANNER}
      >
        {mutationVariable => {
          return (
            <Query
              query={HOME_BANNER}
              variables={{ id: Number(banner_id) || 0 }}
            >
              {({ loading, error, data, refetch }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                return (
                  <div>
                    <ForceRefetch refetch={refetch} />
                    <PixForm
                      formTitle="Home Page Banner"
                      formFieldData={formFieldData}
                      initialFormData={
                        crud === "create" ? initialFormData : data.homeBanner
                      }
                      formMutation={mutationVariable}
                      executeMutation="Y"
                      callBackFromPixForm={this.getFormData}
                      page_history={page_history}
                      redirectStringOnSuccess="/misc/homeBanners"
                      redirectStringOnCancel={
                        "/misc/homeBanners/read/" + banner_id
                      }
                      redirectStringOnBack="/misc/homeBanners"
                      redirectStringOnEdit={
                        "/misc/homeBanners/update/" + banner_id
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

export default BannerForm;
