import React, { useState } from "react";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import Slider from "react-slick";

import { Box, Text } from "../../components/Core";
import { device } from "../../utils";

import Carousel from "react-multi-carousel";
import horraImg from "../../assets/image/homepage/sponsors/horra.jpg";
import skinWorksImg from "../../assets/image/homepage/sponsors/skin-works.jpg";
import blanckanvasImg from "../../assets/image/homepage/sponsors/blanckanvas-updated.jpg";
import rubaruImg from "../../assets/image/homepage/sponsors/rubaru.jpg";
import feverImg from "../../assets/image/homepage/sponsors/fever.jpg";
import eipimediaImg from "../../assets/image/homepage/sponsors/eipimedia.jpg";
import buycepsImg from "../../assets/image/homepage/sponsors/buyceps.png";
import topupImg from "../../assets/image/homepage/sponsors/topup-home.png";
import macvImg from "../../assets/image/homepage/sponsors/macv-home.png";
import streaxLogo from "../../assets/image/homepage/sponsors/Streax-Professional.png";
import dcotLogo from "../../assets/image/homepage/sponsors/Dcot-logo.png";

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
  centerPadding: "40px",
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
      <Box
        pb={"30px"}
        pt={"30px"}
        style={{ background: "#ffffff" }}
        mt={"-5px"}
      >
        <Container>
          <TitleContainer>
            <Text fontSize="18px" as="h4" className="" variant="custom-title">
              Official Partners
            </Text>
          </TitleContainer>
        </Container>
        <Container>
          <SliderStyled {...slickSettings}>
            <Link href="official-partners#topup">
              <a href="official-partners#topup">
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
                    src={streaxLogo}
                    alt="topup"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Title Sponsors
                  </Text>
                </Box>
              </a>
            </Link>

            <Link href="official-partners#skin-works">
              <a href="official-partners#skin-works">
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
                    src={skinWorksImg}
                    alt="skin-works"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Powered By
                  </Text>
                </Box>
              </a>
            </Link>
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
            <Link href="official-partners#fever-fm">
              <a href="official-partners#fever-fm">
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
                    src={feverImg}
                    alt="fever-fm"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Radio Partner
                  </Text>
                </Box>
              </a>
            </Link>
            <Link href="official-partners#macv">
              <a href="official-partners#macv">
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
                    src={macvImg}
                    alt="macv"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Eyewear Partner
                  </Text>
                </Box>
              </a>
            </Link>
            <Link href="official-partners#eipimedia">
              <a href="official-partners#eipimedia">
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
                    src={eipimediaImg}
                    alt="eipimedia"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Influencer Partner
                  </Text>
                </Box>
              </a>
            </Link>
            <Link href="official-partners#buyceps">
              <a href="official-partners#buyceps">
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
                    src={buycepsImg}
                    alt="buyceps"
                    className="img-fluid"
                    style={{ padding: "0.5rem" }}
                  />
                  <Text variant="bold" color="#000000" className="text-center">
                    Fitness Partner
                  </Text>
                </Box>
              </a>
            </Link>
            <Link href="official-partners#blanckanvas">
              <a href="official-partners#blanckanvas">
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
              </a>
            </Link>
            <Link href="official-partners#horra">
              <a href="official-partners#horra">
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
              </a>
            </Link>
          </SliderStyled>
        </Container>
      </Box>
    </>
  );
};

export default Sponsors;
