import React, { Component } from "react";
import { Avatar, Popover } from "antd";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { userSignOut } from "appRedux/actions/Auth";
// import { FaBell } from "react-icons/fa";
//query
const query = gql`
  query {
    me {
      id
      first_name
      last_name
      email
    }
  }
`;

class UserProfile extends Component {
  render() {
    const userMenuOptions = (
      <ul className="gx-user-popover">
        <li>My Account</li>
        {/* <li>Connections</li> */}
        <li onClick={() => this.props.userSignOut()}>Logout</li>
      </ul>
    );

    return (
      <Query query={query} pollInterval={50000}>
        {({ loading, error, data, startPolling, stopPolling }) => {
          if (loading) return `Loading...`;
          if (error) return `Error : ${error}`;
          return (
            <div className="gx-flex-row gx-align-items-center gx-avatar-row">
              {/* <span className="gx-mr-3">
                <FaBell/>
              </span> */}
              <Popover
                placement="bottomRight"
                content={userMenuOptions}
                trigger="click"
              >
                <Avatar className="gx-size-40 gx-bg-primary gx-mr-3">
                  {data
                    ? data.me
                      ? data.me.first_name + data.me.last_name
                      : ""
                    : ""}
                </Avatar>
                {data
                  ? data.me
                    ? data.me.first_name
                      ? data.me.first_name
                      : ""
                    : ""
                  : ""}
              </Popover>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default connect(null, { userSignOut })(UserProfile);
