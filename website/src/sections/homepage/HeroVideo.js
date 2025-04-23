import React, { Component } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { Container, Row, Col } from "react-bootstrap";

import { Title, Button, Section, Box, Text } from "../../components/Core";
import { Carousel } from "react-responsive-carousel";
import GlobalContext from "../../context/GlobalContext";

import imgL1LogoWhite from "../../assets/image/logo/video-logo.png";

// import homepageBannerVideo from "../../assets/videos/homepage-video-new-edited.mp4";
// import homepageBannerVideo from "../../assets/videos/final-banner-video.mp4";
// import videoGrabImage from "../../assets/image/homepage/video-background.jpg";

// import octoberVideo from "../../assets/videos/october-video.mp4";
// import octoberVideoGrabImage from "../../assets/image/homepage/october-video-background.jpg";

import novVideo from "../../assets/videos/omg-banner-video-10nov.mp4";
import novVideoGrabImage from "../../assets/image/homepage/nov-video-background.jpg";

import top10Video from "../../assets/videos/top10.mp4";

import video2022 from "../../assets/videos/omg-2022.mp4";

class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogo: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showLogo: false });
    }, 100);
  }

  render() {
    return (
      <>
        {/* <!-- Hero Area --> */}
        <Section
          className="p-0"
          style={{
            // minHeight: "85vh",
            background: "#000",
          }}
        >
          {this.state.showLogo ? (
            <Box
              data-aos="hide"
              data-aos-duration="2000"
              data-aos-once="true"
              data-aos-delay="4000"
            >
              <img
                src={imgL1LogoWhite}
                style={{
                  position: "absolute",
                  top: "0%",
                  left: "0%",
                  width: "100vw",
                  height: "auto",
                }}
              />
            </Box>
          ) : null}
          <Container
            className="pr-0 pl-0 banner-container homepage-video"
            style={{
              display: "table",
              marginTop: "80px",
              // background: "-webkit-linear-gradient(#000000 80%, #ffffff 20%)",
              // background: "#000000",
              // backgroundImage: "url(" + octoberVideoGrabImage + ")",
            }}
            id="videohomeslide"
          >
            <>
              <div
                style={{ display: "table-cell", verticalAlign: "top" }}
                dangerouslySetInnerHTML={{
                  __html: `
                  <video
                    muted
                    autoplay
                    playsinline
                    loop
                    src="${video2022}#t=0.1"
                    style="height:auto;width:100vw;margin-top:0%;display:flex"
                  />
                `,
                }}
              />
              {/* <img
                src={novVideoGrabImage}
                style={{ width: "100vw", height: "auto" }}
              /> */}
            </>
          </Container>
        </Section>
      </>
    );
  }
}

export default Hero;
