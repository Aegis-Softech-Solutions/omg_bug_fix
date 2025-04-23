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
import horraImg from "../../assets/image/homepage/sponsors/horra.jpg";
import skinWorksImg from "../../assets/image/homepage/sponsors/skin-works-page.jpg";
import rubaruImg from "../../assets/image/homepage/sponsors/rubaru.jpg";
import blanckanvasImg from "../../assets/image/homepage/sponsors/blanckanvas-updated.jpg";
import feverImg from "../../assets/image/homepage/sponsors/fever.jpg";
import radioCityImg from "../../assets/image/homepage/sponsors/radio-city.jpg";
import eipimediaImg from "../../assets/image/homepage/sponsors/eipimedia.jpg";
import buycepsImg from "../../assets/image/homepage/sponsors/buyceps.png";
import oraneImg from "../../assets/image/homepage/sponsors/orane.png";
import topupImg from "../../assets/image/homepage/sponsors/topup.png";
import macvImg from "../../assets/image/homepage/sponsors/macv.png";
import garrisonImg from "../../assets/image/homepage/sponsors/garrison.png";
import svarImg from "../../assets/image/homepage/sponsors/svar.png";
import rvcjImg from "../../assets/image/homepage/sponsors/rvcj.png";
import aajTakImg from "../../assets/image/homepage/sponsors/aajtak.png";

import resortImg from "../../assets/image/homepage/sponsors/resort-logo.jpg";

import atrangiImg from "../../assets/image/homepage/sponsors/atrangi.png";
import bharat24Img from "../../assets/image/homepage/sponsors/bharat-24.png";
import brightImg from "../../assets/image/homepage/sponsors/bright.png";
import digitalPartnersImg from "../../assets/image/homepage/sponsors/digital-partners.png";
import joshImg from "../../assets/image/homepage/sponsors/josh.png";
import middayImg from "../../assets/image/homepage/sponsors/mid-day.png";
import synbioImg from "../../assets/image/homepage/sponsors/synbio.png";
import streaxLogo from "../../assets/image/homepage/sponsors/Streax-Professional.png";
import dcotLogo from "../../assets/image/homepage/sponsors/Dcot-logo.png";

class Partners extends Component {
  render() {
    return (
      <Section pb={"30px"}>
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
                  <Title variant="card" color="#000000" className="mb-4">
                    Official Partners
                  </Title>
                </Col>

                <Col xs="12" style={{ paddingTop: "30px" }} id="rubaru">
                  <Link href="/official-partners/rubaru">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Pageant Partner
                      </Text>
                      <img
                        src={rubaruImg}
                        alt="rubaru"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
                </Col>
                <Col xs="12" style={{ paddingTop: "20px" }} id="fever-fm">
                  <Link href="/official-partners/fever-fm">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Radio Partner
                      </Text>
                      <img
                        src={radioCityImg}
                        alt="radio-city"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="fever-fm">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Crown &amp; Trophy Partner
                    </Text>
                    <img
                      src={svarImg}
                      alt="fever-fm"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <hr />
                  </Box>
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Powered By Partner
                    </Text>
                    <img
                      src={resortImg}
                      alt="the-resort"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Outdoor Partner
                    </Text>
                    <img
                      src={brightImg}
                      alt="bright"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Digital Partners
                    </Text>
                    <img
                      src={digitalPartnersImg}
                      alt="digitalPartners"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Print Partner
                    </Text>
                    <img
                      src={middayImg}
                      alt="midday"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Short Video Partner
                    </Text>
                    <img
                      src={joshImg}
                      alt="josh"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      News Partner
                    </Text>
                    <img
                      src={aajTakImg}
                      alt="aaj-tak"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Co-Powered Partner
                    </Text>
                    <img
                      src={synbioImg}
                      alt="synbio"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                <Col xs="12" style={{ paddingTop: "20px" }} id="resort">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Media Partner
                    </Text>
                    <img
                      src={bharat24Img}
                      alt="bharat24"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <Text
                      variant="bold"
                      color="#000000"
                      className="text-center"
                    ></Text>
                  </Box>
                  <hr />
                </Col>

                {/* <Col xs="12" style={{ paddingTop: "20px" }} id="fever-fm">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Venue Partner
                    </Text>
                    <img
                      src={garrisonImg}
                      alt="fever-fm"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <hr />
                  </Box>
                </Col> */}

                {/* <Col xs="12" style={{ paddingTop: "20px" }} id="fever-fm">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      News Partner
                    </Text>
                    <img
                      src={aajTakImg}
                      alt="fever-fm"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <hr />
                  </Box>
                </Col> */}

                {/* <Col xs="12" style={{ paddingTop: "20px" }} id="fever-fm">
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
                    <Text
                      variant="small"
                      color="#000000"
                      className="text-center"
                    >
                      Talent Partner
                    </Text>
                    <img
                      src={rvcjImg}
                      alt="fever-fm"
                      className="img-fluid"
                      style={{ padding: "0.5rem" }}
                    />
                    <hr />
                  </Box>
                </Col> */}

                {/* <Col xs="12" style={{ paddingTop: "20px" }} id="eipimedia">
                  <Link href="/official-partners/eipimedia">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Influencer Partner
                      </Text>
                      <img
                        src={eipimediaImg}
                        alt="eipimedia"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
                </Col> */}
                {/* <Col xs="12" style={{ paddingTop: "20px" }} id="buyceps">
                  <Link href="/official-partners/buyceps">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Fitness Partner
                      </Text>
                      <img
                        src={buycepsImg}
                        alt="buyceps"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
                </Col> */}

                <Col xs="12" style={{ paddingTop: "30px" }} id="macv">
                  <Link href="/official-partners/macv">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Eyewear Sponsor
                      </Text>
                      <img
                        src={macvImg}
                        alt="macv"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
                </Col>

                {/* <Col xs="12" style={{ paddingTop: "20px" }} id="orane">
                  <Link href="/official-partners/orane">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Hair &amp; Make Up Partner
                      </Text>
                      <img
                        src={oraneImg}
                        alt="orane"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
                </Col> */}
                <Col xs="12" style={{ paddingTop: "20px" }} id="blanckanvas">
                  <Link href="/official-partners/blanckanvas">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Grooming Partner
                      </Text>
                      <img
                        src={blanckanvasImg}
                        alt="blanckanvas"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
                </Col>
                <Col xs="12" style={{ paddingTop: "20px" }} id="horra">
                  <Link href="/official-partners/horra">
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
                      <Text
                        variant="small"
                        color="#000000"
                        className="text-center"
                      >
                        Style Partner
                      </Text>
                      <img
                        src={horraImg}
                        alt="horra"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <hr />
                    </Box>
                  </Link>
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
