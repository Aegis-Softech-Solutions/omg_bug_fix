import React, { Component } from "react";
import { Button, Card, Form, Input, Row, Col, Select, Checkbox, DatePicker, notification } from "antd";
import { Query } from 'react-apollo';
import { validateForm } from "./validateForm";
import _ from 'lodash';
import { Link } from 'react-router-dom'
import "./pixForm.less";
import ImageUpload from './ImageUpload';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group

class PixForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.initialFormData,
      errors: []
    };
  }

  // state = { ...this.props.initialState, errors : [] };

  returnDateString = (text) => {
    var datedata = '/Date(' + text + ')/'
    var timestamp = +datedata.replace(/\/Date\((.*?)\)\//g, '$1')
    var date = new Date(timestamp)

    var dateString = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()

    return dateString
  }

  onChange = (inputType, inputValueType, event) => {
    const { name, value } = event.target;
    this.setState({ [name]: inputType==="number"?(inputValueType==="float"?parseFloat(value):parseInt(value,10)):value }, 
      () => {
        if(this.props.executeMutation==='N'){
          this.onSubmit()
        }
      });
  };

  onChangeSelect = (nameid, namename, value) => {
    const csv = value.split(","); //Value is to be sent as id,name
    this.setState(
      { [nameid]: parseInt(csv[0],10), [namename]: csv[1] }, 
      () => {
        if(this.props.executeMutation==='N'){
          this.onSubmit()
        }
      }
    );

  };

  onChangeCheckBox = (namename, checkedList) => {
    let checkedData = []
    if (checkedList.length > 0) {
      checkedList.map(checkedItem => {
        checkedData = [...checkedData, checkedItem]
        return null
      })
    }

    this.setState({ [namename]: checkedData })
  }

  onCancel = event => {
    this.setState({...this.props.initialFormData, errors: []},
      ()=> {
        this.props.page_history.push(this.props.redirectStringOnCancel);
      }
    )
    
  }

  onChangeDate = (fieldName, dateString) => {
    this.setState({ [fieldName]: dateString }, 
      () => {
        if(this.props.executeMutation==='N'){
          this.onSubmit()
        }
      })
  }

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
      if (this.props.executeMutation === "N") {
        this.onSubmit();
      }
    });
  };

  onSubmit = event => {

    //Add fieldValue from state for each field into validationArrayItem for each field
    this.props.formFieldData.forEach(formField => {
      formField.validationArrayItem.fieldValue = this.state[
        formField.fieldName
      ];
    });

    //Catch return data from Form Validation in variable
    let validationData = validateForm(
      this.props.formFieldData.map(formField => formField.validationArrayItem)
    );

    if (validationData.formIsValid === false) {
      //if validation fails, set the errors into state. Use this to display error below the Input field
      this.setState({ errors: validationData.errors });
    } else {

      //validation has succeeded so check if mutation needs to be executed or not; if yes, execute; else return data to calling form

      if(this.props.executeMutation==="Y"){

        this.props.formMutation({variables : _.omit(this.state, 'errors')})
        .then((value) => {
          this.setState({ errors: [] },
            () => {this.props.page_history.push(this.props.redirectStringOnSuccess);}  
          )
          notification.success({
            message: "Data Saved Successfully"
          });
        }
          
        )
        .catch(function(error){
          notification.error({
            message: "Error Saving Data",
            description: "Please check if data already exists. Or contact system administrator."
          });
        })

      }else{

        this.props.callBackFromPixForm({
          data: this.state,
          formMutation: this.props.formMutation
        });

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
    
    return (
      <Card className="gx-card" title={this.props.formTitle}>
        <Row>
          {this.props.formFieldData.map(formField => {
            switch (formField.fieldType) {
              case "Input":
                return (
                    <Col lg={8} md={18} sm={24} xs={24} key={formField.key+"2"} className="padding-bottom-10px">
                    {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                      {
                        this.props.crud !== "read" ? (
                          <div>
                            <Input
                              name={formField.fieldName}
                              value={this.state[formField.fieldName]}
                              onChange={this.onChange.bind(this, formField.inputType, formField.inputValueType)}
                              placeholder={this.props.crud==="create"?formField.title:""}
                              // id="error"
                              type={formField.inputType ? formField.inputType : "text"}
                              disabled={this.props.crud==="read"||formField.disabled}
                            />
                            <React.Fragment className="error-below-input">
                              {typeof this.state.errors[formField.fieldName] !==
                              "undefined"
                                ? this.state.errors[formField.fieldName]
                                : ""}
                            </React.Fragment>
                          </div>
                        ): (
                            <Input
                              name={formField.fieldName}
                              value={this.state[formField.fieldName]}
                              onChange={this.onChange.bind(this, formField.inputType, formField.inputValueType)}
                              placeholder={this.props.crud==="create"?formField.title:""}
                              // id="error"
                              step=".01"
                              type={formField.inputType ? formField.inputType : "text"}
                              disabled={this.props.crud==="read"||formField.disabled}
                            />
                        )
                      }
                    </Col>
                );

              case "Select":
                return (
                    <Col lg={8} md={18} sm={24} xs={24} key={formField.key+"2"} className="padding-bottom-10px">
                      {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                      <Query query={formField.selectQuery} variables={_.pick(this.state, formField.selectQueryVariables)}>
                        {({ loading, error, data }) => {
                          if (loading) return "Loading...";
                          if (error) return "";
                          return(
                              this.props.crud !== "read" ? (
                                <Select
                                  name={formField.fieldName}
                                  value={this.state[formField.fieldName]}
                                  onChange={this.onChangeSelect.bind(
                                    this,
                                    formField.fieldIDName,
                                    formField.fieldName
                                  )}
                                  showSearch
                                  style={{ width: "100%" }}
                                  placeholder={this.props.crud==="create"?formField.title:""}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  disabled={this.props.crud==="read"||formField.disabled}
                                >
                                  {
                                    Object.values(data[formField.selectDataIdentifier]).map(item => (
                                      <Option
                                        key={
                                          item[formField.selectDataIDName] +
                                          "," +
                                          item[formField.selectDataFieldName?formField.selectDataFieldName:formField.fieldName]
                                        }
                                      >
                                        {item[formField.selectDataFieldName?formField.selectDataFieldName:formField.fieldName]}
                                      </Option>
                                    ))
                                  }
                                  
                                </Select>
                              ):(
                                <Input
                                  name={formField.fieldName}
                                  value={this.state[formField.fieldName]}
                                  onChange={this.onChange}
                                  placeholder={this.props.crud==="create"?formField.title:""}
                                  // id="error"
                                  type={formField.inputType ? formField.inputType : "text"}
                                  disabled={this.props.crud==="read"||formField.disabled}
                                />
                              )
                            

                            
                          )
                        }}
                      </Query>
                      <React.Fragment className="error-below-input">
                        {typeof this.state.errors[formField.fieldName] !==
                        "undefined"
                          ? this.state.errors[formField.fieldName]
                          : ""}
                      </React.Fragment>
                    </Col>
                );

              case "Checkbox":

                return (
                    <Col lg={8} md={18} sm={24} xs={24} key={formField.key+"2"} className="padding-bottom-10px">
                    {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                      <Query query={formField.selectQuery} variables={_.pick(this.state, formField.selectQueryVariables)}>
                        {({ loading, error, data }) => {
                          if (loading) return "Loading...";
                          if (error) return "";
                          let checkboxGroupData = []
                          Object.values(data[formField.selectDataIdentifier]).map(
                            item =>
                              (checkboxGroupData = [
                                ...checkboxGroupData,
                                item[formField.fieldName],
                              ]),
                          )
                          return (
                            <CheckboxGroup
                              options={checkboxGroupData}
                              onChange={this.onChangeCheckBox.bind(
                                this, 
                                formField.fieldName
                              )}
                              defaultValue={this.state[formField.fieldName]?this.state[formField.fieldName]:[]}
                              disabled={this.props.crud==="read"}
                            />
                          )
                        }}
                      </Query>
                      <React.Fragment className="error-below-input">
                        {typeof this.state.errors[formField.fieldName] !==
                        "undefined"
                          ? this.state.errors[formField.fieldName]
                          : ""}
                      </React.Fragment>
                    </Col>
                );

              case "Date":
                return (
                    <Col lg={8} md={18} sm={24} xs={24} key={formField.key+"2"} className="padding-bottom-10px">
                    {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                      {
                        this.props.crud !== "read" ? (
                          <div>
                            <DatePicker 
                              disabled={this.props.crud==="read"||formField.disabled}
                              onChange={this.onChangeDate.bind(
                                this,
                                formField.fieldName
                              )}
                            />
                            <br/>
                            <React.Fragment className="error-below-input">
                              {typeof this.state.errors[formField.fieldName] !==
                              "undefined"
                                ? this.state.errors[formField.fieldName]
                                : ""}
                            </React.Fragment>
                          </div>
                        ): (
                            <Input
                              name={formField.fieldName}
                              value={this.returnDateString(this.state[formField.fieldName])}
                              onChange={this.onChange}
                              placeholder={this.props.crud==="create"?formField.title:""}
                              // id="error"
                              type={formField.inputType ? formField.inputType : "text"}
                              disabled={this.props.crud==="read"||formField.disabled}
                            />
                        )
                      }
                      
                    </Col>
                );

                case "Image":
                  return (
                      <Col lg={8} md={18} sm={24} xs={24} key={formField.key+"2"} className="padding-bottom-10px">
                      <strong>{formField.title}{formField.isRequired === "Y" ? "*" : ""}</strong>
                        {
                          this.props.crud === "read" ? (
                            <ImageUpload
                              fileList={
                                  [
                                    {
                                      uid: this.state[formField.fieldName],
                                      url: process.env.REACT_APP_IMAGE_URL+this.state[formField.fieldName],
  
                                    }
                                  ]
                              }
                              getFile={file => {
                                  this.setState({
                                  [formField.fieldName]: file
                                  });
                              }}
                              onRemove={() => {
                                  // console.log("removed file");
                              }}
                              crud={this.props.crud}
                          />
                          
                          ): (
                            <ImageUpload
                                fileList={
                                  this.props.crud==="create"?[]:
                                    [
                                      {
                                        uid: this.state[formField.fieldName],
                                        url: process.env.REACT_APP_IMAGE_URL+this.state[formField.fieldName],
  
                                      }
                                    ]
                                }
                                getFile={file => {
                                    this.setState({
                                    [formField.fieldName]: file
                                    });
                                }}
                                onRemove={() => {
                                    // console.log("removed file");
                                }}
                                crud={this.props.crud}
                            />
                          )
                        }
                        
                      </Col>
                  );

              
                case "MultiSelect":
                  return (
                        <Col lg={8} md={18} sm={24} xs={24} key={formField.key+"2"} className="padding-bottom-10px">
                        {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                        <Query query={formField.selectQuery} variables={_.pick(this.state,formField.selectQueryVariables)}>
                          {({ loading, error, data }) => {
                            if (loading) return "Loading...";
                            if (error) return "";
                        
                            //arrays for dropdown
                            let SelectOptionData = [], SelectOptionNameData = [];
                            Object.values(data[formField.selectDataIdentifier]).map(item =>(
                              SelectOptionData = [
                                ...SelectOptionData,
                                Number(item[formField.selectDataIDName? formField.selectDataIDName: formField.fieldName])
                                ]
                            ));
                            
                            let selectedData = _.intersection(SelectOptionData,this.state[formField.fieldName]);

                            Object.values(data[formField.selectDataIdentifier]).map(item => {
                              if (_.findIndex(selectedData,o => o === parseInt(item[formField.selectDataIDName? formField.selectDataIDName: formField.fieldName],10) ) > -1)
                                return (SelectOptionNameData = [
                                  ...SelectOptionNameData,
                                  item[formField.selectDataFieldName? formField.selectDataFieldName: formField.fieldName]
                                ]);
                            });
                        
                            return this.props.crud !== "read" ? (
                              <Select
                                mode="multiple"
                                name={formField.fieldName}
                                defaultValue={this.state[formField.fieldName]}
                                onChange={items =>this.onChangeMultiSelect(formField.fieldIDName,formField.fieldName,items)}
                                showSearch
                                style={{ width: "100%" }}
                                placeholder={this.props.crud === "create"? formField.title: ""}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled={this.props.crud === "read" || formField.disabled}
                              >
                                {Object.values(data[formField.selectDataIdentifier]).map(item => (
                                  <Option key={item[formField.selectDataIDName]}
                                    value={Number(item[formField.selectDataIDName])}
                                  >
                                    {item[formField.selectDataFieldName? formField.selectDataFieldName: formField.fieldName]}
                                  </Option>
                                ))}
                              </Select>
                            ) : (
                              <Input
                                name={formField.fieldName}
                                value={SelectOptionNameData}
                                onChange={this.onChange}
                                placeholder={this.props.crud === "create"? formField.title: ""}
                                type={formField.inputType ? formField.inputType : "text"}
                                disabled={this.props.crud === "read" || formField.disabled}
                              />
                            );
                          }}
                        </Query>
                        <React.Fragment className="error-below-input">
                          {typeof this.state.errors[formField.fieldName] !== "undefined" ? this.state.errors[formField.fieldName]: ""}
                        </React.Fragment>
                      </Col>
                );

              default:
                return <div />;
            }
          })}
        </Row>
        {this.props.showButtons!=='N'?(
          <Row>
            <Col lg={12} md={12} sm={24} xs={24}>
              {
                this.props.crud!=="read"?(
                  <React.Fragment>
                    <Button type="primary" onClick={event => this.onSubmit(event)} style={{marginRight: "10px"}}>
                      Save
                    </Button>
                    
                    {
                      this.props.crud!=="create"?(
                        <Button onClick={event => this.onCancel(event)} style={{marginRight: "10px"}}>
                          Cancel
                        </Button>
                      ):null
                    }
                    

                  </React.Fragment>
                ):(
                  <Link to={this.props.redirectStringOnEdit}>
                    <Button type="primary" style={{marginRight: "10px"}}>
                      Edit
                    </Button>
                  </Link>
                )
              }
              <Link to={this.props.redirectStringOnBack}>
                <Button>Back</Button>
              </Link>
            </Col>
          </Row>
              
        ):null}
          
      </Card>
      
    );
  }
}

const WrappedPixForm = Form.create()(PixForm);
export default WrappedPixForm;
