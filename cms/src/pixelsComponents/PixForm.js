import React, { Component } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Select,
  Checkbox,
  DatePicker,
  notification,
  Tag
} from "antd";
import { Query } from "react-apollo";
import _ from "lodash";
import moment from "moment";
import { validateForm } from "./validateForm";
import { Link } from "react-router-dom";
import "./pixForm.less";
import ImageUpload from "./ImageUpload";
import createSlug from "./createSlug";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;
class PixForm extends Component {
  constructor(props) {
    super(props);

    let stateObj = {};
    if (props.setSelectStateValues) {
      const {
        initalValues,
        mutationValues,
        selectOptions
      } = props.setSelectStateValues;
      if (initalValues.length)
        initalValues.forEach((initalVarName, i) => {
          const foundValue = props.initialFormData[initalVarName];
          let newValue = null;
          if (foundValue) {
            const selectIndex = selectOptions[i].findIndex(
              obj => obj.name === foundValue
            );
            if (selectIndex > -1) newValue = selectOptions[i][selectIndex].id;
          }

          stateObj = {
            ...stateObj,
            [mutationValues[i]]: newValue || null
          };
        });
    }

    this.state = {
      ...props.initialFormData,
      ...stateObj,
      slugFieldName: props.slugFieldName || null,
      errors: [],
      deletedFiles: {}
    };
  }

  componentDidMount() {
    if (this.props.executeMutation === "N")
      this.props.callBackFromPixForm({
        isMount: true,
        data: this.state,
        formMutation: this.props.formMutation
      });
  }

  onChange = (inputType, inputValueType, slugSource, event) => {
    const { name, value } = event.target;
    const { slugFieldName } = this.state;

    let slugObj = {};
    if (slugSource && slugFieldName)
      slugObj = { [slugFieldName]: createSlug(value) };

    this.setState(
      {
        [name]:
          inputType === "number"
            ? inputValueType === "float"
              ? parseFloat(value)
              : parseInt(value, 10)
            : value,
        ...slugObj
      },
      () => {
        if (this.props.executeMutation === "N") this.onSubmit();
      }
    );
  };

  onChangeSelect = (nameid, namename, resetFields, value) => {
    // console.log("value", value);
    const splitValue = value.split(","); //Value is to be sent as id,name

    if (resetFields)
      resetFields.forEach(item => {
        this.setState({ [item]: "" });
      });

    this.setState(
      { [nameid]: splitValue[0], [namename]: splitValue[1] },
      () => {
        if (this.props.executeMutation === "N") this.onSubmit();
      }
    );
  };

  onChangeCheckBox = (namename, checkedList) => {
    let checkedData = [];
    if (checkedList.length > 0)
      checkedList.map(checkedItem => {
        checkedData = [...checkedData, checkedItem];
        return null;
      });

    this.setState({ [namename]: checkedData });
  };

  onCancel = event => {
    this.setState({ ...this.props.initialFormData, errors: [] }, () => {
      this.props.page_history.push(this.props.redirectStringOnCancel);
    });
  };

  onChangeDate = (fieldName, dateString) => {
    this.setState({ [fieldName]: String(moment(dateString).valueOf()) }, () => {
      if (this.props.executeMutation === "N") this.onSubmit();
    });
  };

  onChangeMultiSelect = (nameid, namemame, selectedList) => {
    // g(items, nameid, data);
    let selectedData = [];
    if (selectedList.length > 0) {
      selectedList.map(selectedItem => {
        selectedData = [...selectedData, selectedItem];
        return null;
      });
    }

    this.setState({ [namemame]: selectedData }, () => {
      if (this.props.executeMutation === "N") this.onSubmit();
    });
  };

