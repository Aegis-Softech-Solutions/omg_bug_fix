import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { breakpoints } from "../../utils";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

class LevelsOfOMG extends Component {
  render() {
    return (
      <Section style={{ display: "block" }}>
        <Box pb={"0px"} pt={"40px"} pl={"10px"} pr={"10px"}>
          <>
            <Container>
              <Row className="text-center">
                <Col xs="12">
                  <Text variant="card-title" color="#000000" className="mb-4">
                    Levels of OMG
                  </Text>
                </Col>
              </Row>

              <Accordion preExpanded={[1]} allowMultipleExpanded={true}>
                <AccordionItem uuid={1}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">1</span>
                      <strong>Registration & Leaderboard</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box pb={"20px"}>
                      <Text
                        variant="small"
                        color="#000000"
                        // style={{
                        //   paddingLeft: "20px",
                        //   paddingRight: "20px",
                        //   width: "100%",
                        //   textAlign: "right",
                        // }}
                      >
                        Open your door-way to fame and success as you register
                        for OMG - Face Of The Year.
                        <br />
                        <br />
                        Upon successful registration and payment, you get a
                        confirmation mail regarding the same along with your
                        login id. Get set to create your profile by filling in
                        the information as required and by following certain
                        guidelines as instructed.
                        <br />
                        <br />
                        Complete your profile by uploading 3 pictures, a bio,
                        and some basic information.
                        <br />
                        <br />
                        Once you successfully complete your profile and submit
                        it, it will further go for the approval process. Post
                        approval you will appear on the live leaderboard.
                        <br />
                        <br />
                        You can now share your profile on social media
                        (WhatsApp/Facebook/Instagram) to collect votes.
                        Depending upon your vote counts you will be ranked on
                        the live leaderboard.
                        <br />
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem uuid={2}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">2</span>
                      <strong>Pre-Contest Challenges</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box mb={"20px"} mt={"20px"}>
                      <Text variant="small" color="#000000">
                        To collect additional bonus votes, you must participate
                        in Pre-contest challenges. These votes will help your
                        profile to move up on the live leaderboard.
                        <br />
                        <br />
                        Once the Pre-Contest Challenges are over, the
                        leaderboard will stop and the top 500 males & females
                        will proceed to knock out rounds.
                        <br />
                        <br />
                        <strong>
                          500 males & females will move to the next level.
                        </strong>
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>
                <br />
                <br />
                <Text variant="card-title" color="#000000" className="mb-4">
                  Knockout Rounds
                </Text>
                <AccordionItem uuid={3}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">3.1</span>
                      <strong>Talent Extravaganza</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box mb={"20px"} mt={"20px"}>
                      <Text variant="small" color="#000000">
                        Get your talent hats on as we begin the Talent round in
                        the hunt.
                        <br />
                        <br />
                        The task for this along with all the details and
                        deadlines shall be e-mailed well in advance to all the
                        contestants in each category.
                        <br />
                        <br />
                        The details of the tasks shall be emailed to all the
                        contestants before the start of the round.
                        <br />
                        <br />
                        <strong>
                          250 males & females will move to the next level.
                        </strong>
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem uuid={4}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">3.2</span>
                      <strong>CaptureCon</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box mb={"20px"} mt={"20px"}>
                      <Text variant="small" color="#000000">
                        Capture your life and show it to the world. Come and
                        depict your story in the form of a slideshow with photos
                        explaining your life. Play with your creativity and go
                        all out with any story (fictional/non-fictional) you can
                        come up with. <br />
                        <br />
                        The details of the tasks shall be emailed to all the
                        contestants before the start of the round. <br />
                        <br />
                        <strong>
                          100 males & females will move to the next level.
                        </strong>
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem uuid={5}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">3.3</span>
                      <strong>Fit Hit</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box mb={"20px"} mt={"20px"}>
                      <Text variant="small" color="#000000">
                        Moving Forward, this round shall consist of fitness
                        tasks. So, get your fitness game on and set the ultimate
                        benchmark. <br />
                        <br />
                        The details of the tasks shall be emailed to all the
                        contestants before the start of the round. <br />
                        <br />
                        <strong>
                          60 males & females will move to the next level.
                        </strong>
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem uuid={6}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">3.4</span>
                      <strong>Walk And Sync</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box mb={"20px"} mt={"20px"}>
                      <Text variant="small" color="#000000">
                        A personality hunt without a walk? Think no more as we
                        bring a complete out-of-the-box concept where you get to
                        slay the ramp.
                        <br />
                        <br />
                        The details of the tasks shall be emailed to all the
                        contestants before the start of the round.
                        <br />
                        <br />
                        <strong>
                          30 males & females will move to the next level.
                        </strong>
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem uuid={7}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">3.5</span>
                      <strong>Personal Interview</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box mb={"20px"} mt={"20px"}>
                      <Text variant="small" color="#000000">
                        For this round, the contestants will have a one-on-one
                        video call with the juries.
                        <br />
                        <br />
                        The details shall be emailed to all the contestants
                        before the start of the round.
                        <br />
                        <br />
                        <strong>
                          10 males & females will move to the next level.
                        </strong>
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>

                <AccordionItem uuid={8}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <span className="profile-form-accordian-number">3.6</span>
                      <strong>Swipe The Crown</strong>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Box mb={"20px"} mt={"20px"}>
                      <Text variant="small" color="#000000">
                        <strong>The last and the final Top20!!</strong>
                        <br />
                        <br />
                        Get ready to be a part of this splendid finale in Mumbai
                        as we discover our new Mr. & Miss OMG - Face Of the Year
                      </Text>
                    </Box>
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default LevelsOfOMG;
