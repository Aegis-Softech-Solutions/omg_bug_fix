import React, { Component } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";
import { Mutation } from "react-apollo";
import { UPSERT_COMPETITION_SUBMISSION } from "./queries.js";
import ReactPlayer from "react-player";
import ReactModal from "react-modal";
import { toast } from "react-nextjs-toast";

import instagramVideo from "../../assets/videos/buyceps-challenge.mp4";

class ChallengeUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formMessage: {},
      showModal: false,
    };
  }

  onSelectImage = (e, upsertMutation, customerID, competitionID) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size / (1024 * 1024) > 3) {
        toast.notify("", {
          duration: 5,
          type: "error",
          position: "top-right",
          title: "Image size should be less than 3MB",
        });
        e.target.value = "";
      } else {
        this.setState({ showModal: true });

        upsertMutation({
          variables: {
            competition_id: competitionID,
            customer_id: customerID,
            media: e.target.files[0],
          },
        })
          .then((results) => {
            this.setState({ formMessage: {}, showModal: false });
            window.location.reload();
          })
          .catch((error) => {
            const intermediateFormMessage = {};
            intermediateFormMessage[competitionID] =
              Object.values(error)[0][0].message;

            this.setState({
              formMessage: intermediateFormMessage,
              showModal: false,
            });
          });
      }
    }
  };

  onSelectVideo = (e, upsertMutation, customerID, competitionID) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size / (1024 * 1024) > 25) {
        toast.notify("", {
          duration: 5,
          type: "error",
          position: "top-right",
          title: "Video size should be less than 25MB",
        });
      } else {
        this.setState({ showModal: true });

        upsertMutation({
          variables: {
            competition_id: competitionID,
            customer_id: customerID,
            media: e.target.files[0],
          },
        })
          .then((results) => {
            this.setState({ formMessage: {}, showModal: false });
            window.location.reload();
          })
          .catch((error) => {
            const intermediateFormMessage = {};
            intermediateFormMessage[competitionID] =
              Object.values(error)[0][0].message;
            this.setState({
              formMessage: intermediateFormMessage,
              showModal: false,
            });
          });
      }
    }
  };

  render() {
    const userSubmissions =
      this.props.allSubmissionsOfCustomer &&
      this.props.allSubmissionsOfCustomer.allSubmissionsOfCustomer;
    return (
      <Mutation mutation={UPSERT_COMPETITION_SUBMISSION}>
        {(upsertCompetitionSubmission, { data, loading, error }) => (
          <Section pb={"30px"} style={{ minHeight: "85vh" }}>
            <ReactModal
              isOpen={this.state.showModal}
              contentLabel="Uploading"
              className="Modal"
              overlayClassName="ReactModalOverlay"
            >
              Uploading
            </ReactModal>
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
                      <Text
                        variant="card-title"
                        color="#000000"
                        className="mb-4"
                        style={{ lineHeight: "30px" }}
                      >
                        Upload
                      </Text>
                      <Text>
                        Participate in our challenges and stand a chance to win
                        bonus votes
                      </Text>
                    </Col>
                  </Row>
                </Container>
                <Container>
                  <hr />
                  {!this.props.customerID ? (
                    <div>
                      Please{" "}
                      <Link href="/login">
                        <a>
                          <Text
                            style={{
                              color: "#FF0000",
                              textDecoration: "underline",
                              display: "inline-block",
                            }}
                          >
                            Login
                          </Text>
                        </a>
                      </Link>{" "}
                      to participate in this challenge
                    </div>
                  ) : userSubmissions.length > 0 ? (
                    <Row
                      style={{
                        marginRight: "0px",
                        marginLeft: "0px",
                        textAlign: "center",
                        marginTop: "20px",
                      }}
                    >
                      {userSubmissions.map((challenge) => {
                        return (
                          challenge.active && (
                            <Col xs="12" style={{ padding: "0.5rem" }}>
                              <Text as="h4">{challenge.competition_name}</Text>
                              <br />
                              <div
                                style={{
                                  whiteSpace: "break-spaces",
                                  textAlign: "left",
                                }}
                              >
                                {/* {challenge.active
                              ? challenge.description
                              : "Entries to this competition have been closed."} */}

                                <p>
                                  “Let your style shine in a captivating reel
                                  with expressions, music, and transitions!”
                                  <br />
                                  All you need to do is:
                                  <br />
                                  <br />
                                  Step 1️⃣
                                  <br />
                                  Show your style with the variations in outfits
                                  and make a video of min. 30 seconds or max. 60
                                  seconds, showing your swag with the best reels
                                  with music, and showing your expressions
                                  unlimited! Post it on the oMg website.
                                  <br />
                                  <br />
                                  Step 2️⃣
                                  <br />
                                  Upload this reel on the website and on your
                                  Instagram reel section and tag the official
                                  account of oMg @omg.foy and horra luxury
                                  @horraluxury with hashtag #oMgkaswag.
                                  <br />
                                  <br />
                                  Step 3️⃣
                                  <br />
                                  Send the same video reel to your friends and
                                  family and get maximum likes on your reel also
                                  ask them to post on their Instagram story and
                                  tag you and the oMg Instagram handle @omg.foy
                                  <br />
                                  <br />
                                  POINTS TO REMEMBER 👇
                                  <br />
                                  **Be in your glamorous outfits which must have
                                  one each from formal wear, high fashion &
                                  ethnic wear.
                                  <br />
                                  **Video should be shot in a vertical
                                  orientation, reel size should not exceed 25MB,
                                  and reel length should not exceed 60 seconds.
                                  <br />
                                  **You are only allowed to perform solo in the
                                  video.
                                  <br />
                                  **You will be primarily judged on your styling
                                  skills and overall video presentation, so make
                                  sure your styling and surroundings are in sync
                                  with your video submitted.
                                  <br />
                                  <br />
                                  <br />
                                  Winners rewards👇
                                  <br />
                                  *Winner in both categories will get - 10000
                                  votes, the second position in both categories
                                  will get 7,500 votes and the third position in
                                  both categories will get 5000 votes.
                                  <br />
                                  *Apart from the Top 3 in both categories, The
                                  next top 15 contestants in each category will
                                  get 3000 bonus votes <br />
                                  *Fastest 30 contestants in both the categories
                                  to submit the challenge will also get 1000
                                  bonus votes.
                                  <br />
                                  <br />
                                  **These votes will be added to your current
                                  votes on the leaderboard.
                                  <br />
                                  <br />
                                  <br />
                                  Last date for submission of video is 20th June
                                  2023.
                                </p>
                              </div>
                              <br />
                              <br />
                              {challenge.media &&
                              challenge.upload_type === "image" ? (
                                <img
                                  src={
                                    process.env.REACT_APP_IMAGE_URL +
                                    process.env.REACT_APP_PROFILE_IMAGE_PATH +
                                    challenge.media
                                  }
                                  style={{ maxWidth: "100%" }}
                                />
                              ) : challenge.media &&
                                challenge.upload_type === "video" ? (
                                <ReactPlayer
                                  url={
                                    process.env.REACT_APP_IMAGE_URL +
                                    process.env.REACT_APP_PROFILE_IMAGE_PATH +
                                    challenge.media +
                                    "#t=0.1"
                                  }
                                  width="100%"
                                  // height="30vh"
                                  controls={true}
                                />
                              ) : challenge.upload_type === "image" ? (
                                <>
                                  {challenge.active && (
                                    <label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          this.onSelectImage(
                                            e,
                                            upsertCompetitionSubmission,
                                            this.props.customerID,
                                            challenge.competition_id
                                          )
                                        }
                                      />
                                      <span>
                                        <i
                                          className="fas fa-cloud-upload-alt"
                                          style={{ paddingRight: "5px" }}
                                        ></i>
                                        Upload Image
                                      </span>
                                    </label>
                                  )}
                                </>
                              ) : (
                                <>
                                  {challenge.competition_name ===
                                    "Omg Buyceps Regime" && (
                                    <>
                                      Sample Video :
                                      <video
                                        src={instagramVideo + "#t=0.1"}
                                        width="100%"
                                        controls
                                        playsInline
                                      />
                                    </>
                                  )}
                                  {challenge.active && (
                                    <label className="mt-4">
                                      <input
                                        type="file"
                                        accept="video/mp4,video/x-m4v,video/*"
                                        onChange={(e) =>
                                          this.onSelectVideo(
                                            e,
                                            upsertCompetitionSubmission,
                                            this.props.customerID,
                                            challenge.competition_id
                                          )
                                        }
                                      />
                                      <span>
                                        <i
                                          className="fas fa-cloud-upload-alt"
                                          style={{ paddingRight: "5px" }}
                                        ></i>
                                        Upload Your Video
                                      </span>
                                    </label>
                                  )}
                                  {this.state.formMessage &&
                                  this.state.formMessage[
                                    challenge.competition_id
                                  ] &&
                                  this.state.formMessage[
                                    challenge.competition_id
                                  ] !== "" ? (
                                    <div style={{ minHeight: "22px" }}>
                                      <Text variant="error" color="#FFFFFF">
                                        {
                                          this.state.formMessage[
                                            challenge.competition_id
                                          ]
                                        }
                                      </Text>
                                    </div>
                                  ) : (
                                    <div style={{ minHeight: "28px" }}></div>
                                  )}
                                </>
                              )}
                              <hr />
                            </Col>
                          )
                        );
                      })}
                    </Row>
                  ) : (
                    <Text>
                      No active challenges available. Please check back again
                      later.
                    </Text>
                  )}
                </Container>
              </>
            </Box>
          </Section>
        )}
      </Mutation>
    );
  }
}

export default ChallengeUpload;
