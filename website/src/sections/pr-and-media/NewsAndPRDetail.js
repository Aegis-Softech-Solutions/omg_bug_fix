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

class NewsAndPRDetail extends Component {
  render() {
    return (
      <Section pb={"30px"} style={{ minHeight: "85vh" }}>
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
                <Col xs="12">
                  <Text variant="card-title" color="#000000" className="mb-4">
                    {this.props.newsBySlug && this.props.newsBySlug.newsBySlug
                      ? this.props.newsBySlug.newsBySlug.title
                      : ""}
                  </Text>
                </Col>
              </Row>
            </Container>
            <Container>
              <Row style={{ marginRight: "0px", marginLeft: "0px" }}>
                {this.props.newsBySlug && this.props.newsBySlug.newsBySlug ? (
                  <>
                    <Col xs="12" style={{ padding: "0.5rem", height: "60vh" }}>
                      <div style={{ height: "100%" }}>
                        {this.props.newsBySlug.newsBySlug.media_type ===
                        "video" ? (
                          <ReactPlayer
                            url={
                              process.env.REACT_APP_IMAGE_URL +
                              process.env.REACT_APP_MISC_URL +
                              this.props.newsBySlug.newsBySlug.featured_image
                            }
                            width="100%"
                            height="100%"
                            controls
                            muted
                            playing={true}
                            style={{ background: "black" }}
                          />
                        ) : (
                          <div
                            // className="profile-page-image"
                            style={{
                              backgroundImage: this.props.newsBySlug.newsBySlug
                                .featured_image
                                ? "url(" +
                                  process.env.REACT_APP_IMAGE_URL +
                                  process.env.REACT_APP_MISC_URL +
                                  this.props.newsBySlug.newsBySlug
                                    .featured_image +
                                  ")"
                                : placeholder,

                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              height: "100%",
                              width: "100%",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                    <Col xs="12">
                      <Text variant="small" color="#000000" className="pt-2">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: this.props.newsBySlug.newsBySlug
                              .html_content,
                          }}
                        ></div>
                      </Text>
                    </Col>
                  </>
                ) : (
                  <Text>Incorrect Path</Text>
                )}
              </Row>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default NewsAndPRDetail;
