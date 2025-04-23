import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { breakpoints } from "../../utils";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";
// import horraImg from "../../assets/image/homepage/sponsors/horra.jpg";
import skinWorksImg from "../../assets/image/homepage/sponsors/skin-works-page.jpg";

class Partners extends Component {
  render() {
    return (
      <Section pb={"30px"} pt={"40px"}>
        <Box
          // mb={"40px"}
          // mt={"40px"}
          pb={"30px"}
          pt={"40px"}
          pl={"10px"}
          pr={"10px"}
        >
          <>
            <Container>
              <Row className="text-center">
                {/* <Col xs="12">
                  <Text variant="card-title" color="#000000" className="mb-4">
                    Powered By - Skin Works
                  </Text>
                </Col> */}
                <Col xs="12">
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
                      alt="skinworks"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                  </Box>
                </Col>

                <Col
                  xs="12"
                  style={{
                    paddingTop: "10px",
                    textAlign: "left",
                  }}
                >
                  <Box
                    style={{
                      marginLeft: "10px",
                      marginRight: "10px",
                      padding: "0.5rem",
                    }}
                  >
                    <Text color="#000000" variant="bold">
                      About SkinWorks Clinc
                    </Text>
                    <br />
                    <Text color="#000000" className="mb-4">
                      A place which offers comprehensive and holistic solution
                      to all Dermatology and Cosmetology related conditions. We
                      specialize in different laser treatments from skin
                      rejuvenation to non surgical application for scars,
                      tattoos, freckles, wrinkles, moles, acne and hair removal.
                      If you are looking for a solution for your skin problems,
                      well you need look no further.
                    </Text>
                    <Text color="#000000" className="mb-4">
                      The Clinic is committed to offer quality care in a very
                      warm & friendly environment. We are committed to help you
                      achieve a rejuvenated and refreshed look with our
                      knowledge, experience and skill. Our philosophy is simple,
                      we believe in putting our patient’s first & strive hard to
                      accommodate every individual’s requirements and needs. Our
                      aim lies in offering the highest quality service in a
                      comfortable environment.
                    </Text>
                    <Text color="#000000" className="mb-4">
                      <strong>Available Specialized Treatment</strong>
                      <ul style={{ paddingLeft: "20px" }}>
                        <li style={{ listStyleType: "disc" }}>
                          Skin Lightening & Rejuvenation
                        </li>
                        <li style={{ listStyleType: "disc" }}>
                          Laser Hair Reduction
                        </li>
                        <li style={{ listStyleType: "disc" }}>
                          Ageing Solutions
                        </li>
                        <li style={{ listStyleType: "disc" }}>
                          Acne & Scar treatments
                        </li>
                        <li style={{ listStyleType: "disc" }}>
                          Hair loss & Re-growth treatment
                        </li>
                      </ul>
                    </Text>
                    <br />

                    <a
                      href="http://www.skinworks.co.in/index.aspx"
                      target="_blank"
                    >
                      <Text
                        color="#000000"
                        style={{ textDecoration: "underline" }}
                      >
                        Visit Website
                      </Text>
                    </a>
                  </Box>
                </Col>
              </Row>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default Partners;
