import React, { Component } from "react";
import Router from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import OtpInput from "react-otp-input";
import ReactCountdown, { zeroPad } from "react-countdown";
import { setCookie } from "nookies";
import ReactModal from "react-modal";
import registrationBackground from "../../assets/image/registration/background.jpg";
import rightArrowIcon from "../../assets/image/icons/right-arrow.png";
import TermsAndConditions from "./TermsAndConditions";
import bannerImage from "../../assets/image/landing-page/banner.jpg";
import imgL1Logo from "../../assets/image/logo/black-logo-lg.png";
import beliefImage from "../../assets/image/landing-page/belief.jpg";
import confidenceImage from "../../assets/image/landing-page/confidence.jpg";
import groomingImage from "../../assets/image/landing-page/grooming.jpg";
import speakingImage from "../../assets/image/landing-page/speaking.jpg";
import rubaruImg from "../../assets/image/homepage/sponsors/rubaru.jpg";
import queueImage from "../../assets/image/landing-page/queue.png";
import photoshootImage from "../../assets/image/landing-page/photoshoot.png";
import producerImage from "../../assets/image/landing-page/producer.png";
import cashIcon2 from "../../assets/image/icons/cash2.png";
import crownIcon from "../../assets/image/icons/crown.png";
import influencerIcon from "../../assets/image/icons/influencer.png";
import radioIcon from "../../assets/image/icons/radio.png";
import streaxLogo from "../../assets/image/homepage/sponsors/Streax-Professional.png";
import dcotLogo from "../../assets/image/homepage/sponsors/Dcot-logo.png";

import rohitImg from "../../assets/image/homepage/jury/rohit.jpg";
import sureshImg from "../../assets/image/homepage/jury/suresh.jpg";
import dabbooImg from "../../assets/image/homepage/jury/dabboo.jpg";

import vihbizImg from "../../assets/image/homepage/jury/vibhiz.jpg";
import sunnyImg from "../../assets/image/homepage/jury/sunny.jpg";
import kavitaImg from "../../assets/image/homepage/jury/kavita.jpg";

import horraImg from "../../assets/image/homepage/sponsors/horra.jpg";
import skinWorksImg from "../../assets/image/homepage/sponsors/skin-works.jpg";
import blanckanvasImg from "../../assets/image/homepage/sponsors/blanckanvas-updated.jpg";
import feverImg from "../../assets/image/homepage/sponsors/fever.jpg";
import eipimediaImg from "../../assets/image/homepage/sponsors/eipimedia.jpg";
import buycepsImg from "../../assets/image/homepage/sponsors/buyceps.png";

import rohitVideo from "../../assets/videos/rohit-video.mp4";
import explainerVideo from "../../assets/videos/explainer-video.mp4";
import testimonialVideo from "../../assets/videos/testimonial-video.mp4";
import rohitPreviewImg from "../../assets/videos/rohit-preview.jpg";

import { breakpoints } from "../../utils";

import { BsQuestionCircleFill } from "react-icons/bs";

import ReactPlayer from "react-player";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
} from "../../components/Core";
import Slider from "react-slick";
import { Mutation } from "react-apollo";
import {
  SEND_OTP_REGISTER,
  VERIFY_OTP_REGISTER,
  GENERATE_RAZORPAY_ORDER_ID,
  ADD_PAYMENT,
  PAYMENT_FAILED,
} from "./queries.js";

const FormStyled = styled.form`
  border: 1px solid #e0e0e0;
  padding: 25px 20px 10px 20px;
`;

const SliderStyled = styled(Slider)`
  .slick-dots {
    position: relative;
    margin-top: 10px;
    li {
      font-size: 0;
      width: 17px;
      height: 8px;
      border-radius: 4px;
      background-color: ${({ theme }) => theme.colors.shadow};
      margin-left: 5px;
      margin-right: 5px;
      transition: 0.5s;
      &.slick-active {
        width: 45px;
        height: 8px;
        border-radius: 4px;
        background-color: ${({ theme }) => theme.colors.secondary};
      }
      button {
        width: 100%;
        height: 100%;
        &:before {
          content: none;
        }
      }
    }
  }
`;

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <></>;
  } else {
    // Render a countdown
    return (
      <Text variant="very-small">
        OTP has been sent via SMS and Email. Resend OTP in {seconds}s.
      </Text>
    );
  }
};

