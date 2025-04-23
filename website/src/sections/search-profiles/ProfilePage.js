import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import Feed from "react-instagram-authless-feed";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import { setCookie, parseCookies } from "nookies";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
// import { pincodeData } from "./pincodeData";
import _ from "lodash";
import moment from "moment";
import { Mutation } from "react-apollo";
import { ADD_PROFILE_LIKE } from "./queries.js";

import { toast } from "react-nextjs-toast";

import {
  FloatingMenu,
  MainButton,
  ChildButton,
} from "react-floating-button-menu";
import shareIcon from "../../assets/image/icons/share.png";
import facebookIcon from "../../assets/image/icons/facebook.png";
import twitterIcon from "../../assets/image/icons/twitter.png";
import whatsappIcon from "../../assets/image/icons/whatsapp.png";
import linkIcon from "../../assets/image/icons/link.png";
import likeIcon from "../../assets/image/icons/like.png";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
const axios = require("axios");

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const SliderStyled = styled(Slider)`
  margin-left: -10px;
  margin-right: -10px;
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

const slickSettings = {
  dots: true,
  infinite: false,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: false,
  // centerPadding: "5px",
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

class ProfileForm extends Component {
  async componentDidMount() {
    window.scrollTo(0, 0);

    try {
      const userInfoSource = await axios.get(
        "https://www.instagram.com/" +
        this.props.customerBySlug.insta_link +
        "/"
      );
      const jsonObject = userInfoSource.data
        .match(
          /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/
        )[1]
        .slice(0, -1);

      const userInfo = JSON.parse(jsonObject);
      this.setState({
        userInstaFollowers:
          userInfo.entry_data.ProfilePage[0].graphql.user.edge_followed_by
            .count,
      });
    } catch (error) {
      this.setState({ userInstaFollowers: 0 });
    }

    try {
      const getData = await axios.get("https://api.ipify.org?format=json");
      this.setState({ ip_address: getData.data.ip });
    } catch (error) {
      this.setState({ ip_address: "127.0.0.1" });
    }
  }

  constructor(props) {
    super(props);

    let selfProfile = false;

    if (
      props.customerBySlug &&
      props.customerBySlug.id &&
      props.customerBySlug.id === props.loggedInUserId
    ) {
      selfProfile = true;
    }

    let onlineVoting = false;

    if (props.contestStages) {
      props.contestStages.forEach((stageDetail) => {
        if (stageDetail.stage === "online_voting" && stageDetail.active)
          onlineVoting = true;
      });
    }

    let convertedBirthDate = null;
    let convertedBirthDateString = "";

    if (props.customerBySlug && props.customerBySlug.dob !== null) {
      try {
        convertedBirthDate = moment(Number(props.customerBySlug.dob)).toDate();

        var dd = convertedBirthDate.getDate();
        var mm = convertedBirthDate
          .toLocaleString("default", {
            month: "long",
          })
          .substr(0, 3);
        var yyyy = convertedBirthDate.getFullYear();

        convertedBirthDateString = dd + " " + mm + " " + yyyy;
      } catch (error) {
        convertedBirthDate = null;
        convertedBirthDateString = "";
      }
    }

    let fullNameArray =
      props.customerBySlug && props.customerBySlug.full_name
        ? props.customerBySlug.full_name.split(" ")
        : [""];

    let firstName, lastName;

    if (fullNameArray.length > 1) {
      firstName = fullNameArray[0] + "";
      fullNameArray.shift();
      lastName = fullNameArray.join(" ");
    } else {
      firstName = fullNameArray[0];
    }

    this.state = {
      selfProfile: selfProfile,
      onlineVoting: onlineVoting,
      customerId:
        props.customerBySlug && props.customerBySlug.id
          ? props.customerBySlug.id
          : null,
      slug:
        props.customerBySlug && props.customerBySlug.slug
          ? props.customerBySlug.slug
          : null,
      closeUpPath:
        props.customerBySlug && props.customerBySlug.pic1
          ? props.customerBySlug.pic1
          : null,
      midShotPath:
        props.customerBySlug && props.customerBySlug.pic2
          ? props.customerBySlug.pic2
          : null,
      fullProfilePath:
        props.customerBySlug && props.customerBySlug.pic3
          ? props.customerBySlug.pic3
          : null,
      additionalImagePath:
        props.customerBySlug && props.customerBySlug.pic4
          ? props.customerBySlug.pic4
          : null,
      bio:
        props.customerBySlug && props.customerBySlug.bio
          ? props.customerBySlug.bio
          : "",
      birthDate: convertedBirthDateString,
      bioLength:
        props.customerBySlug && props.customerBySlug.bio
          ? props.customerBySlug.bio.length
          : 0,
      introVideoPath:
        props.customerBySlug && props.customerBySlug.intro_video
          ? props.customerBySlug.intro_video
          : null,
      personalityMeaning:
        props.customerBySlug && props.customerBySlug.personality_meaning
          ? props.customerBySlug.personality_meaning
          : null,
      acceptChecked: false,
      height:
        props.customerBySlug && props.customerBySlug.height
          ? props.customerBySlug.height
          : null,
      weight:
        props.customerBySlug && props.customerBySlug.weight
          ? props.customerBySlug.weight
          : null,
      pincode:
        props.customerBySlug && props.customerBySlug.pincode
          ? props.customerBySlug.pincode
          : null,
      stateName:
        props.customerBySlug && props.customerBySlug.state
          ? props.customerBySlug.state
          : null,
      cityName:
        props.customerBySlug && props.customerBySlug.city
          ? props.customerBySlug.city
          : null,
      instagramVerified:
        props.customerBySlug && props.customerBySlug.insta_verified
          ? props.customerBySlug.insta_verified
          : null,
      instagramLink:
        props.customerBySlug && props.customerBySlug.insta_link
          ? props.customerBySlug.insta_link
          : null,
      firstName: firstName,
      lastName: lastName,
      votedMessage: "",
    };
  }

  addVote = (customerId, addProfileLike) => {
    let existingVotedIDs = [];

    try {
      existingVotedIDs = localStorage.getItem("deviceInfo")
        ? JSON.parse(localStorage.getItem("deviceInfo"))
        : [];
    } catch (error) {
      existingVotedIDs = [];
    }

    if (existingVotedIDs.includes(customerId)) {
      this.setState({
        votedMessage:
          "Your vote has already been recorded for the profile. Thank you.",
      });
    } else {
      addProfileLike({
        variables: {
          customer_id: customerId,
          ip_address: this.state.ip_address,
        },
      })
        .then((results) => {
          if (Object.values(results.data)[0]) {
            this.setState(
              {
                voted: true,
                votedMessage: "Thank you! Your vote has been captured.",
              },
              () => {
                window.scrollTo(0, document.body.scrollHeight);

                existingVotedIDs.push(customerId);

                localStorage.setItem(
                  "deviceInfo",
                  JSON.stringify(existingVotedIDs)
                );
              }
            );
          }
        })
        .catch((error) => {
          this.setState({
            votedMessage:
              "Your vote has already been recorded for the profile. Thank you.",
          });
        });
    }
  };

  abbreviateNumber(number) {
    if (!number) {
      number = 0;
    }
    // what tier? (determines SI symbol)
    var tier = (Math.log10(number) / 3) | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }
  parseAndTrimBioFields = (bio) => {
    if (!bio) return {};

    // Define the fields to extract
    const fields = [
      "Specialization",
      "Work Experience",
      "Salon/Business Name",
      "Participation Reason",
      "Willing to Travel",
      "Allergies/Medical Conditions",
    ];

    // Initialize an object to store trimmed fields
    const parsedFields = {};

    // Split bio into lines and parse each field
    bio.split("\n").forEach((line) => {
      fields.forEach((field) => {
        if (line.startsWith(field)) {
          parsedFields[field] = line.replace(`${field}:`, "").trim();
        }
      });
    });

    return parsedFields;
  };

  render() {
    return (
      <Mutation mutation={ADD_PROFILE_LIKE}>
        {(addProfileLike, { data, loading, error }) => (
          <Section pb={"10px"} pt={"70px"}>
            <Box
              // mb={"40px"}
              // mt={"40px"}
              // pb={"30px"}
              pt={"20px"}
              pl={"10px"}
              pr={"10px"}
            >
              <>
                <Container>
                  <Row>
                    <Col xs="8">
                      <Text
                        fontSize="18px"
                        as="h4"
                        variant="contestant-name"
                        style={{ paddingBottom: "18px" }}
                      >
                        {this.state.firstName}
                        <br />
                        {this.state.lastName}
                      </Text>
                    </Col>
                    <Col xs="4"></Col>
                  </Row>
                </Container>

                <hr style={{ paddingBottom: "10px" }} />

                {/* {this.props.customerBySlug &&
                  this.props.customerBySlug.is_in_top5 && (
                    <>
                      <Container>
                        <Row>
                          <Col
                            xs="12"
                            style={{
                              paddingLeft: "15px",
                              paddingRight: "15px",
                            }}
                          >
                            <Text
                              fontSize="18px"
                              as="h4"
                              variant="contestant-name"
                            >
                              <span style={{ fontSize: "16px" }}>
                                LEVEL 7 <br />
                                SWIPE THE CROWN
                              </span>
                            </Text>

                            <Text
                              fontSize="18px"
                              as="h4"
                              variant="contestant-name"
                              // style={{ paddingBottom: "18px" }}
                            >
                              <span
                                style={{ fontSize: "14px", color: "#FF0000" }}
                              >
                                IN PROGRESS
                              </span>
                            </Text>
                          </Col>
                        </Row>
                      </Container>
                      <hr />
                    </>
                  )} */}

                {/* {this.props.customerBySlug &&
                  this.props.customerBySlug.is_in_top20 && (
                    <>
                      <Container>
                        <Row>
                          <Col
                            xs="12"
                            style={{
                              paddingLeft: "15px",
                              paddingRight: "15px",
                            }}
                          >
                            <Text
                              fontSize="18px"
                              as="h4"
                              variant="contestant-name"
                            >
                              <span style={{ fontSize: "16px" }}>
                                LEVEL 6 <br />
                                WALK AND SYNC
                              </span>
                            </Text>

                            {this.props.customerBySlug.is_in_top5 ? (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#008f00",
                                    fontSize: "14px",
                                  }}
                                >
                                  QUALIFIED
                                </span>
                              </Text>
                            ) : (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#FF0000",
                                    fontSize: "14px",
                                  }}
                                >
                                  ELIMINATED
                                </span>
                              </Text>
                            )}
                          </Col>
                        </Row>
                      </Container>
                      {this.props.customerBySlug &&
                        this.props.customerBySlug.top_20_video_link && (
                          <ReactPlayer
                            url={
                              process.env.REACT_APP_IMAGE_URL +
                              process.env.REACT_APP_TOP_20_VIDEO_PATH +
                              this.props.customerBySlug.top_20_video_link
                            }
                            width="100%"
                            height="20vh"
                            controls
                          />
                        )}
                      <hr />
                    </>
                  )} */}

                {/* {this.props.customerBySlug &&
                  this.props.customerBySlug.is_in_top30 && (
                    <>
                      <Container>
                        <Row>
                          <Col
                            xs="12"
                            style={{
                              paddingLeft: "15px",
                              paddingRight: "15px",
                            }}
                          >
                            <Text
                              fontSize="18px"
                              as="h4"
                              variant="contestant-name"
                            >
                              <span style={{ fontSize: "16px" }}>
                                LEVEL 5 <br />
                                FIT HIT
                              </span>
                            </Text>

                            {this.props.customerBySlug.is_in_top30 ? (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#008f00",
                                    fontSize: "14px",
                                  }}
                                >
                                  QUALIFIED
                                </span>
                              </Text>
                            ) : (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#FF0000",
                                    fontSize: "14px",
                                  }}
                                >
                                  ELIMINATED
                                </span>
                              </Text>
                            )}
                          </Col>
                        </Row>
                      </Container>
                      {this.props.customerBySlug &&
                        this.props.customerBySlug.top_30_video_link && (
                          <ReactPlayer
                            url={
                              process.env.REACT_APP_IMAGE_URL +
                              process.env.REACT_APP_TOP_30_VIDEO_PATH +
                              this.props.customerBySlug.top_30_video_link
                            }
                            width="100%"
                            height="20vh"
                            controls
                          />
                        )}
                      <hr />
                    </>
                  )} */}

                {/* {this.props.customerBySlug &&
                  this.props.customerBySlug.is_in_top75 && (
                    <>
                      <Container>
                        <Row>
                          <Col
                            xs="12"
                            style={{
                              paddingLeft: "15px",
                              paddingRight: "15px",
                            }}
                          >
                            <Text
                              fontSize="18px"
                              as="h4"
                              variant="contestant-name"
                            >
                              <span style={{ fontSize: "16px" }}>
                                LEVEL 4 <br />
                                CAPTURE CON
                              </span>
                            </Text>

                            {this.props.customerBySlug.is_in_top30 ? (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#008f00",
                                    fontSize: "14px",
                                  }}
                                >
                                  QUALIFIED
                                </span>
                              </Text>
                            ) : (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#FF0000",
                                    fontSize: "14px",
                                  }}
                                >
                                  ELIMINATED
                                </span>
                              </Text>
                            )}
                          </Col>
                        </Row>
                      </Container>
                      {this.props.customerBySlug &&
                        this.props.customerBySlug.top_75_video_link && (
                          <ReactPlayer
                            url={
                              process.env.REACT_APP_IMAGE_URL +
                              process.env.REACT_APP_TOP_75_VIDEO_PATH +
                              this.props.customerBySlug.top_75_video_link
                            }
                            width="100%"
                            height="30vh"
                            controls
                          />
                        )}
                      <hr />
                    </>
                  )} */}

                {/* {this.props.customerBySlug &&
                  this.props.customerBySlug.is_in_top150 && (
                    <>
                      <Container>
                        <Row>
                          <Col
                            xs="12"
                            style={{
                              paddingLeft: "15px",
                              paddingRight: "15px",
                            }}
                          >
                            <Text
                              fontSize="18px"
                              as="h4"
                              variant="contestant-name"
                            >
                              <span style={{ fontSize: "16px" }}>
                                LEVEL 3 <br />
                                TALENT EXTRAVAGANZA
                              </span>
                            </Text>

                            {this.props.customerBySlug.is_in_top75 ? (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#008f00",
                                    fontSize: "14px",
                                  }}
                                >
                                  QUALIFIED
                                </span>
                              </Text>
                            ) : (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#FF0000",
                                    fontSize: "14px",
                                  }}
                                >
                                  ELIMINATED
                                </span>
                              </Text>
                            )}
                          </Col>
                        </Row>
                      </Container>
                      {this.props.customerBySlug &&
                        this.props.customerBySlug.top_150_video_link && (
                          <ReactPlayer
                            url={
                              process.env.REACT_APP_IMAGE_URL +
                              process.env.REACT_APP_TOP_150_VIDEO_PATH +
                              this.props.customerBySlug.top_150_video_link
                            }
                            width="100%"
                            height="30vh"
                            controls
                          />
                        )}
                      <hr />
                    </>
                  )} */}

                {/* {this.props.customerBySlug &&
                  this.props.customerBySlug.is_in_top500 && (
                    <>
                      <Container>
                        <Row>
                          <Col
                            xs="12"
                            style={{
                              paddingLeft: "15px",
                              paddingRight: "15px",
                            }}
                          >
                            <Text
                              fontSize="18px"
                              as="h4"
                              variant="contestant-name"
                            >
                              <span style={{ fontSize: "16px" }}>
                                LEVEL 2 <br />
                                CHARISMATIC PERSONA
                              </span>
                            </Text>

                            {this.props.customerBySlug.is_in_top150 ? (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#008f00",
                                    fontSize: "14px",
                                  }}
                                >
                                  QUALIFIED
                                </span>
                              </Text>
                            ) : (
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                              >
                                <span
                                  style={{
                                    color: "#FF0000",
                                    fontSize: "14px",
                                  }}
                                >
                                  ELIMINATED
                                </span>
                              </Text>
                            )}
                          </Col>
                        </Row>
                      </Container>

                      <hr />
                    </>
                  )} */}

                {/* <Container>
                  <Row>
                    <Col
                      xs="12"
                      style={{ paddingLeft: "15px", paddingRight: "15px" }}
                    >
                      <Text fontSize="18px" as="h4" variant="contestant-name">
                        <span style={{ fontSize: "16px" }}>
                          LEVEL 1 <br />
                          LEADERBOARD
                        </span>
                      </Text>

                      {this.props.customerBySlug.is_in_top500 ? (
                        <Text
                          fontSize="18px"
                          as="h4"
                          variant="contestant-name"
                          style={{ paddingBottom: "18px" }}
                        >
                          <span style={{ color: "#008f00", fontSize: "14px" }}>
                            QUALIFIED
                          </span>
                        </Text>
                      ) : (
                        <Text
                          fontSize="18px"
                          as="h4"
                          variant="contestant-name"
                          style={{ paddingBottom: "18px" }}
                        >
                          <span style={{ color: "#FF0000", fontSize: "14px" }}>
                            ELIMINATED
                          </span>
                        </Text>
                      )}
                    </Col>
                  </Row>
                </Container> */}

                <Box>
                  {this.state.closeUpPath && !this.state.midShotPath && !this.state.fullProfilePath ? (
                    // Single image box for gender 'h' (only close-up image available)
                    <Box
                      css={`
                        &:focus {
                          outline: none;
                        }
                        position: relative;
                      `}
                    >
                      <img
                        src={
                          this.state.closeUpChanged
                            ? this.state.closeUp
                            : this.state.closeUpPath
                              ? process.env.REACT_APP_IMAGE_URL +
                                process.env.REACT_APP_PROFILE_IMAGE_PATH +
                                this.state.closeUpPath
                              : this.state.closeUp
                                ? this.state.closeUp
                                : closeUpImage
                        }
                        alt=""
                        width="102%"
                        style={{ margin: "0 -2px" }}
                      />
                    </Box>
                  ) : (
                    // Slider for other genders (multiple images available)
                    <SliderStyled {...slickSettings}>
                      {/* Close-up image */}
                      {this.state.closeUpPath && (
                        <Box
                          css={`
                            &:focus {
                              outline: none;
                            }
                            position: relative;
                          `}
                        >
                          <img
                            src={
                              this.state.closeUpChanged
                                ? this.state.closeUp
                                : this.state.closeUpPath
                                  ? process.env.REACT_APP_IMAGE_URL +
                                    process.env.REACT_APP_PROFILE_IMAGE_PATH +
                                    this.state.closeUpPath
                                  : this.state.closeUp
                                    ? this.state.closeUp
                                    : closeUpImage
                            }
                            alt=""
                            width="102%"
                            style={{ margin: "0 -2px" }}
                          />
                        </Box>
                      )}
                      
                      {/* Mid-shot image */}
                      {this.state.midShotPath && (
                        <Box
                          css={`
                            &:focus {
                              outline: none;
                            }
                            position: relative;
                          `}
                        >
                          <img
                            src={
                              this.state.midShotChanged
                                ? this.state.midShot
                                : this.state.midShotPath
                                  ? process.env.REACT_APP_IMAGE_URL +
                                    process.env.REACT_APP_PROFILE_IMAGE_PATH +
                                    this.state.midShotPath
                                  : this.state.midShot
                                    ? this.state.midShot
                                    : midShotImage
                            }
                            alt=""
                            width="102%"
                            style={{ margin: "0 -2px" }}
                          />
                        </Box>
                      )}
                      
                      {/* Full profile image */}
                      {this.state.fullProfilePath && (
                        <Box
                          css={`
                            &:focus {
                              outline: none;
                            }
                            position: relative;
                          `}
                        >
                          <img
                            src={
                              this.state.fullProfileChanged
                                ? this.state.fullProfile
                                : this.state.fullProfilePath
                                  ? process.env.REACT_APP_IMAGE_URL +
                                    process.env.REACT_APP_PROFILE_IMAGE_PATH +
                                    this.state.fullProfilePath
                                  : this.state.fullProfile
                                    ? this.state.fullProfile
                                    : fullProfileImage
                            }
                            alt=""
                            width="102%"
                            style={{ margin: "0 -2px" }}
                          />
                        </Box>
                      )}
                    </SliderStyled>
                  )}
                </Box>
                <Box
                  mb={3}
                  style={{
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    paddingTop: "15px",
                  }}
                >
                  <Text style={{ wordBreak: "break-all" }}>
                    {(this.state.additionalImagePath )
                      ? Object.entries(this.parseAndTrimBioFields(this.state.bio)).map(
                        ([key, value]) => (
                          <span key={key}>
                            {`${key}: `}
                            <strong>{value}</strong>
                            <br />
                          </span>
                        )
                      )
                      : this.state.bio}
                  </Text>
                </Box>

                <Box
                  mb={3}
                  style={{
                    marginTop: "20px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <Row>
                    <Col xs="12">
                      <Text
                        variant="small"
                        className="pt-2 input-title"
                        color="#000000"
                      >
                        WHAT DOES PERSONALITY MEAN TO YOU ?{" "}
                      </Text>
                      <Text
                        variant="small"
                        className="input-title"
                        color="#000000"
                      >
                        <strong>
                          {this.state.personalityMeaning.join(", ")}
                        </strong>
                      </Text>
                    </Col>
                  </Row>
                </Box>

                <Box
                  mb={3}
                  style={{
                    marginTop: "20px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <Row>
                    <Col xs="6">
                      <Text
                        variant="small"
                        className="pt-2 input-title"
                        color="#000000"
                      >
                        DOB - <strong>{this.state.birthDate}</strong>
                      </Text>
                    </Col>
                    <Col xs="6">
                      <Text
                        variant="small"
                        className="pt-2 input-title"
                        color="#000000"
                      >
                        Height - <strong>{this.state.height}</strong>
                      </Text>
                    </Col>
                    <Col xs="6">
                      <Text
                        variant="small"
                        className="pt-2 input-title"
                        color="#000000"
                      >
                        Weight - <strong>{this.state.weight + " kgs"}</strong>
                      </Text>
                    </Col>
                    <Col xs="6">
                      <Text
                        variant="small"
                        className="pt-2 input-title"
                        color="#000000"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          display: "block",
                          textOverflow: "ellipsis",
                        }}
                      >
                        City - <strong>{this.state.cityName}</strong>
                      </Text>
                    </Col>
                  </Row>
                </Box>
                <Box
                  mb={3}
                  style={{
                    marginTop: "30px",
                    marginLeft: "-10px",
                    marginRight: "-10px",
                  }}
                >
                  {/* <ReactPlayer
                url={
                  process.env.REACT_APP_IMAGE_URL +
                  process.env.REACT_APP_PROFILE_IMAGE_PATH +
                  this.state.introVideoPath
                }
                width="100%"
                height="32vh"
                controls={true}
              /> */}
                  {/* <video
                    src={
                      process.env.REACT_APP_IMAGE_URL +
                      process.env.REACT_APP_PROFILE_IMAGE_PATH +
                      this.state.introVideoPath +
                      "#t=0.1"
                    }
                    width="100%"
                    controls
                    style={{ paddingLeft: "25px", paddingRight: "25px" }}
                  /> */}
                </Box>

                <Box
                  mb={3}
                  style={{
                    marginTop: "30px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <Row>
                    <Col xs="12">
                      <Text variant="bold" color="#000000">
                        INSTAGRAM
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6">
                      <a
                        href={
                          "https://www.instagram.com/" +
                          this.state.instagramLink
                        }
                        target="_blank"
                      >
                        <Text
                          variant="small"
                          style={{ paddingRight: "5px" }}
                          color="#000000"
                        >
                          @{this.state.instagramLink}
                        </Text>
                      </a>
                    </Col>
                    <Col xs="6">
                      <a
                        href={
                          "https://www.instagram.com/" +
                          this.state.instagramLink
                        }
                        target="_blank"
                      >
                        {/* <Text
                          variant="small"
                          style={{ textAlign: "right", paddingRight: "5px" }}
                          color="#000000"
                        >
                          {this.abbreviateNumber(
                            this.state.userInstaFollowers
                              ? this.state.userInstaFollowers
                              : 0
                          ) + " followers"}
                        </Text> */}
                      </a>
                    </Col>
                  </Row>
                </Box>

                {this.state.instagramVerified ? (
                  <Box
                    mb={3}
                    style={{
                      paddingLeft: "15px",
                      paddingRight: "15px",
                    }}
                  >
                    <Feed
                      userName={this.state.instagramLink}
                      className="Feed"
                      classNameLoading="Loading"
                    />
                  </Box>
                ) : null}

                <Box
                  mb={3}
                  style={{
                    marginTop: "30px",
                    marginBottom: "0px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <Row className="mt-4">
                     <Col xs="6" className="text-center">
                      <FloatingMenu
                        slideSpeed={500}
                        direction="right"
                        spacing={8}
                        isOpen={this.state.isOpen}
                      >
                        <MainButton
                          iconResting={
                            <>
                              <Text
                                variant="small"
                                color="#FFFFFF"
                                className="mr-1"
                              >
                                Share
                              </Text>
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
                          onClick={() =>
                            this.setState({ isOpen: !this.state.isOpen })
                          }
                          size={100}
                          style={{
                            borderRadius: "0px",
                            width: "120px",
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
                                "profiles/" +
                                this.state.slug
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
                                "profiles/" +
                                this.state.slug
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
                                "profiles/" +
                                this.state.slug
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
                                "profiles/" +
                                this.state.slug
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
                   {this.state.isOpen ||
                    !this.state.onlineVoting ||
                    this.state.selfProfile ? null : this.state.voted ? (
                      <Col xs="6">
                        <FloatingMenu style={{ float: "right" }}>
                          <MainButton
                            iconResting={
                              <>
                                <Text
                                  variant="small"
                                  color="#FFFFFF"
                                  className="mr-1"
                                >
                                  Voted !
                                </Text>
                                <img
                                  src={likeIcon}
                                  width="16px"
                                  height="16px"
                                  style={{
                                    marginTop: "3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </>
                            }
                            iconActive={
                              <>
                                <img
                                  src={likeIcon}
                                  width="20px"
                                  height="20px"
                                  style={{ marginTop: "2px" }}
                                />
                              </>
                            }
                            size={100}
                            style={{
                              borderRadius: "0px",
                              width: "120px",
                              height: "40px",
                              backgroundColor: "#000",
                              color: "white",
                            }}
                          />
                        </FloatingMenu>
                      </Col>
                    ) : (
                      <Col xs="6">
                        <FloatingMenu style={{ float: "right" }}>
                          <MainButton
                            iconResting={
                              <>
                                <Text
                                  variant="small"
                                  color="#FFFFFF"
                                  className="mr-1"
                                >
                                  Vote
                                </Text>
                                <img
                                  src={likeIcon}
                                  width="16px"
                                  height="16px"
                                  style={{
                                    marginTop: "3px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </>
                            }
                            iconActive={
                              <>
                                <img
                                  src={likeIcon}
                                  width="20px"
                                  height="20px"
                                  style={{ marginTop: "2px" }}
                                />
                              </>
                            }
                            onClick={() =>
                              this.addVote(
                                this.state.customerId,
                                addProfileLike
                              )
                            }
                            size={100}
                            style={{
                              borderRadius: "0px",
                              width: "120px",
                              height: "40px",
                              backgroundColor: "#000",
                              color: "white",
                            }}
                          />
                        </FloatingMenu>
                      </Col>
                    )}
                    {this.state.votedMessage &&
                      this.state.votedMessage !== "" ? (
                      <Box
                        mb={3}
                        style={{
                          marginTop: "30px",
                          paddingLeft: "15px",
                          paddingRight: "15px",
                          marginBottom: "10px",
                        }}
                      >
                        <Text variant="bold" color="#000000">
                          {this.state.votedMessage}
                        </Text>
                      </Box>
                    ) : null}
                    {this.state.voted ? (
                      <>
                        <Container
                          className="mt-4 pl-4 pr-4"
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
                            Accelerate your fashion career. <br />
                            Become a part of OMG Face Of The Year today.
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
                          <br />
                          <Link
                            href="/home"
                            className="mt-3"
                            style={{
                              color: "rgb(255 255 255) !important",
                            }}
                          >
                            <Text
                              variant="bold"
                              color="#FFFFFF"
                              className="mt-4"
                              style={{
                                textDecoration: "underline",
                                marginTop: "10px",
                                opacity: "1",
                              }}
                            >
                              Visit Home
                            </Text>
                          </Link>
                        </Container>
                      </>
                    ) : null}
                  </Row>
                  <hr />
                </Box>
              </>
            </Box>
          </Section>
        )}
      </Mutation>
    );
  }
}

export default ProfileForm;
