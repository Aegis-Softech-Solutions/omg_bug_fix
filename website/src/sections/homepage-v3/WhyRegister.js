import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { Row, Col, Container } from "react-bootstrap";
import { Box, Text, Button } from "../../components/Core";
import { device } from "../../utils";
import testimonialVideo from "../../assets/videos/testimonial-video.mp4";
import testimonialPreviewImg from "../../assets/videos/testimonial-preview.jpg";
import cashPrizeImg from "../../assets/image/homepage/v2/cash-prize.jpg";
import radioLiveImg from "../../assets/image/homepage/v2/radio-live.jpg";
import photoshootImg from "../../assets/image/homepage/v2/photoshoot.jpg";
import rubaruImg from "../../assets/image/homepage/v2/mr-ms.jpg";
import influencerImg from "../../assets/image/homepage/v2/influencer.jpg";
import groomingImg from "../../assets/image/homepage/v2/grooming.jpg";
import { Player, BigPlayButton } from "video-react";
import homepageBanner5 from "../../assets/image/homepage/banners/homepage-banner-5.jpg";
import level1Img from "../../assets/image/homepage/v3/level-1.jpg";
import level2Img from "../../assets/image/homepage/v3/level-2.jpg";
import level3Img from "../../assets/image/homepage/v3/level-3.jpg";
import level4Img from "../../assets/image/homepage/v3/level-4.jpg";
import level5Img from "../../assets/image/homepage/v3/level-5.jpg";
import level6Img from "../../assets/image/homepage/v3/level-6.jpg";
import Prizes from "./Prizes";

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
      <Box pb={"60px"} pt={"0px"} style={{ background: "#ffffff" }}>
        <Container className="pt-4 pl-4 pr-4">
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            WHY SHOULD YOU REGISTER ?
          </Text>
          <Text
            color="#000000"
            style={{
              opacity: 1,
              fontSize: "18px",
              lineHeight: "24px",
            }}
          >
            Have an aspiration to become the next big thing in the glamour world
            but don't know where to start ? <br />
            <br />
            Tired of long audition queues ?<br />
            <br />
            Unable to decide if you're skilled enough to make it in the industry
            ?<br />
            <br />
            Let down by the expensive portfolio shoots ?<br />
            <br />
            Need a mentor to guide you ?<br />
            <br />
            Fear moving to a big city to take a chance on yourself ?<br />
            <br />
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Over the years, the people behind OMG have groomed and launched
              thousands of models who've faced and overcome the same questions.
              Listen to what others have to say about OMG Face of The Year -
            </span>
          </Text>
        </Container>

        <Container className="mt-3 pt-2 pl-4 pr-4 text-center">
          <Player playsInline poster={testimonialPreviewImg}>
            <source src={testimonialVideo} />
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
      </Box>
    </>
  );
};

export default BannerTextVideo;
