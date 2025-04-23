import React from "react";
import {
  Card,
  Table,
  Button,
  Radio,
  Switch,
  Icon,
  Popconfirm,
  Input,
  Row,
  Col,
  notification
} from "antd";
import pagination from "./pagination";
import { Query } from "react-apollo";
import moment from "moment";
import { CSVLink } from "react-csv";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "./displayTable.less";
import PivotTable from "./PivotTable";

let tabledata, oldFilters;
let oldFilterValueList = [],
  pivotColumns = [],
  pivotColumnIndices = [], //This will get the dataIndexes for mapping of data
  pivotData = [];

class DisplayTableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initTablePrepared: false, //for one-time function call from render during init
      columnList: this.props.columns,
      tabledata: props.tabledata,
      csvData: props.csvData,
      csvHeaders: [],
      showColumns: this.props.showColumns,
      allColumns: { dataIndex: this.props.columns.map(a => a.dataIndex) },
      isPivotViewChecked: 0,
      expandedRowInputText: null,
      checkedIDs: props.checkedIDs || [],
      newCheckedIDs: [],
      newUncheckedIDs: []
    };
    this.tabledata = props.tabledata;
  }

  onTableChange = (
    pagination,
    filters,
    sorter,
    filteredData = { currentDataSource: [] } //Set the empty array if the filters are not giving any results
  ) => {
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
              oldFilterValueList[filter]
                ? oldFilterValueList[filter].sort()
                : []
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
      csvHeaders.push({ label: column.title, key: column.dataIndex });

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

        if (column.dataIndex !== props.changedFilter)
          column.filters = filterValueList;

        column.onFilter = (value, record) =>
          record[column.dataIndex].toString().indexOf(value) === 0;
      }

      if (column.sortableYN === "Y") {
        if (column.sortableNumber === "Y")
          column.sorter = (a, b) => a[column.dataIndex] - b[column.dataIndex];
        else
          column.sorter = (a, b) =>
            a[column.dataIndex].localeCompare(b[column.dataIndex]);
      }

      if (column.fieldType === "date" && column.redirectYN !== "Y") {
        column.render = text =>
          text
            ? moment(Number(text)).format(column.dateFormat || dateFormat)
            : "";
      } else if (column.fieldType === "date" && column.redirectYN === "Y") {
        column.render = (text, record) => (
          <Link
            to={
              column.redirectStringConcatId
                ? column.redirectString.concat(
                    record[column.redirectStringConcatId]
                  )
                : column.redirectString.concat(record.id)
            }
          >
            {text
              ? moment(Number(text)).format(column.dateFormat || dateFormat)
              : ""}
          </Link>
        );
      } else if (column.fieldType !== "image" && column.redirectYN === "Y") {
        column.render = (text, record) =>
          column.externalLink === "Y" ? (
            <a
              target="_blank"
              href={
                column.redirectStringConcatId
                  ? column.redirectString.concat(
                      record[column.redirectStringConcatId]
                    )
                  : column.redirectString
              }
            >
              {column.fixedText ? column.fixedText : text}
            </a>
          ) : (
            <Link
              to={
                column.redirectStringConcatId
                  ? column.redirectString.concat(
                      record[column.redirectStringConcatId]
                    )
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
                    ? process.env.REACT_APP_IMAGE_URL +
                      column.imgFolderUrl +
                      text
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
                  ? column.redirectString.concat(
                      record[column.redirectStringConcatId]
                    )
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
              disabled={
                column.extraDisabledLogic
                  ? column.disabled || column.extraDisabledLogic
                  : column.disabled
              }
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
                        [column.statusVariableName]:
                          column.onChangeStatusValues.check
                      }
                    })
                    .then(() => {
                      let { tabledata } = this.state;

                      const index = tabledata.findIndex(
                        obj => Number(obj.id) === Number(record.id)
                      );

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
                        [column.statusVariableName]:
                          column.onChangeStatusValues.cross
                      }
                    })
                    .then(() => {
                      let { tabledata } = this.state;

                      const index = tabledata.findIndex(
                        obj => Number(obj.id) === Number(record.id)
                      );

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
                  const index = tabledata.findIndex(
                    obj => Number(obj.id) === Number(record.id)
                  );
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

  onChangeExpandedInput = expandedRowInputText =>
    this.setState({ expandedRowInputText });

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

        if (
          expandedRowMutation_OtherVariables &&
          expandedRowMutation_OtherVariables.length
        ) {
          expandedRowMutation_OtherVariables.forEach((obj, i) => {
            varObj = {
              ...varObj,
              [obj]: record[expandedRowMutation_OtherVariableValues[i]]
            };
          });
        }

        if (
          expandedRowMutation_StaticVariables &&
          Object.keys(expandedRowMutation_StaticVariables).length
        ) {
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

  selectRowMutation = () => {
    const { newCheckedIDs, newUncheckedIDs } = this.state;

    if (!newCheckedIDs.length && !newUncheckedIDs.length) {
      notification.error({
        message: "Nothing checked/un-checked",
        description:
          "Please SELECT / DE-SELECT a few contestants before proceeding."
      });
      return;
    }

    if (this.props.checkboxButtonMutation)
      this.props
        .checkboxButtonMutation({
          variables: {
            add_customer_ids: newCheckedIDs,
            delete_customer_ids: newUncheckedIDs
          }
        })
        .then(() => {
          this.setState({ newCheckedIDs: [], newUncheckedIDs: [] });
          notification.success({
            message: "Candidates finalised successfully!"
          });
          if (this.props.refetch) this.props.refetch();
          if (this.props.checkboxRefetch) this.props.checkboxRefetch();
        })
        .catch(error => {
          notification.error({
            message: "Error finalising contestants",
            description: "Please contact system administrator."
          });
        });
  };

  componentDidMount() {
    pivotData = [];
  }

  render() {
    tabledata = this.state.tabledata;
    // prettier-ignore
    const { expandedRowInputText, checkedIDs, newCheckedIDs, newUncheckedIDs } = this.state;
    // prettier-ignore
    const { showPivotButton, showCreateButton, createLink, showExtraButton, extraButtonLink, extraButtonText,
            additionalComponents, disablePagination, showCSVButton, csvFilename, expandedRowInput,
            expandedRowHistoryVariable, checkboxButton }
      = this.props;

    if (!this.state.initTablePrepared)
      this.prepareColumnList({ tabledata: tabledata });

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
            <CSVLink
              filename={csvFilename ? `${csvFilename}.csv` : "omg.csv"}
              headers={this.state.csvHeaders}
              data={this.state.csvData}
              ref={r => (this.csvLink = r)}
              target="_blank"
            />
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
            {checkboxButton ? (
              <Button
                type="primary"
                onClick={this.selectRowMutation}
                style={{ marginBottom: "0px" }}
                disabled={
                  checkboxButton.disabled ||
                  (!newCheckedIDs.length && !newUncheckedIDs.length)
                }
              >
                {checkboxButton.title}
              </Button>
            ) : null}
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
            <SearchBar
              tableData={this.tabledata}
              filteredTable={this.getFilteredTable}
            />
            {showCSVButton === "Y" && tabledata && tabledata.length ? (
              <Button
                onClick={() => this.csvLink.link.click()}
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
              rowSelection={{
                getCheckboxProps: record => ({
                  checked: checkedIDs.includes(Number(record.id))
                }),
                onSelect: (record, selected) => {
                  let tempCheckedIDs = _.cloneDeep(checkedIDs);
                  let tempNewCheckedIDs = _.cloneDeep(newCheckedIDs);
                  let tempUncheckedIDs = _.cloneDeep(newUncheckedIDs);

                  if (selected) {
                    const newID = record.id;
                    tempCheckedIDs = _.uniq([...tempCheckedIDs, Number(newID)]);
                    if (tempUncheckedIDs.includes(Number(newID)))
                      tempUncheckedIDs = tempUncheckedIDs.filter(
                        id => Number(id) !== Number(newID)
                      );
                    else
                      tempNewCheckedIDs = _.uniq([
                        ...tempNewCheckedIDs,
                        Number(newID)
                      ]);
                  } else {
                    const deletedID = record.id;
                    tempCheckedIDs = tempCheckedIDs.filter(
                      id => Number(id) !== Number(deletedID)
                    );
                    if (newCheckedIDs.includes(Number(deletedID)))
                      tempNewCheckedIDs = tempNewCheckedIDs.filter(
                        id => Number(id) !== Number(deletedID)
                      );
                    else
                      tempUncheckedIDs = _.uniq([
                        ...newUncheckedIDs,
                        Number(deletedID)
                      ]);
                  }

                  this.setState({
                    checkedIDs: tempCheckedIDs,
                    newCheckedIDs: tempNewCheckedIDs,
                    newUncheckedIDs: tempUncheckedIDs
                  });
                }
              }}
              expandedRowRender={
                expandedRowInput === "Y"
                  ? record => (
                      <div>
                        {expandedRowHistoryVariable &&
                        record[expandedRowHistoryVariable] ? (
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
                              onChange={({ target: { value } }) =>
                                this.onChangeExpandedInput(value)
                              }
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

class DisplayTable extends React.Component {
  componentDidMount() {
    pivotData = [];
    pivotColumns = [];
    pivotColumnIndices = [];
  }

  render() {
    let variableObject = {};

    // prettier-ignore
    const { columns, showColumns, createLink, selectQuery, selectQueryVariables, selectQueryVariablesValue,
            showCreateButton, showExtraButton, extraButtonLink, extraButtonText, showPivotButton, title,
            disablePagination, additionalComponents, showCSVButton, csvFilename, csvDateColumns,
            expandedRowInput, expandedRowMutation, expandedRowHistoryVariable, expandedRowMutation_MainVariable,
            expandedRowMutation_OtherVariables, expandedRowMutation_OtherVariableValues, checkedIDs,
            expandedRowMutation_StaticVariables, checkboxButton, checkboxButtonMutation, checkboxRefetch }
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
          variables={variableObject}
          fetchPolicy="network-only"
        >
          {({ loading, error, data, subscribeToMore, refetch }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            tabledata = Object.values(data)[0];
            // console.log('tabledata: ', tabledata);

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
                  refetch={refetch}
                  columns={columns}
                  showColumns={showColumns}
                  createLink={createLink}
                  showCreateButton={showCreateButton}
                  showExtraButton={showExtraButton}
                  extraButtonLink={extraButtonLink}
                  extraButtonText={extraButtonText}
                  additionalComponents={additionalComponents}
                  checkboxButton={checkboxButton}
                  checkboxButtonMutation={checkboxButtonMutation}
                  checkedIDs={checkedIDs}
                  checkboxRefetch={checkboxRefetch}
                  selectQueryVariables={selectQueryVariables}
                  selectQueryVariablesValue={selectQueryVariablesValue}
                  tabledata={tabledata}
                  csvData={csvData}
                  showPivotButton={showPivotButton}
                  disablePagination={disablePagination}
                  showCSVButton={showCSVButton}
                  csvFilename={csvFilename}
                  expandedRowInput={expandedRowInput}
                  expandedRowMutation={expandedRowMutation}
                  expandedRowMutation_MainVariable={
                    expandedRowMutation_MainVariable
                  }
                  expandedRowMutation_OtherVariables={
                    expandedRowMutation_OtherVariables
                  }
                  expandedRowMutation_OtherVariableValues={
                    expandedRowMutation_OtherVariableValues
                  }
                  expandedRowHistoryVariable={expandedRowHistoryVariable}
                  expandedRowMutation_StaticVariables={
                    expandedRowMutation_StaticVariables
                  }
                />
              </div>
            );
          }}
        </Query>
      </Card>
    );
  }
}

export default DisplayTable;
