import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { Row, Col, Container } from "react-bootstrap";
import { Box, Text, Button, Title } from "../../components/Core";
import { device } from "../../utils";
import rohitVideo from "../../assets/videos/rohit-video.mp4";
import rohitPreviewImg from "../../assets/videos/rohit-preview.jpg";
import cashPrizeImg from "../../assets/image/homepage/v2/cash-prize.jpg";
import radioLiveImg from "../../assets/image/homepage/v2/radio-live.jpg";
import photoshootImg from "../../assets/image/homepage/v2/photoshoot.jpg";
import rubaruImg from "../../assets/image/homepage/v2/mr-ms.jpg";
import influencerImg from "../../assets/image/homepage/v2/influencer.jpg";
import groomingImg from "../../assets/image/homepage/v2/grooming.jpg";
import { Player, BigPlayButton } from "video-react";
import homepageBanner5 from "../../assets/image/homepage/banners/homepage-banner-6.jpg";
import level1Img from "../../assets/image/homepage/v3/level-1.jpg";
import level2Img from "../../assets/image/homepage/v3/level-2.jpg";
import level3Img from "../../assets/image/homepage/v3/level-3.jpg";
import level4Img from "../../assets/image/homepage/v3/level-4.jpg";
import level5Img from "../../assets/image/homepage/v3/level-5.jpg";
import level6Img from "../../assets/image/homepage/v3/level-6.jpg";
import Prizes from "./Prizes";
import Profiles from "./Profiles";
import JuryVideos from "./JuryVideos";
import Jury from "./Jury";
import Rounds from "./Rounds";
import MaleLeaderboard from "./MaleLeaderboard";
import FemaleLeaderboard from "./FemaleLeaderboard";
import rvcjIcon from "../../assets/image/icons/acting.png";
import cashIcon2 from "../../assets/image/icons/cash2.png";
import cameraIcon from "../../assets/image/icons/camera.png";
import crownIcon from "../../assets/image/icons/crown.png";
import influencerIcon from "../../assets/image/icons/influencer.png";
import radioIcon from "../../assets/image/icons/radio.png";
import productsIcon from "../../assets/image/icons/brand-products.png";
import glamonnIcon from "../../assets/image/icons/glamon.png";
import magazineIcon from "../../assets/image/icons/magazine.png";
import top1000Img from "../../assets/image/homepage/top-1000.jpg";
import top300Img from "../../assets/image/homepage/top-300.jpg";
import top150Img from "../../assets/image/homepage/top-150.jpg";
import top60Img from "../../assets/image/homepage/top-60.jpg";
import top40Img from "../../assets/image/homepage/top-40.jpg";
import top10Img from "../../assets/image/homepage/top-10.jpg";
import inviteImg from "../../assets/image/homepage/invite.jpeg";
import top10Video from "../../assets/videos/top10.mp4";
import novVideoGrabImage from "../../assets/image/homepage/nov-video-background.jpg";
import Videos from "./Videos";
import finaleImg from "../../assets/image/homepage/post-finale-banner.jpg";
import ReactCountdown, { zeroPad } from "react-countdown";
import maleWinner from "../../assets/image/homepage/winners/male-winner.jpg";
import maleFirstRunnerUp from "../../assets/image/homepage/winners/male-first-runner-up.jpg";
import maleSecondRunnerUp from "../../assets/image/homepage/winners/male-second-runner-up.jpg";
import femaleWinner from "../../assets/image/homepage/winners/female-winner.jpg";
import femaleFirstRunnerUp from "../../assets/image/homepage/winners/female-first-runner-up.jpg";
import femaleSecondRunnerUp from "../../assets/image/homepage/winners/female-second-runner-up.jpg";

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

const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
  return (
    <span style={{ fontSize: "30px", color: "#FF0000", fontWeight: "600" }}>
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
};

