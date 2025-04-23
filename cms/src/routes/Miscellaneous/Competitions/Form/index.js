import React, { Component } from "react";
import { Query, Mutation, withApollo, compose } from "react-apollo";
import { connect } from "react-redux";
import { Card, Button, Icon, Row, Col, Select, notification } from "antd";
import {
  COMPETITION,
  ADD_COMPETITION,
  UPDATE_COMPETITION,
  ALL_COMPETITION_SUBMISSIONS,
  UPSERT_SUBMISSION,
  CHANGE_SUBMISSION_STATUS,
  CHANGE_SUBMISSION_ACTION_TAKEN,
  DELETE_SUBMISSION,
  COMPETITION_WINNERS,
  CHOOSE_WINNERS
} from "../queries";
import { ALL_CUSTOMERS_LIST_BY_SEARCH } from "../../../CustomerManagement/Customers/queries";
import PixForm from "../../../../pixelsComponents/PixForm";
import ImageUpload from "../../../../pixelsComponents/ImageUpload";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";
import { validateForm } from "../../../../pixelsComponents/validateForm";

const initialFormData = { id: 0 };

const selectDataUploadType = [
  { id: "Image", name: "Image" },
  { id: "Video", name: "Video" }
];

const formFieldData = [
  {
    key: 1,
    title: "Name",
    fieldName: "name",
    fieldType: "Input",
    isRequired: "Y",
    validationArrayItem: { fieldName: "name", checkNotEmpty: "Y" }
  },
  {
    key: 2,
    title: "Description",
    fieldName: "description",
    fieldType: "Textarea",
    isRequired: "Y",
    validationArrayItem: { fieldName: "description", checkNotEmpty: "Y" }
  },
  {
    key: 3,
    fieldName: "upload_type", // key in dataSource that stores value, OR, state variable --> used in validations
    title: "Upload Type",
    fieldType: "NormalSelect",
    isRequired: "Y",
    validationArrayItem: {
      fieldName: "uploadType",
      checkNotEmpty: "Y"
    },
    // For Select
    fieldIDName: "uploadType", // this variable will be used in mutations
    selectDataIDName: "id", // used as "key" in "Option" of "Select" dropdown
    selectDataFieldName: "name", // display-name of "Option" of "Select" dropdown
    // selectDataIdentifier: "upload_type",
    selectData: selectDataUploadType
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

class CompetitionForm extends Component {
  state = {
    errors: {},
    mediaCustomerSearchTerm: null,
    mediaCustomers: [],
    customerID: undefined,
    mediaCustomerSearchTerm: null,
    mediaFile: null,
    winnerIDs: [],
    firstRunnerUpIDs: [],
    secondRunnerUpIDs: []
  };

  handleCustSearchForMedia = async () => {
    const { mediaCustomerSearchTerm } = this.state;
    if (mediaCustomerSearchTerm) {
      const { data } = await this.props.client.query({
        query: ALL_CUSTOMERS_LIST_BY_SEARCH,
        variables: { searchTerm: mediaCustomerSearchTerm }
      });
      this.setState({ mediaCustomers: data.customersNamesListBySearch });
    } else this.setState({ mediaCustomers: [] });
  };

  upsertSubmission = upsertCompetitionSubmission => {
    const { customerID, mediaFile } = this.state;
    const { competition_id } = this.props;

    let validationArray = [
      { fieldName: "customerID", fieldValue: customerID, checkNotEmpty: "Y" },
      { fieldName: "mediaFile", fieldValue: mediaFile, checkNotEmpty: "Y" }
    ];
    let validationData = validateForm(validationArray);

    if (!validationData.formIsValid) {
      this.setState({ errors: validationData.errors });
      notification.error({
        message: "Incomplete Fields!",
        description: "Both contestant and media should be selected."
      });
      return;
    }

    upsertCompetitionSubmission({
      variables: { competition_id, customer_id: customerID, media: mediaFile }
    })
      .then(data => {
        this.setState({
          customerID: undefined,
          mediaFile: null,
          refreshVar: new Date().getTime()
        });
        notification.success({
          message: "Media successfully updated."
        });
      })
      .catch(error => {
        notification.error({
          message: "Error occured while saving media.",
          description: error.message
            ? error.message
            : "Please contact system administrator."
        });
      });
  };

  saveWinnersFunction = (chooseWinners, competitionWinners) => {
    const { winnerIDs, firstRunnerUpIDs, secondRunnerUpIDs } = this.state;
    const { competition_id } = this.props;

    const finalWinners =
      winnerIDs && winnerIDs.length
        ? winnerIDs
        : competitionWinners && competitionWinners.winner_customer_ids
        ? competitionWinners && competitionWinners.winner_customer_ids
        : [];

    const finalFirstRunnerUps =
      firstRunnerUpIDs && firstRunnerUpIDs.length
        ? firstRunnerUpIDs
        : competitionWinners && competitionWinners.runner_up_1_customer_ids
        ? competitionWinners && competitionWinners.runner_up_1_customer_ids
        : [];

    const finalSecondRunnerUps =
      secondRunnerUpIDs && secondRunnerUpIDs.length
        ? secondRunnerUpIDs
        : competitionWinners && competitionWinners.runner_up_2_customer_ids
        ? competitionWinners && competitionWinners.runner_up_2_customer_ids
        : [];

    chooseWinners({
      variables: {
        competition_id,
        winner_customer_ids: finalWinners,
        runner_up_1_customer_ids: finalFirstRunnerUps,
        runner_up_2_customer_ids: finalSecondRunnerUps
      }
    })
      .then(() => {
        notification.success({
          message: "Winners & Runner-Ups successfully updated."
        });
      })
      .catch(error => {
        notification.error({
          message: "Error occured while saving winners.",
          description: error.message
            ? error.message
            : "Please contact system administrator."
        });
      });
  };

  // prettier-ignore
  render() {
    const { competition_id, crud, page_history, userPermissions } = this.props;

    const { customerID, mediaCustomers, errors, refreshVar, mediaFile,
            winnerIDs, firstRunnerUpIDs, secondRunnerUpIDs }
      = this.state;

    return (
      <Mutation mutation={CHOOSE_WINNERS}>
        {chooseWinners => (

      <Mutation mutation={UPSERT_SUBMISSION}>
        {upsertCompetitionSubmission => (

      <Mutation mutation={DELETE_SUBMISSION}>
        {deleteCompetitionSubmission => (

      <Mutation mutation={CHANGE_SUBMISSION_STATUS}>
        {changeSubmissionStatus => (

      <Mutation mutation={CHANGE_SUBMISSION_ACTION_TAKEN}>
        {changeActionTaken => (

      <Mutation mutation={crud === "create" ? ADD_COMPETITION : UPDATE_COMPETITION}>
        {mutationVariable => (
      
      <Query
        query={COMPETITION_WINNERS}
        variables={{ competition_id: Number(competition_id) || 0 }}
      >
        {({ loading: winnersLoad, error: winnersErr, data: winnersData }) => (

      <Query
        query={ALL_COMPETITION_SUBMISSIONS}
        variables={{ competition_id: Number(competition_id) || 0 }}
        >
      {({ loading: submitLoad, error: submitErr, data: submissionsData }) => (

      <Query
        query={COMPETITION}
        variables={{ id: Number(competition_id) || 0 }}
      >
        {({ loading: compLoad, error: compErr, data: compData, refetch }) => {
          if (compLoad || winnersLoad || submitLoad) return "Loading...";
          if (compErr) return `Error! ${compErr.message}`;
          if (winnersErr) return `Error! ${winnersErr.message}`;
          if (submitErr) return `Error! ${submitErr.message}`;

          const { competition } = compData;
          const competitionWinners = winnersData.competitionWinnerIDsByCompetitionID;
          const { competitionSubmissions } = submissionsData;

          const columnList = [
            {
              title: "Profile Pic",
              dataIndex: "profile_pic",
              key: "profile_pic",
              width: 100,
              filterableYN: "N",
              sortableYN: "N",
              fieldType: "image",
              imgFolderUrl: process.env.REACT_APP_CUSTOMER_URL,
              placeholderType: "profile" // values to be passed: "general", or, "profile"
            },
            {
              title: "Name",
              dataIndex: "full_name",
              key: "full_name",
              filterableYN: "N",
              sortableYN: "Y",
              redirectYN: "Y",
              redirectString: "/contestant-management/contestants/read/",
              redirectStringConcatId: "customer_id"
            },
            {
              title: "Submitted Media",
              dataIndex: "media",
              key: "media",
              filterableYN: "N",
              sortableYN: "Y",
              render: media => {
                const mediaURL = process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_CUSTOMER_URL + media;
                if (competition.upload_type.toLowerCase() === "image")
                  return (
                    <a target="_blank" href={mediaURL}>
                      <img src={mediaURL} height={130} alt="no-image" />
                    </a>
                  );
                return (
                  <a target="_blank" href={mediaURL}>
                    <Icon type="play-circle" />
                  </a>
                );
              }
            },
            {
              title: "Action Taken",
              dataIndex: "action_taken",
              key: "action_taken",
              fieldType: "mutationSwitch",
              mutation: changeActionTaken,
              variables: [{ varName: "submission_id", varValue: "id" }],
              statusVariableName: "status",
              disabled: !(userPermissions && userPermissions.includes("updateSubmission")),
              filterableYN: "N",
              sortableYN: "N"
            },
            {
              title: "Active",
              dataIndex: "active",
              key: "active",
              fieldType: "mutationSwitch",
              mutation: changeSubmissionStatus,
              variables: [{ varName: "submission_id", varValue: "id" }],
              statusVariableName: "status",
              disabled: !(userPermissions && userPermissions.includes("updateSubmission")),
              filterableYN: "N",
              sortableYN: "N"
            },
            {
              title: "Delete",
              dataIndex: "delete",
              key: "delete",
              fieldType: "deleteIcon",
              mutation: deleteCompetitionSubmission,
              variables: [{ varName: "submission_id", varValue: "id" }],
              disabled: !(userPermissions && userPermissions.includes("deleteSubmission")),
              filterableYN: "N",
              sortableYN: "N"
            }
          ];

          return (
            <div>
              <ForceRefetch refetch={refetch} />

              <PixForm
                formTitle="Competition"
                formFieldData={formFieldData}
                initialFormData={crud === "create" ? initialFormData : competition}
                setSelectStateValues={{
                  initalValues: ["upload_type"],
                  mutationValues: ["uploadType"],
                  selectOptions: [selectDataUploadType]
                }}
                formMutation={mutationVariable}
                executeMutation="Y"
                callBackFromPixForm={this.getFormData}
                page_history={page_history}
                redirectStringOnSuccess="/misc/competitions"
                redirectStringOnCancel={"/misc/competitions/read/" + competition_id}
                redirectStringOnBack="/misc/competitions"
                redirectStringOnEdit={"/misc/competitions/update/" + competition_id}
                crud={crud}
              />

              {crud !== "create" ? (
                <>
                  {userPermissions && userPermissions.includes("updateSubmission") ? (
                    <Card
                      className="gx-card"
                      title={`${competition.name} — Add / Update Media for contestants`}
                    >
                      <Row>
                        <Col span={10}>
                          <Select
                            showSearch
                            defaultActiveFirstOption={false}
                            value={customerID}
                            style={{ width: "100%" }}
                            placeholder="Type and press 'ENTER' to search contestant"
                            onChange={e => this.setState({ customerID: e })}
                            onSearch={e => {
                              let setObj = { mediaCustomerSearchTerm: e };
                              if (!e) setObj = { ...setObj, mediaCustomers: [] };
                              this.setState(setObj);
                            }}
                            onInputKeyDown={e => {
                              if (e.key === "Enter") this.handleCustSearchForMedia();
                            }}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {mediaCustomers.map(obj => (
                              <Select.Option key={Number(obj.id)} value={Number(obj.id)}>
                                {`${obj.full_name} (${obj.email})`}
                              </Select.Option>
                            ))}
                          </Select>
                          <br />
                          <span className="error-below-input">{errors.customerID || ""}</span>
                        </Col>

                        <Col span={5}>
                          <ImageUpload
                            fileType={ competition && competition.upload_type ? competition.upload_type.toLowerCase() : "media"}
                            fileName={undefined}
                            fileList={[]}
                            getFile={mediaFile => this.setState({ mediaFile })}
                            onRemove={() => this.setState({ mediaFile: null })}
                            crud={crud}
                            hideUploadList
                            mediaFile={mediaFile}
                          />
                          <span className="error-below-input">{errors.mediaFile || ""}</span>
                        </Col>

                        <Col span={2}>
                          <Button type="primary" onClick={() => this.upsertSubmission(upsertCompetitionSubmission)}>
                            Save
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ) : null}

                  <DisplayTable
                    columns={columnList}
                    selectQuery={ALL_COMPETITION_SUBMISSIONS}
                    selectQueryVariables={["competition_id", "refreshVar"]}
                    selectQueryVariablesValue={[competition_id, refreshVar]}
                    title="Submissions"
                    showCreateButton="N"
                    createLink="/"
                  />

                  {userPermissions && userPermissions.includes("updateSubmission") ? (
                    <Card
                      className="gx-card"
                      title={`${competition.name} — Choose final winners & ruuner-ups`}
                    >
                      <Row style={{marginBottom: '12px'}}>
                        <Col span={8}>
                          <div style={{marginBottom: '8px'}}><strong>Winner(s)</strong></div>
                          <Select
                            mode="multiple"
                            showSearch
                            value={
                              winnerIDs && winnerIDs.length
                              ? winnerIDs
                              : competitionWinners && competitionWinners.winner_customer_ids
                                ? competitionWinners && competitionWinners.winner_customer_ids
                                : []
                              }
                            style={{ width: "90%" }}
                            placeholder="Select winner(s)"
                            onChange={e => this.setState({ winnerIDs: e })}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {competitionSubmissions.map(obj => (
                              <Select.Option key={Number(obj.customer_id)} value={Number(obj.customer_id)}>
                                {`${obj.full_name} (${obj.email})`}
                              </Select.Option>
                            ))}
                          </Select>
                        </Col>

                        <Col span={8}>
                          <div style={{marginBottom: '8px'}}><strong>1st Runner-Up(s)</strong></div>
                          <Select
                            mode="multiple"
                            showSearch
                            value={
                              firstRunnerUpIDs && firstRunnerUpIDs.length
                              ? firstRunnerUpIDs
                              : competitionWinners && competitionWinners.runner_up_1_customer_ids
                                ? competitionWinners && competitionWinners.runner_up_1_customer_ids
                                : []
                              }
                            style={{ width: "90%" }}
                            placeholder="Select 1st runner-up(s)"
                            onChange={e => this.setState({ firstRunnerUpIDs: e })}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {competitionSubmissions.map(obj => (
                              <Select.Option key={Number(obj.customer_id)} value={Number(obj.customer_id)}>
                                {`${obj.full_name} (${obj.email})`}
                              </Select.Option>
                            ))}
                          </Select>
                        </Col>

                        <Col span={8}>
                          <div style={{marginBottom: '8px'}}><strong>2nd Runner-Up(s)</strong></div>
                          <Select
                            mode="multiple"
                            showSearch
                            value={
                              secondRunnerUpIDs && secondRunnerUpIDs.length
                              ? secondRunnerUpIDs
                              : competitionWinners && competitionWinners.runner_up_2_customer_ids
                                ? competitionWinners && competitionWinners.runner_up_2_customer_ids
                                : []
                              }
                            style={{ width: "90%" }}
                            placeholder="Select 2nd runner-up(s)"
                            onChange={e => this.setState({ secondRunnerUpIDs: e })}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {competitionSubmissions.map(obj => (
                              <Select.Option key={Number(obj.customer_id)} value={Number(obj.customer_id)}>
                                {`${obj.full_name} (${obj.email})`}
                              </Select.Option>
                            ))}
                          </Select>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={4}>
                          <Button type="primary" onClick={() => this.saveWinnersFunction(chooseWinners, competitionWinners)}>
                            Save Winners & Runner-Ups
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        }}
      </Query>
        )}
      </Query>
        )}
      </Query>
        )}
      </Mutation>
        )}
      </Mutation>
        )}
      </Mutation>
        )}
      </Mutation>
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

// export default connect(mapStateToProps)(CompetitionForm);
export default compose(connect(mapStateToProps), withApollo)(CompetitionForm);
