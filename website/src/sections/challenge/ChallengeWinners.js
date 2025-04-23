import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { breakpoints } from "../../utils";
import { Query } from "react-apollo";
import { COMPETITION_SUBMISSION_BY_SEARCH } from "./queries.js";
import leaderRankBackground from "../../assets/image/leaderboardRankBackground.jpg";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";
import personPlaceholder from "../../assets/image/placeholder-person.png";

class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.competitionWinners || [],
    };
  }

  gridItem = (profile, record, winnerText) => {
    return (
      <Row key={profile.slug} style={{ marginBottom: "1.5rem" }}>
        <Col
          xs="12"
          style={{
            padding: "0.5rem",
          }}
        >
          {record.upload_type === "image" ? (
            <img
              src={
                process.env.REACT_APP_IMAGE_URL +
                process.env.REACT_APP_PROFILE_IMAGE_PATH +
                profile.media
              }
              width="100%"
            />
          ) : (
            <ReactPlayer
              url={
                process.env.REACT_APP_IMAGE_URL +
                process.env.REACT_APP_PROFILE_IMAGE_PATH +
                profile.media +
                "#t=0.1"
              }
              width="100%"
              height="auto"
              controls={true}
            />
          )}
        </Col>
        <Col xs="2" style={{ padding: "0.5rem" }}>
          <Link href={`/profiles/${profile.slug}`}>
            <img
              src={
                profile.profile_pic
                  ? process.env.REACT_APP_IMAGE_URL +
                    process.env.REACT_APP_PROFILE_IMAGE_PATH +
                    profile.profile_pic
                  : personPlaceholder
              }
              width="100%"
            />
          </Link>
        </Col>
        <Col
          xs="8"
          style={{
            padding: "0.5rem",
            zIndex: 999,
          }}
        >
          <>
            <Link href={`/profiles/${profile.slug}`}>
              <Text
                fontSize="16px"
                as="h4"
                style={{
                  textOverflow: "ellipsis",
                }}
              >
                {profile.full_name}
              </Text>
            </Link>
            <Text
              fontSize="16px"
              style={{
                textOverflow: "ellipsis",
              }}
            >
              {winnerText}
              <br />
              {record.competition_name}
            </Text>
          </>
        </Col>
        <Col xs="12">
          <hr />
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <Section className="mt-5" pb={"30px"} style={{ minHeight: "85vh" }}>
        <Container>
          {/* <Row className="text-center" style={{ marginTop: "30px" }}>
            <Col xs="12">
              <Title variant="card" color="#000000" className="mb-2">
                CURRENT CHALLENGE
              </Title>

              <Link href="/challenge-upload" className="mt-3">
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
                    VIEW
                  </Button>
                </a>
              </Link>
            </Col>
          </Row> */}

          <Row className="text-center" style={{ marginTop: "10px" }}>
            <Col xs="12">
              <Title variant="card" color="#000000" className="mb-2">
                CHALLENGE WINNERS
              </Title>
              <hr />
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Box pb={"10px"} pt={"10px"} pl={"10px"} pr={"10px"}>
                <>
                  {/* Leaderboard Rows */}

                  <>
                    <Accordion preExpanded={[0]} allowMultipleExpanded={true}>
                      {this.state.data.map((record, index) => {
                        let winners = record.winners || [];
                        let firstRunnerUps = record.firstRunnerUps || [];
                        let secondRunnerUps = record.secondRunnerUps || [];

                        return (
                          <AccordionItem
                            style={{ paddingBottom: "5px" }}
                            uuid={record.id}
                          >
                            <AccordionItemHeading>
                              <AccordionItemButton
                                style={{ textAlign: "center" }}
                              >
                                <strong>{record.competition_name}</strong>
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                              {winners &&
                                winners.length > 0 &&
                                winners.map((profile) => {
                                  return this.gridItem(
                                    profile,
                                    record,
                                    "Winner"
                                  );
                                })}
                              {firstRunnerUps &&
                                firstRunnerUps.length > 0 &&
                                firstRunnerUps.map((profile) => {
                                  return this.gridItem(
                                    profile,
                                    record,
                                    "First Runner Up"
                                  );
                                })}
                              {secondRunnerUps &&
                                secondRunnerUps.length > 0 &&
                                secondRunnerUps.map((profile) => {
                                  return this.gridItem(
                                    profile,
                                    record,
                                    "Second Runner Up"
                                  );
                                })}
                            </AccordionItemPanel>
                          </AccordionItem>

                          // <>
                          //   <Title
                          //     variant="card"
                          //     color="#000000"
                          //     className="mb-2 text-center"
                          //   >
                          //     {record.competition_name}
                          //   </Title>
                          //   {winners &&
                          //     winners.length > 0 &&
                          //     winners.map((profile) => {
                          //       return this.gridItem(profile, record, "Winner");
                          //     })}
                          //   {firstRunnerUps &&
                          //     firstRunnerUps.length > 0 &&
                          //     firstRunnerUps.map((profile) => {
                          //       return this.gridItem(
                          //         profile,
                          //         record,
                          //         "First Runner Up"
                          //       );
                          //     })}
                          //   {secondRunnerUps &&
                          //     secondRunnerUps.length > 0 &&
                          //     secondRunnerUps.map((profile) => {
                          //       return this.gridItem(
                          //         profile,
                          //         record,
                          //         "Second Runner Up"
                          //       );
                          //     })}
                          //   <hr />
                          // </>
                        );
                      })}
                    </Accordion>
                  </>
                </>
              </Box>
            </Col>
          </Row>
        </Container>
      </Section>
    );
  }
}

export default SearchList;
