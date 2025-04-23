import React, { useState, PureComponent } from "react";
import ReactPlayer from "react-player";
import { Player, BigPlayButton } from "video-react";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import Slider from "react-slick";

import { Box, Text, Button } from "../../components/Core";
import { device } from "../../utils";

import rohitVideo from "../../assets/videos/rohit-2.mp4";
import rohitPreviewImg from "../../assets/videos/rohit-preview-2.jpg";

import vahbizVideo from "../../assets/videos/vahbiz.mp4";
import vahbizPreviewImg from "../../assets/videos/vahbiz-preview.jpg";

import kavitaVideo from "../../assets/videos/kavita.mp4";
import kavitaPreviewImg from "../../assets/videos/kavita-preview.jpg";

import dabbooVideo from "../../assets/videos/dabboo.mp4";
import dabbooPreviewImg from "../../assets/videos/dabboo-preview.jpg";

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

    return (
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
                CELEB SPEAK
              </Text>
            </TitleContainer>
          </Container>
          <Container className="mt-5">
            <SliderStyled
              {...slickSettings}
              key={isClient ? "client" : "server"}
            >
              <Box
                css={`
                  &:focus {
                    outline: none;
                  }
                  padding-left: 10px;
                  padding-right: 10px;
                  position: relative;
                `}
                key="1"
              >
                <Player playsInline poster={dabbooPreviewImg}>
                  <source src={dabbooVideo} />
                  <BigPlayButton position="center" />
                </Player>
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
                key="1"
              >
                <Player playsInline poster={rohitPreviewImg}>
                  <source src={rohitVideo} />
                  <BigPlayButton position="center" />
                </Player>
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
                key="2"
              >
                <Player playsInline poster={kavitaPreviewImg}>
                  <source src={kavitaVideo} />
                  <BigPlayButton position="center" />
                </Player>
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
                key="3"
              >
                <Player playsInline poster={vahbizPreviewImg}>
                  <source src={vahbizVideo} />
                  <BigPlayButton position="center" />
                </Player>
              </Box>
            </SliderStyled>
          </Container>
        </Box>
      </>
    );
  }
}

export default Sponsors;