const registerRenderer = ({ hours, minutes, seconds, completed }) => {
  return (
    <span style={{ fontSize: "30px", color: "#FF0000", fontWeight: "600" }}>
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
};

const slickSettings = {
  autoplay: true,
  autoplaySpeed: 1500,
  pauseOnHover: false,
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "40px",
  responsive: [
    {
      breakpoint: breakpoints.md,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

class RegistrationForm extends Component {
  componentDidMount() {
    setCookie(null, "utm_campaign", this.props.utm_campaign, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });
    setCookie(null, "utm_source", this.props.utm_source, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setCookie(null, "utm_medium", this.props.utm_medium, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setCookie(null, "utm_adgroup", this.props.utm_adgroup, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setCookie(null, "utm_content", this.props.utm_content, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });
  }

  onChangeAccepted = (e) => {
    this.setState({ acceptChecked: e.target.checked });
  };

  resendOTP = (e, sendOTPMutation) => {
    e.preventDefault();
    sendOTPMutation({
      variables: {
        full_name: this.state.full_name,
        email: this.state.email,
        phone: parseInt(this.state.phone, 10),
        gender: this.state.gender,
        utm_referrer: this.props.utm_campaign
          ? this.props.utm_campaign
          : "landing-page",

        utm_source: this.props.utm_source
          ? this.props.utm_source
          : "landing-page",

        utm_medium: this.props.utm_medium
          ? this.props.utm_medium
          : "landing-page",

        utm_adgroup: this.props.utm_adgroup
          ? this.props.utm_adgroup
          : "landing-page",

        utm_content: this.props.utm_content
          ? this.props.utm_content
          : "landing-page",
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
    e.preventDefault();
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
          utm_referrer: this.props.utm_campaign
            ? this.props.utm_campaign
            : "landing-page",

          utm_source: this.props.utm_source
            ? this.props.utm_source
            : "landing-page",

          utm_medium: this.props.utm_medium
            ? this.props.utm_medium
            : "landing-page",

          utm_adgroup: this.props.utm_adgroup
            ? this.props.utm_adgroup
            : "landing-page",

          utm_content: this.props.utm_content
            ? this.props.utm_content
            : "landing-page",
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

            let amount = 499 * 100;

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
                      pathname: "/thank-you",
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
          })
          .catch((error) => {
            this.setState({
              formMessage: Object.values(error)[0][0].message,
            });
          });
      } else {
        let amount = 499 * 100;

        let options = {
          key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
          amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "OMG Face Of The Year",
          description: "Registration",
          order_id: this.state.order_id,
          prefill: {
            email: this.state.email,
            contact: this.state.phone,
            name: this.state.full_name,
          },
          readonly: {
            email: true,
            contact: true,
          },
          modal: {
            ondismiss: function () {
              failedPaymentMutation();
            },
          },
          // order_id: order_id,
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
                  pathname: "/thank-you",
                  query: { orderId: response.razorpay_order_id },
                });
              } else {
                // closeModal();
              }
            });
          },
        };

        let rzp1 = new window.Razorpay(options);
        rzp1.open();
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
  executeScroll = () => this.myRef.current.scrollIntoView();

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
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
      registerCountdown: Date.now() + 21600000,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.executeScroll = () => this.myRef.current.scrollIntoView();
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
                            pt={"0px"}
                            style={{ fontFamily: "Montserrat" }}
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
                              pt={"20px"}
                              pb={"30px"}
                              pl={"10px"}
                              pr={"10px"}
                            >
                              {this.props.customerDetails &&
                              this.props.customerDetails.payment_made ===
                                "Yes" ? (
                                <Container>
                                  <Text variant="bold">
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
                                  <Container style={{ textAlign: "center" }}>
                                    <Title variant="landing-h1" color="#000000">
                                      INDIA'S FIRST DIGITAL FASHION HUNT!
                                    </Title>
                                    <Title variant="landing-h2" color="#000000">
                                      <span
                                        style={{
                                          color: "#FF0000",
                                        }}
                                      >
                                        LEARN
                                      </span>{" "}
                                      FROM INDUSTRY MENTORS &{" "}
                                      <span
                                        style={{
                                          color: "#FF0000",
                                        }}
                                      >
                                        EARN
                                      </span>{" "}
                                      YOUR PLACE IN FASHION INDUSTRY
                                    </Title>
                                    <Title variant="landing-h3" color="#000000">
                                      All from the comfort of your home
                                    </Title>
                                  </Container>
                                  <Container>
                                    <img
                                      src={bannerImage}
                                      alt=""
                                      className="w-100 img-fluid"
                                    />
                                    <Title
                                      variant="landing-h3"
                                      color="#000000"
                                      className="mt-3"
                                    >
                                      OMG - Face Of The Year, a platform that
                                      brings together the who’s who of the
                                      industry.
                                      <br />
                                      <br /> Mentorship that gets all eyes on
                                      you and takes you on the path of a
                                      game-changing career.
                                    </Title>
                                  </Container>

                                  <Container
                                    style={{ paddingTop: "2rem" }}
                                    ref={this.myRef}
                                  >
                                    <Row className="align-items-center">
                                      <Col lg="6">
                                        <FormStyled>
                                          <Title
                                            variant="landing-h2"
                                            color="#000000"
                                          >
                                            Register Now
                                          </Title>
                                          <Box mb={3}>
                                            <Input
                                              type="text"
                                              variant="dark"
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
                                              variant="dark"
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
                                              variant="dark"
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
                                            <Row>
                                              <Col xs="6">
                                                <Input
                                                  variant="dark"
                                                  type="radio"
                                                  id="male"
                                                  name="gender"
                                                  value="m"
                                                  width="10%"
                                                  disabled={
                                                    this.state.disableForm
                                                  }
                                                  style={{
                                                    display: "inline-block",
                                                    fontSize: "12px",
                                                  }}
                                                  onChange={(e) =>
                                                    this.onChangeGender(e)
                                                  }
                                                />
                                                {"  "}
                                                <span
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {" "}
                                                  MALE
                                                </span>
                                              </Col>
                                              <Col xs="6">
                                                <Input
                                                  variant="dark"
                                                  type="radio"
                                                  id="female"
                                                  name="gender"
                                                  value="f"
                                                  width="10%"
                                                  disabled={
                                                    this.state.disableForm
                                                  }
                                                  style={{
                                                    display: "inline-block",
                                                    fontSize: "12px",
                                                  }}
                                                  onChange={(e) =>
                                                    this.onChangeGender(e)
                                                  }
                                                />
                                                {"  "}
                                                <span
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {" "}
                                                  FEMALE
                                                </span>
                                              </Col>
                                            </Row>
                                          </Box>

                                          {this.state.otpSent ? (
                                            <>
                                              <Box mb={3}>
                                                <Text
                                                  variant="very-small"
                                                  className="pt-2 input-title"
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
                                                  inputStyle="otp-input-landing"
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
                                                <Text variant="very-small">
                                                  OTP resent.
                                                </Text>
                                              ) : null}

                                              <Text
                                                variant="very-small"
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
                                                  width="100%"
                                                  type="submit"
                                                  variant="custom"
                                                  id="payment-button"
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
                                          ) : (
                                            <Button
                                              width="100%"
                                              type="submit"
                                              variant="custom"
                                              borderRadius={10}
                                              id="send-otp"
                                              style={{ paddingTop: "10px" }}
                                              onClick={(e) =>
                                                this.onSendOTP(
                                                  e,
                                                  sendOTPMutation
                                                )
                                              }
                                            >
                                              Send OTP
                                            </Button>
                                          )}

                                          {this.state.formMessage &&
                                          this.state.formMessage !== "" ? (
                                            <div
                                              style={{
                                                minHeight: "22px",
                                                paddingTop: "10px",
                                              }}
                                            >
                                              <Text variant="error">
                                                {this.state.formMessage}
                                              </Text>
                                            </div>
                                          ) : (
                                            <div
                                              style={{ minHeight: "28px" }}
                                            ></div>
                                          )}
                                        </FormStyled>
                                      </Col>
                                    </Row>
                                  </Container>

                                  <Container className="mt-5">
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                    >
                                      Rewards
                                    </Title>

                                    <Row
                                      className="mt-4 winners-row-landing"
                                      style={{
                                        padding: "10px 10px",
                                        marginLeft: "0.5rem",
                                        marginRight: "0.5rem",
                                        border: "1px solid #e0e0e0",
                                      }}
                                    >
                                      <Col
                                        xs="2"
                                        style={{
                                          paddingLeft: "0px",
                                          paddingRight: "0px",
                                        }}
                                      >
                                        <img
                                          src={cashIcon2}
                                          width="40px"
                                          style={{ marginTop: "10px" }}
                                        />
                                      </Col>
                                      <Col
                                        xs="10"
                                        style={{
                                          paddingLeft: "5px",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        <Title
                                          variant="landing-h3"
                                          className="mb-0"
                                          style={{ fontSize: "14px" }}
                                        >
                                          CASH PRIZES
                                        </Title>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          style={{ lineHeight: "18px" }}
                                        >
                                          ₹50,000 for Winners
                                          <br />
                                          ₹10,000 for Finalists
                                        </Text>
                                      </Col>
                                    </Row>

                                    <Row
                                      className="mt-4 winners-row-landing"
                                      style={{
                                        padding: "10px 10px",
                                        marginLeft: "0.5rem",
                                        marginRight: "0.5rem",
                                        border: "1px solid #e0e0e0",
                                      }}
                                    >
                                      <Col
                                        xs="2"
                                        style={{
                                          paddingLeft: "0px",
                                          paddingRight: "0px",
                                        }}
                                      >
                                        <img src={crownIcon} width="40px" />
                                      </Col>
                                      <Col
                                        xs="10"
                                        style={{
                                          paddingLeft: "5px",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        <Title
                                          variant="landing-h3"
                                          className="mb-0"
                                          style={{ fontSize: "14px" }}
                                        >
                                          WILD CARD ENTRY
                                        </Title>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          style={{ lineHeight: "18px" }}
                                        >
                                          To Mr. & Miss. India Rubaru
                                        </Text>
                                      </Col>
                                    </Row>

                                    <Row
                                      className="mt-4 winners-row-landing"
                                      style={{
                                        padding: "10px 10px",
                                        marginLeft: "0.5rem",
                                        marginRight: "0.5rem",
                                        border: "1px solid #e0e0e0",
                                      }}
                                    >
                                      <Col
                                        xs="2"
                                        style={{
                                          paddingLeft: "0px",
                                          paddingRight: "0px",
                                        }}
                                      >
                                        <img
                                          src={influencerIcon}
                                          width="40px"
                                        />
                                      </Col>
                                      <Col
                                        xs="10"
                                        style={{
                                          paddingLeft: "5px",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        <Title
                                          variant="landing-h3"
                                          className="mb-0"
                                          style={{ fontSize: "14px" }}
                                        >
                                          ANNUAL CONTRACT
                                        </Title>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          style={{ lineHeight: "18px" }}
                                        >
                                          As a Social Media Influencer
                                        </Text>
                                      </Col>
                                    </Row>

                                    <Row
                                      className="mt-4 winners-row-landing"
                                      style={{
                                        padding: "10px 10px",
                                        marginLeft: "0.5rem",
                                        marginRight: "0.5rem",
                                        border: "1px solid #e0e0e0",
                                      }}
                                    >
                                      <Col
                                        xs="2"
                                        style={{
                                          paddingLeft: "0px",
                                          paddingRight: "0px",
                                        }}
                                      >
                                        <img src={radioIcon} width="40px" />
                                      </Col>
                                      <Col
                                        xs="10"
                                        style={{
                                          paddingLeft: "5px",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        <Title
                                          variant="landing-h3"
                                          className="mb-0"
                                          style={{ fontSize: "14px" }}
                                        >
                                          LIVE ON RADIO
                                        </Title>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          style={{ lineHeight: "18px" }}
                                        >
                                          Interview on Fever 104 FM
                                        </Text>
                                      </Col>
                                    </Row>
                                  </Container>

                                  <Container className="mt-5">
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                    >
                                      Our Approach
                                      <br />
                                      <br />
                                      Learning First!
                                    </Title>
                                    <Text color="#000000">
                                      The best of the mentors and coaches in the
                                      fashion industry are going to hold your
                                      hand and{" "}
                                      <span
                                        style={{
                                          textDecoration: "underline",
                                          color: "#FF0000",
                                          fontWeight: "600",
                                          fontSize: "20px",
                                        }}
                                      >
                                        guide you step by step
                                      </span>{" "}
                                      on acquiring skills that will serve you
                                      for your lifetime! <br />
                                      <br />
                                      Learn the skills that will clear your way
                                      to future success!
                                    </Text>

                                    <Row className="mt-3">
                                      <Col xs="5">
                                        <img
                                          src={confidenceImage}
                                          className="img-fluid"
                                        />
                                      </Col>
                                      <Col xs="7">
                                        <Title
                                          color="#000000"
                                          variant="landing-section-heading"
                                        >
                                          Improve <br />
                                          self-confidence
                                        </Title>
                                      </Col>
                                    </Row>
                                    <Row className="mt-4">
                                      <Col xs="5">
                                        <img
                                          src={beliefImage}
                                          className="img-fluid"
                                        />
                                      </Col>
                                      <Col xs="7">
                                        <Title
                                          color="#000000"
                                          variant="landing-section-heading"
                                        >
                                          Attain self-belief
                                        </Title>
                                      </Col>
                                    </Row>
                                    <Row className="mt-4">
                                      <Col xs="5">
                                        <img
                                          src={speakingImage}
                                          className="img-fluid"
                                        />
                                      </Col>
                                      <Col xs="7">
                                        <Title
                                          color="#000000"
                                          variant="landing-section-heading"
                                        >
                                          Acquire public speaking skills
                                        </Title>
                                      </Col>
                                    </Row>
                                    <Row className="mt-4">
                                      <Col xs="5">
                                        <img
                                          src={groomingImage}
                                          className="img-fluid"
                                        />
                                      </Col>
                                      <Col xs="7">
                                        <Title
                                          color="#000000"
                                          variant="landing-section-heading"
                                        >
                                          Personality grooming & presentation
                                          tips
                                        </Title>
                                      </Col>
                                    </Row>

                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                      className="mt-5"
                                    >
                                      Become a better version of yourself!
                                    </Title>
                                  </Container>

                                  <Container
                                    className="mt-5"
                                    style={{
                                      textAlign: "center",

                                      border: "1px solid #e0e0e0",
                                      padding: "25px 20px 20px 20px",
                                    }}
                                  >
                                    <Title variant="landing-h2" color="#000000">
                                      DON'T WAIT ANYMORE!
                                    </Title>
                                    <Title variant="landing-h3" color="#000000">
                                      <span style={{ fontWeight: "600" }}>
                                        First 1000 Registrants
                                        <br />
                                      </span>{" "}
                                      get <br />
                                      <span
                                        style={{
                                          fontWeight: "600",
                                          fontSize: "20px",
                                        }}
                                      >
                                        FREE WEBINAR
                                        <br />
                                        <br />
                                      </span>
                                      Conducted by Parimal Mehta on “Tricks of
                                      Fashion Industry and getting OMG Ready”
                                    </Title>
                                    <Title variant="landing-h3" color="#000000">
                                      Fee: ₹5,000/-
                                    </Title>
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ fontSize: "24px" }}
                                    >
                                      Early Bird Offer: ₹499/-
                                    </Title>
                                    <Button
                                      size="sm"
                                      className="animated-button1"
                                      id="register-button-1"
                                      // css={`
                                      //   font-size: 1.2rem !important;
                                      //   min-width: 45vw !important;
                                      //   height: 5vh !important;
                                      //   background: #ff0000 !important;
                                      //   border-radius: 0px !important;
                                      //   color: #fff !important;
                                      //   border: 1px solid #dadada !important;
                                      //   box-shadow: 2px 2px 0px #dadada;
                                      //   padding: 0px !important;
                                      // `}
                                      onClick={() => this.executeScroll()}
                                    >
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      REGISTER NOW!
                                    </Button>
                                  </Container>

                                  <Container
                                    className="mt-5 pt-4 pb-4"
                                    style={{
                                      background: "#e2e2e2",
                                      textAlign: "center",
                                    }}
                                  >
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{
                                        fontSize: "24px",
                                      }}
                                    >
                                      That's Not All !
                                    </Title>
                                    <Text
                                      color="#000000"
                                      style={{
                                        textAlign: "center",
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      Your registration{" "}
                                      <span
                                        style={{
                                          color: "red",
                                          fontWeight: "600",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        today
                                      </span>{" "}
                                      makes you eligible for participation in
                                    </Text>
                                    <img
                                      src={imgL1Logo}
                                      alt=""
                                      width="50%"
                                      height="auto"
                                      className="mt-4"
                                      style={{
                                        textAlign: "center",
                                        marginLeft: "auto",
                                      }}
                                    />
                                    <Text
                                      color="#000000"
                                      style={{
                                        textAlign: "center",
                                        fontSize: "20px",
                                        fontWeight: "600",
                                      }}
                                      className="mt-3"
                                    >
                                      A national level platform where you get to
                                      match your skills with people just like
                                      you! And become a{" "}
                                      <span
                                        style={{
                                          fontSize: "20px",
                                          color: "red",
                                          fontWeight: "600",
                                        }}
                                      >
                                        professional model.
                                      </span>
                                    </Text>
                                    <hr />
                                    <Text
                                      color="#000000"
                                      style={{
                                        textAlign: "center",
                                        fontSize: "16px",
                                      }}
                                      className="mt-3"
                                    >
                                      Get an annual Contract as{" "}
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        Social Media Influencer
                                      </span>
                                      <br />
                                      <hr />
                                      Go Live on{" "}
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        Fever 104 FM
                                      </span>
                                      <br />
                                      <hr />
                                      Photoshoot by{" "}
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        Dabboo Ratnani
                                      </span>
                                    </Text>
                                  </Container>

                                  <Container className="mt-5 text-center">
                                    <ReactPlayer
                                      url={rohitVideo + "#t=0.1"}
                                      width="100%"
                                      height="100%"
                                      controls
                                    />
                                  </Container>
                                  <Container className="mt-5 text-center">
                                    <ReactPlayer
                                      url={explainerVideo + "#t=0.1"}
                                      width="100%"
                                      height="100%"
                                      controls
                                    />
                                    <Row className="text-center">
                                      <Col>
                                        <Title
                                          color="#000000"
                                          variant="landing-section-heading"
                                          className="mt-3"
                                          style={{
                                            textDecoration: "underline",
                                            textDecorationColor: "#FF0000",
                                          }}
                                        >
                                          <span style={{ color: "#FF0000" }}>
                                            Renowned industry mentors
                                          </span>{" "}
                                          are going to coach you
                                        </Title>
                                      </Col>
                                    </Row>
                                  </Container>

                                  <Container>
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                      className="mt-4"
                                    >
                                      Jury
                                    </Title>
                                    <Row>
                                      <Col xs="6">
                                        <img
                                          src={dabbooImg}
                                          alt="dabboo-ratnani"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Dabboo Ratnani
                                        </Text>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Celebrity & Fashion Photographer
                                        </Text>
                                      </Col>

                                      <Col xs="6">
                                        <img
                                          src={sureshImg}
                                          alt="rohit-khandelwal"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Suresh Mukund
                                        </Text>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Celebrity Choreographer & Director -
                                          The KINGS
                                        </Text>
                                      </Col>
                                      {/* <Col xs="6">
                                        <img
                                          src={vihbizImg}
                                          alt="rohit-khandelwal"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Vahbiz Mehta
                                        </Text>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Fashion Choreographer
                                        </Text>
                                      </Col> */}
                                      <Col xs="6">
                                        <img
                                          src={sunnyImg}
                                          alt="rohit-khandelwal"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Sunny Kamble
                                        </Text>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Super Model
                                        </Text>
                                      </Col>
                                      <Col xs="6">
                                        <img
                                          src={kavitaImg}
                                          alt="rohit-khandelwal"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Kavita Kharayat
                                        </Text>
                                        <Text
                                          variant="small"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Super Model
                                        </Text>
                                      </Col>
                                    </Row>
                                  </Container>

                                  <Container
                                    style={{
                                      textAlign: "center",
                                    }}
                                    className="mt-5"
                                  >
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ fontSize: "24px" }}
                                    >
                                      There is Even More !!!
                                    </Title>
                                    <Text color="#000000">
                                      The winners of OMGFoY will get a wild card
                                      entry in
                                    </Text>
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      className="mt-2"
                                      style={{ textDecoration: "underline" }}
                                    >
                                      Mr. & Ms. India
                                    </Title>
                                    <img
                                      src={rubaruImg}
                                      alt="rubaru"
                                      className="img-fluid"
                                      width="50%"
                                    />
                                    <Text color="#000000">
                                      And a cash prize of{" "}
                                    </Text>
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      className="mt-2"
                                      style={{ textDecoration: "underline" }}
                                    >
                                      ₹50,000/-
                                    </Title>
                                    <Text color="#000000" className="mt-4">
                                      Runners up will get get cash prizes of{" "}
                                      <span
                                        style={{
                                          fontWeight: "600",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        ₹10,000/-
                                      </span>{" "}
                                      each and lots of gifts
                                    </Text>
                                    <Text color="#000000" className="mt-4">
                                      <span
                                        style={{
                                          fontWeight: "600",
                                          color: "#ff0000",
                                          // textDecoration: "underline",
                                        }}
                                      >
                                        A once in a lifetime opportunity waiting
                                        for you!
                                      </span>
                                      {/* {" "}
                                      grab this lifetime opportunity{" "}
                                      <span
                                        style={{
                                          fontWeight: "600",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        NOW!
                                      </span> */}
                                    </Text>
                                  </Container>

                                  <Container
                                    className="mt-5"
                                    style={{
                                      border: "1px solid rgb(224, 224, 224)",
                                      padding: "25px 20px 20px",
                                    }}
                                  >
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                    >
                                      It’s a chance to showcase your skills….
                                    </Title>
                                    <Text
                                      color="#000000"
                                      style={{
                                        fontWeight: "600",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      We give you a chance to showcase your
                                      skills and get a direct entry into the
                                      fashion & modeling industry.
                                      <br />
                                    </Text>
                                    <Row className="mt-3">
                                      <Col xs="3">
                                        <img
                                          src={queueImage}
                                          className="img-fluid"
                                          style={{
                                            background: "#e2e2e2",
                                            padding: "5px",
                                          }}
                                        />
                                      </Col>
                                      <Col xs="9">
                                        <Text color="#000">
                                          No standing in long audition queues
                                        </Text>
                                      </Col>
                                    </Row>
                                    <Row className="mt-3">
                                      <Col xs="3">
                                        <img
                                          src={photoshootImage}
                                          className="img-fluid"
                                          style={{
                                            background: "#e2e2e2",
                                            padding: "5px",
                                          }}
                                        />
                                      </Col>
                                      <Col xs="9">
                                        <Text color="#000">
                                          No need for expensive portfolios
                                        </Text>
                                      </Col>
                                    </Row>
                                    <Row className="mt-3">
                                      <Col xs="3">
                                        <img
                                          src={producerImage}
                                          className="img-fluid"
                                          style={{
                                            background: "#e2e2e2",
                                            padding: "5px",
                                          }}
                                        />
                                      </Col>
                                      <Col xs="9">
                                        <Text color="#000">
                                          No going door to door in front of
                                          producers
                                        </Text>
                                      </Col>
                                    </Row>
                                  </Container>

                                  <Container
                                    style={{
                                      textAlign: "center",
                                      background: "#e2e2e2",
                                    }}
                                    className="mt-5 pt-4 pb-4"
                                  >
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                    >
                                      It's your entry ticket to fashion &
                                      modelling industry
                                    </Title>

                                    <Text color="#000000">
                                      Apply all your learning! <br />
                                      Challenge Yourself! <br />
                                      Make your own destiny!
                                      <br />
                                      <br />
                                    </Text>
                                    <Title variant="landing-h3" color="#000000">
                                      Our Guidance + Your Dedication ={" "}
                                      <span style={{ fontWeight: "600" }}>
                                        Success
                                      </span>
                                    </Title>
                                  </Container>

                                  <Container
                                    style={{
                                      textAlign: "center",
                                      background: "#e2e2e2",
                                    }}
                                    className="mt-5 pt-4 pb-4"
                                  >
                                    <Title variant="landing-h3" color="#000000">
                                      Fee: ₹5,000/-
                                    </Title>
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ fontSize: "24px" }}
                                    >
                                      Special Offer: ₹499/-
                                    </Title>
                                    <ReactCountdown
                                      date={this.state.registerCountdown}
                                      renderer={registerRenderer}
                                      zeroPadTime={2}
                                    />

                                    <Title variant="landing-h2" color="#000000">
                                      It's now or never!
                                    </Title>
                                    <Button
                                      size="sm"
                                      className="animated-button1"
                                      id="register-button-2"
                                      // css={`
                                      //   font-size: 1.2rem !important;
                                      //   min-width: 45vw !important;
                                      //   height: 5vh !important;
                                      //   background: #ff0000 !important;
                                      //   border-radius: 0px !important;
                                      //   color: #fff !important;
                                      //   border: 1px solid #dadada !important;
                                      //   box-shadow: 2px 2px 0px #dadada;
                                      //   padding: 0px !important;
                                      // `}
                                      onClick={() => this.executeScroll()}
                                    >
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      REGISTER NOW!
                                    </Button>
                                  </Container>

                                  <Container
                                    className="mt-5"
                                    style={{ textAlign: "center" }}
                                  >
                                    <ReactPlayer
                                      url={testimonialVideo + "#t=0.1"}
                                      width="100%"
                                      height="100%"
                                      controls
                                    />

                                    <Text
                                      color="#000000"
                                      style={{ textAlign: "left" }}
                                      className="mt-3"
                                    >
                                      <Row>
                                        <Col xs="1">
                                          <BsQuestionCircleFill
                                            style={{ color: "#FF0000" }}
                                          />
                                        </Col>
                                        <Col xs="10">
                                          Are you confused about your future?
                                        </Col>
                                      </Row>
                                      <br />
                                      <Row>
                                        <Col xs="1">
                                          <BsQuestionCircleFill
                                            style={{ color: "#FF0000" }}
                                          />
                                        </Col>
                                        <Col xs="10">
                                          You have a dream but don’t have the
                                          skill set?
                                        </Col>
                                      </Row>
                                      <br />

                                      <Row>
                                        <Col xs="1">
                                          <BsQuestionCircleFill
                                            style={{ color: "#FF0000" }}
                                          />
                                        </Col>
                                        <Col xs="10">
                                          You don’t have anyone to guide you?
                                        </Col>
                                      </Row>
                                      <br />

                                      <Row>
                                        <Col xs="1">
                                          <BsQuestionCircleFill
                                            style={{ color: "#FF0000" }}
                                          />
                                        </Col>
                                        <Col xs="10">
                                          You want to achieve something bigger
                                          in life?
                                        </Col>
                                      </Row>
                                      <br />

                                      <Row>
                                        <Col xs="1">
                                          <BsQuestionCircleFill
                                            style={{ color: "#FF0000" }}
                                          />
                                        </Col>
                                        <Col xs="10">
                                          You want to prove yourself to the
                                          world?
                                        </Col>
                                      </Row>
                                      <br />
                                    </Text>
                                    <Text color="#000000">
                                      If the answer to any of the above question
                                      is <br />
                                      <br />
                                      <span
                                        style={{
                                          fontWeight: "600",
                                          fontSize: "25px",
                                          textDecoration: "underline",
                                          opacity: "1",
                                        }}
                                      >
                                        YES
                                      </span>
                                      <br />
                                      <br />
                                      You have an opportunity right in front of
                                      you!
                                    </Text>
                                  </Container>

                                  <Container
                                    style={{
                                      textAlign: "center",
                                      background: "#e2e2e2",
                                    }}
                                    className="mt-5 pt-4 pb-4"
                                  >
                                    <Title variant="landing-h2" color="#000000">
                                      “There will never be a perfect time to
                                      start working on your dreams, start NOW!”
                                    </Title>
                                    {/* <Text color="#000000">
                                      See what other participants have to say:
                                    </Text> */}
                                    <Title variant="landing-h3" color="#000000">
                                      Fee: ₹5,000/-
                                    </Title>
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ fontSize: "24px" }}
                                    >
                                      Special Offer: ₹499/-
                                    </Title>
                                    <ReactCountdown
                                      date={this.state.registerCountdown}
                                      renderer={registerRenderer}
                                      zeroPadTime={2}
                                    />

                                    <Title variant="landing-h2" color="#000000">
                                      Listen to your heart!
                                    </Title>
                                    <Button
                                      size="sm"
                                      className="animated-button1"
                                      id="register-button-3"
                                      // css={`
                                      //   font-size: 1.2rem !important;
                                      //   min-width: 45vw !important;
                                      //   height: 5vh !important;
                                      //   background: #ff0000 !important;
                                      //   border-radius: 0px !important;
                                      //   color: #fff !important;
                                      //   border: 1px solid #dadada !important;
                                      //   box-shadow: 2px 2px 0px #dadada;
                                      //   padding: 0px !important;
                                      // `}
                                      onClick={() => this.executeScroll()}
                                    >
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      REGISTER NOW!
                                    </Button>
                                  </Container>

                                  <Container
                                    style={{ textAlign: "center" }}
                                    className="mt-5"
                                  >
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ fontWeight: "600" }}
                                    >
                                      What will you gain during the process?
                                    </Title>
                                    <hr />
                                    <Title
                                      variant="landing-h3"
                                      color="#000000"
                                      style={{ fontWeight: "600" }}
                                    >
                                      Name & Fame
                                    </Title>
                                    <hr />
                                    <Title
                                      variant="landing-h3"
                                      color="#000000"
                                      style={{ fontWeight: "600" }}
                                    >
                                      Money
                                    </Title>
                                    <hr />
                                    <Title
                                      variant="landing-h3"
                                      color="#000000"
                                      style={{ fontWeight: "600" }}
                                    >
                                      A Bright Career
                                    </Title>
                                    <hr />
                                    <Title
                                      variant="landing-h3"
                                      color="#000000"
                                      style={{ fontWeight: "600" }}
                                    >
                                      Recognition
                                    </Title>
                                    <hr />
                                    <Title
                                      variant="landing-h3"
                                      color="#000000"
                                      style={{ fontWeight: "600" }}
                                    >
                                      Skill set for success in life
                                    </Title>
                                    <hr />
                                  </Container>

                                  <Container>
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                      className="mt-5"
                                    >
                                      Official Partners
                                    </Title>
                                    <SliderStyled {...slickSettings}>
                                      <Box
                                        css={`
                                          &:focus {
                                            outline: none;
                                          }
                                          padding-left: 10px;
                                          padding-right: 10px;
                                          position: relative;
                                        `}
                                      >
                                        <img
                                          src={skinWorksImg}
                                          alt="skin-works"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Powered By
                                        </Text>
                                      </Box>
                                      <Box
                                        css={`
                                          &:focus {
                                            outline: none;
                                          }
                                          padding-left: 10px;
                                          padding-right: 10px;
                                          position: relative;
                                        `}
                                      >
                                        <img
                                          src={rubaruImg}
                                          alt="rubaru"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Pageant Partner
                                        </Text>
                                      </Box>
                                      <Box
                                        css={`
                                          &:focus {
                                            outline: none;
                                          }
                                          padding-left: 10px;
                                          padding-right: 10px;
                                          position: relative;
                                        `}
                                      >
                                        <img
                                          src={feverImg}
                                          alt="fever-fm"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Radio Partner
                                        </Text>
                                      </Box>

                                      <Box
                                        css={`
                                          &:focus {
                                            outline: none;
                                          }
                                          padding-left: 10px;
                                          padding-right: 10px;
                                          position: relative;
                                        `}
                                      >
                                        <img
                                          src={eipimediaImg}
                                          alt="eipimedia"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Influencer Partner
                                        </Text>
                                      </Box>

                                      <Box
                                        css={`
                                          &:focus {
                                            outline: none;
                                          }
                                          padding-left: 10px;
                                          padding-right: 10px;
                                          position: relative;
                                        `}
                                      >
                                        <img
                                          src={buycepsImg}
                                          alt="buyceps"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Fitness Partner
                                        </Text>
                                      </Box>

                                      <Box
                                        css={`
                                          &:focus {
                                            outline: none;
                                          }
                                          padding-left: 10px;
                                          padding-right: 10px;
                                          position: relative;
                                        `}
                                      >
                                        <img
                                          src={blanckanvasImg}
                                          alt="blanckanvas"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Grooming Partner
                                        </Text>
                                      </Box>

                                      <Box
                                        css={`
                                          &:focus {
                                            outline: none;
                                          }
                                          padding-left: 10px;
                                          padding-right: 10px;
                                          position: relative;
                                        `}
                                      >
                                        <img
                                          src={horraImg}
                                          alt="horra"
                                          className="img-fluid"
                                          style={{ padding: "0.5rem" }}
                                        />
                                        <Text
                                          variant="bold"
                                          color="#000000"
                                          className="text-center"
                                        >
                                          Style Partner
                                        </Text>
                                      </Box>
                                    </SliderStyled>
                                  </Container>

                                  <Container className="mt-5">
                                    <Title
                                      variant="landing-h2"
                                      color="#000000"
                                      style={{ textAlign: "center" }}
                                    >
                                      FAQs
                                    </Title>
                                    <Accordion allowZeroExpanded={true}>
                                      <AccordionItem
                                        style={{ paddingBottom: "20px" }}
                                        uuid={1}
                                      >
                                        <AccordionItemHeading>
                                          <AccordionItemButton className="landing-page-accordion">
                                            <strong>
                                              I don’t think I am good looking,
                                              can I do this?
                                            </strong>
                                          </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                          Most of the times this feeling that ‘I
                                          am not good looking’ is the result of
                                          lack of self-confidence and that is
                                          exactly what you are going to work
                                          upon through this platform. Our
                                          mentors are going to teach you how to
                                          gain self-confidence.
                                          <br />
                                          <br />
                                          Moreover, it is not just a model hunt.
                                          You are going to gain insane amount of
                                          knowledge and unique set of skills
                                          like – overcoming self-doubt, build
                                          self-confidence, how to speak in front
                                          of people and many such skills that
                                          will help you to move forward and
                                          achieve success in whatever you do in
                                          your life.
                                        </AccordionItemPanel>
                                      </AccordionItem>

                                      <AccordionItem
                                        style={{ paddingBottom: "20px" }}
                                        uuid={2}
                                      >
                                        <AccordionItemHeading>
                                          <AccordionItemButton className="landing-page-accordion">
                                            <strong>
                                              I am from a small town, how will I
                                              participate in this?
                                            </strong>
                                          </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                          Best of the talent come from small
                                          towns of India. Moreover, this entire
                                          activity will be online so anyone from
                                          any part of India can participate in
                                          this. All the coaching and activities
                                          will be online. So all you need is a
                                          smart phone, an internet connection
                                          and your determination to succeed.
                                        </AccordionItemPanel>
                                      </AccordionItem>

                                      <AccordionItem
                                        style={{ paddingBottom: "20px" }}
                                        uuid={3}
                                      >
                                        <AccordionItemHeading>
                                          <AccordionItemButton className="landing-page-accordion">
                                            <strong>
                                              I have a small house, how will I
                                              shoot my video or photos?
                                            </strong>
                                          </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                          The size of your house doesn’t matter.
                                          The size of your dreams does! Our jury
                                          will judge you based on your talent,
                                          determination and zeal to succeed. If
                                          you have that, then all you need more
                                          is a smart phone, internet and some
                                          creativity. Don’t overthink it. Take
                                          your first step towards success now.
                                        </AccordionItemPanel>
                                      </AccordionItem>
                                    </Accordion>

                                    <Container style={{ textAlign: "center" }}>
                                      <ReactCountdown
                                        date={this.state.registerCountdown}
                                        renderer={registerRenderer}
                                        zeroPadTime={2}
                                      />
                                      <Button
                                        size="sm"
                                        className="animated-button1"
                                        id="register-button-4"
                                        // css={`
                                        //   font-size: 1.2rem !important;
                                        //   min-width: 45vw !important;
                                        //   height: 5vh !important;
                                        //   background: #ff0000 !important;
                                        //   border-radius: 0px !important;
                                        //   color: #fff !important;
                                        //   border: 1px solid #dadada !important;
                                        //   box-shadow: 2px 2px 0px #dadada;
                                        //   padding: 0px !important;
                                        // `}
                                        onClick={() => this.executeScroll()}
                                      >
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        REGISTER NOW!
                                      </Button>
                                    </Container>
                                  </Container>
                                </>
                              )}
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
