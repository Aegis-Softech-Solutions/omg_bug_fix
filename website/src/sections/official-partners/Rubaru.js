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
import rubaruImg from "../../assets/image/homepage/sponsors/rubaru.jpg";

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
                    Powered By - Rubaru
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
                      src={rubaruImg}
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
                      About Rubaru Group
                    </Text>
                    <br />
                    <Text color="#000000" className="mb-4">
                      Founded in the year 2004 in the north Indian state of
                      Haryana, Rubaru Group is a talent promoting agency,
                      pageant organization, and NGO. The organization focuses on
                      various social causes like women's empowerment and the
                      importance of education and creates awareness on sensitive
                      issues like domestic violence, human trafficking, female
                      infanticide, and female foeticide.
                    </Text>
                    <Text color="#000000" className="mb-4">
                      Rubaru Group also serves as the parent organization to
                      seven beauty pageants and modeling competitions in India.
                      It is the producer of Rubaru Mr. India competition (est.
                      in 2004), Rubaru Miss India Elite competition (est. in
                      2004), Rubaru Mr. & Miss Junior India competition (est. in
                      2004), Miss Supermodel Worldwide competition (est. in
                      2018), Mister Model Worldwide competition (est. in 2018),
                      Rubaru Mrs.India (est. in 2019) and Mrs. Supermodel
                      Worldwide competition (est. in 2019).
                    </Text>
                    <br />

                    <a href="http://rubarugroup.in/" target="_blank">
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
