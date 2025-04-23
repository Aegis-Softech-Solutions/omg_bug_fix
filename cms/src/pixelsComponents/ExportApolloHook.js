import React from "react";
import { Query } from "react-apollo";
import { CSVLink } from "react-csv";
import { Icon } from "antd";

class ExportApolloHook extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstLoadOver: false };
  }
  render() {
    const {
      csvFilename,
      csvHeaders,
      selectQuery,
      queryVariables,
      changeExportState
    } = this.props;

    let variablesObj = { paginated: false };
    if (queryVariables) variablesObj = { ...variablesObj, ...queryVariables };

    return (
      <Query
        query={selectQuery}
        variables={variablesObj}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <span>
                &nbsp;
                <Icon type="loading" />
              </span>
            );
          if (error) return `Error! ${error.message}`;

          const csvData = Object.values(data)[0];
          // console.log("csvData", csvData);

          if (!this.state.firstLoadOver) {
            this.setState({ firstLoadOver: true }, () => {
              this.csvLink.link.click();
              changeExportState();
            });
          }

          return (
            <div>
              <CSVLink
                filename={csvFilename ? `${csvFilename}.csv` : "omg.csv"}
                headers={csvHeaders}
                data={csvData}
                ref={r => (this.csvLink = r)}
                target="_blank"
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ExportApolloHook;
