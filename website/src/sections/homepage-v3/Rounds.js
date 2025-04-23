import React, { useState } from "react";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import Slider from "react-slick";

import { Box, Text } from "../../components/Core";
import { device } from "../../utils";

import Carousel from "react-multi-carousel";
import Img1 from "../../assets/image/homepage/rounds/1.png";
import Img2 from "../../assets/image/homepage/rounds/2.png";
import Img3 from "../../assets/image/homepage/rounds/3.png";
import Img4 from "../../assets/image/homepage/rounds/4.png";
import Img5 from "../../assets/image/homepage/rounds/5.png";
import Img6 from "../../assets/image/homepage/rounds/6.png";
import Img7 from "../../assets/image/homepage/rounds/7.png";
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
  infinite: false,
  arrows: false,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  centerMode: false,
  // centerPadding: "40px",
  responsive: [
    {
      breakpoint: breakpoints.md,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

const Rounds = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* <Box pb={"30px"} pt={"0px"} mt={"-5px"} style={{ background: "#ffffff" }}> */}
      {/* <Container>
        <TitleContainer mt={"50px"} mb={"20px"}>
          <Text fontSize="18px" as="h4" className="" variant="custom-title">
            Levels of OMG
          </Text>
        </TitleContainer>
      </Container> */}
      <Container style={{ marginTop: "20px" }}>
        <TitleContainer mt={"50px"} mb={"20px"}>
          <Text fontSize="18px" as="h4" className="" variant="custom-title">
            Levels Of OMG
          </Text>
        </TitleContainer>
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
            <img
              src={Img1}
              alt="leaderboard"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
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
            <img
              src={Img2}
              alt="top-300"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
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
            <img
              src={Img3}
              alt="capture-con"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
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
            <img
              src={Img4}
              alt="fit-hit"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
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
            <img
              src={Img5}
              alt="walk-and-sync"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
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
            <img
              src={Img6}
              alt="finale"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
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
            <img
              src={Img7}
              alt="finale"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
          </Box>
        </SliderStyled>
      </Container>
      {/* </Box> */}
    </>
  );
};

export default Rounds;
