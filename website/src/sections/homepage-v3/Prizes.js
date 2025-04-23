import React, { useState } from "react";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import Slider from "react-slick";

import { Box, Text, Button } from "../../components/Core";
import { device } from "../../utils";

import Carousel from "react-multi-carousel";
// import horraImg from "../../assets/image/homepage/sponsors/horra.jpg";
// import skinWorksImg from "../../assets/image/homepage/sponsors/skin-works.jpg";
// import parimalImg from "../../assets/image/homepage/sponsors/parimal.jpg";
// import rubaruImg from "../../assets/image/homepage/sponsors/rubaru.jpg";
// import feverImg from "../../assets/image/homepage/sponsors/fever.jpg";
// import eipimediaImg from "../../assets/image/homepage/sponsors/eipimedia.jpg";

import cashPrizeImg from "../../assets/image/homepage/v2/cash-prize.jpg";
import radioLiveImg from "../../assets/image/homepage/v2/radio-live.jpg";
import photoshootImg from "../../assets/image/homepage/v2/photoshoot.jpg";
import rubaruImg from "../../assets/image/homepage/v2/mr-ms.jpg";
import influencerImg from "../../assets/image/homepage/v2/influencer.jpg";
import groomingImg from "../../assets/image/homepage/v2/grooming.jpg";

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
    items: 2,
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
      width: 50%;
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
  pauseOnHover: false,
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "60px",
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

const Sponsors = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Container className="mt-4">
        <SliderStyled {...slickSettings}>
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
              src={cashPrizeImg}
              alt="cash-prize"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Cash prize of upto Rs.50,000
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
              src={radioLiveImg}
              alt="radio"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Live interview on Fever 104 FM
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
              src={photoshootImg}
              alt="celebrity"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Photoshoot By Celebrity Photographer
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
              src={rubaruImg}
              alt="rubaru"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Wildcard entry to Mr. & Miss. India Rubaru
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
              src={influencerImg}
              alt="influencer"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Annual contract as a Social Media Influencer
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
              src={groomingImg}
              alt="horra"
              className="img-fluid"
              style={{ padding: "0.5rem" }}
            />
            <Text variant="bold" color="#000000" className="text-center">
              Personalized Grooming Session by PMA
            </Text>
          </Box>
        </SliderStyled>
      </Container>

      {/* <Container
        className="mt-3 pl-4 pr-4"
        style={{
          background: "#000000",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <Text
          fontSize="12px"
          as="h5"
          className=""
          variant="custom-title"
          style={{ color: "red" }}
        >
          Begin Your <br />
          Journey
        </Text>
        <Text
          variant="bold"
          color="#FFFFFF"
          style={{ opacity: "1" }}
          className="mt-4 mb-4"
        >
          OMG is for those who shine. <br />
          Are you the one?
        </Text>
        <Link href="/registration" className="mt-3">
          <a>
            <Button
              size="sm"
              css={`
                font-size: 1.2rem !important;
                min-width: 60vw !important;
                font-weight: 600;
                height: 5vh !important;
                background: red !important;
                border-radius: 0px !important;
                // border: none !important;
                color: #000 !important;
                // border: 1px solid #dadada !important;
                // box-shadow: 4px 4px 0px #ff0000;
                padding: 0px !important;
              `}
              // className="register-floating-button"
            >
              REGISTER
            </Button>
          </a>
        </Link>
      </Container> */}
    </>
  );
};

export default Sponsors;
