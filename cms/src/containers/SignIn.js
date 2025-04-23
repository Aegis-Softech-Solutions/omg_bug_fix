import React from "react";
import crypto from "crypto";
import { Button, Form, Input, message } from "antd";
import { connect } from "react-redux";
import { Mutation } from "react-apollo";
import { SIGN_IN } from "./queries.js"; //import Query

import { hideMessage, showAuthLoader, userSignIn } from "appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/CircularProgress/index";

const FormItem = Form.Item;

class SignIn extends React.Component {
  handleSubmit = signIn => e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, { email, password }) => {
      // prettier-ignore
      let cipher = crypto.createCipher("aes-256-cbc", process.env.REACT_APP_CRYPTO_SECRET);
      let cipheredPass = cipher.update(password, "utf8", "base64");
      cipheredPass += cipher.final("base64");

      signIn({
        variables: {
          email,
          password: cipheredPass
        }
      })
        .then(data => {
          //if successful
          this.props.showAuthLoader();
          this.props.userSignIn(data.data.signIn);
          this.props.history.push("/"); //push to the main route
        })
        .catch(err => {
          //if error
          this.props.userSignIn(err); //pass the error to reducer via proops
        });
    });
  };

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    if (this.props.authUser !== null) {
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showMessage, loader, alertMessage } = this.props;

    return (
      <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo">
                <img
                  style={{ maxWidth: "80%" }}
                  alt={"logo"}
                  src={
                    process.env.REACT_APP_IMAGE_URL +
                    process.env.REACT_APP_LOGO_URL +
                    "logo-square.png"
                  }
                />
              </div>
            </div>
            <Mutation mutation={SIGN_IN}>
              {(signIn, { data, loading, error }) => (
                <div className="gx-app-login-content">
                  <Form
                    onSubmit={this.handleSubmit(signIn)}
                    className="gx-signin-form gx-form-row0"
                  >
                    <FormItem>
                      {getFieldDecorator("email", {
                        rules: [
                          {
                            required: true,
                            type: "email",
                            message: "The input is not valid E-mail!"
                          }
                        ]
                      })(<Input placeholder="Email" />)}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your Password!"
                          }
                        ]
                      })(<Input type="password" placeholder="Password" />)}
                    </FormItem>

                    <FormItem>
                      <Button
                        type="primary"
                        className="gx-mb-0"
                        htmlType="submit"
                      >
                        <IntlMessages id="app.userAuth.signIn" />
                      </Button>
                    </FormItem>
                  </Form>
                </div>
              )}
            </Mutation>
            {loader ? (
              <div className="gx-loader-view">
                <CircularProgress />
              </div>
            ) : null}
            {showMessage ? message.error(alertMessage.toString()) : null}
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(SignIn);

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser };
};

export default connect(mapStateToProps, {
  userSignIn,
  hideMessage,
  showAuthLoader
  // layoutUpdate
})(WrappedNormalLoginForm);
