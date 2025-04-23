import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
// import { notification } from "antd";
import {
  SAMPLE_RECORD,
  UPDATE_SAMPLE_RECORD,
  ADD_SAMPLE_RECORD
} from "../queries";
import PixForm from "../../../../pixelsComponents/PixForm";
// import _ from 'lodash';

let initialFormData = {
  id: 0,
  sample_record_name: ""
};

//Component to force refetch on mount
class ForceRefetch extends React.Component {
  componentDidMount() {
    this.props.refetch();
  }

  render() {
    return null;
  }
}

class SampleRecordForm extends Component {
  state = {
    formStateData: {},
    createMutation: "",
    updateMutation: ""
  };

  getFormData = props => {
    props.data.sort_order = parseInt(props.data.sort_order);
    this.setState({
      formStateData: props.data,
      createMutation: props.formMutation
    });
  };

  formFieldData = [
    {
      key: 1,
      fieldName: "sample_record_name",
      title: "Sample Record Name",
      fieldType: "Input",
      isRequired: "Y",
      validationArrayItem: {
        fieldName: "sample_record_name",
        checkNotEmpty: "Y"
      }
    }
  ];

  render() {
    return (
      <Mutation
        mutation={
          this.props.crud === "create"
            ? ADD_SAMPLE_RECORD
            : UPDATE_SAMPLE_RECORD
        }
      >
        {(addSampleRecord, { data, loading, error }) => {
          return (
            <Query
              query={SAMPLE_RECORD}
              variables={{
                id: this.props.sample_record_id
                  ? this.props.sample_record_id
                  : 0
              }}
            >
              {({ loading, error, data: sampleRecord, refetch }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                if (this.props.crud === "update")
                  initialFormData = sampleRecord.sampleRecord; //To set the initial arguments value for the update mutation
                return (
                  <div>
                    <ForceRefetch refetch={refetch} />

                    <PixForm
                      formTitle="Sample Record"
                      formFieldData={this.formFieldData}
                      initialFormData={
                        this.props.crud === "create"
                          ? initialFormData
                          : sampleRecord.sampleRecord
                      }
                      formMutation={addSampleRecord}
                      executeMutation="Y"
                      callBackFromPixForm={this.getFormData}
                      page_history={this.props.page_history}
                      redirectStringOnSuccess={"/sample-module/sample-records/"}
                      redirectStringOnCancel={
                        "/sample-module/sample-records/read/" +
                        this.props.sample_record_id
                      }
                      redirectStringOnBack={"/sample-module/sample-records/"}
                      redirectStringOnEdit={
                        "/sample-module/sample-records/update/" +
                        this.props.sample_record_id
                      }
                      crud={this.props.crud}
                      showButtons="Y"
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

export default SampleRecordForm;
