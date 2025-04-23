import React, { useState } from "react";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import Slider from "react-slick";

import { Box, Text } from "../../components/Core";
import { device } from "../../utils";

import Carousel from "react-multi-carousel";
import dabbooImg from "../../assets/image/homepage/jury/dabboo.jpg";
import manushiImg from "../../assets/image/homepage/jury/manushi.jpg";
import rohitImg from "../../assets/image/homepage/jury/rohit.jpg";
import vihbizImg from "../../assets/image/homepage/jury/vibhiz.jpg";
import sunnyImg from "../../assets/image/homepage/jury/sunny.jpg";
import kavitaImg from "../../assets/image/homepage/jury/kavita.jpg";

import vindhyaImg from "../../assets/image/homepage/jury/vindhya.jpg";
import amitImg from "../../assets/image/homepage/jury/amit.jpg";
import rajendraImg from "../../assets/image/homepage/jury/rajendra.jpg";

import L3Acting from "../../assets/videos/rounds-media/l3-acting.mp4";
import L3Dance from "../../assets/videos/rounds-media/l3-dance.mp4";
import L3Special from "../../assets/videos/rounds-media/l3-special.mp4";
import L4Music from "../../assets/videos/rounds-media/l4-female-comp.mp4";
import L4Male from "../../assets/videos/rounds-media/l4-male-comp.mp4";
import L4Female from "../../assets/videos/rounds-media/l4-music.mp4";

import episode1 from "../../assets/videos/season-1-highlights/Episode-1.mp4";
import episode2 from "../../assets/videos/season-1-highlights/Episode-2.mp4";
import episode3 from "../../assets/videos/season-1-highlights/Episode-3.mp4";
import episode4 from "../../assets/videos/season-1-highlights/Episode-4.mp4";
import episode5 from "../../assets/videos/season-1-highlights/Episode-5.mp4";
import episode6 from "../../assets/videos/season-1-highlights/Episode-6.mp4";

import episode1Img from "../../assets/image/homepage/episodes-thumbnail/01.jpg";
import episode2Img from "../../assets/image/homepage/episodes-thumbnail/02.jpg";
import episode3Img from "../../assets/image/homepage/episodes-thumbnail/03.jpg";
import episode4Img from "../../assets/image/homepage/episodes-thumbnail/04.jpg";
import episode5Img from "../../assets/image/homepage/episodes-thumbnail/05.jpg";
import episode6Img from "../../assets/image/homepage/episodes-thumbnail/06.jpg";

import s1teasor from "../../assets/videos/omg-teaser-1.mp4";
import s2teasor from "../../assets/videos/omg-teaser-2.mp4";
import s1teasorImg from "../../assets/image/homepage/episodes-thumbnail/s1.jpg";
import s2teasorImg from "../../assets/image/homepage/episodes-thumbnail/s2.png";
import { breakpoints } from "../../utils";

const SliderStyled = styled(Slider)`
  .slick-dots {
    position: relative;
    margin-top: 10px;
    li {
      font-size: 0;
      width: 17px;
      height: 8px;
      border-radius: 4px;
      background-color: ${({ theme }) => theme.colors.shadow};
      margin-left: 5px;
      margin-right: 5px;
      transition: 0.5s;
      &.slick-active {
        width: 45px;
        height: 8px;
        border-radius: 4px;
        background-color: ${({ theme }) => theme.colors.secondary};
      }
      button {
        width: 100%;
        height: 100%;
        &:before {
          content: none;
        }
      }
    }
  }
`;

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
    // partialVisibilityGutter: 40,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    // partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    // partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    // partialVisibilityGutter: 30,
  },
};

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

const slickSettings = {
  autoplay: true,
  autoplaySpeed: 1500,
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: false,
  // centerPadding: "40px",
  responsive: [
    {
      breakpoint: breakpoints.md,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Jury = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* <Box pb={"30px"} pt={"0px"} mt={"-5px"} style={{ background: "#ffffff" }}> */}
      <Container>
        <TitleContainer mt={"50px"} mb={"20px"}>
          <Text fontSize="18px" as="h4" className="" variant="custom-title">
            THE SEASON 1 & 2 JOURNEY
          </Text>
        </TitleContainer>
      </Container>
      <Container>
        <SliderStyled {...slickSettings}>
        <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={s1teasor + "#t=1"}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={s1teasorImg}
            />
            <Text variant="bold" color="#000000" className="text-center">
            OMG Teaser S1
            </Text>
          </Box>
          <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={s2teasor + "#t=1"}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={s2teasorImg}
            />
            <Text variant="bold" color="#000000" className="text-center">
            OMG Teaser S2
            </Text>
          </Box>
          {/* <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={episode1}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={episode1Img}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Episode 1
            </Text>
          </Box>

          <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={episode2 + "#t=1"}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={episode2Img}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Episode 2
            </Text>
          </Box>

          <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={episode3 + "#t=1"}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={episode3Img}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Episode 3
            </Text>
          </Box>

          <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={episode4 + "#t=1"}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={episode4Img}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Episode 4
            </Text>
          </Box>

          <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={episode5 + "#t=1"}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={episode5Img}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Episode 5
            </Text>
          </Box>

          <Box
            css={`
              &:focus {
                outline: none;
              }
              // padding-left: 10px;
              // padding-right: 10px;
              position: relative;
            `}
          >
            <ReactPlayer
              url={episode6 + "#t=1"}
              width="100%"
              height="200px"
              controls
              muted
              playing={false}
              style={{ background: "black" }}
              light={episode6Img}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Episode 6
            </Text>
          </Box> */}
        </SliderStyled>
      </Container>
    </>
  );
};

export default Jury;
