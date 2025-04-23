import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import OtpInput from "react-otp-input";
import ReactCountdown from "react-countdown";
import { setCookie } from "nookies";

import loginBackground from "../../assets/image/login/login-background.jpg";
import rightArrowIcon from "../../assets/image/icons/right-arrow.png";

import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
} from "../../components/Core";

import { Mutation } from "react-apollo";
import { SEND_OTP_LOGIN, VERIFY_OTP_LOGIN } from "./queries.js";

const FormStyled = styled.form``;

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <></>;
  } else {
    // Render a countdown
    return (
      <Text variant="very-small" color="#FFF">
        OTP has been sent via SMS and Email. Resend OTP in {seconds}s.
      </Text>
    );
  }
};

class LoginForm extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  resendOTP = (e, sendOTPMutation) => {
    sendOTPMutation({
      variables: {
        cred: this.state.cred,
      },
    })
      .then((results) => {
        if (Object.values(results.data)[0]) {
          this.setState({
            showResendOTP: false,
            otpResent: true,
          });
        }
      })
      .catch((error) => {
        this.setState({
          formMessage: Object.values(error)[0][0].message,
        });
      });
  };

  setResendOTPTrue = () => {
    this.setState({ showResendOTP: true });
  };

  onChangeCred = (e) => {
    this.setState({ cred: e.target.value.trim(), otpSent: false });
  };

  handleOTPChange = (otp) => this.setState({ otp });

  onSendOTP = (e, sendOTPMutation) => {
    let lastAtPos = this.state.cred.lastIndexOf("@");
    let lastDotPos = this.state.cred.lastIndexOf(".");

    if (
      !isNaN(this.state.cred) &&
      !isNaN(parseFloat(this.state.cred)) &&
      this.state.cred === ""
    ) {
      this.setState({ formMessage: "Please enter a valid phone number" });
    } else if (
      !isNaN(this.state.cred) &&
      !isNaN(parseFloat(this.state.cred)) &&
      this.state.cred.length !== 10
    ) {
      this.setState({ formMessage: "Please enter a valid phone number" });
    } else if (
      isNaN(this.state.cred) &&
      isNaN(parseFloat(this.state.cred)) &&
      !(
        lastAtPos < lastDotPos &&
        lastAtPos > 0 &&
        this.state.cred.indexOf("@@") === -1 &&
        this.state.cred.indexOf("@-") === -1 &&
        this.state.cred.indexOf("-.") === -1 &&
        this.state.cred.indexOf("--") === -1 &&
        lastDotPos > 2 &&
        this.state.cred.length - lastDotPos > 2 &&
        this.state.cred[0] !== "_"
      )
    ) {
      this.setState({ formMessage: "Please enter a valid email" });
    } else if (
      isNaN(this.state.cred) &&
      isNaN(parseFloat(this.state.cred)) &&
      !/^[a-zA-Z0-9_]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,15})$/.test(
        this.state.cred
      )
    ) {
      this.setState({ formMessage: "Please enter a valid email" });
    } else {
      sendOTPMutation({
        variables: {
          cred: this.state.cred,
        },
      })
        .then((results) => {
          if (Object.values(results.data)[0]) {
            this.setState({
              otpSent: true,
              showResendOTP: false,
              formMessage: "",
              countDownDate: Date.now() + 20000,
            });
            // setTimeout(function () {
            //   this.setState({ showResendOTP: true });
            // }, 10000);
          }
        })
        .catch((error) => {
          if (
            Object.values(error)[0][0].message ===
            "This phone/e-mail is not registered. Please register and then try again."
          ) {
            this.setState({
              formMessage: (
                <span>
                  This phone/e-mail is not registered. Please{" "}
                  <Link href="/registration">
                    <a>
                      <Text
                        style={{
                          color: "#FF0000",
                          textDecoration: "underline",
                          display: "inline-block",
                        }}
                        variant="very-small"
                      >
                        register
                      </Text>
                    </a>
                  </Link>{" "}
                  and then try again.
                </span>
              ),
            });
          } else {
            this.setState({
              formMessage: Object.values(error)[0][0].message,
            });
          }
        });
    }
  };

  verifyOTP = (e, verifyOTPMutation) => {
    e.preventDefault();

    if (
      this.state.cred &&
      this.state.otp &&
      this.state.cred !== "" &&
      this.state.otp !== "" &&
      this.state.otp.length === 4
    ) {
      verifyOTPMutation({
        variables: {
          cred: this.state.cred,
          otp: this.state.otp,
        },
      })
        .then((results) => {
          setCookie(null, "token", results.data.verifyOTPLogin.token, {
            maxAge: 90 * 24 * 60 * 60,
            path: "/",
            sameSite: "Lax",
          });
          Router.push({
            pathname: "/my-profile",
          });
        })
        .catch((error) => {
          // console.log(error);
          this.setState({
            formMessage: Object.values(error)[0][0].message,
          });
        });
    } else {
      this.setState({ formMessage: "Please enter a valid OTP" });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      cred: "",
    };
  }

  render() {
    return (
      <Mutation mutation={VERIFY_OTP_LOGIN}>
        {(verifyOTPMutation, { data, loading, error }) => (
          <Mutation mutation={SEND_OTP_LOGIN}>
            {(sendOTPMutation, { data, loading, error }) => (
              <Section
                pb={"30px"}
                style={{
                  backgroundColor: "#000000",
                  backgroundImage: "url(" + loginBackground + ")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  minHeight: "95vh",
                }}
              >
                <Box
                  // mb={"40px"}
                  mt={"40px"}
                  mr={"20px"}
                  ml={"20px"}
                  pb={"30px"}
                  pt={"30px"}
                  pl={"10px"}
                  pr={"10px"}
                >
                  {this.props.customerDetails &&
                  this.props.customerDetails.id ? (
                    <Container>
                      <Text variant="bold" color="#FFFFFF">
                        You are logged in. <br />
                        <br />
                      </Text>
                      {/* <Link href="/profile-form">
                        <a>
                          <Button
                            width="100%"
                            type="submit"
                            variant="custom"
                            borderRadius={10}
                          >
                            Edit Profile
                          </Button>
                        </a>
                      </Link> */}
                    </Container>
                  ) : (
                    <>
                      <Container>
                        <Text variant="bold" color="#FFFFFF">
                          Login
                        </Text>
                      </Container>
                      <Container className="pt-4">
                        <Row className="align-items-center">
                          <Col lg="6">
                            <FormStyled>
                              <Box mb={3}>
                                <Input
                                  type="email"
                                  placeholder="Mobile No./Email"
                                  isRequired={true}
                                  onChange={(e) => this.onChangeCred(e)}
                                />
                              </Box>

                              {this.state.otpSent ? (
                                <>
                                  <Box mb={3}>
                                    <Text
                                      variant="very-small"
                                      className="pt-2 input-title"
                                      color="#FFFFFF"
                                    >
                                      OTP
                                      <span style={{ color: "red" }}>*</span>
                                    </Text>
                                    <OtpInput
                                      value={this.state.otp}
                                      onChange={this.handleOTPChange}
                                      numInputs={4}
                                      separator={<span></span>}
                                      containerStyle="otp-container"
                                      inputStyle="otp-input"
                                      isInputNum={true}
                                    />
                                  </Box>

                                  <ReactCountdown
                                    date={this.state.countDownDate}
                                    renderer={renderer}
                                    onComplete={this.setResendOTPTrue}
                                  />

                                  {this.state.showResendOTP ? (
                                    <Text
                                      variant="very-small"
                                      color="#FFF"
                                      onClick={(e) =>
                                        this.resendOTP(e, sendOTPMutation)
                                      }
                                    >
                                      Resend OTP
                                    </Text>
                                  ) : null}

                                  {this.state.otpResent ? (
                                    <Text variant="very-small" color="#FFF">
                                      OTP resent.
                                    </Text>
                                  ) : null}

                                  <Container className="text-center pt-4">
                                    <Button
                                      width="100%"
                                      type="submit"
                                      variant="custom"
                                      borderRadius={10}
                                      onClick={(e) =>
                                        this.verifyOTP(e, verifyOTPMutation)
                                      }
                                    >
                                      SUBMIT
                                    </Button>
                                  </Container>
                                </>
                              ) : (
                                <Text
                                  mb={3}
                                  mt={3}
                                  variant="small"
                                  color="#FFFFFF"
                                  style={{
                                    textAlign: "right",
                                    textDecoration: "underline",
                                  }}
                                  onClick={(e) =>
                                    this.onSendOTP(e, sendOTPMutation)
                                  }
                                >
                                  Send OTP
                                  <img
                                    src={rightArrowIcon}
                                    width="15px"
                                    style={{ marginLeft: "10px" }}
                                  />
                                </Text>
                              )}

                              {this.state.formMessage &&
                              this.state.formMessage !== "" ? (
                                <div style={{ minHeight: "22px" }}>
                                  <Text variant="error" color="#FFFFFF">
                                    {this.state.formMessage}
                                  </Text>
                                </div>
                              ) : (
                                <div style={{ minHeight: "28px" }}></div>
                              )}
                            </FormStyled>
                          </Col>
                        </Row>
                      </Container>
                    </>
                  )}
                </Box>
              </Section>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default LoginForm;
