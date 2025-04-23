import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import Feed from "react-instagram-authless-feed";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import { destroyCookie } from "nookies";
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
  FloatingMenu,
  MainButton,
  ChildButton,
} from "react-floating-button-menu";
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
import { UPSERT_PROFILE } from "./queries.js";

import { toast } from "react-nextjs-toast";

import closeUpImage from "../../assets/image/profile-form/close-up-placeholder.jpg";
import fullProfileImage from "../../assets/image/profile-form/full-profile-placeholder.jpg";
import midShotImage from "../../assets/image/profile-form/mid-shot-placeholder.jpg";
import fullProfileMaleImage from "../../assets/image/profile-form/full-profile-placeholder-male.jpg";
import midShotMaleImage from "../../assets/image/profile-form/mid-shot-placeholder-male.jpg";
import closeUpMaleImage from "../../assets/image/profile-form/close-up-placeholder-male.jpg";

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

import Top150Upload from "./Top150Upload";
import Top75Upload from "./Top75Upload";
import Top30Upload from "./Top30Upload";
import Top20Upload from "./Top20Upload";
import { marginBottom } from "styled-system";

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
        this.props.profileByCustomerId.insta_link +
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
  }

  constructor(props) {
    super(props);

    let convertedBirthDate = null;
    let convertedBirthDateString = "";

    if (props.profileByCustomerId && props.profileByCustomerId.dob !== null) {
      try {
        convertedBirthDate = moment(
          Number(props.profileByCustomerId.dob)
        ).toDate();

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
      props.customerDetails && props.customerDetails.full_name
        ? props.customerDetails.full_name.split(" ")
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
      gender:
        props.customerDetails && props.customerDetails.gender
          ? props.customerDetails.gender
          : "m",
      slug:
        props.customerDetails && props.customerDetails.slug
          ? props.customerDetails.slug
          : "",
      closeUpPath:
        props.profileByCustomerId && props.profileByCustomerId.pic1
          ? props.profileByCustomerId.pic1
          : null,
      midShotPath:
        props.profileByCustomerId && props.profileByCustomerId.pic2
          ? props.profileByCustomerId.pic2
          : null,
      fullProfilePath:
        props.profileByCustomerId && props.profileByCustomerId.pic3
          ? props.profileByCustomerId.pic3
          : null,
      additionalImagePath:     // Aditional image path for hairstylist
        props.profileByCustomerId && props.profileByCustomerId.pic4
          ? props.profileByCustomerId.pic4
          : null,
      bio:
        props.profileByCustomerId && props.profileByCustomerId.bio
          ? props.profileByCustomerId.bio
          : "",
      birthDate: convertedBirthDateString,
      bioLength:
        props.profileByCustomerId && props.profileByCustomerId.bio
          ? props.profileByCustomerId.bio.length
          : 0,
      introVideoPath:
        props.profileByCustomerId && props.profileByCustomerId.intro_video
          ? props.profileByCustomerId.intro_video
          : null,
      personalityMeaning:
        props.profileByCustomerId &&
          props.profileByCustomerId.personality_meaning
          ? props.profileByCustomerId.personality_meaning
          : null,
      acceptChecked: false,
      height:
        props.profileByCustomerId && props.profileByCustomerId.height
          ? props.profileByCustomerId.height
          : null,
      weight:
        props.profileByCustomerId && props.profileByCustomerId.weight
          ? props.profileByCustomerId.weight
          : null,
      pincode:
        props.profileByCustomerId && props.profileByCustomerId.pincode
          ? props.profileByCustomerId.pincode
          : null,
      stateName:
        props.profileByCustomerId && props.profileByCustomerId.state
          ? props.profileByCustomerId.state
          : null,
      cityName:
        props.profileByCustomerId && props.profileByCustomerId.city
          ? props.profileByCustomerId.city
          : null,
      instagramLink:
        props.profileByCustomerId && props.profileByCustomerId.insta_link
          ? props.profileByCustomerId.insta_link
          : null,
      instagramVerified:
        props.profileByCustomerId && props.profileByCustomerId.insta_verified
          ? props.profileByCustomerId.insta_verified
          : null,
      firstName: firstName,
      lastName: lastName,
      final_status:
        props.profileByCustomerId && props.profileByCustomerId.final_status
          ? props.profileByCustomerId.final_status
          : null,
    };

  }

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
  extractFieldsFromBio(bio) {
    const fields = {
      "Specialization": null,
      "Work Experience": null,
      "Salon/Business Name": null,
      "Participation Reason": null,
      "Willing to Travel": null,
      "Allergies/Medical Conditions": null
    };

    for (const field in fields) {
      const regex = new RegExp(`${field}: (.+)`);
      const match = bio.match(regex);
      if (match) {
        fields[field] = match[1].trim();
      }
    }

    return fields;
  }
  onChangeAccepted = (e) => {
    this.setState({ acceptChecked: e.target.checked });
  };

  logOutUser = () => {
    destroyCookie(null, "token");
    setTimeout(function () {
      Router.push({
        pathname: "/login",
      });
    }, 500);
  };

  allFields = () => {
    if (
      this.state.closeUpPath === null ||
      this.state.closeUpPath === "" ||
      (this.state.gender !== "h" && (
        this.state.midShotPath === null ||
        this.state.midShotPath === "" ||
        this.state.fullProfilePath === null ||
        this.state.fullProfilePath === ""
        // ||
        // this.state.additionalImagePath === null
      )) ||
      // this.state.introVideoPath === null ||
      // this.state.introVideoPath === "" ||
      this.state.personalityMeaning === null ||
      this.state.personalityMeaning.length === 0 ||
      // this.state.bio.length < 100 ||
      this.state.height === null ||
      this.state.height === "" ||
      this.state.weight === null ||
      this.state.weight === "" ||
      this.state.birthDate === null ||
      this.state.birthDate === "" ||
      this.state.pincode === null ||
      this.state.pincode === "" ||
      this.state.instagramLink === null ||
      this.state.instagramLink === "" ||
      !this.state.instagramLink
    ) {
      return false;
    } else {
      return true;
    }
  };

  updateProfile = (e, upsertProfileMutation) => {
    let variables = {
      final_status: "pending",
    };

    upsertProfileMutation({ variables })
      .then((results) => {
        toast.notify("", {
          duration: 5,
          type: "success",
          position: "top-right",
          title: "Submitted successfully",
        });

        this.setState({
          formMessage: "",
          hideButtons: true,
          final_status: "pending",
        });
        Router.push("/successful-submission");
      })
      .catch((error) => {
        this.setState({
          formMessage: Object.values(error)[0][0].message,
          hideButtons: false,
        });
      });
  };

  render() {
    return (
      <Mutation mutation={UPSERT_PROFILE}>
        {(upsertProfileMutation, { data, loading, error }) => (
          <Section pb={"30px"} pt={"70px"}>
            <Box
              // mb={"40px"}
              // mt={"40px"}
              // pb={"30px"}
              pt={"20px"}
              pl={"10px"}
              pr={"10px"}
            >
              {this.props.customerDetails &&
                this.props.customerDetails.id &&
                this.allFields() ? (
                <>
                  <Container>
                    <Row>
                      <Col xs="8">
                        <Text
                          fontSize="18px"
                          as="h4"
                          variant="contestant-name"
                        // style={{ paddingBottom: "18px" }}
                        >
                          {this.state.firstName}
                          <br />
                          {this.state.lastName}
                        </Text>
                      </Col>

                      <Col xs="4">
                        {this.state.final_status !== "pending" &&
                          this.state.final_status !== "approved" ? (
                          <>
                            <Link href="/profile-form">
                              <a>
                                <Text
                                  variant="small"
                                  style={{
                                    float: "right",
                                    paddingRight: "0.5rem",
                                    textDecoration: "underline",
                                  }}
                                  color="#000000"
                                >
                                  Edit Profile
                                </Text>
                              </a>
                            </Link>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  </Container>
                  <hr style={{ paddingBottom: "10px" }} />


                  {this.props.profileByCustomerId &&
                    this.props.profileByCustomerId.is_in_top5 && (
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
                                  SWIPE THE CROWN
                                </span>
                              </Text>

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
                                  IN PROGRESS
                                </span>
                              </Text>

                              {/* {this.props.profileByCustomerId.is_in_top5 ? (
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
                              )} */}
                            </Col>
                          </Row>
                        </Container>



                        <hr />
                      </>
                    )}


                  {this.props.profileByCustomerId &&
                    this.props.profileByCustomerId.is_in_top10 && (
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
                                  PERSONAL INTERVIEW
                                </span>
                              </Text>


                              {this.props.profileByCustomerId.is_in_top5 ? (
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
                    )}


                  {this.props.profileByCustomerId &&
                    this.props.profileByCustomerId.is_in_top20 && (
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
                                  WALK AND SYNC
                                </span>
                              </Text>

                              {this.props.profileByCustomerId.is_in_top10 ? (
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

                        {/* <Top20Upload
                          profileData={this.props.profileByCustomerId}
                        /> */}

                        <hr />
                      </>
                    )}

                  {this.props.profileByCustomerId &&
                    this.props.profileByCustomerId.is_in_top30 && (
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
                                  FIT HIT
                                </span>
                              </Text>

                              {this.props.profileByCustomerId.is_in_top20 ? (
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

                        {/* <Top30Upload
                          profileData={this.props.profileByCustomerId}
                        /> */}

                        <hr />
                      </>
                    )}

                  {this.props.profileByCustomerId &&
                    this.props.profileByCustomerId.is_in_top75 && (
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
                                  CAPTURE CON
                                </span>
                              </Text>

                              {this.props.profileByCustomerId.is_in_top30 ? (
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

                        {/* <Top75Upload
                          profileData={this.props.profileByCustomerId}
                        /> */}

                        <hr />
                      </>
                    )}

                  {this.props.profileByCustomerId &&
                    this.props.profileByCustomerId.is_in_top150 && (
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
                                  LEVEL 1 <br />
                                  TALENT EXTRAVAGANZA
                                </span>
                              </Text>

                              {this.props.profileByCustomerId.is_in_top75 ? (
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

                        {/* <Top150Upload
                          profileData={this.props.profileByCustomerId}
                        /> */}

                        <hr />
                      </>
                    )}

                  <Container>
                    <Row>
                      <Col
                        xs="12"
                        style={{ paddingLeft: "15px", paddingRight: "15px" }}
                      >
                        <Text fontSize="18px" as="h4" variant="contestant-name">
                          <span style={{ fontSize: "16px" }}>LEADERBOARD</span>
                        </Text>

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

                        {/* {this.props.profileByCustomerId.is_in_top500 ? (
                          <Text
                            fontSize="18px"
                            as="h4"
                            variant="contestant-name"
                            style={{ paddingBottom: "18px" }}
                          >
                            <span
                              style={{ color: "#008f00", fontSize: "14px" }}
                            >
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
                            <span
                              style={{ color: "#FF0000", fontSize: "14px" }}
                            >
                              ELIMINATED
                            </span>
                          </Text>
                        )} */}
                      </Col>
                    </Row>
                  </Container>

                  <Box>
                    {this.state.closeUpPath && !this.state.midShotPath && !this.state.fullProfilePath ? (
                      // Single image box for gender 'h'
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
                      // Slider for other genders
                      <SliderStyled {...slickSettings}>
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
                      </SliderStyled>
                    )}
                  </Box>
                  {/* <Box
                    mb={3}
                    style={{
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      paddingTop: "15px",
                    }}
                  >
                    <Text style={{ wordBreak: "break-all" }}>
                      {this.state.bio}
                    </Text>
                  </Box> */}
                  <Box
                    mb={3}
                    style={{
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      paddingTop: "15px",
                    }}
                  >
                    <Text style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}>
                      {this.state.gender === "h" ? (
                        <>
                          {/* {this.state.bio} */}
                          {"\n\n"}  {/* Add spacing between sections */}
                          {/* Extract fields from bio */}
                          {Object.entries(this.extractFieldsFromBio(this.state.bio)).map(([key, value]) => (
                            value ?
                              <>
                                <span style={{ marginBottom: "10px", display: "block" }} key={key}>
                                  {`${key}: `}
                                  <strong>{value}</strong>
                                </span>
                              </> : null
                          ))}
                        </>
                      ) : (
                        this.state.bio
                      )}
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
                            {this.state.personalityMeaning &&
                              this.state.personalityMeaning.join(", ")}
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
                  {/* {this.state.instagramVerified ? (
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
                  ) : null} */}
                  <Box
                    mb={3}
                    style={{
                      marginTop: "30px",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                    }}
                  >
                    <Row className="mt-3">
                      <Col xs="9">
                        <Text variant="small" color="#000000" width="90%">
                          Current profile status -{" "}
                          <strong>
                            {this.state.final_status.toUpperCase()}
                          </strong>
                          .
                        </Text>
                      </Col>
                      <Col xs="3">
                        <Text
                          variant="small"
                          color="#000000"
                          onClick={this.logOutUser}
                          style={{
                            float: "right",
                            textDecoration: "underline",
                            fontWeight: "600",
                            paddingRight: "5px",
                          }}
                        >
                          Logout
                        </Text>
                      </Col>
                    </Row>
                  </Box>
                  {this.state.final_status === "draft" ||
                    this.state.final_status === "rejected" ? (
                    <Box
                      mb={3}
                      style={{
                        paddingLeft: "15px",
                        paddingRight: "15px",
                      }}
                    >
                      <Row>
                        <Col xs="12">
                          {this.state.formMessage &&
                            this.state.formMessage !== "" ? (
                            <div style={{ minHeight: "22px" }}>
                              <Text variant="error" color="#FFFFFF">
                                {this.state.formMessage}
                              </Text>
                            </div>
                          ) : null}
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col xs="12" className="text-center">
                          <Button
                            width="100%"
                            type="submit"
                            variant="custom"
                            borderRadius={10}
                            onClick={(e) =>
                              this.updateProfile(
                                e,
                                upsertProfileMutation,
                                "final"
                              )
                            }
                          >
                            SUBMIT
                          </Button>
                        </Col>
                      </Row>
                    </Box>
                  ) : null}
                  {this.state.final_status === "pending" ? (
                    <Box
                      mb={3}
                      style={{
                        marginTop: "30px",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                      }}
                    >
                      <Row className="mt-3">
                        <Col xs="12">
                          <Text variant="small" color="#000000" width="90%">
                            Profile submitted successfully. Your profile is
                            currently under review. You would recieve and email
                            with further updates within 48 hours.
                          </Text>
                        </Col>
                      </Row>
                    </Box>
                  ) : null}
                  {this.state.final_status === "approved" ? (
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
                        {/* {this.state.isOpen ? null : (
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
                            </FloatingMenu>
                          </Col>
                        )} */}
                      </Row>
                      <hr />
                    </Box>
                  ) : null}
                </>
              ) : this.props.customerDetails &&
                this.props.customerDetails.id &&
                !this.props.allFields ? (
                <Container style={{ minHeight: "70vh" }}>
                  <Text variant="bold">
                    Please fill all fields in the profile form.
                    <br />
                    <br />
                  </Text>
                  <Link href="/profile-form">
                    <a>
                      <Button
                        width="100%"
                        type="submit"
                        variant="custom"
                        borderRadius={10}
                      >
                        Complete Profile
                      </Button>
                    </a>
                  </Link>
                </Container>
              ) : (
                <Container style={{ minHeight: "70vh" }}>
                  <Text variant="bold">
                    Please login to continue
                    <br />
                    <br />
                  </Text>
                  <Link href="/login">
                    <a>
                      <Button
                        width="100%"
                        type="submit"
                        variant="custom"
                        borderRadius={10}
                      >
                        Login
                      </Button>
                    </a>
                  </Link>
                </Container>
              )}
            </Box>
          </Section>
        )}
      </Mutation>
    );
  }
}

export default ProfileForm;
