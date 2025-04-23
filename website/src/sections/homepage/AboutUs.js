import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "react-bootstrap";

import { Box, Text } from "../../components/Core";
import { device } from "../../utils";

import aboutUsBanner from "../../assets/image/homepage/about-us.jpg";

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

const AboutUs = () => {
  return (
    <>
      <Box
        pb={"60px"}
        pt={"30px"}
        mt={"-5px"}
        style={{ background: "#ffffff" }}
      >
        <Container>
          <TitleContainer mb={"10px"}>
            <Text fontSize="18px" as="h4" className="" variant="custom-title">
              India's First Digital
              <br />
              Personality Hunt
            </Text>
          </TitleContainer>
        </Container>
        <Container>
          <img
            src={aboutUsBanner}
            alt=""
            className="w-100 img-fluid"
            style={{ padding: "0.5rem" }}
          />
        </Container>
        <Container className="pt-2">
          <Text style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
            OMG- Face Of The Year, a platform that brings together the who’s who
            of the industry, a mentorship that sets all eyes on you and on the
            path of a game-changing career.
          </Text>
        </Container>
        <Container className="pt-1">
          <Link href="/about-us">
            <a>
              <Text
                variant="more-link"
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
              >
                more
              </Text>
            </a>
          </Link>
        </Container>
      </Box>
    </>
  );
};

export default AboutUs;