  onSubmit = async e => {
    // prettier-ignore
    const { checkSlugExists, slugFieldName, doesSlugExist, doesSlugExistType, formFieldData, formMutation,
            callBackFromPixForm, executeMutation, mutationExtraStaticVariables, page_history,
            redirectStringOnSuccess, checkPhoneValidation }
      = this.props;
    // console.log("formFieldData ", formFieldData);

    // Add fieldValue from state for each field into validationArrayItem for each field
    formFieldData.forEach(formField => {
      formField.validationArrayItem.fieldValue = this.state[
        formField.fieldName
      ];
    });

    let validationData = validateForm(
      formFieldData.map(obj => obj.validationArrayItem)
    );

    // If validation fails, set the errors in state --> to display error below the Input field
    if (validationData.formIsValid === false) {
      this.setState({ errors: validationData.errors });
      notification.error({
        message: "Required fields cannot be empty",
        description:
          "Please make sure all the mandatory fields are properly filled."
      });
    } else {
      // If the form is supposed to run the final mutation, only then proceed;
      // else, simply call the callback function
      if (executeMutation === "Y") {
        let doesSlugExistData = false;

        // Check if any field in the form is a slug, and if it's value already exists in the DB
        if (checkSlugExists && slugFieldName) {
          await doesSlugExist({
            variables: {
              type: doesSlugExistType,
              id: this.state.id,
              slug: this.state[slugFieldName]
            }
          })
            .then(res => {
              doesSlugExistData = res.data.doesSlugExist.slugExists;
            })
            .catch(error => {
              notification.error({
                message: "Error occured in 'doesSlugExist' mutation",
                description: error.message
                  ? error.message
                  : "Please contact system administrator."
              });
            });
        }

        // If entered slug already exists, set the error in state and show alert
        if (doesSlugExistData) {
          this.setState({
            errors: {
              [slugFieldName]:
                "Slug already in use. Please enter a unique slug."
            }
          });
          notification.error({
            message: "Slug already in use",
            description: "Please enter a unique slug/URL for this post."
          });
          return;
        }

        let arePhoneDigitsValid = true;

        if (checkPhoneValidation) {
          if (
            this.state.countryCode === "+91" &&
            this.state.phone_without_code.toString().length !== 10
          )
            arePhoneDigitsValid = false;
        }

        // If entered phone number is invalid, set the error in state and show alert
        if (!arePhoneDigitsValid) {
          this.setState({
            errors: {
              phone_without_code:
                "Indian phone numbers should strictly be 10 digits."
            }
          });
          notification.error({
            message: "Invalid phone number",
            description: "Indian phone numbers should strictly be 10 digits."
          });
          return;
        }

        // Finally, if no errors, run the mutation
        formMutation({ variables: _.omit(this.state, "errors") })
          .then(value => {
            this.setState({ errors: [] }, () => {
              page_history.push(redirectStringOnSuccess);
            });
            notification.success({ message: "Data Saved Successfully" });
          })
          .catch(error => {
            notification.error({
              message: "Error Saving Data",
              description: error.message
                ? error.message
                : "Please contact system administrator."
            });
          });
      } else {
        callBackFromPixForm({ data: this.state, formMutation });
        this.setState({ errors: [] });
      }
    }
  };

  /**
   * Some fields data for reference
   * @fieldName = Input name property (<Input name = fieldName>)
   * @fieldType = Tag Type of Input (Input/Select)
   * @inputType = the actual type of Input (text/email/password/number/date)
   * @isRequired = "Y"/"N"
   * @title = Will be like a label which comes on uppar part of the input
   * @validationArrayItem = validation rules in accordance with validateForm component
   * @disabled = will be disabled if true
   * //If the input type is select
   * @fieldIDName = the select Id
   * @selectDataIDName = the actual Id which gets passed
   * @selectDataIdentifier = from where the select will fetch
   *
   */

