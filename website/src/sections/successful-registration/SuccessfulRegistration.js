import React, { Component } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import Router from "next/router";

import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
} from "../../components/Core";

const FormStyled = styled.form``;

class SuccessfulRegistration extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { orderId, freeRegistration } = Router.query || this.props;
    const isSuccessful = orderId || freeRegistration;

    return (
      <>
        <Section pb={"30px"} style={{ minHeight: "90vh" }}>
          <Box
            mt={"40px"}
            mr={"20px"}
            ml={"20px"}
            pb={"30px"}
            pt={"30px"}
            pl={"10px"}
            pr={"10px"}
          >
            <Container>
              <Title variant="card" mb="40px" style={{ textAlign: "center" }}>
                Registration {isSuccessful ? "Successful!" : "Under Process."}
              </Title>
              <Text variant="regular" mb="30px" style={{ textAlign: "center" }}>
                Thank you for registering with OMG - Face Of The Year 2025.
                <br />
                <br />
                {isSuccessful
                  ? "Get set to create your profile!"
                  : "The payment is being processed. Please check your inbox for a confirmation email or reach out to us for support."}
                <br />
                <br />
              </Text>
              {isSuccessful && (
                <Row className="text-center">
                  <Col xs={12}>
                    <Link href="/profile-form">
                      <a>
                        <Button
                          width="100%"
                          type="submit"
                          variant="custom"
                          borderRadius={10}
                        >
                          Create Profile
                        </Button>
                      </a>
                    </Link>
                  </Col>
                </Row>
              )}
            </Container>
          </Box>
        </Section>
      </>
    );
  }
}

export default SuccessfulRegistration;
