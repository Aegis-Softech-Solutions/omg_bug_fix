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
                COMPLETE YOUR PROFILE
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
                    You can participate in pre-contest challenges only once your
                    profile is submitted and approved. Please complete your
                    profile here :<br />
                    <br />
                    <Link href="/my-profile" className="mt-3">
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
                          VISIT PROFILE
                        </Button>
                      </a>
                    </Link>
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
