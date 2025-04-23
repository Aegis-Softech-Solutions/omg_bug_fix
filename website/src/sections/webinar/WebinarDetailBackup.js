import React, { Component } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";
import { DiscussionEmbed } from "disqus-react";

class WebinarDetail extends Component {
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
                  <Text
                    variant="card-title"
                    color="#000000"
                    className="mb-4"
                    style={{ lineHeight: "30px" }}
                  >
                    {this.props.activeWebinars &&
                    this.props.activeWebinars.activeWebinars &&
                    this.props.activeWebinars.activeWebinars.length > 0
                      ? this.props.activeWebinars.activeWebinars[0].title
                      : ""}
                  </Text>
                </Col>
              </Row>
            </Container>

            <Container>
              <Row style={{ marginRight: "0px", marginLeft: "0px" }}>
                {this.props.activeWebinars &&
                this.props.activeWebinars.activeWebinars &&
                this.props.activeWebinars.activeWebinars.length > 0 ? (
                  <>
                    <Col xs="12" style={{ padding: "0.5rem" }}>
                      <div style={{ height: "100%" }}>
                        <iframe
                          src={this.props.activeWebinars.activeWebinars[0].link}
                          frameborder="0"
                          webkitallowfullscreen="true"
                          mozallowfullscreen="true"
                          allowFullScreen
                          style={{ border: "none", minHeight: "300px" }}
                        ></iframe>
                      </div>
                    </Col>

                    <Col
                      xs="12"
                      style={{
                        padding: "0.5rem",
                        textAlign: "center",
                        marginBottom: "2rem",
                      }}
                    >
                      <Link href="/webinar-archive">
                        <a>
                          <Button
                            width="100%"
                            type="submit"
                            variant="custom"
                            borderRadius={10}
                          >
                            View Past Webinars
                          </Button>
                        </a>
                      </Link>
                    </Col>

                    <Col xs="12">
                      <DiscussionEmbed
                        shortname="omgfaceoftheyear"
                        config={{
                          url: "https://omgfaceoftheyear.com/webinar",
                          identifier:
                            this.props.activeWebinars.activeWebinars[0].id, // Single post id
                          title:
                            this.props.activeWebinars.activeWebinars[0].title, // Single post title
                        }}
                      />
                    </Col>
                  </>
                ) : (
                  <Text>
                    No active webinars available. Please check back again later.
                  </Text>
                )}
              </Row>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default WebinarDetail;
