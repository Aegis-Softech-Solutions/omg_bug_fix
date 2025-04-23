import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { Row, Col, Container } from "react-bootstrap";
import { Box, Text, Button } from "../../components/Core";
import { device } from "../../utils";
import rohitVideo from "../../assets/videos/rohit-video.mp4";
import rohitPreviewImg from "../../assets/videos/rohit-preview.jpg";
import cashPrizeImg from "../../assets/image/homepage/v2/cash-prize.jpg";
import radioLiveImg from "../../assets/image/homepage/v2/radio-live.jpg";
import photoshootImg from "../../assets/image/homepage/v2/photoshoot.jpg";
import rubaruImg from "../../assets/image/homepage/v2/mr-ms.jpg";
import influencerImg from "../../assets/image/homepage/v2/influencer.jpg";
import groomingImg from "../../assets/image/homepage/v2/grooming.jpg";
import { Player, BigPlayButton } from "video-react";

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

const BannerTextVideo = () => {
  return (
    <>
      <Box pb={"60px"} pt={"100px"} style={{ background: "#ffffff" }}>
        <Container>
          <TitleContainer mb={"10px"}>
            <Text variant="custom-title-plain">
              YOUR ENTRY
              <br />
              TO THE
              <br />
              GLAMOUR
              <br />
              INDUSTRY
            </Text>
          </TitleContainer>
        </Container>
        <Container className="pt-2">
          <Text
            color="#000000"
            style={{
              opacity: 1,
              fontSize: "20px",
              lineHeight: "26px",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
            }}
          >
            Listen to{" "}
            <span style={{ fontWeight: "600" }}>
              Mr.World 2016, Rohit Khandelwal
            </span>{" "}
            talk about OMG -
          </Text>
        </Container>
        <Container className="mt-3 pt-2 pl-4 pr-4 text-center">
          <Player playsInline poster={rohitPreviewImg}>
            <source src={rohitVideo} />
            <BigPlayButton position="center" />
          </Player>
        </Container>
        <Container className="mt-3 text-center">
          <Link href="/leaderboard" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                LEADERBOARD
              </Button>
            </a>
          </Link>
        </Container>
        <Container className="pt-5 pl-4 pr-4">
          <Text fontSize="18px" as="h4" className="mb-4" variant="custom-title">
            Guaranteed Takeaways
          </Text>
          <Row
            className="winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0px",
              marginRight: "0px",
              marginBottom: "10px",
            }}
          >
            <Col xs="12" className="pl-0 pt-0">
              <Text
                color="#000000"
                style={{
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "26px",
                }}
              >
                Improve self-confidence and attain self belief
              </Text>
            </Col>
          </Row>

          <Row
            className="winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0px",
              marginRight: "0px",
              marginBottom: "10px",
            }}
          >
            <Col xs="12" className="pl-0 pt-0">
              <Text
                color="#000000"
                style={{
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "26px",
                }}
              >
                Acquire public speaking and presentation skills
              </Text>
            </Col>
          </Row>

          <Row
            className="winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0px",
              marginRight: "0px",
              marginBottom: "10px",
            }}
          >
            <Col xs="12" className="pl-0 pt-0">
              <Text
                color="#000000"
                style={{
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "26px",
                }}
              >
                Glamour industry insights, training and tips
              </Text>
            </Col>
          </Row>

          <Row
            className="winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0px",
              marginRight: "0px",
              marginBottom: "10px",
            }}
          >
            <Col xs="12" className="pl-0 pt-0">
              <Text
                color="#000000"
                style={{
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "26px",
                }}
              >
                Building your portfolio and career guidance
              </Text>
            </Col>
          </Row>

          <Row
            className="winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0px",
              marginRight: "0px",
              marginBottom: "10px",
            }}
          >
            <Col xs="12" className="pl-0 pt-0">
              <Text
                color="#000000"
                style={{
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "26px",
                }}
              >
                A Horra Luxury gift voucher worth Rs.500
              </Text>
            </Col>
          </Row>

          <Row
            className="winners-row"
            style={{
              background: "#EDEDED",
              padding: "5px 10px",
              marginLeft: "0px",
              marginRight: "0px",
              marginBottom: "10px",
            }}
          >
            <Col xs="12" className="pl-0 pt-0">
              <Text
                color="#000000"
                style={{
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "26px",
                }}
              >
                Publicly shareable profile page visible to brands
              </Text>
            </Col>
          </Row>
        </Container>
        <Container className="pt-5 pl-4 pr-4">
          <Text fontSize="18px" as="h4" className="mb-4" variant="custom-title">
            Stand a chance to win
          </Text>
          <Row>
            <Col xs="6">
              <img src={cashPrizeImg} width="100%" />
              <Text
                color="#000000"
                style={{
                  marginTop: "10px",
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "24px",
                  paddingBottom: "5px",
                  borderBottom: "3px solid #ff0000",
                }}
              >
                Cash prize of upto Rs.50,000
              </Text>
            </Col>
            <Col xs="6">
              {" "}
              <img src={radioLiveImg} width="100%" />
              <Text
                color="#000000"
                style={{
                  marginTop: "10px",
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "24px",
                  paddingBottom: "5px",
                  borderBottom: "3px solid #ff0000",
                }}
              >
                Live interview on Fever 104 FM
              </Text>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="6">
              {" "}
              <img src={photoshootImg} width="100%" />
              <Text
                color="#000000"
                style={{
                  marginTop: "10px",
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "24px",
                  paddingBottom: "5px",
                  borderBottom: "3px solid #ff0000",
                }}
              >
                Photoshoot by Celebrity Photographer
              </Text>
            </Col>
            <Col xs="6">
              {" "}
              <img src={rubaruImg} width="100%" />
              <Text
                color="#000000"
                style={{
                  marginTop: "10px",
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "24px",
                  paddingBottom: "5px",
                  borderBottom: "3px solid #ff0000",
                }}
              >
                Wildcard entry to Mr. & Miss. India Rubaru
              </Text>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col xs="6">
              {" "}
              <img src={influencerImg} width="100%" />
              <Text
                color="#000000"
                style={{
                  marginTop: "10px",
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "24px",
                  paddingBottom: "5px",
                  borderBottom: "3px solid #ff0000",
                }}
              >
                Annual Contract as a Social Media Influencer
              </Text>
            </Col>
            <Col xs="6">
              {" "}
              <img src={groomingImg} width="100%" />
              <Text
                color="#000000"
                style={{
                  marginTop: "10px",
                  opacity: 1,
                  fontSize: "18px",
                  lineHeight: "24px",
                  paddingBottom: "5px",
                  borderBottom: "3px solid #ff0000",
                }}
              >
                Personalized Grooming Session by PMA
              </Text>
            </Col>
          </Row>
        </Container>
        <Container className="mt-3 text-center">
          <Link href="/leaderboard" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                LEADERBOARD
              </Button>
            </a>
          </Link>
        </Container>
      </Box>
    </>
  );
};

export default BannerTextVideo;