  render() {
    // console.log("State of PIX FORM: ", this.state);
    // console.log("Props of PIX FORM: ", this.props);

    return (
      <Card className="gx-card" title={this.props.formTitle}>
        {this.props.formFieldData.map(formField => {
          // prettier-ignore
          const { key, fieldType, title, isRequired, fieldName, fieldIDName, inputType, inputValueType,
                  slugSource, disabled, resetFields, selectQuery, selectQueryVariables, selectDataIdentifier,
                  selectDataIDName, selectDataFieldName, selectData, imgFolderUrl, placeholderType,
                  stepSize, extraText, evaluatePic, evaluateScoreVar, evaluateStatusVar, uploadFileType }
            = formField;
          const dateFormat = "Do MMM YYYY";

          switch (fieldType) {
            case "Input":
              return (
                <Row key={key}>
                  <Col
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    lg={18}
                    md={18}
                    sm={24}
                    xs={24}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    {this.props.crud !== "read" ? (
                      <div>
                        <Input
                          name={fieldName}
                          value={this.state[fieldName]}
                          onChange={this.onChange.bind(
                            this,
                            inputType,
                            inputValueType,
                            slugSource
                          )}
                          placeholder={
                            this.props.crud === "create" ? title : ""
                          }
                          type={inputType ? inputType : "text"}
                          disabled={this.props.crud === "read" || disabled}
                        />
                        {extraText || null}
                        <span className="error-below-input">
                          {typeof this.state.errors[fieldName] !== "undefined"
                            ? this.state.errors[fieldName]
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <Input
                        name={fieldName}
                        value={this.state[fieldName]}
                        onChange={this.onChange.bind(
                          this,
                          inputType,
                          inputValueType,
                          slugSource
                        )}
                        placeholder={this.props.crud === "create" ? title : ""}
                        step={stepSize || ".01"}
                        type={inputType ? inputType : "text"}
                        disabled={this.props.crud === "read" || disabled}
                      />
                    )}
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    key={key + "3"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );

            case "Select":
              return (
                <Row key={key}>
                  <Col
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    lg={18}
                    md={18}
                    sm={24}
                    xs={24}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    <Query
                      query={selectQuery}
                      variables={_.pick(this.state, selectQueryVariables)}
                    >
                      {({ loading, error, data }) => {
                        if (loading) return "Loading...";
                        if (error) return "";
                        return this.props.crud !== "read" ? (
                          <Select
                            name={fieldName}
                            value={this.state[fieldName]}
                            onChange={this.onChangeSelect.bind(
                              this,
                              fieldIDName,
                              fieldName,
                              resetFields
                            )}
                            showSearch
                            style={{ width: "100%" }}
                            placeholder={
                              this.props.crud === "create" ? title : ""
                            }
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={this.props.crud === "read" || disabled}
                          >
                            {Object.values(data[selectDataIdentifier]).map(
                              item => (
                                <Option
                                  key={
                                    item[selectDataIDName] +
                                    "," +
                                    item[selectDataFieldName || fieldName]
                                  }
                                >
                                  {item[selectDataFieldName || fieldName]}
                                </Option>
                              )
                            )}
                          </Select>
                        ) : (
                          <Input
                            name={fieldName}
                            value={this.state[fieldName]}
                            onChange={this.onChange}
                            placeholder={
                              this.props.crud === "create" ? title : ""
                            }
                            // id="error"
                            type={inputType ? inputType : "text"}
                            disabled={this.props.crud === "read" || disabled}
                          />
                        );
                      }}
                    </Query>
                    <span className="error-below-input">
                      {typeof this.state.errors[fieldName] !== "undefined"
                        ? this.state.errors[fieldName]
                        : ""}
                    </span>
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    key={key + "3"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );

            case "Checkbox":
              return (
                <Row key={key}>
                  <Col
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    lg={18}
                    md={18}
                    sm={24}
                    xs={24}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    <Query
                      query={selectQuery}
                      variables={_.pick(this.state, selectQueryVariables)}
                    >
                      {({ loading, error, data }) => {
                        if (loading) return "Loading...";
                        if (error) return "";
                        let checkboxGroupData = [];
                        Object.values(data[selectDataIdentifier]).map(
                          item =>
                            (checkboxGroupData = [
                              ...checkboxGroupData,
                              item[fieldName]
                            ])
                        );
                        return (
                          <CheckboxGroup
                            options={checkboxGroupData}
                            onChange={this.onChangeCheckBox.bind(
                              this,
                              fieldName
                            )}
                            defaultValue={
                              this.state[fieldName] ? this.state[fieldName] : []
                            }
                            disabled={this.props.crud === "read"}
                          />
                        );
                      }}
                    </Query>
                    <span className="error-below-input">
                      {typeof this.state.errors[fieldName] !== "undefined"
                        ? this.state.errors[fieldName]
                        : ""}
                    </span>
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    key={key + "3"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );

            case "Date":
              return (
                <Row key={key}>
                  <Col
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    lg={18}
                    md={18}
                    sm={24}
                    xs={24}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    {this.props.crud !== "read" ? (
                      <div>
                        <DatePicker
                          value={
                            this.state[fieldName]
                              ? moment(Number(this.state[fieldName]))
                              : null
                          }
                          format={dateFormat}
                          disabled={this.props.crud === "read" || disabled}
                          onChange={this.onChangeDate.bind(this, fieldName)}
                        />
                        <br />
                        <span className="error-below-input">
                          {typeof this.state.errors[fieldName] !== "undefined"
                            ? this.state.errors[fieldName]
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <Input
                        name={fieldName}
                        value={
                          this.state[fieldName]
                            ? moment(Number(this.state[fieldName])).format(
                                dateFormat
                              )
                            : null
                        }
                        onChange={this.onChange}
                        placeholder={this.props.crud === "create" ? title : ""}
                        type={inputType || "text"}
                        disabled={this.props.crud === "read" || disabled}
                      />
                    )}
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    key={key + "3"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );

            case "Image":
              return (
                <Row key={key}>
                  <Col
                    span={6}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    span={evaluatePic ? 4 : 18}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    {this.props.crud === "read" ? (
                      <img
                        src={
                          this.state[fieldName]
                            ? process.env.REACT_APP_IMAGE_URL +
                              imgFolderUrl +
                              this.state[fieldName]
                            : `resources/images/placeholder-${placeholderType}.png`
                        }
                        alt="Image not found"
                        height={this.state[fieldName] ? 100 : 30}
                      />
                    ) : (
                      <div>
                        <ImageUpload
                          fileType={uploadFileType || "image"}
                          fileName={this.state[fieldName]}
                          fileList={
                            this.state[fieldName]
                              ? [
                                  {
                                    uid: this.state[fieldName],
                                    url:
                                      process.env.REACT_APP_IMAGE_URL +
                                      imgFolderUrl +
                                      this.state[fieldName]
                                  }
                                ]
                              : []
                          }
                          getFile={file => {
                            this.setState(
                              {
                                [fieldName]: file,
                                deletedFiles: {
                                  ...this.state.deletedFiles,
                                  [fieldName]: false
                                }
                              },
                              () => {
                                if (this.props.executeMutation === "N")
                                  this.onSubmit();
                              }
                            );
                          }}
                          onRemove={() =>
                            this.setState({
                              [fieldName]: "",
                              deletedFiles: {
                                ...this.state.deletedFiles,
                                [fieldName]: true
                              }
                            })
                          }
                          crud={this.props.crud}
                        />
                        <span className="error-below-input">
                          {typeof this.state.errors[fieldName] !== "undefined"
                            ? this.state.errors[fieldName]
                            : ""}
                        </span>
                      </div>
                    )}
                  </Col>
                  {evaluatePic ? (
                    <Col
                      span={14}
                      key={key + "3"}
                      className="padding-bottom-10px"
                    >
                      <Row>
                        <Col span={3}>Status:</Col>
                        <Col span={21}>
                          <Select
                            name={evaluateStatusVar}
                            value={this.state[evaluateStatusVar]}
                            onChange={value =>
                              this.setState({ [evaluateStatusVar]: value })
                            }
                            showSearch
                            style={{ width: "50%" }}
                            placeholder="Select one option"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={this.props.crud === "read" || disabled}
                          >
                            <Option key="pending" value="pending">
                              Pending
                            </Option>
                            <Option key="approved" value="approved">
                              Approved
                            </Option>
                            <Option key="rejected" value="rejected">
                              Rejected
                            </Option>
                          </Select>
                        </Col>
                      </Row>
                      <br />
                      {/* <Row>
                        <Col span={3}>Score:</Col>
                        <Col span={21}>
                          <Input
                            type="number"
                            style={{ width: "50%" }}
                            value={this.state[evaluateScoreVar]}
                            onChange={({ target: { value } }) =>
                              this.setState({
                                [evaluateScoreVar]: Number(value)
                              })
                            }
                          />
                        </Col>
                      </Row> */}
                    </Col>
                  ) : null}
                  <Col
                    span={24}
                    key={key + "4"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );

            case "MultiSelect":
              return (
                <Row key={key}>
                  <Col
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    lg={18}
                    md={18}
                    sm={24}
                    xs={24}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    <Query
                      query={selectQuery}
                      variables={_.pick(this.state, selectQueryVariables)}
                    >
                      {({ loading, error, data }) => {
                        if (loading) return "Loading...";
                        if (error) return "";

                        //arrays for dropdown
                        let SelectOptionData = [],
                          SelectOptionNameData = [];
                        Object.values(data[selectDataIdentifier]).map(
                          item =>
                            (SelectOptionData = [
                              ...SelectOptionData,
                              Number(item[selectDataIDName || fieldName])
                            ])
                        );

                        let selectedData = _.intersection(
                          SelectOptionData,
                          this.state[fieldName]
                        );

                        Object.values(data[selectDataIdentifier]).forEach(
                          item => {
                            if (
                              _.findIndex(
                                selectedData,
                                o =>
                                  o ===
                                  parseInt(
                                    item[selectDataIDName || fieldName],
                                    10
                                  )
                              ) > -1
                            )
                              return (SelectOptionNameData = [
                                ...SelectOptionNameData,
                                item[selectDataFieldName || fieldName]
                              ]);
                          }
                        );

                        return this.props.crud !== "read" ? (
                          <Select
                            mode="multiple"
                            name={fieldName}
                            defaultValue={this.state[fieldName]}
                            onChange={items =>
                              this.onChangeMultiSelect(
                                fieldIDName,
                                fieldName,
                                items
                              )
                            }
                            showSearch
                            style={{ width: "100%" }}
                            placeholder={
                              this.props.crud === "create" ? title : ""
                            }
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={this.props.crud === "read" || disabled}
                          >
                            {Object.values(data[selectDataIdentifier]).map(
                              item => (
                                <Option
                                  key={item[selectDataIDName]}
                                  value={Number(item[selectDataIDName])}
                                >
                                  {item[selectDataFieldName || fieldName]}
                                </Option>
                              )
                            )}
                          </Select>
                        ) : (
                          SelectOptionNameData.map(name => (
                            <Tag className="pixform-tag" key={name}>
                              {name}
                            </Tag>
                          ))
                        );
                      }}
                    </Query>
                    <span className="error-below-input">
                      {typeof this.state.errors[fieldName] !== "undefined"
                        ? this.state.errors[fieldName]
                        : ""}
                    </span>
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    key={key + "3"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );

            case "Textarea":
              return (
                <Row key={key}>
                  <Col
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    lg={18}
                    md={18}
                    sm={24}
                    xs={24}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    {this.props.crud !== "read" ? (
                      <div>
                        <TextArea
                          name={fieldName}
                          value={this.state[fieldName]}
                          onChange={this.onChange.bind(
                            this,
                            inputType,
                            inputValueType,
                            slugSource
                          )}
                          placeholder={
                            this.props.crud === "create" ? title : ""
                          }
                          type={inputType ? inputType : "text"}
                          disabled={this.props.crud === "read" || disabled}
                          autosize
                        />
                        <span className="error-below-input">
                          {typeof this.state.errors[fieldName] !== "undefined"
                            ? this.state.errors[fieldName]
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <TextArea
                        name={fieldName}
                        value={this.state[fieldName]}
                        onChange={this.onChange}
                        placeholder={this.props.crud === "create" ? title : ""}
                        type={inputType ? inputType : "text"}
                        disabled={this.props.crud === "read" || disabled}
                        autosize
                      />
                    )}
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    key={key + "3"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );

            case "NormalSelect":
              let data = selectData;

              return (
                <Row key={key}>
                  <Col
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                    key={key + "1"}
                    className="padding-bottom-10px"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {title}
                    {isRequired === "Y" ? (
                      <span className="error-below-input"> *</span>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    lg={18}
                    md={18}
                    sm={24}
                    xs={24}
                    key={key + "2"}
                    className="padding-bottom-10px"
                  >
                    {this.props.crud !== "read" ? (
                      <div>
                        <Select
                          name={fieldName}
                          value={this.state[fieldName]}
                          onChange={this.onChangeSelect.bind(
                            this,
                            fieldIDName,
                            fieldName,
                            resetFields
                          )}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={
                            this.props.crud === "create" ? title : ""
                          }
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          disabled={this.props.crud === "read" || disabled}
                        >
                          {Object.values(data).map(item => {
                            return (
                              <Option
                                key={
                                  item[selectDataIDName] +
                                  "," +
                                  item[selectDataFieldName || fieldName]
                                }
                              >
                                {item[selectDataFieldName || fieldName]}
                              </Option>
                            );
                          })}
                        </Select>
                        <span className="error-below-input">
                          {typeof this.state.errors[fieldIDName] !== "undefined"
                            ? this.state.errors[fieldIDName]
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <Input
                        name={fieldName}
                        value={this.state[fieldName]}
                        onChange={this.onChange}
                        placeholder={this.props.crud === "create" ? title : ""}
                        type={inputType ? inputType : "text"}
                        disabled={this.props.crud === "read" || disabled}
                      />
                    )}
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    key={key + "3"}
                    className="padding-bottom-10px"
                  >
                    <hr />
                  </Col>
                </Row>
              );
            default:
              return <div />;
          }
        })}

        {this.props.showButtons !== "N" ? (
          <Row>
            <Col lg={12} md={12} sm={24} xs={24}>
              {this.props.crud !== "read" ? (
                <span>
                  <Button
                    type="primary"
                    onClick={event => this.onSubmit(event)}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>

                  {this.props.crud !== "create" ? (
                    <Button
                      onClick={event => this.onCancel(event)}
                      style={{ marginRight: "10px" }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </span>
              ) : this.props.showEditButton !== "N" ? (
                <Link to={this.props.redirectStringOnEdit}>
                  <Button type="primary" style={{ marginRight: "10px" }}>
                    Edit
                  </Button>
                </Link>
              ) : null}
              <Link to={this.props.redirectStringOnBack}>
                <Button>Back</Button>
              </Link>
            </Col>
          </Row>
        ) : null}
      </Card>
    );
  }
}

const WrappedPixForm = Form.create()(PixForm);
export default WrappedPixForm;
