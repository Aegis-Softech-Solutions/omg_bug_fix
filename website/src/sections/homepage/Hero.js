import React, { useContext } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

import { Title, Button, Section, Box, Text } from "../../components/Core";
import { Carousel } from "react-responsive-carousel";
import GlobalContext from "../../context/GlobalContext";

import homepageBanner1 from "../../assets/image/homepage/banners/homepage-banner-1.jpg";
import homepageBanner2 from "../../assets/image/homepage/banners/homepage-banner-2.jpg";
import homepageBanner3 from "../../assets/image/homepage/banners/homepage-banner-3.jpg";

const Hero = () => {
  const gContext = useContext(GlobalContext);

  return (
    <>
      {/* <!-- Hero Area --> */}
      <Section className="p-0">
        <Container className="p-0 banner-container">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            showIndicators={false}
            infiniteLoop={true}
            swipeable={true}
            swipeScrollTolerance={5}
            autoPlay
            interval={5000}
          >
            <div>
              <div
                className="homepage-banner"
                style={{
                  backgroundImage: "url(" + homepageBanner1 + ")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <p className="homepage-banner-text ">
                The most glamorous stage is lit,
                <br />
                and the spotlight is waiting for you.
              </p>
            </div>
            <div>
              <div
                className="homepage-banner"
                style={{
                  backgroundImage: "url(" + homepageBanner2 + ")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <p className="homepage-banner-text ">
                Redefine elegance and bring <br />
                your style statement to the fore.
              </p>
            </div>
            <div>
              <div
                className="homepage-banner"
                style={{
                  backgroundImage: "url(" + homepageBanner3 + ")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <p className="homepage-banner-text ">
                Grab the opportunity <br />
                that is first-of-its-kind.
              </p>
            </div>
          </Carousel>
        </Container>
      </Section>
    </>
  );
};

export default Hero;
