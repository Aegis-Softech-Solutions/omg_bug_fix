import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

import { Box, Text } from "../../components/Core";
import { device } from "../../utils";

import aboutUsBanner from "../../assets/image/homepage/about-us.jpg";

import cashIcon from "../../assets/image/icons/cash.png";
import cashIcon2 from "../../assets/image/icons/cash2.png";
import crownIcon from "../../assets/image/icons/crown.png";
import influencerIcon from "../../assets/image/icons/influencer.png";
import radioIcon from "../../assets/image/icons/radio.png";

const TitleContainer = styled(Box)`
  position: relative;
  padding-left: 0.5rem;
  &:after {
    content: "";
    height: 1px;
    position: absolute;
    right: 0;
    top: 50%;
    width: 32%;
    background: ${({ theme }) => theme.colors.border};
    margin-top: 0.5px;
    display: none;

    @media ${device.md} {
      width: 40%;
      display: block;
    }
    @media ${device.lg} {
      width: 52%;
    }
    @media ${device.xl} {
      width: 60%;
    }
  }
`;

const AboutUs = () => {
  return (
    <>
      <Box
        pb={"60px"}
        pt={"10px"}
        mt={"-5px"}
        style={{ background: "#ffffff" }}
      >
        <Container>
          <TitleContainer mb={"10px"}>
            <Text fontSize="18px" as="h4" className="" variant="custom-title">
              WINNER REWARDS
            </Text>
          </TitleContainer>
        </Container>
        <Container>
          <Row
            className="mt-4 winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <Col xs="2" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
              <img src={cashIcon2} width="40px" style={{ marginTop: "10px" }} />
            </Col>
            <Col xs="10" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              <Text
                as="h6"
                className=""
                variant="custom-title"
                style={{ fontSize: "14px" }}
              >
                CASH PRIZES
              </Text>
              <Text
                variant="small"
                color="#000000"
                style={{ lineHeight: "18px" }}
              >
                <strong>₹50,000</strong> for Winners
                <br />
                <strong>₹10,000</strong> for Finalists
              </Text>
            </Col>
          </Row>
          <Row
            className="mt-3 winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <Col xs="2" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
              <img src={crownIcon} height="40px" />
            </Col>
            <Col xs="10" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              <Text
                as="h6"
                className=""
                variant="custom-title"
                style={{ fontSize: "14px" }}
              >
                WILD CARD ENTRY
              </Text>
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
            className="mt-3 winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <Col xs="2" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
              <img src={influencerIcon} height="40px" />
            </Col>
            <Col xs="10" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              <Text
                as="h6"
                className=""
                variant="custom-title"
                style={{ fontSize: "14px" }}
              >
                ANNUAL CONTRACT
              </Text>
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
            className="mt-3 winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <Col xs="2" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
              <img src={radioIcon} height="40px" />
            </Col>
            <Col xs="10" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              <Text
                as="h6"
                className=""
                variant="custom-title"
                style={{ fontSize: "14px" }}
              >
                LIVE ON RADIO
              </Text>
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
        <Container className="mt-3">
          <Link href="/registration">
            <a>
              <Text
                variant="more-link"
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
              >
                register
              </Text>
            </a>
          </Link>
        </Container>
      </Box>
    </>
  );
};

export default AboutUs;
