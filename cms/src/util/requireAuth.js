import React from "react";
import { message } from "antd";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

//query
const query = gql`
  query {
    me {
      id
      email
    }
  }
`;
export default WrappedComponent => {
  class RequireAuth extends React.Component {
    componentDidMount() {
      if (!this.props.data.loading && !this.props.data.me) {
        this.props.history.push("/signin"); //check whether the loading is false and me is null if yes then redirect to the signin
        message.warning("Your Session expired! Please login again"); //show message
      }
    }
    componentWillUpdate(nextProps) {
      //check whether the loading is false and me is null if yes then redirect to the signin
      if (!nextProps.data.loading && !nextProps.data.me) {
        this.props.history.push("/signin");
        message.warning("Your Session expired! Please login again"); //show message
      }
    }

    render() {
      // console.log(this.props);
      return <WrappedComponent {...this.props} />; //provide all childrens to to wrappedcomponent
    }
  }

  return graphql(query, {
    options: () => ({
      fetchPolicy: "network-only" //fetch network only as apollo caches the query we need the updated the query data for login and logout
    })
  })(RequireAuth);
};
