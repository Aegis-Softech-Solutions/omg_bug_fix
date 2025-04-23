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
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
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
                    {/* {this.props.activeWebinars &&
                    this.props.activeWebinars.activeWebinars &&
                    this.props.activeWebinars.activeWebinars.length > 0
                      ? this.props.activeWebinars.activeWebinars[0].title
                      : ""} */}
                    OMG Webinars
                  </Text>
                </Col>
              </Row>
            </Container>

            <Container style={{ textAlign: "center" }}>
              <Accordion preExpanded={[0]} allowMultipleExpanded={true}>
                <AccordionItem style={{ paddingBottom: "5px" }} uuid={1}>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ textAlign: "center" }}>
                      <strong>Skincare Webinar</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      style={{ display: "table-cell", verticalAlign: "top" }}
                      dangerouslySetInnerHTML={{
                        __html: `
                              <iframe src="https://www.youtube.com/embed/GWgtUXpUccw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          `,
                      }}
                    />
                  </AccordionItemPanel>
                </AccordionItem>

                <AccordionItem style={{ paddingBottom: "5px" }} uuid={2}>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ textAlign: "center" }}>
                      <strong>Model Life Webinar</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      style={{ display: "table-cell", verticalAlign: "top" }}
                      dangerouslySetInnerHTML={{
                        __html: `
                          <iframe src="https://www.youtube.com/embed/Csm7xuBnv4s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          `,
                      }}
                    />
                  </AccordionItemPanel>
                </AccordionItem>

                <AccordionItem style={{ paddingBottom: "5px" }} uuid={3}>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ textAlign: "center" }}>
                      <strong>Fitness Webinar</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      style={{ display: "table-cell", verticalAlign: "top" }}
                      dangerouslySetInnerHTML={{
                        __html: `
                          <iframe src="https://www.youtube.com/embed/O4K41QqCOiE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          `,
                      }}
                    />
                  </AccordionItemPanel>
                </AccordionItem>

                <AccordionItem style={{ paddingBottom: "5px" }} uuid={4}>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ textAlign: "center" }}>
                      <strong>Fitness Webinar</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      style={{ display: "table-cell", verticalAlign: "top" }}
                      dangerouslySetInnerHTML={{
                        __html: `
                          <iframe src="https://www.youtube.com/embed/KZW2rmIsF-E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          `,
                      }}
                    />
                  </AccordionItemPanel>
                </AccordionItem>

                <AccordionItem style={{ paddingBottom: "5px" }} uuid={5}>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ textAlign: "center" }}>
                      <strong>Styling Webinar</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      style={{ display: "table-cell", verticalAlign: "top" }}
                      dangerouslySetInnerHTML={{
                        __html: `
                          <iframe src="https://www.youtube.com/embed/Uzj2QkZh-xA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          `,
                      }}
                    />
                  </AccordionItemPanel>
                </AccordionItem>

                <AccordionItem style={{ paddingBottom: "5px" }} uuid={6}>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ textAlign: "center" }}>
                      <strong>Acting Webinar</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      style={{ display: "table-cell", verticalAlign: "top" }}
                      dangerouslySetInnerHTML={{
                        __html: `
                          <iframe src="https://www.youtube.com/embed/KhYOckx2jr8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          `,
                      }}
                    />
                  </AccordionItemPanel>
                </AccordionItem>

                <AccordionItem style={{ paddingBottom: "5px" }} uuid={7}>
                  <AccordionItemHeading>
                    <AccordionItemButton style={{ textAlign: "center" }}>
                      <strong>Dance Webinar</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      style={{ display: "table-cell", verticalAlign: "top" }}
                      dangerouslySetInnerHTML={{
                        __html: `
                          <iframe src="https://www.youtube.com/embed/TiJG4mV5CdY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          `,
                      }}
                    />
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default WebinarDetail;
