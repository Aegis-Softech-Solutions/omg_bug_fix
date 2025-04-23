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
import oraneImg from "../../assets/image/homepage/sponsors/orane.png";

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
                    Title Partners - Horra
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
                      src={oraneImg}
                      alt="orane"
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
                      About Orane
                    </Text>
                    <br />
                    <Text color="#000000">
                      Envisioning the global trends of demand and supply of
                      trained beauty professionals, Orane International was
                      incorporated in the year 2009 in Ontario. The visionary
                      leaders travelled to various countries studying global
                      trends such as demographic profiling & market demand of
                      Beauty & Wellness domain. They zeroed in on India as the
                      first country to invest in as there was a massive dearth
                      of (beauty) skilled manpower, lack of formal skill
                      education in the country and the young population metrics
                      of this nation held their attention for setting up
                      startup-boost.
                    </Text>
                    <br />
                    <a href="https://orane.com/" target="_blank">
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
