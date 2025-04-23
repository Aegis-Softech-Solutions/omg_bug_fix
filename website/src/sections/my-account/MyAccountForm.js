import React, { Component } from "react";
import Router from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import OtpInput from "react-otp-input";

import { destroyCookie } from "nookies";

import registrationBackground from "../../assets/image/registration/background.jpg";
import rightArrowIcon from "../../assets/image/icons/right-arrow.png";

import { toast } from "react-nextjs-toast";

import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
} from "../../components/Core";

import { Mutation } from "react-apollo";
import { EDIT_CUSTOMER_DETAILS } from "./queries.js";

const FormStyled = styled.form``;

class MyAccountForm extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  editCustomer = (e, editCustomerMutation) => {
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
    } else {
      editCustomerMutation({
        variables: {
          full_name: this.state.full_name,
          email: this.state.email,
          phone: parseInt(this.state.phone, 10),
        },
      })
        .then((results) => {
          if (Object.values(results.data)[0]) {
            this.setState({
              disableForm: true,
              formMessage: "",
            });
            toast.notify("", {
              duration: 5,
              type: "success",
              position: "top-right",
              title: "Saved successfully",
            });
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({
            formMessage: Object.values(error)[0][0].message,
          });
        });
    }
  };

  onChangeName = (e) => {
    this.setState({ full_name: e.target.value });
  };

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  onChangePhone = (e) => {
    this.setState({ phone: e.target.value });
  };

  logOutUser = () => {
    destroyCookie(null, "token");
    setTimeout(function () {
      Router.push({
        pathname: "/login",
      });
    }, 1000);
  };

  constructor(props) {
    super(props);
    this.state = {
      full_name: props.customerDetails.full_name,
      email: props.customerDetails.email,
      phone: props.customerDetails.phone + "",
      formMessage: "",
      disableForm: true,
    };
  }

  render() {
    return (
      <Mutation mutation={EDIT_CUSTOMER_DETAILS}>
        {(editCustomerMutation, { data, loading, error }) => (
          <Section
            pb={"30px"}
            style={{
              backgroundImage: "url(" + registrationBackground + ")",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "100vh",
            }}
          >
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
              <>
                <Container>
                  <Text variant="bold" color="#FFFFFF">
                    Hey!
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
                            onChange={(e) => this.onChangeName(e)}
                            disabled={this.state.disableForm}
                            value={this.state.full_name}
                          />
                        </Box>
                        <Box mb={3}>
                          <Input
                            type="text"
                            placeholder="Email"
                            isRequired={true}
                            onChange={(e) => this.onChangeEmail(e)}
                            disabled={this.state.disableForm}
                            value={this.state.email}
                          />
                        </Box>
                        <Box mb={3}>
                          <Input
                            type="number"
                            width="90%"
                            value={this.state.phone}
                            style={{ display: "inline-block" }}
                            placeholder="Mobile Number"
                            isRequired={true}
                            isMobileNumber={true}
                            onChange={(e) => this.onChangePhone(e)}
                            disabled={this.state.disableForm}
                          />
                        </Box>

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

                        <Row>
                          <Col xs="6">
                            {this.state.disableForm ? (
                              <Text
                                mb={3}
                                mt={3}
                                variant="small"
                                color="#FFFFFF"
                                onClick={(e) =>
                                  this.setState({ disableForm: false })
                                }
                              >
                                Edit
                              </Text>
                            ) : (
                              <Text
                                mb={3}
                                mt={3}
                                variant="small"
                                color="#FFFFFF"
                                onClick={(e) =>
                                  this.editCustomer(e, editCustomerMutation)
                                }
                              >
                                Save
                              </Text>
                            )}
                          </Col>
                          <Col xs="6">
                            <Text
                              mb={3}
                              mt={3}
                              variant="small"
                              color="#F00"
                              style={{ textAlign: "right" }}
                              onClick={this.logOutUser}
                            >
                              Logout
                            </Text>
                          </Col>
                          <Row></Row>
                        </Row>
                      </FormStyled>
                    </Col>
                  </Row>
                </Container>
              </>
            </Box>
          </Section>
        )}
      </Mutation>
    );
  }
}

export default MyAccountForm;
