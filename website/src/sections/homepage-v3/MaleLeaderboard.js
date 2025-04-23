import React, { useState, PureComponent } from "react";
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
  centerPadding: "10px",
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

class Sponsors extends PureComponent {
  state = {
    isClient: false,
  };

  componentDidMount() {
    this.setState({ isClient: true });
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { isClient } = this.state;

    return this.props.maleLeaderboardData ? (
      <>
        <Box
          pb={"0px"}
          pt={"80px"}
          style={{ background: "#ffffff" }}
          mt={"-5px"}
        >
          <Container>
            <TitleContainer>
              <Text fontSize="18px" as="h4" className="" variant="custom-title">
                MALE <br />
                LEADERBOARD
              </Text>
            </TitleContainer>
          </Container>
          <Container className="mt-3">
            <SliderStyled
              {...slickSettings}
              key={isClient ? "client" : "server"}
            >
              {this.props.maleLeaderboardData.map((profile) => (
                <Box
                  css={`
                    &:focus {
                      outline: none;
                    }
                    padding-left: 10px;
                    padding-right: 10px;
                    position: relative;
                  `}
                  key={profile.id}
                >
                  <img
                    src={
                      process.env.REACT_APP_IMAGE_URL +
                      process.env.REACT_APP_PROFILE_IMAGE_PATH +
                      profile.profile_pic
                    }
                    alt="profile-image"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    {profile.full_name}
                  </Text>
                </Box>
              ))}
            </SliderStyled>
          </Container>
        </Box>
      </>
    ) : null;
  }
}

export default Sponsors;
