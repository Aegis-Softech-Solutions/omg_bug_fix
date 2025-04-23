import React from "react";
import { Card, Table, Button, Input, Select, Icon, Row, Col } from "antd";
import { Query } from "react-apollo";
// import pagination from "./pagination";
import _ from "lodash";
import { Link } from "react-router-dom";
import "./pixEditableTable.less";
import PrintableInvoice from "./PrintableInvoice";
import PrintableChallan from "./PrintableChallan";
// import { throws } from "assert";

const Option = Select.Option;

let columnList = [];

class PixEditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabledata: JSON.parse(JSON.stringify(this.props.initialTableData))
    };

    this.props.editableTableData.forEach(field => {
      columnList.push({
        title: field.title,
        dataIndex: field.fieldName,
        render: (text, record) => {
          switch (field.fieldType) {
            case "Input":
              return this.renderInputColumns(text, record, field);
            // case "InputNumber":
            //   return this.renderInputColumns(text, record, field, "number");
            case "Select":
              return this.renderSelectColumns(text, record, field);
            default:
              return text;
          }
        }
      });
    });

    if (this.props.crud !== "read" && !this.props.hideAddRemoveRowButton) {
      columnList.push({
        render: (text, record) => {
          return (
            <div>
              <Button
                className="editable-add-btn"
                type="primary"
                onClick={this.handleAdd}
              >
                <Icon type="plus-circle" />
              </Button>
              <Button
                className="editable-add-btn"
                type="primary"
                onClick={value => this.handleDelete(record.id)}
              >
                <Icon type="minus-circle" />
              </Button>
            </div>
          );
        }
      });
    }
  }

  componentDidMount() {
    this.setState({
      tabledata: JSON.parse(JSON.stringify(this.props.initialTableData))
    });
  }

  componentWillUnmount() {
    columnList = [];
  }

  onChangeInput(value, key, column, type, inputValueType) {
    const newData = [...this.state.tabledata];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      target[column] =
        type === "number"
          ? inputValueType === "float"
            ? parseFloat(value)
            : parseInt(value, 10)
          : value;
      this.setState({ tabledata: newData });
    }
  }

  onChangeSelect = (record, nameName, key, value) => {
    const newData = [...this.state.tabledata];
    const target = newData.filter(item => record.id === item.id)[0];
    if (target) {
      const csv = value.split(","); //Value is to be sent as id,name only where id's are being used
      // target[nameId] = parseInt(csv[0],10);
      // target[nameName] = csv[1];

      let i = 0;
      this.props.editableTableData
        .filter(field => field.fieldName === nameName)[0]
        .selectSetData.forEach(eachSetData => {
          if (i === 0) {
            target[eachSetData] = parseInt(csv[i], 10);
          } else {
            target[eachSetData] = csv[i];
          }
          i = i + 1;
        });

      //clearing dependent select fields
      this.props.editableTableData
        .filter(field => (field.fieldType === "Select") & (field.key > key))
        .forEach(eachField => {
          let j = 0;
          eachField.selectSetData.forEach(eachSetData => {
            if (j === 0) {
              target[eachSetData] = 0;
            } else {
              target[eachSetData] = "";
            }
            j = j + 1;
          });
        });
      //set State
      this.setState({ tabledata: newData });
    }
  };

  renderSelectColumns(text, record, field) {
    return (
      <Query
        query={field.selectQuery}
        variables={_.pick(
          this.state.tabledata.filter(item => record.id === item.id)[0],
          field.selectQueryVariables
        )}
      >
        {({ loading, error, data }) => {
          if (loading) return "";
          if (error) return "";
          return this.props.crud !== "read" ? (
            <Select
              name={field.fieldName}
              value={text}
              onChange={this.onChangeSelect.bind(
                this,
                record,
                field.fieldName,
                field.key
              )}
              showSearch
              style={{ width: field.selectWidth }}
              placeholder="Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              disabled={this.props.crud === "read" || field.disabled}
            >
              {Object.values(data[field.selectDataIdentifier]).map(item => {
                let keyData = "";
                field.selectConcatData.forEach(eachField => {
                  keyData = keyData + item[eachField] + ",";
                });

                return (
                  <Option key={keyData}>
                    {item[field.selectConcatData[1]]}
                  </Option>
                );
              })}
            </Select>
          ) : (
            <Input
              name={field.fieldName}
              value={text}
              disabled={this.props.crud === "read" || field.disabled}
              style={{ width: field.selectWidth }}
            />
          );
        }}
      </Query>
    );
  }

  renderInputColumns(text, record, field) {
    return (
      <div>
        <Input
          style={{ margin: "5px 0" }}
          value={text}
          type={field.inputType ? field.inputType : "text"}
          step=".01"
          onChange={e =>
            this.onChangeInput(
              e.target.value,
              record.id,
              field.fieldName,
              field.inputType,
              field.inputValueType
            )
          }
          disabled={this.props.crud === "read" || field.disabled}
        />
      </div>
    );
  }

  handleAdd = () => {
    let newDatakey;

    if (!this.state.tabledata.length) newDatakey = 1;
    else
      newDatakey =
        Math.max.apply(
          Math,
          this.state.tabledata.map(o => o.id)
        ) + 1;

    let newData = JSON.parse(JSON.stringify(this.props.newRowData[0]));
    newData.id = newDatakey;

    this.setState({ tabledata: [...this.state.tabledata, newData] });
  };

  handleDelete = key =>
    this.setState({
      tabledata: this.state.tabledata.filter(item => key !== item.id)
    });

  onSubmit = event => {
    event.preventDefault();
    this.props.callBackFromPixTable({
      data: this.state.tabledata,
      formMutation: this.props.formMutation
    });
  };

  onCancel = event => {
    this.setState({
      tabledata: JSON.parse(JSON.stringify(this.props.initialTableData))
    });
    this.props.page_history.push(this.props.redirectStringOnCancel);
  };

  render() {
    // console.log("-- EDITABLE TABLE -- state: ", this.state);

    // prettier-ignore
    const { tableTitle, crud, showButtons, redirectStringOnEdit, redirectStringOnBack,
            printButton, printInvoiceData, printInvoiceName, printChallanButton, printChallanData }
        = this.props;

    return (
      <Card className="gx-card" title={tableTitle}>
        <Table
          columns={columnList}
          dataSource={this.state.tabledata}
          pagination={false}
          bordered
          size="small"
          rowKey="id"
        />
        <br />
        {showButtons !== "N" ? (
          <Row className="padding-bottom-10px">
            <Col lg={8} md={8} sm={12} xs={24} className="padding-bottom-10px">
              {crud !== "read" ? (
                <span>
                  <Button
                    type="primary"
                    onClick={event => this.onSubmit(event)}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                  {crud === "update" ? (
                    <Button
                      onClick={event => this.onCancel(event)}
                      style={{ marginRight: "10px" }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </span>
              ) : (
                <Link to={redirectStringOnEdit}>
                  <Button type="primary" style={{ marginRight: "10px" }}>
                    Edit
                  </Button>
                </Link>
              )}
              <Link to={redirectStringOnBack}>
                <Button style={{ marginRight: "10px" }}>Back</Button>
              </Link>
              {crud === "read" && printButton ? (
                <PrintableInvoice
                  printInvoiceData={printInvoiceData}
                  printInvoiceName={printInvoiceName}
                />
              ) : null}

              {crud === "read" && printChallanButton ? (
                <PrintableChallan printChallanData={printChallanData} />
              ) : null}
            </Col>
          </Row>
        ) : null}
      </Card>
    );
  }
}

export default PixEditableTable;
