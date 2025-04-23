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
import blanckanvasImg from "../../assets/image/homepage/sponsors/blanckanvas-updated.jpg";

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
                      src={blanckanvasImg}
                      alt="blanckanvas"
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
                      About Blanckanvas Edu
                    </Text>
                    <br />
                    <Text color="#000000" className="mb-4">
                      Founded by Parimal Mehhta & Rohit Reddy in 2019,
                      Blanckanvas Media is a fully integrated company in the
                      media, entertainment and marketing domain. We are
                      dedicated to providing 360-degree solutions for events &
                      planning, entertainment, digital marketing and talent
                      management. At Blanckanvas, we craft epic experiences.
                    </Text>
                    <br />

                    {/* <a
                      href="https://www.Blanckanvas.com/"
                      target="_blank"
                    >
                      <Text
                        color="#000000"
                        style={{ textDecoration: "underline" }}
                      >
                        Visit Website
                      </Text>
                    </a> */}
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
