import React, { Component } from "react";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Avatar, Popover } from "antd";
import { userSignOut } from "appRedux/actions/Auth";

const PROFILE_PIC = gql`
  query {
    adminProfilePic {
      profile_pic
    }
  }
`;

class UserInfo extends Component {
  render() {
    const userMenuOptions = (
      <ul className="gx-user-popover">
        <li>
          <Link to={`/user-management/users/read/${this.props.authUser}`}>
            My Account
          </Link>
        </li>
        <li onClick={() => this.props.userSignOut()}>Logout</li>
      </ul>
    );

    return (
      <Query query={PROFILE_PIC} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return `Error ${error}`;

          const pic = data.adminProfilePic
            ? data.adminProfilePic.profile_pic
            : null;

          return (
            <Popover
              overlayClassName="gx-popover-horizantal"
              placement="bottomRight"
              content={userMenuOptions}
              trigger="click"
            >
              <Avatar
                src={
                  !pic
                    ? require("assets/images/person.png")
                    : process.env.REACT_APP_IMAGE_URL +
                      process.env.REACT_APP_ADMIN_URL +
                      pic
                }
                className="gx-avatar gx-pointer"
                alt=""
              />
            </Popover>
          );
        }}
      </Query>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { authUser: auth.authUser };
};

export default connect(mapStateToProps, { userSignOut })(UserInfo);
