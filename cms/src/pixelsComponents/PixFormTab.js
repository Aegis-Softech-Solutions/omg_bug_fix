import React, { Component } from "react";
import { Button, Card, Form, Input, Row, Col, Select, Checkbox, DatePicker, Tabs } from "antd";
import { Query } from 'react-apollo';
import { validateForm } from "./validateForm";
import _ from 'lodash';
import { Link } from 'react-router-dom'
import "./pixForm.less";
import ImageUpload from './ImageUpload';


const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;

class PixFormTab extends Component {
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

  onChange = (inputType, event) => {
    const { name, value } = event.target;
    this.setState({ [name]: inputType==="number"?parseInt(value,10):value }, 
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
    // console.log(items, nameid, data);
    let selectedData = [];
    if (selectedList.length > 0) {
    selectedList.map(selectedItem => {
    selectedData = [...selectedData, selectedItem];
    return null;
    });
    }
    
    this.setState({ [namemame]: selectedData });
  };

  onSubmit = event => {

    //Add fieldValue from state for each field into validationArrayItem for each field
    this.props.formFieldData.forEach(outerFormField => {
      outerFormField.formFieldData.forEach(formField => {
        formField.validationArrayItem.fieldValue = this.state[
          formField.fieldName
        ];
      });
    })

    let validateFormInput = []

    this.props.formFieldData.map(outerFormField => {
      outerFormField.formFieldData.map(formField => validateFormInput.push(formField.validationArrayItem))
    })

    //Catch return data from Form Validation in variable
    let validationData = validateForm(validateFormInput);

    if (validationData.formIsValid === false) {
      //if validation fails, set the errors into state. Use this to display error below the Input field
      this.setState({ errors: validationData.errors });
    } else {

      //validation has succeeded so check if mutation needs to be executed or not; if yes, execute; else return data to calling form

      if(this.props.executeMutation==="Y"){
        this.props.formMutation({variables : _.omit(this.state, 'errors')})

        this.setState({ errors: [] },
          () => {this.props.page_history.push(this.props.redirectStringOnSuccess);}  
        );

      }else{

        this.props.callBackFromPixFormTab({
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
      <Card className="gx-card">
        
        {this.props.showButtons!=='N'?(
          <Row>
            <Col lg={12} md={12} sm={24} xs={24}>
              <div className="ant-card-head-title" style={{paddingTop: 16}}>{this.props.formTitle}</div>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24} className="gx-text-right">
              {
                this.props.crud!=="read"?(
                  <span>
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
                    

                  </span>
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

        <Tabs defaultActiveKey="1"> 
          {
            this.props.formFieldData.map(eachTab => {
              return(
                <TabPane tab={eachTab.tabName} key={eachTab.tabKey}>

                    {eachTab.formFieldData.map(formField => {
                      switch (formField.fieldType) {
                        case "Input":
                          return (
                            <Row key={eachTab.tabKey+formField.key}>
                              <Col lg={6} md={6} sm={24} xs={24} key={formField.key} className="padding-bottom-10px" style={{textAlign:"right", marginTop: 10}}>
                                {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                              </Col>
                              <Col lg={18} md={18} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
                                {
                                  this.props.crud !== "read" ? (
                                    <div>
                                      <Input
                                        name={formField.fieldName}
                                        value={this.state[formField.fieldName]}
                                        onChange={this.onChange.bind(this, formField.inputType)}
                                        placeholder={this.props.crud==="create"?formField.title:""}
                                        // id="error"
                                        type={formField.inputType ? formField.inputType : "text"}
                                        disabled={this.props.crud==="read"||formField.disabled}
                                      />
                                      <span className="error-below-input">
                                        {typeof this.state.errors[formField.fieldName] !==
                                        "undefined"
                                          ? this.state.errors[formField.fieldName]
                                          : ""}
                                      </span>
                                    </div>
                                  ): (
                                      <Input
                                        name={formField.fieldName}
                                        value={this.state[formField.fieldName]}
                                        onChange={this.onChange.bind(this, formField.inputType)}
                                        placeholder={this.props.crud==="create"?formField.title:""}
                                        // id="error"
                                        type={formField.inputType ? formField.inputType : "text"}
                                        disabled={this.props.crud==="read"||formField.disabled}
                                      />
                                  )
                                }
                              </Col>
                              <Col lg={24} md={24} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
                                <hr/>
                              </Col>
                            
                            </Row>
                          );

                        case "Select":
                          return (
                            <Row key={eachTab.tabKey+formField.key}>
                              <Col lg={6} md={6} sm={24} xs={24} key={formField.key} className="padding-bottom-10px" style={{textAlign:"right", marginTop: 10}}>
                                {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                              </Col>
                              <Col lg={18} md={18} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
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
                                            {Object.values(data[formField.selectDataIdentifier]).map(item => (
                                              <Option
                                                key={
                                                  item[formField.selectDataIDName] +
                                                  "," +
                                                  item[formField.selectDataFieldName?formField.selectDataFieldName:formField.fieldName]
                                                }
                                              >
                                                {item[formField.selectDataFieldName?formField.selectDataFieldName:formField.fieldName]}
                                              </Option>
                                            ))}
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
                                <span className="error-below-input">
                                  {typeof this.state.errors[formField.fieldName] !==
                                  "undefined"
                                    ? this.state.errors[formField.fieldName]
                                    : ""}
                                </span>
                              </Col>
                              <Col lg={24} md={24} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
                                <hr/>
                              </Col>
                            </Row>
                          );

                        case "Checkbox":

                          return (
                            <Row key={eachTab.tabKey+formField.key}>
                              <Col lg={6} md={6} sm={24} xs={24} key={formField.key} className="padding-bottom-10px" style={{textAlign:"right", marginTop: 10}}>
                                {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                              </Col>
                              <Col lg={18} md={18} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
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
                                <span className="error-below-input">
                                  {typeof this.state.errors[formField.fieldName] !==
                                  "undefined"
                                    ? this.state.errors[formField.fieldName]
                                    : ""}
                                </span>
                              </Col>
                              <Col lg={24} md={24} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
                                <hr/>
                              </Col>
                            </Row>
                          );

                        case "Date":
                          return (
                            <Row key={eachTab.tabKey+formField.key}>
                              <Col lg={6} md={6} sm={24} xs={24} key={formField.key} className="padding-bottom-10px" style={{textAlign:"right", marginTop: 10}}>
                                {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                              </Col>
                              <Col lg={18} md={18} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
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
                                      <span className="error-below-input">
                                        {typeof this.state.errors[formField.fieldName] !==
                                        "undefined"
                                          ? this.state.errors[formField.fieldName]
                                          : ""}
                                      </span>
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
                              <Col lg={24} md={24} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
                                <hr/>
                              </Col>
                            </Row>
                          );

                          case "Image":
                            return (
                              <Row key={eachTab.tabKey+formField.key}>
                                <Col lg={6} md={6} sm={24} xs={24} key={formField.key} className="padding-bottom-10px" style={{textAlign:"right", marginTop: 10}}>
                                  {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                                </Col>
                                <Col lg={18} md={18} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
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
                                <Col lg={24} md={24} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
                                  <hr/>
                                </Col>
                              </Row>
                            );
  

                        
                          case "MultiSelect":
                            return (
                              <Row key={eachTab.tabKey+formField.key}>
                                <Col lg={6} md={6} sm={24} xs={24} key={formField.key} className="padding-bottom-10px" style={{textAlign:"right", marginTop: 10}}>
                                  {formField.title}{formField.isRequired === "Y" ? "*" : ""}
                                </Col>
                                <Col lg={18} md={18} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
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
                                      if (_.findIndex(selectedData,o => o === item[formField.selectDataIDName? formField.selectDataIDName: formField.fieldName]) > -1)
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
                                <span className="error-below-input">
                                  {typeof this.state.errors[formField.fieldName] !== "undefined" ? this.state.errors[formField.fieldName]: ""}
                                </span>
                              </Col>
                              <Col lg={24} md={24} sm={24} xs={24} key={formField.key} className="padding-bottom-10px">
                                <hr/>
                              </Col>
                            </Row>
                          );

                        default:
                          return <div />;
                      }
                    })}


                </TabPane>
              )
            })
          }
        </Tabs>
        
          
      </Card>
      
    );
  }
}

const WrappedPixFormTab = Form.create()(PixFormTab);
export default WrappedPixFormTab;
