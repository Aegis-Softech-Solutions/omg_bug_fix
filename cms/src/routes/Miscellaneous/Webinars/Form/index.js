import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { WEBINAR, ADD_WEBINAR, UPDATE_WEBINAR } from "../queries";
import PixForm from "../../../../pixelsComponents/PixForm";

const initialFormData = { id: 0 };

const formFieldData = [
  {
    key: 1,
    title: "Webinar",
    fieldName: "title",
    fieldType: "Input",
    isRequired: "Y",
    validationArrayItem: { fieldName: "title", checkNotEmpty: "Y" }
  },
  {
    key: 2,
    title: "Link",
    fieldName: "link",
    fieldType: "Input",
    isRequired: "Y",
    validationArrayItem: {
      fieldName: "link",
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

class WebinarForm extends Component {
  render() {
    const { webinar_id, crud, page_history } = this.props;

    return (
      <Mutation mutation={crud === "create" ? ADD_WEBINAR : UPDATE_WEBINAR}>
        {mutationVariable => {
          return (
            <Query query={WEBINAR} variables={{ id: Number(webinar_id) || 0 }}>
              {({ loading, error, data, refetch }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                return (
                  <div>
                    <ForceRefetch refetch={refetch} />
                    <PixForm
                      formTitle="Webinar"
                      formFieldData={formFieldData}
                      initialFormData={
                        crud === "create" ? initialFormData : data.webinar
                      }
                      formMutation={mutationVariable}
                      executeMutation="Y"
                      callBackFromPixForm={this.getFormData}
                      page_history={page_history}
                      redirectStringOnSuccess="/misc/webinars"
                      redirectStringOnCancel={
                        "/misc/webinars/read/" + webinar_id
                      }
                      redirectStringOnBack="/misc/webinars"
                      redirectStringOnEdit={
                        "/misc/webinars/update/" + webinar_id
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

export default WebinarForm;
