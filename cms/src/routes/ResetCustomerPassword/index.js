import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import crypto from 'crypto';
import { Query, Mutation } from 'react-apollo';
import { GET_CUSTOMER_PASSWORD_TOKEN, RESET_CUSTOMER_PASSWORD } from './queries';

const FormItem = Form.Item;

class ResetCustomerPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { confirmDirty: false };
  }

  handleSubmit = (resetPassword, customer_id) => (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, { firstPassword }) => {
      if (err) return;

      let hashedPass = crypto.createHash('sha256').update(firstPassword).digest('hex');

      resetPassword({
        variables: {
          customer_id,
          password: hashedPass
        }
      })
        .then((data) => {
          this.props.history.push('/success-password-reset');
        })
        .catch((error) => {
          notification.error({
            message: 'Error occured while resetting password.',
            description: error.message ? error.message : 'Please contact system administrator.'
          });
        });
    });
  };

  returnErrorDiv = () => (
    <div className="gx-app-login-wrap">
      <div className="gx-page-success-container">
        <div className="gx-page-success-content">
          <div className="gx-page-success-logo">
            <img src={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_LOGO_URL + 'logo-horizontal.png'} />
          </div>
          <div className="gx-success-code gx-mb-4">OOPS!</div>
          <h2 className="gx-text-center">Something went wrong!</h2>
          <form className="gx-mb-4" role="search" />
          <p className="gx-text-center">Please try again again after some time.</p>
        </div>
      </div>
    </div>
  );

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('firstPassword'))
      callback('Two passwords that you enter are inconsistent!');

    callback();
  };

  validateFirstPassword = (rule, value, callback) => {
    const { form } = this.props;

    if (!/^(?=.*[A-Z]+).{8,}/.test(value))
      callback('Use 8 or more characters with a mix of lower and upper case letters.');

    if (value && this.state.confirmDirty) form.validateFields(['confirmPassword'], { force: true });

    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { token } = this.props.match.params;

    return (
      <Query query={GET_CUSTOMER_PASSWORD_TOKEN} variables={{ token }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return <div className="gx-app-login-wrap">{this.returnErrorDiv()}</div>;

          const custId = data ? data.customerByResetPasswordToken.id : 0;

          if (custId)
            return (
              <div className="gx-app-login-wrap">
                <div className="gx-app-login-container">
                  <div className="gx-app-login-main-content">
                    <div className="gx-app-logo-content">
                      <div className="gx-app-logo">
                        <img
                          alt={'logo'}
                          src={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_LOGO_URL + 'logo-square.png'}
                        />
                      </div>
                    </div>

                    <Mutation mutation={RESET_CUSTOMER_PASSWORD}>
                      {(resetPassword) => (
                        <div className="gx-app-login-content">
                          Hello, {data.customerByResetPasswordToken.full_name}
                          <br />
                          <br />
                          <Form
                            onSubmit={this.handleSubmit(resetPassword, custId)}
                            className="gx-signin-form gx-form-row0"
                          >
                            <FormItem>
                              {getFieldDecorator('firstPassword', {
                                rules: [
                                  {
                                    required: true,
                                    message: 'Please input your Password!'
                                  },
                                  { validator: this.validateFirstPassword }
                                ]
                              })(<Input.Password addonBefore="Enter Password" />)}
                            </FormItem>

                            <FormItem hasFeedback>
                              {getFieldDecorator('confirmPassword', {
                                rules: [
                                  {
                                    required: true,
                                    message: 'Please confirm your Password!'
                                  },
                                  { validator: this.compareToFirstPassword }
                                ]
                              })(<Input.Password addonBefore="Confirm Password" onBlur={this.handleConfirmBlur} />)}
                            </FormItem>

                            <FormItem>
                              <Button type="primary" className="gx-mb-0" htmlType="submit">
                                Reset Password
                              </Button>
                            </FormItem>
                          </Form>
                        </div>
                      )}
                    </Mutation>
                  </div>
                </div>
              </div>
            );
          return this.returnErrorDiv();
        }}
      </Query>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(ResetCustomerPassword);
export default WrappedNormalLoginForm;
