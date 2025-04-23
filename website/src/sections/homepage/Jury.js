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

const Jury = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Box pb={"30px"} pt={"0px"} mt={"-5px"} style={{ background: "#ffffff" }}>
        <Container>
          <TitleContainer mb={"20px"}>
            <Text fontSize="18px" as="h4" className="" variant="custom-title">
              Jury
            </Text>
          </TitleContainer>
        </Container>
        <Container>
          {/* <Carousel
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            swipeable={true}
            draggable={false}
            showDots={true}
            // partialVisbile={true}
            centerMode={true}
            infinite={false}
            autoPlay={false}
            autoPlaySpeed={4000}
            // keyBoardControl={true}
            // customTransition="all .5"
            // transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["desktop", "tablet", "mobile"]}
            // deviceType={
            //   device === "sm"
            //     ? "mobile"
            //     : device === "md"
            //     ? "tablet"
            //     : device === "lg"
            //     ? "desktop"
            //     : "superLargeDesktop"
            // }
            // dotListClass="custom-dot-list-style"
            // itemClass="carousel-item-padding-40-px"
          >
            <div className="text-center">
              <img
                src={dabbooImg}
                alt="dabboo-ratnani"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000">
                Dabboo Ratnani
              </Text>
            </div>
            <div className="text-center">
              <img
                src={rohitImg}
                alt="dabboo-ratnani"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000">
                Rohit Khandelwal
              </Text>
            </div>
          </Carousel> */}

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
                src={dabbooImg}
                alt="dabboo-ratnani"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000" className="text-center">
                Dabboo Ratnani
              </Text>
              <Text variant="small" color="#000000" className="text-center">
                Celebrity & Fashion Photographer
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
                src={rohitImg}
                alt="rohit-khandelwal"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000" className="text-center">
                Rohit Khandelwal
              </Text>
              <Text variant="small" color="#000000" className="text-center">
                Mr World 2016
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
              <img
                src={vihbizImg}
                alt="vihbiz"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000" className="text-center">
                Vahbiz Mehta
              </Text>
              <Text variant="small" color="#000000" className="text-center">
                Fashion Choreographer
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
              <img
                src={sunnyImg}
                alt="sunny"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000" className="text-center">
                Sunny Kamble
              </Text>
              <Text variant="small" color="#000000" className="text-center">
                Super Model
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
              <img
                src={kavitaImg}
                alt="rohit-khandelwal"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000" className="text-center">
                Kavita Kharayat
              </Text>
              <Text variant="small" color="#000000" className="text-center">
                Super Model
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
                src={manushiImg}
                alt="manushi-ratnani"
                className="img-fluid"
                style={{ padding: "0.5rem" }}
              />
              <Text variant="bold" color="#000000" className="text-center">
                Manushi Chhillar
              </Text>
              <Text variant="small" color="#000000" className="text-center">
                Celebrity & Fashion Photographer
              </Text>
            </Box> */}
          </SliderStyled>
        </Container>
      </Box>
    </>
  );
};

export default Jury;
