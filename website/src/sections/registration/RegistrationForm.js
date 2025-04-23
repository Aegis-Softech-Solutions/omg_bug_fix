import React, { Component } from "react";
import Router from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import OtpInput from "react-otp-input";
import ReactCountdown from "react-countdown";
import { setCookie } from "nookies";
import ReactModal from "react-modal";
import registrationBackground from "../../assets/image/registration/registration-background.jpg";
import rightArrowIcon from "../../assets/image/icons/right-arrow.png";
import TermsAndConditions from "./TermsAndConditions";

import cashIcon from "../../assets/image/icons/payment/cash.png";
import voucherIcon from "../../assets/image/icons/payment/voucher.png";
import brandIcon from "../../assets/image/icons/payment/brand.png";
import photographerIcon from "../../assets/image/icons/payment/photographer.png";
import radioIcon from "../../assets/image/icons/payment/radio.png";
import groomingIcon from "../../assets/image/icons/payment/grooming.png";
import influencerIcon from "../../assets/image/icons/payment/influencer.png";
import rubaruIcon from "../../assets/image/icons/payment/rubaru.png";

import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
} from "../../components/Core";

import { Mutation } from "react-apollo";
import {
  SEND_OTP_REGISTER,
  VERIFY_OTP_REGISTER,
  GENERATE_RAZORPAY_ORDER_ID,
  ADD_PAYMENT,
  PAYMENT_FAILED,
} from "./queries.js";
import { marginLeft } from "styled-system";

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

