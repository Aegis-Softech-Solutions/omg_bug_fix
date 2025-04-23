import React from "react";

import { Input } from "antd";

//CSS
const searchStyle = {
  width: "25%",
  float: "right",
  margin: "0 1% 1% 1%"
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = [];
  }

  searchTerm = event => {
    this.dataSource = this.props.tableData;
    let searchInput = event.target.value.toLowerCase();
    let tableData = this.dataSource.filter(item => {
      return Object.keys(item).some(
        key =>
          String(item[key])
            .toLowerCase()
            .toString()
            .search(searchInput) !== -1
      );
    });

    if (searchInput === "") {
      tableData = this.dataSource;
    }
    // console.log(this.dataSource);
    this.props.filteredTable(tableData);
  };

  render() {
    return (
      <div style={searchStyle}>
        <Input placeholder="Search..." onKeyUp={this.searchTerm.bind(this)} />
      </div>
    );
  }
}

export default SearchBar;
