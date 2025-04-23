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
import personPlaceholder from "../../assets/image/placeholder-person.png";
import shareIcon from "../../assets/image/icons/share.png";
import facebookIcon from "../../assets/image/icons/facebook.png";
import twitterIcon from "../../assets/image/icons/twitter.png";
import whatsappIcon from "../../assets/image/icons/whatsapp.png";
import linkIcon from "../../assets/image/icons/link.png";
import {
  FloatingMenu,
  MainButton,
  ChildButton,
} from "react-floating-button-menu";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { toast } from "react-nextjs-toast";

class SubmissionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: {},
    };
  }
  render() {
    return (
      <Section pb={"30px"} style={{ minHeight: "85vh" }}>
        <Box
          // mb={"40px"}
          // mt={"40px"}
          pb={"30px"}
          pt={"40px"}
          pl={"10px"}
          pr={"10px"}
        >
          <>
            <Container>
              <Row className="text-center">
                <Col xs="12">
                  <Text variant="card-title" color="#000000" className="mb-4">
                    {this.props.competitionSubmissionById &&
                    this.props.competitionSubmissionById
                      .competitionSubmissionById
                      ? this.props.competitionSubmissionById
                          .competitionSubmissionById.competition_name
                      : ""}
                  </Text>
                </Col>
              </Row>
            </Container>
            <Container>
              <Row style={{ marginRight: "0px", marginLeft: "0px" }}>
                {this.props.competitionSubmissionById &&
                this.props.competitionSubmissionById
                  .competitionSubmissionById ? (
                  <>
                    <Col xs="12" style={{ padding: "0.5rem" }}>
                      <div style={{ height: "100%" }}>
                        {this.props.competitionSubmissionById
                          .competitionSubmissionById.upload_type === "image" ? (
                          <img
                            src={
                              process.env.REACT_APP_IMAGE_URL +
                              process.env.REACT_APP_PROFILE_IMAGE_PATH +
                              this.props.competitionSubmissionById
                                .competitionSubmissionById.media
                            }
                            width="100%"
                          />
                        ) : (
                          <ReactPlayer
                            url={
                              process.env.REACT_APP_IMAGE_URL +
                              process.env.REACT_APP_PROFILE_IMAGE_PATH +
                              this.props.competitionSubmissionById
                                .competitionSubmissionById.media +
                              "#t=0.1"
                            }
                            width="100%"
                            height="auto"
                            controls={true}
                          />
                        )}
                      </div>
                    </Col>
                    <Col
                      xs="10"
                      style={{
                        padding: "0.5rem",
                        zIndex: this.state.isOpen[
                          this.props.competitionSubmissionById
                            .competitionSubmissionById.id
                        ]
                          ? 0
                          : 999,
                      }}
                    >
                      {!this.state.isOpen[
                        this.props.competitionSubmissionById
                          .competitionSubmissionById.id
                      ] && (
                        <>
                          <Link
                            href={`/profiles/${this.props.competitionSubmissionById.competitionSubmissionById.slug}`}
                          >
                            <Text
                              fontSize="16px"
                              as="h4"
                              // variant="leader-name"
                              style={{
                                textOverflow: "ellipsis",
                              }}
                            >
                              {
                                this.props.competitionSubmissionById
                                  .competitionSubmissionById.full_name
                              }
                            </Text>
                          </Link>
                          <Text
                            fontSize="16px"
                            style={{
                              textOverflow: "ellipsis",
                            }}
                          >
                            {
                              this.props.competitionSubmissionById
                                .competitionSubmissionById.competition_name
                            }
                          </Text>
                        </>
                      )}
                    </Col>
                    <Col
                      xs="2"
                      style={{
                        padding: "0.5rem",
                        // marginTop: "-170px",
                        marginLeft: "-170px",
                      }}
                    >
                      <FloatingMenu
                        slideSpeed={500}
                        direction="left"
                        spacing={8}
                        isOpen={
                          this.state.isOpen[
                            this.props.competitionSubmissionById
                              .competitionSubmissionById.id
                          ]
                        }
                      >
                        <MainButton
                          iconResting={
                            <>
                              <img
                                src={shareIcon}
                                width="16px"
                                height="16px"
                                style={{
                                  marginTop: "5px",
                                  marginLeft: "5px",
                                }}
                              />
                            </>
                          }
                          iconActive={
                            <>
                              <img
                                src={shareIcon}
                                width="20px"
                                height="20px"
                                style={{ marginTop: "2px" }}
                              />
                            </>
                          }
                          onClick={() => {
                            const intermediateIsOpen = JSON.parse(
                              JSON.stringify(this.state.isOpen)
                            );
                            intermediateIsOpen[
                              this.props.competitionSubmissionById.competitionSubmissionById.id
                            ] = !intermediateIsOpen[
                              this.props.competitionSubmissionById
                                .competitionSubmissionById.id
                            ];
                            this.setState({
                              isOpen: intermediateIsOpen,
                            });
                          }}
                          size={100}
                          style={{
                            borderRadius: "0px",
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#000",
                            color: "white",
                          }}
                        />
                        <ChildButton
                          icon={
                            <FacebookShareButton
                              quote="Hey ! Vote on my OMG profile , share it to your friends & family, and make me Face of the year !"
                              url={
                                process.env.CLIENT_URL +
                                "challenge-submission/" +
                                this.props.competitionSubmissionById
                                  .competitionSubmissionById.id
                              }
                            >
                              <img src={facebookIcon} />
                            </FacebookShareButton>
                          }
                          backgroundColor="white"
                          size={35}
                        />
                        <ChildButton
                          icon={
                            <WhatsappShareButton
                              title="Hey ! Vote on my OMG profile , share it to your friends & family, and make me Face of the year !"
                              url={
                                process.env.CLIENT_URL +
                                "challenge-submission/" +
                                this.props.competitionSubmissionById
                                  .competitionSubmissionById.id
                              }
                            >
                              <img src={whatsappIcon} />
                            </WhatsappShareButton>
                          }
                          backgroundColor="white"
                          size={35}
                        />
                        <ChildButton
                          icon={
                            <TwitterShareButton
                              title="Hey ! Vote on my OMG profile , share it to your friends & family, and make me Face of the year !"
                              url={
                                process.env.CLIENT_URL +
                                "challenge-submission/" +
                                this.props.competitionSubmissionById
                                  .competitionSubmissionById.id
                              }
                            >
                              <img src={twitterIcon} />
                            </TwitterShareButton>
                          }
                          backgroundColor="white"
                          size={35}
                        />
                        <ChildButton
                          icon={
                            <CopyToClipboard
                              text={
                                process.env.CLIENT_URL +
                                "challenge-submission/" +
                                this.props.competitionSubmissionById
                                  .competitionSubmissionById.id
                              }
                              onCopy={() =>
                                toast.notify("", {
                                  duration: 5,
                                  type: "success",
                                  position: "top-right",
                                  title: "Copied!",
                                })
                              }
                            >
                              <img src={linkIcon} />
                            </CopyToClipboard>
                          }
                          backgroundColor="white"
                          size={35}
                        />
                      </FloatingMenu>
                    </Col>

                    <Col
                      xs="12"
                      style={{
                        marginTop: "2rem",
                        padding: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      <Link href="/challenges">
                        <Button
                          size="sm"
                          css={`
                            font-size: 1.2rem !important;
                            min-width: 40vw !important;
                            // height: 5vh !important;
                            background: #000 !important;
                            border-radius: 0px !important;
                            // border: none !important;
                            color: #ffffff !important;
                            // border: 1px solid #dadada !important;
                            // box-shadow: 2px 2px 0px #ff0000;
                            padding: 0px !important;
                          `}
                        >
                          View All
                        </Button>
                      </Link>
                    </Col>
                  </>
                ) : (
                  <Text>Incorrect Path</Text>
                )}
              </Row>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default SubmissionDetail;
