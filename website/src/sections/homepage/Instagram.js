import React, { useState, Component } from "react";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

import { Box, Text } from "../../components/Core";
import { device } from "../../utils";

import Feed from "react-instagram-authless-feed";

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

class Instagram extends Component {
  render() {
    return (
      <>
        <Box
          pb={"20px"}
          pt={"30px"}
          style={{ background: "#ffffff" }}
          mt={"-5px"}
        >
          <Container>
            <TitleContainer mb={"20px"}>
              <Text fontSize="18px" as="h4" className="" variant="custom-title">
                Instagram
              </Text>
              <a href="https://www.instagram.com/omg.foy/" target="_blank">
                <Text
                  style={{ paddingTop: "12px" }}
                  variant="bold"
                  color="#000000"
                >
                  @omg.foy
                </Text>
              </a>
            </TitleContainer>
          </Container>
          <Container
            className="text-center"
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            <a href="https://www.instagram.com/omg.foy/" target="_blank">
              <Feed
                userName="omg.foy"
                className="Feed"
                classNameLoading="Loading"
              />
              {/* <Row style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
                {this.props.instagramPosts.map((post, index) => (
                  <Col
                    xs="4"
                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                    key={index}
                  >
                    <img
                      src={post.thumbnail}
                      width="100%"
                      style={{ padding: "3px" }}
                    />
                  </Col>
                ))}
              </Row> */}
            </a>
          </Container>
        </Box>
        <Box></Box>
      </>
    );
  }
}

export default Instagram;
