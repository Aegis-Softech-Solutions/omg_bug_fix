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
import topupImg from "../../assets/image/homepage/sponsors/topup.png";

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
                      src={topupImg}
                      alt="topup"
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
                      About TopUp
                    </Text>
                    <br />
                    <Text color="#000000">
                      At the core of TopUp's existence, lies the innate need to
                      deliver world-class healthcare products that ignite a
                      spark of hope – a hope of a new tomorrow. A new tomorrow
                      brings an underlying promise of good health and happiness
                      for all. Keeping hope, health, and happiness in the centre
                      of the universe, TopUp has a modest but quality line up
                      wellness products that helps thousands everyday.
                    </Text>
                    <br />
                    <a href="https://topupnutrition.com/" target="_blank">
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