const BannerTextVideo = (props) => {
  return (
    <>
      <Box pb={"60px"} pt={"0px"} style={{ background: "#ffffff" }}>
        {/* <Container className="pt-0 pl-0 pr-0" style={{ textAlign: "center" }}>
          <img src={finaleImg} style={{ width: "100%" }} />
        </Container> */}

        {/* <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            MR & MISS OMG FACE OF THE YEAR 2022
          </Text>
          <Row>
            <Col xs="6">
              <img src={maleWinner} style={{ width: "100%" }} />
              <Text
                fontSize="16px"
                as="h4"
                style={{
                  textOverflow: "ellipsis",
                }}
              >
                GOKUL G
              </Text>
            </Col>
            <Col xs="6">
              <img src={femaleWinner} style={{ width: "100%" }} />
              <Text
                fontSize="16px"
                as="h4"
                style={{
                  textOverflow: "ellipsis",
                }}
              >
                TITIKSHA TAGGAR
              </Text>
            </Col>
          </Row>
        </Container>

        <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            1st RUNNER UPs
          </Text>
          <Row>
            <Col xs="6">
              <img src={maleFirstRunnerUp} style={{ width: "100%" }} />
              <Text
                fontSize="16px"
                as="h4"
                style={{
                  textOverflow: "ellipsis",
                }}
              >
                Samarthya Gupta
              </Text>
            </Col>
            <Col xs="6">
              <img src={femaleFirstRunnerUp} style={{ width: "100%" }} />
              <Text
                fontSize="16px"
                as="h4"
                style={{
                  textOverflow: "ellipsis",
                }}
              >
                Anoushka Chauhan
              </Text>
            </Col>
          </Row>
        </Container>

        <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            2nd RUNNER UPs
          </Text>
          <Row>
            <Col xs="6">
              <img src={maleSecondRunnerUp} style={{ width: "100%" }} />
              <Text
                fontSize="16px"
                as="h4"
                style={{
                  textOverflow: "ellipsis",
                }}
              >
                Akshay Kaushal
              </Text>
            </Col>
            <Col xs="6">
              <img src={femaleSecondRunnerUp} style={{ width: "100%" }} />
              <Text
                fontSize="16px"
                as="h4"
                style={{
                  textOverflow: "ellipsis",
                }}
              >
                Poojaa Singh
              </Text>
            </Col>
          </Row>
        </Container> */}

        {/* <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            COUNTDOWN TO FINALE
          </Text>
          <ReactCountdown
            date="2021-12-13T14:30:00"
            renderer={countdownRenderer}
            zeroPadTime={2}
          />
        </Container> */}

        {/* <Container
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
            <br />

            <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              dangerouslySetInnerHTML={{
                __html: `
                  <video
                    muted
                    autoplay
                    playsinline
                    loop
                    src="${top10Video}#t=0.1"
                    style="height:auto;width:100vw;margin-top:0%;display:flex"
                  />
                `,
              }}
            />
            <img
              src={novVideoGrabImage}
              style={{ width: "100vw", height: "auto" }}
            />
          </>
        </Container> */}

        {/* <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            LEVEL 6
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            <span style={{ color: "#FF0000" }}>WALK AND SYNC</span>
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            CONGRATULATIONS
          </Text>
          <img src={top10Img} style={{ width: "100%" }} />

          <Link href="/top-10" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW RESULTS
              </Button>
            </a>
          </Link>
        </Container>

        <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            LEVEL 5
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            <span style={{ color: "#FF0000" }}>FIT HIT</span>
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            CONGRATULATIONS
          </Text>
          <img src={top40Img} style={{ width: "100%" }} />

          <Link href="/top-40" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW RESULTS
              </Button>
            </a>
          </Link>
        </Container>

        <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            LEVEL 4
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            <span style={{ color: "#FF0000" }}>CAPTURE CON</span>
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            CONGRATULATIONS
          </Text>
          <img src={top60Img} style={{ width: "100%" }} />

          <Link href="/top-60" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW RESULTS
              </Button>
            </a>
          </Link>
        </Container>

        <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            LEVEL 3
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            <span style={{ color: "#FF0000" }}>TALENT EXTRAVAGANZA</span>
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            CONGRATULATIONS
          </Text>
          <img src={top150Img} style={{ width: "100%" }} />

          <Link href="/top-150" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW RESULTS
              </Button>
            </a>
          </Link>
        </Container>

        <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            LEVEL 2
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            <span style={{ color: "#FF0000" }}>CHARISMATIC PERSONA</span>
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            CONGRATULATIONS
          </Text>
          <img src={top300Img} style={{ width: "100%" }} />

          <Link href="/top-300" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW RESULTS
              </Button>
            </a>
          </Link>
        </Container>

        <Container className="pt-5 pl-4 pr-4" style={{ textAlign: "center" }}>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            LEVEL 1
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            <span style={{ color: "#FF0000" }}>LEADERBOARD</span>
          </Text>
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            CONGRATULATIONS
          </Text>
          <img src={top1000Img} style={{ width: "100%" }} />

          <Link href="/top-1000" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW RESULTS
              </Button>
            </a>
          </Link>
        </Container> */}

        <Container className="pt-5 pl-4 pr-4">
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            INDIA'S BIGGEST
            <br />
            DIGITAL TALENT HUNT
          </Text>
          <Text
            color="#000000"
            style={{
              opacity: 1,
              fontSize: "17px",
              lineHeight: "22px",
            }}
          >
            OMG Face Of The Year is India's first digital talent hunt.
            <br />
            It's not just a search for a face with good looks; this unique contest is designed
            and developed with thoughtful rounds that test your personality and agility as a whole.
            <br />
            The contest features holistic rounds in genres like acting, dance, fitness, photography,
            and modeling, where contestants showcase their talents digitally.
            <br />
            The top ten male and female finalists, chosen from across India, will compete for the titles
            of Mr. OMG and Miss/Mrs. OMG Face of the Year in Mumbai. This season, a new category has been
            introduced, where the top 10 hairstylists, selected digitally from across India, will also
            compete in Mumbai for the title of 'Streax Hairstyle Icon.' The winners will be clicked by
            ace photographer Dabboo Ratnani, along with other exciting incentives.
            <br />
            <br />
            {/* <Link href="/registration">
              <a>
                <Button
                  size="sm"
                  css={`
                    font-size: 1.2rem !important;
                    min-width: 40vw !important;
                    height: 5vh !important;
                    background: #000 !important;
                    border-radius: 0px !important;
                    // border: none !important;
                    color: #ffffff !important;
                    border: 1px solid #dadada !important;
                    box-shadow: 2px 2px 0px #ff0000;
                    padding: 0px !important;
                  `}
                  className="register-floating-button"
                >
                  REGISTER NOW
                </Button>
              </a>
            </Link> */}
            {/* Further they would be progressed ahead in: */}
            {/* <hr />
            <strong>Leaderboard</strong>{" "}
            <span style={{ float: "right" }}>Top 1000</span>
            <hr />
            <strong>Talent Round</strong>{" "}
            <span style={{ float: "right" }}>Top 300</span>
            <hr />
            <strong>Capture-Con Round</strong>{" "}
            <span style={{ float: "right" }}>Top 600</span>
            <hr />
            <strong>Fitness Round</strong>{" "}
            <span style={{ float: "right" }}>Top 60</span>
            <hr />
            <strong>Walk & Pose Round</strong>{" "}
            <span style={{ float: "right" }}>Top 40</span>
            <hr />
            <strong>Finale</strong>{" "}
            <span style={{ float: "right" }}>Top 10</span>
            <hr /> */}
          </Text>
        </Container>
        {/* <Rounds /> */}
        <Videos />
        {/* <Container className="mt-3 mb-2 text-center">
          <Link href="/pr-and-media" className="mt-3">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW MEDIA
              </Button>
            </a>
          </Link>
        </Container> */}
        {/* <Container className="pt-4 pl-4 pr-4">
          <div className="home-v3-image-container">
            <div className="home-v3-text-on-image">
              <div className="home-v3-text-on-image-inner">
                OMG Face of the Year is looking for fresh faces who aspire to
                make a career in Modeling
                <br />
                <br />
                Contestants who register for OMG Face of the year will
                participate digitally from their respective places
                <br />
                <br />
                Participants be guided by industry mentors before every level of
                competition
                <br />
                <br />
                Participants will compete on different levels to become OMG face
                of the Year
                <br />
              </div>
            </div>
          </div>
        </Container> */}

        <Jury />
        <Container className="pt-5 pl-4 pr-4">
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            YOUR GATEWAY
            <br />
            TO SUCCESS
          </Text>
          <Text
            color="#000000"
            style={{
              opacity: 1,
              fontSize: "17px",
              lineHeight: "22px",
            }}
          ></Text>
          {/* <Prizes /> */}
        </Container>
        <Container className="mt-4">
          <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img
                src={cameraIcon}
                width="40px"
                style={{ marginTop: "10px" }}
              />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                {/* PHOTOSHOOT WITH DABBOO */}
                Personal photo shoot <br />
                by Dabboo Ratnani
              </Title>
              {/* <Text
                variant="small"
                color="#000000"
                style={{ lineHeight: "18px" }}
              >
                In Person Photo-shoot with <br />
                Dabboo Ratnani
              </Text> */}
            </Col>
          </Row>

          <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img src={rvcjIcon} width="40px" style={{ marginTop: "10px" }} />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Acting opportunity <br />
                in Web Series/Movies
              </Title>
              {/* <Text
                variant="small"
                color="#000000"
                style={{ lineHeight: "18px" }}
              >
                Acting opportunity in RVCJ Media Web series or Sketch
              </Text> */}
            </Col>
          </Row>

          <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img src={crownIcon} width="40px" />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Wildcard entry in
                <br /> Mr. & Ms. Rubaru India
              </Title>
              {/* <Text
                variant="small"
                color="#000000"
                style={{ lineHeight: "18px" }}
              >
                Wild Card Entry
              </Text> */}
            </Col>
          </Row>

          <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img src={radioIcon} width="40px" />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Live radio Interview <br />
                on Radio City
              </Title>
            </Col>
          </Row>

          <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img src={glamonnIcon} width="40px" />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Glam Onn <br />
                Calendar Shoot as a model
              </Title>
            </Col>
          </Row>

          <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img src={magazineIcon} width="40px" />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Feature on leading <br />
                Magazine cover
              </Title>
            </Col>
          </Row>

          <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img src={influencerIcon} width="40px" />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Social Media Influencer <br /> contract
              </Title>
            </Col>
          </Row>

          {/* <Row
            className="mt-4 winners-row-landing"
            style={{
              padding: "10px 10px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <Col
              xs="2"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <img src={cashIcon2} width="40px" style={{ marginTop: "10px" }} />
            </Col>
            <Col
              xs="10"
              style={{
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <Title
                variant="landing-h3"
                className="mb-0"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Cash Prizes
              </Title>
              <Text
                variant="small"
                color="#000000"
                style={{ lineHeight: "18px" }}
              >
                ₹51,000 for Winners
                <br />
                ₹21,000 for 1st Runner Ups
                <br />
                ₹11,000 for 2nd Runner Ups
              </Text>
            </Col>
          </Row> */}
        </Container>
        <Container className="mt-5 text-center">
          <Link href="/about-us">
            <a>
              <Button
                size="sm"
                css={`
                  font-size: 1.2rem !important;
                  min-width: 60vw !important;
                  height: 5vh !important;
                  background: #000 !important;
                  border-radius: 0px !important;
                  // border: none !important;
                  color: #ffffff !important;
                  border: 1px solid #dadada !important;
                  box-shadow: 4px 4px 0px #ff0000;
                  padding: 0px !important;
                `}
                // className="register-floating-button"
              >
                VIEW MORE
              </Button>
            </a>
          </Link>
        </Container>

        {/* <MaleLeaderboard maleLeaderboardData={props.maleLeaderboardData} />
        <FemaleLeaderboard
          femaleLeaderboardData={props.femaleLeaderboardData}
        /> */}

        {/* <Profiles randomApproved={props.randomApproved} /> */}

        {/* The context */}
        {/* <Container className="pt-5 pl-4 pr-4 mt-4 mb-5">
          <Text fontSize="18px" as="h4" className="mb-3" variant="custom-title">
            THE CONTEST
          </Text>
          <Row className="mt-4">
            <Col xs="6">
              <div className="homepage-v3-image-line-left" />
              <img src={level1Img} width="100%" />
            </Col>
            <Col xs="6">
              <div style={{ display: "table", height: "100%" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "20px",
                      lineHeight: "26px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>LEVEL 1</span>{" "}
                  </Text>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "18px",
                      lineHeight: "22px",
                    }}
                  >
                    Create your profile, enter OMG leader board & get maximum
                    votes
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="6">
              <div style={{ display: "table", height: "100%" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "20px",
                      lineHeight: "26px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>LEVEL 2</span>{" "}
                  </Text>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "18px",
                      lineHeight: "22px",
                    }}
                  >
                    Put your best foot forward & show your natural talent to the
                    judges
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs="6">
              <div className="homepage-v3-image-line-right" />
              <img src={level3Img} width="100%" />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="6">
              <div className="homepage-v3-image-line-left" />
              <img src={level4Img} width="100%" />
            </Col>
            <Col xs="6">
              <div style={{ display: "table", height: "100%" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "20px",
                      lineHeight: "26px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>LEVEL 3</span>{" "}
                  </Text>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "18px",
                      lineHeight: "22px",
                    }}
                  >
                    Fit and Hit. Live training session & activity with celeb
                    fitness experts
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="6">
              <div style={{ display: "table", height: "100%" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "20px",
                      lineHeight: "26px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>
                      LEVEL 4 - WALK ROUND
                    </span>{" "}
                  </Text>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "18px",
                      lineHeight: "22px",
                    }}
                  >
                    Walk round. Present your confidence on the ramp to make the
                    audience go OMG!
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs="6">
              <div className="homepage-v3-image-line-right" />
              <img src={level5Img} width="100%" />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="6">
              <div className="homepage-v3-image-line-left" />
              <img src={level6Img} width="100%" />
            </Col>
            <Col xs="6">
              <div style={{ display: "table", height: "100%" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "20px",
                      lineHeight: "26px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>FINALE</span>{" "}
                  </Text>
                  <Text
                    color="#000000"
                    style={{
                      opacity: 1,
                      fontSize: "18px",
                      lineHeight: "22px",
                    }}
                  >
                    Interact with Dabboo Ratnani & Rohit Khandelwal live online.
                    Be crowned OMG Face Of The Year
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Container> */}
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
          <Text
            variant="small"
            color="#FFFFFF"
            className="mt-4"
            style={{ lineHeight: "18px", textDecoration: "underline" }}
          >
            No hidden or additional costs. One time registration fee of ₹499
            only.
          </Text>
        </Container> */}

        {/* <JuryVideos /> */}
      </Box>
    </>
  );
};

export default BannerTextVideo;