class RegistrationForm extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onChangeAccepted = (e) => {
    this.setState({ acceptChecked: e.target.checked });
  };

  resendOTP = (e, sendOTPMutation) => {
    sendOTPMutation({
      variables: {
        full_name: this.state.full_name,
        email: this.state.email,
        phone: parseInt(this.state.phone, 10),
        gender: this.state.gender,
        utm_referrer: this.props.utm_referrer,

        utm_source: this.props.utm_source ? this.props.utm_source : "none",

        utm_medium: this.props.utm_medium ? this.props.utm_medium : "none",

        utm_adgroup: this.props.utm_campaign ? this.props.utm_campaign : "none",

        utm_content: this.props.utm_content ? this.props.utm_content : "none",
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

  onSendOTP = (e, sendOTPMutation) => {
    let lastAtPos = this.state.email.lastIndexOf("@");
    let lastDotPos = this.state.email.lastIndexOf(".");
    if (
      this.state.full_name === "" ||
      !/^[A-Za-z\'\s\.\,\-]+$/.test(this.state.full_name)
    ) {
      this.setState({ formMessage: "Please fill in a valid name" });
    } else if (
      !(
        lastAtPos < lastDotPos &&
        lastAtPos > 0 &&
        this.state.email.indexOf("@@") === -1 &&
        this.state.email.indexOf("@-") === -1 &&
        this.state.email.indexOf("-.") === -1 &&
        this.state.email.indexOf("--") === -1 &&
        lastDotPos > 2 &&
        this.state.email.length - lastDotPos > 2 &&
        this.state.email[0] !== "_"
      )
    ) {
      this.setState({ formMessage: "Please enter a valid email" });
    } else if (
      !/^[a-zA-Z0-9_]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,15})$/.test(
        this.state.email
      )
    ) {
      this.setState({ formMessage: "Please enter a valid email" });
    } else if (this.state.phone === "" || this.state.phone.length !== 10) {
      this.setState({ formMessage: "Please enter a valid phone number" });
    } else if (this.state.gender === "") {
      this.setState({ formMessage: "Please select gender" });
    } else {
      sendOTPMutation({
        variables: {
          full_name: this.state.full_name,
          email: this.state.email,
          phone: parseInt(this.state.phone, 10),
          gender: this.state.gender,
          utm_referrer: this.props.utm_referrer,

          utm_source: this.props.utm_source ? this.props.utm_source : "none",

          utm_medium: this.props.utm_medium ? this.props.utm_medium : "none",

          utm_adgroup: this.props.utm_campaign
            ? this.props.utm_campaign
            : "none",

          utm_content: this.props.utm_content ? this.props.utm_content : "none",
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
          }
        })
        .catch((error) => {
          if (
            Object.values(error)[0][0].message ===
            'You have already registered. Please "LOGIN" to continue.'
          ) {
            this.setState({
              formMessage: (
                <span>
                  You have already registered. Please{" "}
                  <Link href="/login">
                    <a>
                      <Text
                        style={{
                          color: "#FF0000",
                          textDecoration: "underline",
                          display: "inline-block",
                        }}
                        variant="very-small"
                      >
                        Login
                      </Text>
                    </a>
                  </Link>{" "}
                  to continue
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

  addPayment = (
    e,
    generateRazorpayOrderId,
    addPaymentMutation,
    failedPaymentMutation
  ) => {
    let amount = 499 * 100;
    // let amount = 2 * 100;

    let options = {
      key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "OMG Face Of The Year",
      description: "Registration",
      prefill: {
        email: this.state.email,
        contact: this.state.phone,
        name: this.state.full_name,
      },
      readonly: {
        email: true,
        contact: true,
      },
      // order_id: order_id,
      modal: {
        ondismiss: function () {
          failedPaymentMutation();
        },
      },
      handler: function (response) {
          addPaymentMutation({
            variables: {
              payment_id: response.razorpay_payment_id
                ? response.razorpay_payment_id
                : null,
              order_id: response.razorpay_order_id,
              amount: amount / 100,
            },
          }).then((results) => {
            if (results.data.addPayment) {
              Router.push({
                pathname: "/successful-payment",
                query: { orderId: response.razorpay_order_id },
              });
            } else {
              // closeModal();
            }
          });
      },
    };

    generateRazorpayOrderId({
      variables: {
        amount: amount,
      },
    })
      .then((results) => {
        if (Object.values(results.data)[0]) {
          this.setState({
            order_id: results.data.generateRazorpayOrderId.id,
          });
          options.order_id = results.data.generateRazorpayOrderId.id;

          let rzp1 = new window.Razorpay(options);
          rzp1.open();
        }
      })
      .catch((error) => {
        this.setState({
          formMessage: Object.values(error)[0][0].message,
        });
      });
  };

  verifyOTP = (
    e,
    verifyOTPMutation,
    generateRazorpayOrderId,
    addPaymentMutation,
    failedPaymentMutation
  ) => {
    e.preventDefault();

    if (
      !this.state.otp ||
      this.state.otp === "" ||
      this.state.otp.length !== 4
    ) {
      this.setState({ formMessage: "Please enter a valid OTP value. " });
    } else if (this.state.acceptChecked) {
      if (!this.state.disableForm) {
        verifyOTPMutation({
          variables: {
            phone: parseInt(this.state.phone, 10),
            otp: this.state.otp ? this.state.otp : "0",
          },
        })
          .then((results) => {
            this.setState({ disableForm: true });

            setCookie(null, "token", results.data.verifyOTPRegister.token, {
              maxAge: 90 * 24 * 60 * 60,
              path: "/",
              sameSite: "Lax",
            });

            if (this.state.gender === "h") {
              // Directly create dummy transaction for hairstylists
              addPaymentMutation({
                variables: {
                  payment_id: "HAIRSTYLIST_EXEMPT" + Date.now(),
                  order_id: "HAIRSTYLIST_EXEMPT_" + Date.now(),
                  amount: 1,
                },
              }).then(() => {
                Router.push({
                  pathname: "/successful-payment",
                  query: { freeRegistration: true }
                });
              });
            } else {
              // For regular users, proceed with payment
              let amount = 499 * 100;
              
              generateRazorpayOrderId({
                variables: {
                  amount: amount,
                },
              })
                .then((results) => {
                  if (Object.values(results.data)[0]) {
                    this.setState({
                      order_id: results.data.generateRazorpayOrderId.id,
                    });
                    
                    let options = {
                      key: process.env.RAZORPAY_KEY,
                      amount: amount,
                      currency: "INR",
                      name: "OMG Face Of The Year",
                      description: "Registration",
                      prefill: {
                        email: this.state.email,
                        contact: this.state.phone,
                        name: this.state.full_name,
                      },
                      readonly: {
                        email: true,
                        contact: true,
                      },
                      order_id: results.data.generateRazorpayOrderId.id,
                      modal: {
                        ondismiss: function () {
                          failedPaymentMutation();
                        },
                      },
                      handler: function (response) {
                        addPaymentMutation({
                          variables: {
                            payment_id: response.razorpay_payment_id
                              ? response.razorpay_payment_id
                              : null,
                            order_id: response.razorpay_order_id,
                            amount: amount / 100,
                          },
                        }).then((results) => {
                          if (results.data.addPayment) {
                            Router.push({
                              pathname: "/successful-payment",
                              query: { orderId: response.razorpay_order_id },
                            });
                          }
                        });
                      },
                    };
  
                    let rzp1 = new window.Razorpay(options);
                    rzp1.open();
                  }
                })
                .catch((error) => {
                  this.setState({
                    formMessage: Object.values(error)[0][0].message,
                  });
                });
            }
          })
          .catch((error) => {
            this.setState({
              formMessage: Object.values(error)[0][0].message,
            });
          });
      }
    } else {
      this.setState({ formMessage: "Please read and accept the conditions. " });
    }
  };

  onChangeName = (e) => {
    this.setState({ full_name: e.target.value, otpSent: false });
  };

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value.trim(), otpSent: false });
  };

  onChangePhone = (e) => {
    this.setState({ phone: e.target.value, otpSent: false });
  };

  onChangeGender = (e) => {
    this.setState({ gender: e.target.value, otpSent: false });
  };

  handleOTPChange = (otp) => this.setState({ otp });

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      full_name: "",
      email: "",
      phone: "",
      gender: "",
      otp: "",
      showResendOTP: false,
      formMessage: "",
      disableForm: false,
      otpResent: false,
      otpVerified: false,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  render() {
    return (
      <Mutation mutation={PAYMENT_FAILED}>
        {(failedPaymentMutation, { data, loading, error }) => (
          <Mutation mutation={ADD_PAYMENT}>
            {(addPaymentMutation, { data, loading, error }) => (
              <Mutation mutation={GENERATE_RAZORPAY_ORDER_ID}>
                {(generateRazorpayOrderId, { data, loading, error }) => (
                  <Mutation mutation={VERIFY_OTP_REGISTER}>
                    {(verifyOTPMutation, { data, loading, error }) => (
                      <Mutation mutation={SEND_OTP_REGISTER}>
                        {(sendOTPMutation, { data, loading, error }) => (
                          <Section
                            pb={"30px"}
                            style={{
                              backgroundColor: "#000000",
                              backgroundImage:
                                "url(" + registrationBackground + ")",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: "100vh",
                            }}
                          >
                            <ReactModal
                              isOpen={this.state.showModal}
                              contentLabel="T&Cs"
                              className="Modal"
                              overlayClassName="ReactModalOverlayRegistration"
                            >
                              <Row>
                                <Col xs="8">
                                  <Text
                                    variant="bold"
                                    color="#000000"
                                    style={{
                                      paddingBottom: "10px",
                                      paddingLeft: "15px",
                                    }}
                                  >
                                    Terms & Conditions
                                  </Text>
                                </Col>
                                <Col
                                  xs="4"
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "20px",
                                  }}
                                >
                                  <Text
                                    variant="bold"
                                    onClick={this.handleCloseModal}
                                  >
                                    <strong>X</strong>
                                  </Text>
                                </Col>
                              </Row>
                              <TermsAndConditions />
                            </ReactModal>
                            <Box
                              // mb={"40px"}
                              mt={"20px"}
                              mr={"20px"}
                              ml={"20px"}
                              pb={"30px"}
                              pt={"30px"}
                              pl={"10px"}
                              pr={"10px"}
                            >
                              {this.props.customerDetails &&
                                this.props.customerDetails.payment_made ===
                                "Yes" ? (
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
                                      Hey!
                                    </Text>
                                    <Text
                                      variant="very-small"
                                      className="pt-3"
                                      color="#FEFEFE"
                                    >
                                      {/* Registrations have been closed. Stay tuned
                                      for updates. */}
                                      Let’s set up your account. Get, set, go !
                                    </Text>
                                  </Container>
                                  <Container style={{ paddingTop: "2rem" }}>
                                    <Row className="align-items-center">
                                      <Col lg="6">
                                        <FormStyled>
                                          <Box mb={3}>
                                            <Input
                                              type="text"
                                              placeholder="Full Name"
                                              isRequired={true}
                                              onChange={(e) =>
                                                this.onChangeName(e)
                                              }
                                              disabled={this.state.disableForm}
                                            />
                                          </Box>
                                          <Box mb={3}>
                                            <Input
                                              type="text"
                                              placeholder="Email"
                                              isRequired={true}
                                              onChange={(e) =>
                                                this.onChangeEmail(e)
                                              }
                                              disabled={this.state.disableForm}
                                            />
                                          </Box>
                                          <Box mb={3}>
                                            <Input
                                              type="number"
                                              width="90%"
                                              value={this.state.phone}
                                              style={{
                                                display: "inline-block",
                                              }}
                                              placeholder="Mobile Number"
                                              isRequired={true}
                                              isMobileNumber={true}
                                              onChange={(e) =>
                                                this.onChangePhone(e)
                                              }
                                              disabled={this.state.disableForm}
                                            />
                                          </Box>
                                          <Box mb={3}>
                                            <Text
                                              variant="very-small"
                                              className="pt-2 input-title"
                                              color="#FFFFFF"
                                            >
                                              Category
                                              <span style={{ color: "red" }}>*</span>
                                            </Text>
                                            <div style={{ color: "#FFFFFF" }}>
                                              <div
                                                className="option-container"
                                                style={{ display: "flex", alignItems: "center", marginBottom: "12px", marginTop: "10px" }}
                                              >
                                                <Input
                                                  type="radio"
                                                  id="male"
                                                  name="gender"
                                                  value="m"
                                                  disabled={this.state.disableForm}
                                                  style={{
                                                    fontSize: "18px",
                                                    width: "6%",
                                                  }}
                                                  onChange={(e) => this.onChangeGender(e)}
                                                />
                                                <div
                                                  style={{
                                                    marginLeft: "5px",
                                                    width: "94%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-start",
                                                    fontSize: "18px",
                                                  }}
                                                >
                                                  Mr. OMG
                                                </div>
                                              </div>

                                              <div
                                                className="option-container"
                                                style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}
                                              >
                                                <Input
                                                  type="radio"
                                                  id="female"
                                                  name="gender"
                                                  value="f"
                                                  disabled={
                                                    this.state.disableForm
                                                  }
                                                  style={{
                                                    fontSize: "18px",
                                                    width: "6%",
                                                  }}
                                                  onChange={(e) =>
                                                    this.onChangeGender(e)
                                                  }
                                                />
                                                <div
                                                  style={{
                                                    marginLeft: "5px",
                                                    width: "94%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-start",
                                                    fontSize: "18px",
                                                  }}
                                                >
                                                  Miss/Mrs. OMG
                                                </div>
                                              </div>

                                              <div
                                                className="option-container"
                                                style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px" }}
                                              >
                                                <Input
                                                  type="radio"
                                                  id="hairstylist"
                                                  name="gender"
                                                  value="h"
                                                  disabled={this.state.disableForm}
                                                  style={{
                                                    fontSize: "18px",
                                                    marginTop: "7px",
                                                    width: "6%",
                                                  }}
                                                  onChange={(e) => this.onChangeGender(e)}
                                                />
                                                <div
                                                  style={{
                                                    marginLeft: "5px",
                                                    width: "94%",
                                                    display: "flex",
                                                    alignItems: "start",
                                                    justifyContent: "flex-start",
                                                    flexDirection: "column",
                                                    fontSize: "18px"
                                                  }}
                                                >
                                                  <div>Streax Hairstyle Icon</div>
                                                  <div>
                                                    (only for Hairstylist)*
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
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
                                                  <span
                                                    style={{ color: "red" }}
                                                  >
                                                    *
                                                  </span>
                                                </Text>
                                                <OtpInput
                                                  value={this.state.otp}
                                                  onChange={
                                                    this.handleOTPChange
                                                  }
                                                  numInputs={4}
                                                  separator={<span></span>}
                                                  containerStyle="otp-container"
                                                  inputStyle="otp-input"
                                                  isInputNum={true}
                                                  isDisabled={
                                                    this.state.disableForm
                                                  }
                                                />
                                              </Box>

                                              <ReactCountdown
                                                date={this.state.countDownDate}
                                                renderer={renderer}
                                                onComplete={
                                                  this.setResendOTPTrue
                                                }
                                              />

                                              {this.state.showResendOTP ? (
                                                <Text
                                                  variant="very-small"
                                                  color="#FFF"
                                                  onClick={(e) =>
                                                    this.resendOTP(
                                                      e,
                                                      sendOTPMutation
                                                    )
                                                  }
                                                >
                                                  Resend OTP
                                                </Text>
                                              ) : null}

                                              {this.state.otpResent ? (
                                                <Text
                                                  variant="very-small"
                                                  color="#FFF"
                                                >
                                                  OTP resent.
                                                </Text>
                                              ) : null}

                                              <Text
                                                variant="very-small"
                                                color="#FFFFFF"
                                                width="90%"
                                                style={{
                                                  paddingTop: "20px",
                                                  paddingBottom: "20px",
                                                }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  value="accepted"
                                                  onChange={(e) =>
                                                    this.onChangeAccepted(e)
                                                  }
                                                  style={{
                                                    marginRight: "5px",
                                                  }}
                                                />
                                                &nbsp;I have read and accepted{" "}
                                                <span
                                                  onClick={this.handleOpenModal}
                                                  style={{
                                                    textDecoration: "underline",
                                                  }}
                                                >
                                                  terms & conditions.
                                                </span>
                                              </Text>

                                              <Container className="text-center">
                                                <Button
                                                  id="registration-submit"
                                                  width="100%"
                                                  type="submit"
                                                  variant="custom"
                                                  borderRadius={10}
                                                  style={{ paddingTop: "10px" }}
                                                  onClick={(e) =>
                                                    this.verifyOTP(
                                                      e,
                                                      verifyOTPMutation,
                                                      generateRazorpayOrderId,
                                                      addPaymentMutation,
                                                      failedPaymentMutation
                                                    )
                                                  }
                                                >
                                                  {this.state.disableForm
                                                    ? "SUBMIT"
                                                    : "SUBMIT"}
                                                </Button>
                                              </Container>
                                            </>
                                          ): (
                                            <Text
                                              id="send-otp"
                                              mb={3}
                                              mt={3}
                                              variant="small"
                                              color="#FFFFFF"
                                              style={{
                                                textAlign: "right",
                                                textDecoration: "underline",
                                              }}
                                              onClick={(e) =>
                                                this.onSendOTP(
                                                  e,
                                                  sendOTPMutation
                                                )
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
                                            <div
                                              style={{
                                                minHeight: "22px",
                                                paddingTop: "10px",
                                              }}
                                            >
                                              <Text
                                                variant="error"
                                                color="#FFFFFF"
                                              >
                                                {this.state.formMessage}
                                              </Text>
                                            </div>
                                          ) : (
                                            <div
                                              style={{ minHeight: "28px" }}
                                            ></div>
                                          )}
                                          <Text
                                            style={{
                                              color: "#fff",
                                              fontSize: "12px",
                                            }}
                                          >
                                            To be eligible, you need to be over
                                            18 years.
                                          </Text>
                                        </FormStyled>
                                      </Col>
                                    </Row>
                                  </Container>
                                </>
                              )
                              
                              // : (
                              //   <>
                              //     <Container
                              //       className="pt-4 pb-4"
                              //       style={{ background: "#ffffffa3" }}
                              //     >
                              //       <Text variant="bold" color="#000000">
                              //         Glad to have you onboard!
                              //       </Text>
                              //       <Text
                              //         className="pt-3"
                              //         color="#000000"
                              //         variant="small"
                              //       >
                              //         Please {this.state.gender === 'h' ? "proceed" : " complete the payment"} to start your journey to become the

                              //         <br />
                              //         <span style={{ fontWeight: "600" }}>
                              //           OMG Face Of The Year.
                              //         </span>
                              //         <br />
                              //         <br />
                              //         <span
                              //           style={{
                              //             textDecoration: "underline",
                              //           }}
                              //         >
                              //           Jury :
                              //         </span>{" "}
                              //         <br />
                              //         <span style={{ fontWeight: "600" }}>
                              //           Dabboo Ratnani
                              //         </span>{" "}
                              //         (Celebrity Photographer) <br />{" "}
                              //         <span style={{ fontWeight: "600" }}>
                              //           Suresh Mukund
                              //         </span>{" "}
                              //         (Celebrity Choreographer) <br />{" "}
                              //         <span style={{ fontWeight: "600" }}>
                              //           Sunny Kamble
                              //         </span>{" "}
                              //         ( Super Model ) <br />{" "}
                              //         <span style={{ fontWeight: "600" }}>
                              //           Kavita Kharayat
                              //         </span>{" "}
                              //         (Super Model)
                              //       </Text>
                              //       <hr />
                              //       {this.state.gender !== "h" && (
                              //         <Text
                              //         variant="small"
                              //         color="#000000"
                              //         className="mt-2"
                              //         style={{ lineHeight: "18px" }}
                              //       >
                              //         The nominal entry fee of{" "}
                              //         <span
                              //           style={{
                              //             fontWeight: "600",
                              //             textDecoration: "underline",
                              //           }}
                              //         >
                              //           Rs. 499 only
                              //         </span>{" "}
                              //         (no hidden costs) will get you access to :
                              //       </Text>
                              //         )}

                              //       <Text
                              //         variant="small"
                              //         color="#000000"
                              //         className="mt-2"
                              //         style={{ lineHeight: "18px" }}
                              //       >
                              //         <ul>
                              //           <li className="payment-page-bullet mb-2">
                              //             A chance to win cash prizes of upto{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               ₹51,000
                              //             </span>
                              //           </li>
                              //           <li className="payment-page-bullet mb-2">
                              //             Horra Luxury voucher worth{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               ₹500
                              //             </span>
                              //           </li>
                              //           <li className="payment-page-bullet mb-2">
                              //             An opportunity to be shot by{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               Dabboo Ratnani
                              //             </span>
                              //           </li>

                              //           <li className="payment-page-bullet mb-2">
                              //             A chance to be noticed by{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               brands
                              //             </span>
                              //           </li>
                              //           <li className="payment-page-bullet mb-2">
                              //             Once in a lifetime prospect of
                              //             speaking{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               live on radio
                              //             </span>
                              //           </li>
                              //           <li className="payment-page-bullet mb-2">
                              //             Grooming tips, career guidance and{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               industry insights
                              //             </span>
                              //           </li>
                              //           <li className="payment-page-bullet mb-2">
                              //             A chance to sign an annual contract as
                              //             a{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               social media influencer
                              //             </span>
                              //           </li>
                              //           <li className="payment-page-bullet mb-2">
                              //             Become eligible for a wild card entry
                              //             to{" "}
                              //             <span
                              //               style={{
                              //                 fontWeight: "600",
                              //                 textDecoration: "underline",
                              //               }}
                              //             >
                              //               Mr. | Miss. | Hairstylist India Rubaru
                              //             </span>
                              //           </li>
                              //         </ul>
                              //       </Text>
                              //      {this.state.gender !== "h" && (
                              //        <Text
                              //        variant="small"
                              //        color="#000000"
                              //        className="mt-2"
                              //        style={{ lineHeight: "18px" }}
                              //      >
                              //        All this and more only for Rs. 499 with no
                              //        additional or hidden costs.
                              //      </Text>
                              //      )}
                              //       {this.state.gender === "h" && (
                              //         <Text
                              //           variant="small"
                              //           color="#000000"
                              //           className="mt-2 mb-2"
                              //           style={{
                              //             lineHeight: "18px",
                              //             fontWeight: "600",
                              //             backgroundColor: "#e6f7e6",
                              //             padding: "10px",
                              //             borderRadius: "5px"
                              //           }}
                              //         >
                              //           As a hairstylist, you're eligible for free registration! Click proceed to complete your registration.
                              //         </Text>
                              //       )}
                              //       <Container className="text-center mt-4">
                              //         <Button
                              //           id="proceed-to-pay"
                              //           width="100%"
                              //           type="submit"
                              //           variant="custom"
                              //           borderRadius={10}
                              //           onClick={(e) => {
                              //             this.verifyOTP(
                              //               e,
                              //               verifyOTPMutation,
                              //               generateRazorpayOrderId,
                              //               addPaymentMutation,
                              //               failedPaymentMutation
                              //             );

                              //             if (this.state.gender === "h") {
                              //               // Directly create dummy transaction for hairstylists
                              //               addPaymentMutation({
                              //                 variables: {
                              //                   payment_id: "HAIRSTYLIST_EXEMPT" + Date.now(),
                              //                   order_id: "HAIRSTYLIST_EXEMPT_" + Date.now(),
                              //                   amount: 1,
                              //                 },
                              //               }).then(() => {
                              //                 Router.push({
                              //                   pathname: "/successful-payment",
                              //                   query: { freeRegistration: true }
                              //                 });
                              //               });
                              //             } else {
                              //               this.addPayment(
                              //                 e,
                              //                 generateRazorpayOrderId,
                              //                 addPaymentMutation,
                              //                 failedPaymentMutation
                              //               );
                              //             }
                              //             // if (this.state.gender !== "h") {

                              //             // } else {
                              //             //   // Hairstylists are exempted from payment
                              //             //   // Direct them to successful registration
                              //             //   Router.push({
                              //             //     pathname: "/successful-payment",
                              //             //     query: { freeRegistration: true }
                              //             //   });
                              //             // }
                              //           }}

                              //         // onClick={(e) =>
                              //         //   this.addPayment(
                              //         //     e,
                              //         //     generateRazorpayOrderId,
                              //         //     addPaymentMutation,
                              //         //     failedPaymentMutation
                              //         //   )
                              //         // }
                              //         >
                              //           {this.state.gender !== "h" ? (
                              //             this.state.disableForm
                              //             ? "PROCEED TO PAY"
                              //             : "PROCEED TO PAY"
                              //             ): ( "PROCEED TO REGISTER")}
                              //         </Button>
                              //       </Container>
                              //     </Container>
                              //   </>
                              // )
                              }
                            </Box>
                          </Section>
                        )}
                      </Mutation>
                    )}
                  </Mutation>
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default RegistrationForm;
