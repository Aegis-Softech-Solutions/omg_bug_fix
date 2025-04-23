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
import blanckanvasImg from "../../assets/image/homepage/sponsors/blanckanvas-updated.jpg";
import rubaruImg from "../../assets/image/homepage/sponsors/rubaru.jpg";
import feverImg from "../../assets/image/homepage/sponsors/fever.jpg";
import eipimediaImg from "../../assets/image/homepage/sponsors/eipimedia.jpg";
import buycepsImg from "../../assets/image/homepage/sponsors/buyceps.png";
import oraneImg from "../../assets/image/homepage/sponsors/orane.png";
import topupImg from "../../assets/image/homepage/sponsors/topup-homepage.png";
import macvImg from "../../assets/image/homepage/sponsors/macv-homepage.png";
import garrisonImg from "../../assets/image/homepage/sponsors/garrison.png";
import svarImg from "../../assets/image/homepage/sponsors/svar.png";
import rvcjImg from "../../assets/image/homepage/sponsors/rvcj.png";
// import aajTakImg from "../../assets/image/homepage/sponsors/aajtak.png";
import radioCityImg from "../../assets/image/homepage/sponsors/radio-city.jpg";
import resortImg from "../../assets/image/homepage/sponsors/resort-logo.jpg";

import aajTakImg from "../../assets/image/homepage/sponsors/aaj-tak.png";
import atrangiImg from "../../assets/image/homepage/sponsors/atrangi.png";
import bharat24Img from "../../assets/image/homepage/sponsors/bharat-24.png";
import brightImg from "../../assets/image/homepage/sponsors/bright.png";
import digitalPartnersImg from "../../assets/image/homepage/sponsors/digital-partners.png";
import joshImg from "../../assets/image/homepage/sponsors/josh.png";
import middayImg from "../../assets/image/homepage/sponsors/mid-day.png";
import synbioImg from "../../assets/image/homepage/sponsors/synbio.png";

import cancroImg from "../../assets/image/homepage/sponsors/cancro.png";
import schmittenImg from "../../assets/image/homepage/sponsors/schmitten.png";
import nasoprofumiImg from "../../assets/image/homepage/sponsors/naso.png";
import herbalImg from "../../assets/image/homepage/sponsors/herbal.png";
import oranemaladmumbaiImg from "../../assets/image/homepage/sponsors/orane.png";
import vaanImg from "../../assets/image/homepage/sponsors/vaan.png";
import swissImg from "../../assets/image/homepage/sponsors/swiss.png";


import saasImg from "../../assets/image/homepage/sponsors/saas.png";
import spicejetImg from "../../assets/image/homepage/sponsors/spicejet-cropped.png";
import kaaryamImg from "../../assets/image/homepage/sponsors/kaaryam-cropped.png";
import streaxLogo from "../../assets/image/homepage/sponsors/Streax-Professional.png";
import dcotLogo from "../../assets/image/homepage/sponsors/Dcot-logo.png";
import { margin, marginBottom } from "styled-system";

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
            <Container className="official-partners-page">
              <Row className="text-center" style={{display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "center", gap: "12px"}}>
                <Col xs="12">
                  <Title variant="card" color="#000000" className="mb-4">
                    Official Partners
                  </Title>
                </Col>

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
  <a href="https://professional.streax.in/" target="_blank" rel="noopener noreferrer">
    <img
      src={streaxLogo}
      alt="streax"
      className="img-fluid"
      style={{ padding: "0.5rem", width: "300px" }}
    />
  </a>
  <Text variant="bold" color="#000000" className="text-center" style={{ marginTop: "-140px", marginBottom: "20px" }}>
    Title Sponsor
  </Text>
</Box>

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
  <a href="https://www.theresortmumbai.com/" target="_blank" rel="noopener noreferrer">
    <img
      src={resortImg}
      alt="the-resort"
      className="img-fluid"
      style={{ padding: "0.5rem" }}
    />
  </a>
  <Text variant="bold" color="#000000" className="text-center">
    Powered By Partner
  </Text>
</Box>

<Box
  style={{ marginTop: "0px", marginBottom: "0px" }}
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
    src={dcotLogo}
    alt="dcot"
    className="img-fluid"
    style={{ padding: "0.5rem", width: "250px" }}
  />
  <Text variant="bold" color="#000000" className="text-center" style={{ marginTop: "20px" }}>
    Co-Powered Partner
  </Text>
</Box>

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
  <a href="https://svarmedia.com/" target="_blank" rel="noopener noreferrer">
    <img
      src={svarImg}
      alt="svar"
      className="img-fluid"
      style={{ padding: "0.5rem" }}
    />
  </a>
  <Text variant="bold" color="#000000" className="text-center" style={{ marginTop: "-40px" }}>
    Crown &amp; Trophy Partner
  </Text>
</Box>

                

                {/* <Box
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
                    src={synbioImg}
                    alt="synbio"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Co-Powered Partner
                  </Text>
                </Box>

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
                    src={atrangiImg}
                    alt="atrangi"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Channel Partner
                  </Text>
                </Box>

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
                    src={saasImg}
                    alt="saas"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Editorial Partner
                  </Text>
                </Box>

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
                    src={spicejetImg}
                    alt="spicejet"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Youth Airline Partner
                  </Text>
                </Box>
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
                    src={kaaryamImg}
                    alt="kaaryam"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Supported by
                  </Text>
                </Box>

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
                    src={cancroImg}
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Hydration Partner
                  </Text>
                </Box>

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
                    src={schmittenImg}
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Happinness Partner
                  </Text>
                </Box>



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
                    src={radioCityImg}
                    alt="radio-city-fm"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Radio Partner
                  </Text>
                </Box>

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
                    src={bharat24Img}
                    alt="bharat24"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Media Partner
                  </Text>
                </Box>



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
                    src={joshImg}
                    alt="josh"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Short Video Partner
                  </Text>
                </Box>



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
                    src={nasoprofumiImg}
                    alt="nasoprofumi"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Fragrance Partner
                  </Text>
                </Box>
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
                  <Text variant="bold" color="#000000" className="text-center">
                    Grooming Partner
                  </Text>
                </Box>

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
                    src={brightImg}
                    alt="bright"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Outdoor Partner
                  </Text>
                </Box>
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
                    src={horraImg}
                    alt="horra"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Style Partner
                  </Text>
                </Box>

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
                    src={middayImg}
                    alt="midday"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Print Partner
                  </Text>
                </Box>

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
                    src={herbalImg}
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Gifting Partner
                  </Text>
                </Box>


                <Link href="official-partners#rubaru">
                  <a href="official-partners#rubaru">
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
                        alt="rubaru"
                        className="img-fluid"
                        style={{ padding: "0.5rem" }}
                      />
                      <Text variant="bold" color="#000000" className="text-center">
                        Pageant Partner
                      </Text>
                    </Box>
                  </a>
                </Link>






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
                    src={digitalPartnersImg}
                    alt="digitalPartners"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Digital Partners
                  </Text>
                </Box>

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
                    src={oranemaladmumbaiImg}
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    HMU Partner
                  </Text>
                </Box>

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
                    src={vaanImg}
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    EV Partner
                  </Text>
                </Box>


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
                    src={swissImg}
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Wearable Partner
                  </Text>
                </Box>


 */}





              </Row>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default Partners;
