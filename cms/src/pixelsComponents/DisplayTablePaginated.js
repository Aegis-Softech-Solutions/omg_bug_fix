import React from "react";
// prettier-ignore
import { Card, Table, Button, Radio, Switch, Icon, Popconfirm, Input,
         Row, Col, DatePicker, Select, notification } from "antd";
import { Query } from "react-apollo";
import ExportApolloHook from "./ExportApolloHook";
import moment from "moment";
import _ from "lodash";
import { Link } from "react-router-dom";
import "./displayTable.less";
import PivotTable from "./PivotTable";

const { Option } = Select;

let tabledata, oldFilters;

let oldFilterValueList = [],
  pivotColumns = [],
  pivotColumnIndices = [], //This will get the dataIndexes for mapping of data
  pivotData = [];

let pagination = {
  defaultPageSize: 20,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
  showTotal: total => `Total ${total} items`,
  total: 0
};

class DisplayTableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initTablePrepared: false, //for one-time function call from render during init
      columnList: props.columns,
      tabledata: props.tabledata,
      csvData: props.csvData,
      csvHeaders: [],
      showColumns: props.showColumns,
      allColumns: { dataIndex: props.columns.map(a => a.dataIndex) },
      isPivotViewChecked: 0,
      expandedRowInputText: null,
      searchInputText: props.paginationOptionValues.searchTerm,
      stateCurrent: props.paginationOptionValues.current,
      statePageSize: props.paginationOptionValues.pageSize,
      exportClicked: false,
      stateFutureOption: {}
    };
    this.tabledata = props.tabledata;
  }

  onTableChange = (
    pagination,
    filters,
    sorter,
    filteredData = { currentDataSource: [] } //Set the empty array if the filters are not giving any results
  ) => {
    const { stateCurrent, statePageSize, searchInputText } = this.state;
    //Take action only of filter has been changed
    if (JSON.stringify(oldFilters) !== JSON.stringify(filters)) {
      let changedFilter = ""; //init variable to eventually store which column the filter has been applied on

      if (filters === []) {
        //if no filters are present, send the table data as is --- same as generating filters for the first time
        this.prepareColumnList({
          tabledata: filteredData.currentDataSource,
          changedFilter: changedFilter
        });
        oldFilterValueList = filters; //saving the history for comparison in next iteration
      } else {
        Object.keys(filters).forEach(filter => {
          if (
            !_.isEqual(
              filters[filter] ? filters[filter].sort() : [],
              oldFilterValueList[filter] ? oldFilterValueList[filter].sort() : []
            ) && //check if filter value is equal or different
            (filters[filter]
              ? filters[filter].length
              : 0 === oldFilterValueList[filter]
                ? oldFilterValueList[filter].length
                : 0) //check if changed filter value is addition or removal
          ) {
            changedFilter = filter; //set only if filter has been added
          }
        });
        oldFilterValueList = filters; //saving the history for comparison in next iteration
        this.prepareColumnList({
          tabledata: filteredData.currentDataSource,
          changedFilter: changedFilter
        }); //Calling the prepareColumnList function to update filter values
      }
    }

    oldFilters = JSON.parse(JSON.stringify(filters));

    if (stateCurrent !== pagination.current || statePageSize !== pagination.pageSize)
      this.props.getPaginationOptions(pagination.current, pagination.pageSize, searchInputText);
  };

  changeToNormalView = () => this.setState({ isPivotViewChecked: 0 });

  onChangeSwitch = event => {
    let checked = event.target.checked;
    if (checked === true) this.setState({ isPivotViewChecked: 1 });
  };

  prepareColumnList = props => {
    pivotData = [];
    let columnListIntermediate = this.state.columnList;

    const dateFormat = "Do MMM YYYY";
    let csvHeaders = [];

    columnListIntermediate.forEach(column => {
      csvHeaders.push({
        label: column.title,
        key: column.csvDataIndex || column.dataIndex
      });

      if (props.tabledata && column.filterableYN === "Y") {
        let filterValueList = []; //Init the filter value list
        //Remove duplicates and prepare each unuque value as text and value object
        [...new Set(props.tabledata.map(a => a[column.dataIndex]))].forEach(
          filterValue => {
            if (filterValue !== "") {
              filterValueList.push({ text: filterValue, value: filterValue });
            }
          }
        );

        if (column.dataIndex !== props.changedFilter) column.filters = filterValueList;

        column.onFilter = (value, record) => record[column.dataIndex].toString().indexOf(value) === 0;
      }

      if (column.sortableYN === "Y") {
        if (column.sortableNumber === "Y") column.sorter = (a, b) => a[column.dataIndex] - b[column.dataIndex];
        else column.sorter = (a, b) => a[column.dataIndex].localeCompare(b[column.dataIndex]);
      }

      if (column.fieldType === "date" && column.redirectYN !== "Y") {
        column.render = text => text ? moment(Number(text)).format(column.dateFormat || dateFormat) : "";
      } else if (column.fieldType === "date" && column.redirectYN === "Y") {
        column.render = (text, record) => (
          <Link
            to={
              column.redirectStringConcatId
                ? column.redirectString.concat(record[column.redirectStringConcatId])
                : column.redirectString.concat(record.id)
            }
          >
            {text ? moment(Number(text)).format(column.dateFormat || dateFormat) : ""}
          </Link>
        );
      } else if (column.fieldType !== "image" && column.redirectYN === "Y") {
        column.render = (text, record) =>
          column.externalLink === "Y" ? (
            <a
              target="_blank"
              href={
                column.redirectStringConcatId
                  ? column.redirectString.concat(record[column.redirectStringConcatId])
                  : column.redirectString
              }
            >
              {column.fixedText ? column.fixedText : text}
            </a>
          ) : (
            <Link
              to={
                column.redirectStringConcatId
                  ? column.redirectString.concat(record[column.redirectStringConcatId])
                  : column.redirectString.concat(record.id)
              }
            >
              {column.fixedText ? column.fixedText : text}
            </Link>
          );
      } else if (column.fieldType === "image") {
        column.render = (text, record) => {
          const getImageDiv = () => (
            <div style={{ textAlign: "center" }}>
              <img
                src={
                  text
                    ? process.env.REACT_APP_IMAGE_URL + column.imgFolderUrl + text
                    : `resources/images/placeholder-${column.placeholderType}.png`
                }
                height={text ? column.imgHeight || 60 : 20}
                alt="no-image"
              />
            </div>
          );

          return column.redirectYN === "Y" ? (
            <Link
              to={
                column.redirectStringConcatId
                  ? column.redirectString.concat(record[column.redirectStringConcatId])
                  : column.redirectString.concat(record.id)
              }
            >
              {getImageDiv()}
            </Link>
          ) : (
            getImageDiv()
          );
        };
      } else if (column.fieldType === "mutationSwitch") {
        column.render = (text, record) => {
          let variables = {};
          column.variables.forEach(obj => {
            variables[obj.varName] = record[obj.varValue];
          });

          return (
            <Switch
              defaultChecked={text}
              onChange={checked =>
                column
                  .mutation({
                    variables: {
                      ...variables,
                      [column.statusVariableName]: checked
                    }
                  })
                  .then(res => console.log("sucess"))
              }
              disabled={column.extraDisabledLogic ? column.disabled || column.extraDisabledLogic : column.disabled}
            />
          );
        };
      } else if (column.fieldType === "acceptReject") {
        column.render = (text, record) => {
          let variables = {};
          column.variables.forEach(obj => {
            variables[obj.varName] = record[obj.varValue];
          });

          return column.displayValues[text] ? (
            column.displayValues[text]
          ) : (
            <div>
              <Button
                type="primary"
                disabled={column.disabled}
                onClick={() =>
                  column
                    .mutation({
                      variables: {
                        ...variables,
                        [column.statusVariableName]: column.onChangeStatusValues.check
                      }
                    })
                    .then(() => {
                      let { tabledata } = this.state;
                      const index = tabledata.findIndex(obj => Number(obj.id) === Number(record.id));
                      tabledata[index] = {
                        ...tabledata[index],
                        [column.dataIndex]: column.onChangeStatusValues.check
                      };
                      this.setState({ tabledata });
                    })
                }
              >
                <Icon type="check" />
              </Button>
              &nbsp;
              <Button
                type="danger"
                disabled={column.disabled}
                onClick={() =>
                  column
                    .mutation({
                      variables: {
                        ...variables,
                        [column.statusVariableName]: column.onChangeStatusValues.cross
                      }
                    })
                    .then(() => {
                      let { tabledata } = this.state;
                      const index = tabledata.findIndex(obj => Number(obj.id) === Number(record.id));
                      tabledata[index] = {
                        ...tabledata[index],
                        [column.dataIndex]: column.onChangeStatusValues.cross
                      };
                      this.setState({ tabledata });
                    })
                }
              >
                <Icon type="close" />
              </Button>
            </div>
          );
        };
      } else if (column.fieldType === "deleteIcon") {
        column.render = (text, record) => {
          let variables = {};
          column.variables.forEach(obj => {
            variables[obj.varName] = record[obj.varValue];
          });
          return (
            <Popconfirm
              disabled={column.disabled}
              title="Are you sure delete this entry?"
              onConfirm={() => {
                column.mutation({ variables: { ...variables } }).then(() => {
                  let { tabledata } = this.state;
                  const index = tabledata.findIndex(obj => Number(obj.id) === Number(record.id));
                  tabledata.splice(index, 1);
                  this.setState({ tabledata });
                });
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <div style={{ paddingLeft: "16px" }}>
                <Icon type="delete" theme="twoTone" twoToneColor="red" />
              </div>
            </Popconfirm>
          );
        };
      }

      if (this.props.showPivotButton === "Y") {
        pivotColumns = [...pivotColumns, column.title];
        pivotColumnIndices = [...pivotColumnIndices, column.dataIndex];
      }
    });

    if (this.props.showPivotButton === "Y") {
      tabledata.forEach((item, index) => {
        pivotData = [...pivotData, []];

        pivotColumnIndices.forEach(column => {
          pivotData[index] = [...pivotData[index], item[column]];
        });
      });
    }

    this.setState({
      columnList: [...columnListIntermediate],
      initTablePrepared: true,
      csvHeaders
    });
  };

  preparePivotData = () => {
    tabledata = this.state.tabledata;
  };

  //set the state for search bar
  getFilteredTable = tabledata => {
    if (tabledata[0]) this.setState({ tabledata });
    else this.setState({ tabledata: [] }); //search not found then empty tabledata
  };

  onChangeExpandedInput = expandedRowInputText => this.setState({ expandedRowInputText });

  onSearch = searchInputText => {
    const { stateCurrent, statePageSize } = this.state;
    const { getPaginationOptions } = this.props;
    this.setState({ searchInputText });
    getPaginationOptions(stateCurrent, statePageSize, searchInputText);
  };

  onSearchInputChange = searchInputText => {
    const { stateCurrent, statePageSize } = this.state;
    const { getPaginationOptions } = this.props;
    this.setState({ searchInputText });
    if (!searchInputText) getPaginationOptions(stateCurrent, statePageSize, null);
  };

  expandedRowSubmit = record => {
    // prettier-ignore
    const { expandedRowMutation, expandedRowMutation_MainVariable, expandedRowMutation_StaticVariables,
            expandedRowMutation_OtherVariables, expandedRowMutation_OtherVariableValues }
      = this.props;
    const { expandedRowInputText } = this.state;

    if (!expandedRowInputText) {
      notification.error({
        message: "Empty text!",
        description: "Reply to a comment cannot be empty."
      });
      return;
    } else {
      if (expandedRowMutation_MainVariable) {
        let varObj = {};

        varObj = { [expandedRowMutation_MainVariable]: expandedRowInputText };

        if (expandedRowMutation_OtherVariables && expandedRowMutation_OtherVariables.length) {
          expandedRowMutation_OtherVariables.forEach((obj, i) => {
            varObj = {
              ...varObj,
              [obj]: record[expandedRowMutation_OtherVariableValues[i]]
            };
          });
        }

        if (expandedRowMutation_StaticVariables && Object.keys(expandedRowMutation_StaticVariables).length) {
          varObj = {
            ...varObj,
            ...expandedRowMutation_StaticVariables
          };
        }

        expandedRowMutation({ variables: varObj })
          .then(value => {
            this.setState({ expandedRowInputText: null });
            notification.success({ message: "Reply posted successfully!" });
          })
          .catch(error => {
            notification.error({
              message: "Error Posting Reply",
              description: "Please contact system administrator."
            });
          });
      }
    }
  };

  expandedUnsubscribedSubmit = (record, foundFutureOption) => {
    const { expandedRowMutation } = this.props;
    const { stateFutureOption } = this.state;

    let last_followup = null,
      interest_status = null,
      comment = null;
    if (stateFutureOption[record.customer_id]) {
      last_followup = stateFutureOption[record.customer_id].last_followup;
      interest_status = stateFutureOption[record.customer_id].interest_status;
      comment = stateFutureOption[record.customer_id].comment;
    }

    if (!interest_status && !foundFutureOption) {
      notification.error({
        message: "Empty Interest Status!",
        description: `Please select 'Interest Status' for customer ${record.customer_name}.`
      });
      return;
    } else {
      const interestOption = interest_status
        ? interest_status
        : foundFutureOption && foundFutureOption.interest_status
        ? foundFutureOption.interest_status === "Not Interested" ? 1
          : foundFutureOption.interest_status === "Will Subscribe" ? 2
            : foundFutureOption.interest_status === "Call Later" ? 3
              : foundFutureOption.interest_status === "No Response" ? 4
                : foundFutureOption.interest_status === "Invalid Phone" ? 5
                  : null
        : null;

      let varObj = {
        customer_id: record.customer_id,
        interestOption: interestOption,
        comment: comment
          ? comment
          : foundFutureOption && foundFutureOption.comment
            ? foundFutureOption.comment
            : null,
        last_followup: last_followup ? String(last_followup) : String(moment().valueOf())
      };

      expandedRowMutation({ variables: varObj })
        .then(value => {
          this.setState({
            last_followup: null,
            interest_status: null,
            expandedRowInputText: null
          });
          notification.success({ message: "Updated successfully!" });
        })
        .catch(error => {
          notification.error({
            message: "Error while updating",
            description: "Please contact system administrator."
          });
        });
    }
  };

  changeExportState = () => this.setState({ exportClicked: false });

  onChangeLastFollowUp = e =>
    this.setState({ last_followup: moment(e).valueOf() });

  componentWillMount() {
    pivotData = [];
  }

  render() {
    tabledata = this.state.tabledata;
    // prettier-ignore
    const { expandedRowInputText, searchInputText, exportClicked, stateFutureOption } = this.state;
    // prettier-ignore
    const { showPivotButton, showCreateButton, createLink, showExtraButton, extraButtonLink, extraButtonText,
            additionalComponents, disablePagination, showCSVButton, csvFilename, expandedRowInput,
            expandedRowHistoryVariable, expandedFormFor, expandedPermit, expandedRowQuery,
            expandedRowQueryVariables, paginationOptionValues, selectQuery, variablesPassedInQuery }
      = this.props;

    const { total, current, pageSize, searchTerm } = paginationOptionValues;

    pagination = {
      ...pagination,
      current,
      pageSize,
      showTotal: () => `Total ${total} items`,
      total
    };

    if (!this.state.initTablePrepared) this.prepareColumnList({ tabledata: tabledata });

    return (
      <div>
        {showPivotButton === "Y" && this.state.isPivotViewChecked ? (
          <PivotTable
            changeToNormalView={this.changeToNormalView}
            pivotColumns={pivotColumns}
            pivotData={pivotData}
            isPivotViewChecked={this.state.isPivotViewChecked}
          />
        ) : (
          <div>
            {showCreateButton === "Y" ? (
              <Link to={createLink}>
                <Button type="primary" style={{ marginBottom: "0px" }}>
                  Create
                </Button>
              </Link>
            ) : null}
            &nbsp;&nbsp;
            {showExtraButton === "Y" ? (
              <Link to={extraButtonLink}>
                <Button type="primary" style={{ marginBottom: "0px" }}>
                  {extraButtonText}
                </Button>
              </Link>
            ) : null}
            &nbsp;&nbsp;
            {additionalComponents && additionalComponents.length
              ? additionalComponents.map(e => <span>{e}&nbsp;&nbsp;</span>)
              : null}
            &nbsp;&nbsp;
            {showPivotButton === "Y" ? (
              <Radio.Group
                style={{ float: "right" }}
                defaultValue={this.state.isPivotViewChecked}
                buttonStyle="solid"
                onChange={e => this.onChangeSwitch(e)}
              >
                <Radio.Button value={0}>Normal View</Radio.Button>
                <Radio.Button value={1}>Pivot View</Radio.Button>
              </Radio.Group>
            ) : null}
            <Input.Search
              placeholder="Search..."
              onChange={({ target: { value } }) =>
                this.onSearchInputChange(value)
              }
              onSearch={value => this.onSearch(value)}
              value={searchInputText}
              enterButton
              style={{ width: "25%", float: "right", margin: "0 1% 1% 1%" }}
            />
            {!exportClicked &&
            showCSVButton === "Y" &&
            tabledata &&
            tabledata.length ? (
              <Button
                onClick={() => this.setState({ exportClicked: true })}
                style={{ marginBottom: "0px" }}
              >
                <Icon
                  type="file-excel"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                />
                Export
              </Button>
            ) : null}
            {exportClicked ? (
              <Button style={{ marginBottom: "0px" }}>
                <Icon
                  type="file-excel"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                />
                <ExportApolloHook
                  csvFilename={csvFilename}
                  csvHeaders={this.state.csvHeaders}
                  selectQuery={selectQuery}
                  queryVariables={{
                    ...variablesPassedInQuery,
                    searchTerm
                  }}
                  changeExportState={this.changeExportState}
                />
              </Button>
            ) : null}
            <br />
            <br />
            <Table
              columns={this.state.columnList}
              dataSource={tabledata}
              pagination={disablePagination ? false : pagination}
              bordered
              size="small"
              rowKey="id"
              onChange={this.onTableChange}
              scroll={{ x: true }}
              expandedRowRender={
                expandedPermit
                  ? expandedRowInput === "Y" && !expandedFormFor
                    ? record => (
                        <div>
                          {expandedRowHistoryVariable && record[expandedRowHistoryVariable] ? (
                            <Row>
                              <Col span={20}>
                                <br />
                                Already replied to this comment!
                                <br />
                                <br />
                              </Col>
                            </Row>
                          ) : null}
                          <Row>
                            <Col span={20}>
                              <Input.TextArea
                                placeholder="Type text here ..."
                                onChange={({ target: { value } }) => this.onChangeExpandedInput(value)}
                                value={expandedRowInputText}
                              />
                            </Col>
                            <Col span={4}>
                              <Button
                                type="primary"
                                onClick={() => this.expandedRowSubmit(record)}
                              >
                                Reply
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      )
                    : expandedRowInput === "Y" && expandedFormFor && expandedFormFor === "unsubscribed"
                    ? (record, index, indent, expanded) => {
                        if (expanded) {
                          let expandedQueryVarObj = {};
                          if (expandedFormFor && expandedFormFor === "unsubscribed") {
                            expandedRowQueryVariables.forEach((obj, i) => {
                              expandedQueryVarObj = {
                                ...expandedQueryVarObj,
                                [obj]: record[expandedRowQueryVariables[i]]
                              };
                            });
                          }

                          return (
                            <Query
                              query={expandedRowQuery}
                              variables={expandedQueryVarObj}
                              fetchPolicy="network-only"
                            >
                              {({ loading, error, data }) => {
                                if (loading) return "Loading...";
                                if (error) return `Error! ${error.message}`;

                                const foundFutureOption = data.getFutureOption;
                                let last_followup = null, interest_status = null, comment = null;
                                if (stateFutureOption[record.customer_id]) {
                                  last_followup = stateFutureOption[record.customer_id].last_followup;
                                  interest_status = stateFutureOption[record.customer_id].interest_status;
                                  comment = stateFutureOption[record.customer_id].comment;
                                }

                                return (
                                  <Row>
                                    <Col span={20}>
                                      <Row>
                                        <Col span={12}>
                                          <label>Followed-Up On</label>
                                          <br />
                                          <DatePicker
                                            className="expandedRowFieldPadding"
                                            value={
                                              last_followup
                                                ? moment(Number(last_followup))
                                                : foundFutureOption
                                                  ? moment(Number(foundFutureOption.last_followup))
                                                  : moment()
                                            }
                                            format="Do MMM YYYY"
                                            placeholder="Select Date"
                                            onChange={e =>
                                              this.setState({
                                                stateFutureOption: {
                                                  [record.customer_id]: {
                                                    ...stateFutureOption[record.customer_id],
                                                    last_followup: moment(e).valueOf()
                                                  }
                                                }
                                              })
                                            }
                                          />
                                        </Col>
                                        <Col span={12}>
                                          <label>
                                            Customer Interest Status
                                          </label>
                                          <br />
                                          <Select
                                            className="expandedRowFieldPadding"
                                            value={
                                              interest_status
                                                ? interest_status
                                                : foundFutureOption
                                                  ? foundFutureOption.interest_status : null
                                            }
                                            style={{ width: "100%" }}
                                            placeholder="Select one"
                                            onChange={interest_status =>
                                              this.setState({
                                                stateFutureOption: {
                                                  [record.customer_id]: {
                                                    ...stateFutureOption[record.customer_id],
                                                    interest_status
                                                  }
                                                }
                                              })
                                            }
                                            showSearch
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                          >
                                            <Option key={1} value={1}>Not Interested</Option>
                                            <Option key={2} value={2}>Will Subscribe</Option>
                                            <Option key={3} value={3}>Call Later</Option>
                                            <Option key={4} value={4}>No Response</Option>
                                            <Option key={5} value={5}>Invalid Phone</Option>
                                          </Select>
                                        </Col>
                                      </Row>
                                      <br />
                                      <Row>
                                        <Col span={24}>
                                          <label>Comment</label>
                                          <br />
                                          <Input.TextArea
                                            className="expandedRowFieldPadding"
                                            placeholder="Type text here ..."
                                            onChange={({ target: { value } }) =>
                                              this.setState({
                                                stateFutureOption: {
                                                  [record.customer_id]: {
                                                    ...stateFutureOption[record.customer_id],
                                                    comment: value
                                                  }
                                                }
                                              })
                                            }
                                            value={comment ? comment : foundFutureOption ? foundFutureOption.comment : null}
                                          />
                                          <br />
                                          <br />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col span={4}>
                                      <br />
                                      <br />
                                      <Button
                                        type="primary"
                                        onClick={() => this.expandedUnsubscribedSubmit(record, foundFutureOption)}
                                      >
                                        Update
                                      </Button>
                                    </Col>
                                  </Row>
                                );
                              }}
                            </Query>
                          );
                        } else return null;
                      }
                    : null
                  : null
              }
            />
          </div>
        )}
      </div>
    );
  }
}

//Component to force refetch on mount
class ForceRefetch extends React.Component {
  componentDidMount() {
    this.props.refetch();
  }
  render() {
    return null;
  }
}

class DisplayTablePaginated extends React.Component {
  state = {
    current: 1,
    pageSize: 20,
    searchTerm: null
  };

  componentWillMount() {
    pivotData = [];
    pivotColumns = [];
    pivotColumnIndices = [];
  }

  getPaginationOptions = (current, pageSize, searchTerm) => this.setState({ current, pageSize, searchTerm });

  render() {
    let variableObject = {};

    // prettier-ignore
    const { columns, showColumns, createLink, selectQuery, selectQueryVariables, selectQueryVariablesValue,
            showCreateButton, showExtraButton, extraButtonLink, extraButtonText, showPivotButton, title,
            disablePagination, additionalComponents, showCSVButton, csvFilename, csvDateColumns,
            expandedRowInput, expandedRowMutation, expandedRowHistoryVariable, expandedRowMutation_MainVariable,
            expandedRowMutation_OtherVariables, expandedRowMutation_OtherVariableValues, expandedFormFor,
            expandedRowMutation_StaticVariables, expandedPermit, expandedRowQuery, expandedRowQueryVariables,
            countQuery }
      = this.props;

    try {
      selectQueryVariables.forEach((element, index) => {
        variableObject[element] = selectQueryVariablesValue[index];
      });
    } catch (e) {}

    return (
      <Card className="gx-card" title={title}>
        <Query
          query={selectQuery}
          variables={{
            ...variableObject,
            paginated: true,
            limit: this.state.pageSize,
            offset: (this.state.current - 1) * this.state.pageSize,
            searchTerm: this.state.searchTerm
          }}
          fetchPolicy="network-only"
        >
          {({ loading: sLoad, error: sErr, data: selectData, refetch }) => (
            <Query
              query={countQuery}
              variables={{
                ...variableObject,
                searchTerm: this.state.searchTerm
              }}
              fetchPolicy="network-only"
            >
              {({ loading: cLoad, error: cErr, data: countData }) => {
                if (sLoad || cLoad) return "Loading...";
                if (sErr) return `Error! ${sErr.message}`;
                if (cErr) return `Error! ${cErr.message}`;

                tabledata = Object.values(selectData)[0];

                let csvData = [];
                tabledata.forEach(obj => {
                  let objToPush = obj;
                  if (csvDateColumns && csvDateColumns.length) {
                    csvDateColumns.forEach(col => {
                      if (objToPush[col])
                        objToPush = {
                          ...objToPush,
                          [col]: moment(Number(obj[col])).format("Do MMM YYYY")
                        };
                    });
                  }
                  csvData.push(objToPush);
                });

                return (
                  <div>
                    <ForceRefetch refetch={refetch} />
                    <DisplayTableView
                      columns={columns}
                      getPaginationOptions={this.getPaginationOptions}
                      paginationOptionValues={{
                        total: Object.values(countData)[0].count,
                        current: this.state.current,
                        pageSize: this.state.pageSize,
                        searchTerm: this.state.searchTerm
                      }}
                      showColumns={showColumns}
                      createLink={createLink}
                      showCreateButton={showCreateButton}
                      showExtraButton={showExtraButton}
                      extraButtonLink={extraButtonLink}
                      extraButtonText={extraButtonText}
                      additionalComponents={additionalComponents}
                      selectQuery={selectQuery}
                      selectQueryVariables={selectQueryVariables}
                      selectQueryVariablesValue={selectQueryVariablesValue}
                      variablesPassedInQuery={variableObject}
                      tabledata={tabledata}
                      csvData={csvData}
                      showPivotButton={showPivotButton}
                      disablePagination={disablePagination}
                      showCSVButton={showCSVButton}
                      csvFilename={csvFilename}
                      expandedPermit={expandedPermit}
                      expandedRowInput={expandedRowInput}
                      expandedRowMutation={expandedRowMutation}
                      expandedFormFor={expandedFormFor}
                      expandedRowMutation_MainVariable={expandedRowMutation_MainVariable}
                      expandedRowMutation_OtherVariables={expandedRowMutation_OtherVariables}
                      expandedRowMutation_OtherVariableValues={expandedRowMutation_OtherVariableValues}
                      expandedRowHistoryVariable={expandedRowHistoryVariable}
                      expandedRowMutation_StaticVariables={expandedRowMutation_StaticVariables}
                      expandedRowQuery={expandedRowQuery}
                      expandedRowQueryVariables={expandedRowQueryVariables}
                    />
                  </div>
                );
              }}
            </Query>
          )}
        </Query>
      </Card>
    );
  }
}

export default DisplayTablePaginated;
