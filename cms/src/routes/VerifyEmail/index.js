import React from "react";
import { Col, Row } from "antd";
import { Query } from "react-apollo";
import { GET_VERIFY_TOKEN } from "./queries";

class VerifyEmail extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  returnErrorDiv = () => (
    <div className="gx-app-login-wrap">
      <div className="gx-page-success-container">
        <div className="gx-page-success-content">
          <div className="gx-page-success-logo">
            <img
              src={
                process.env.REACT_APP_IMAGE_URL +
                process.env.REACT_APP_LOGO_URL +
                "logo-horizontal.png"
              }
            />
          </div>
          <div className="gx-success-code gx-mb-4">OOPS!</div>
          <h2 className="gx-text-center">Something went wrong!</h2>
          <form className="gx-mb-4" role="search" />
          <p className="gx-text-center">
            Please try again again after some time.
          </p>
        </div>
      </div>
    </div>
  );

  render() {
    const { token } = this.props.match.params;
    return (
      <Query query={GET_VERIFY_TOKEN} variables={{ token }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error)
            return (
              <div className="gx-app-login-wrap">{this.returnErrorDiv()}</div>
            );

          if (data)
            return (
              <div className="gx-app-login-wrap">
                <div className="gx-page-success-container">
                  <div className="gx-page-success-content">
                    <div className="gx-page-success-logo">
                      <img
                        src={
                          process.env.REACT_APP_IMAGE_URL +
                          process.env.REACT_APP_LOGO_URL +
                          "logo-horizontal.png"
                        }
                      />
                    </div>
                    <div className="gx-success-code gx-mb-4">
                      e-mail Successfully Verified
                    </div>
                    <h2 className="gx-text-center">
                      You may now close this window.
                    </h2>
                    <p className="gx-text-center">
                      Thank you for registering at oMg!
                    </p>
                  </div>
                </div>
              </div>
            );
          return this.returnErrorDiv();
        }}
      </Query>
    );
    // else return <div className="gx-app-login-wrap">NO TOKEN PRESENT</div>;
  }
}

export default VerifyEmail;
