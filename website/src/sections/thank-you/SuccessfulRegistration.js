import React, { Component } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
} from "../../components/Core";

import shareIcon from "../../assets/image/icons/share.png";
import facebookIcon from "../../assets/image/icons/facebook.png";
import twitterIcon from "../../assets/image/icons/twitter.png";
import whatsappIcon from "../../assets/image/icons/whatsapp.png";
import linkIcon from "../../assets/image/icons/link.png";
import likeIcon from "../../assets/image/icons/like.png";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const FormStyled = styled.form``;

class SuccessfulRegistration extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>
        <Section pb={"30px"} style={{ minHeight: "90vh" }}>
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
            <Container>
              <Title variant="card" mb="40px" style={{ textAlign: "center" }}>
                Registration{" "}
                {this.props.orderId ? "Successful!" : "Under Process."}
              </Title>
              <Text variant="regular" mb="30px" style={{ textAlign: "center" }}>
                Thank you for registering with OMG - Face Of The Year 2025. Your
                payment has been successfully received.
                <br />
                <br />
                {this.props.orderId
                  ? "Get set to create your profile!"
                  : "The payment is being processed. Please check your inbox for a confirmation email or reach out to us for support."}
                <br />
                <br />
              </Text>
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
              <Row className="mt-5">
                <Col xs="4" className="text-center">
                  <FacebookShareButton
                    url={process.env.CLIENT_URL + "fashion-hunt"}
                  >
                    <img src={facebookIcon} />
                  </FacebookShareButton>
                </Col>

                <Col xs="4" className="text-center">
                  <WhatsappShareButton
                    url={process.env.CLIENT_URL + "fashion-hunt"}
                  >
                    <img src={whatsappIcon} />
                  </WhatsappShareButton>
                </Col>

                <Col xs="4" className="text-center">
                  <TwitterShareButton
                    url={process.env.CLIENT_URL + "fashion-hunt"}
                  >
                    <img src={twitterIcon} />
                  </TwitterShareButton>
                </Col>
              </Row>
            </Container>
          </Box>
        </Section>
      </>
    );
  }
}

export default SuccessfulRegistration;
