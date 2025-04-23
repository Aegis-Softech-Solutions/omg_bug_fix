import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ReactModal from "react-modal";
import ReactPlayer from "react-player";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";
import { toast } from "react-nextjs-toast";
import femaleSampleVideo from "../../assets/image/profile-form/female-sample-video.mp4";
import { Query, Mutation } from "react-apollo";
import { UPLOAD_TOP_20_VIDEO } from "./queries.js";

const Top20Upload = ({ profileData }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [introVideoPath, setIntroVideoPath] = useState(
    profileData && profileData.top_20_video_link
      ? profileData.top_20_video_link
      : undefined
  );

  const [introVideo, setIntroVideo] = useState(undefined);

  const [introVideoChanged, setIntroVideoChanged] = useState(false);

  const [uploading, setUploading] = useState(false);

  const onSelectVideo = (e, imageType) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size / (1024 * 1024) > 60) {
        toast.notify("", {
          duration: 5,
          type: "error",
          position: "top-right",
          title: "Video size should be less than 60MB",
        });
      } else {
        setIntroVideoPath(e.target.files[0]);
        setIntroVideo(URL.createObjectURL(e.target.files[0]));
        setIntroVideoChanged(true);
      }
    }
  };

  const uploadVideo = (uploadTop20VideoMutation) => {
    let variables = {
      video: introVideoPath,
    };

    setUploading(true);

    uploadTop20VideoMutation({ variables })
      .then((results) => {
        toast.notify("", {
          duration: 10,
          type: "success",
          position: "top-right",
          title: "Saved successfully.",
        });
        setUploading(false);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Mutation mutation={UPLOAD_TOP_20_VIDEO}>
      {(uploadTop20VideoMutation, { data, loading, error }) => (
        <Container>
          {(introVideo || introVideoPath) && (
            <ReactPlayer
              url={
                introVideoChanged
                  ? introVideo
                  : introVideoPath
                  ? process.env.REACT_APP_IMAGE_URL +
                    process.env.REACT_APP_TOP_20_VIDEO_PATH +
                    introVideoPath +
                    "#t=0.1"
                  : introVideo
                  ? introVideo + "#t=0.1"
                  : femaleSampleVideo + "#t=0.1"
              }
              width="100%"
              height="20vh"
              controls={uploading ? false : true}
            />
          )}

          {!introVideoPath && (
            <Row
              style={{
                paddingBottom: "10px",
              }}
            >
              <Col xs="6">
                <label
                  className="custom-video-upload-alt"
                  style={{ textAlign: "left" }}
                >
                  <input
                    type="file"
                    accept="video/mp4,video/x-m4v,video/*"
                    onChange={(e) => onSelectVideo(e)}
                    disabled={uploading}
                  />

                  <Row>
                    {/* <Col xs="12">
                    {introVideoPath ? <span>Video Uploaded</span> : null}
                  </Col> */}
                    <Col xs="12">
                      <span className="upload-button">
                        <i
                          className="fas fa-cloud-upload-alt"
                          style={{ paddingRight: "5px" }}
                        ></i>
                        Upload
                      </span>
                    </Col>
                  </Row>
                </label>
              </Col>

              <Col xs="6" style={{ textAlign: "right" }}>
                <Text
                  variant="very-small"
                  style={{
                    width: "100%",
                    textAlign: "right",
                    paddingTop: "5px",
                  }}
                  onClick={() => setShowVideoModal(true)}
                >
                  Guidelines*
                </Text>
              </Col>
            </Row>
          )}

          {uploading && <span>Uploading...</span>}

          {!uploading && introVideoChanged && introVideo && (
            <React.Fragment>
              <div
                className="col-12"
                style={{ marginTop: "2%", textAlign: "center" }}
              >
                <Button
                  width="100%"
                  variant="custom"
                  borderRadius={10}
                  onClick={() => uploadVideo(uploadTop20VideoMutation)}
                >
                  Upload Video
                </Button>
              </div>
            </React.Fragment>
          )}

          <ReactModal
            isOpen={showVideoModal}
            contentLabel="Guidelines"
            className="Modal"
            overlayClassName="ReactModalOverlay"
          >
            <Row>
              <Col xs="9">
                <Text
                  variant="bold"
                  color="#000000"
                  style={{ paddingBottom: "10px" }}
                >
                  Guidelines
                </Text>
              </Col>
              <Col xs="3" style={{ textAlign: "right", paddingRight: "20px" }}>
                <Text variant="bold" onClick={() => setShowVideoModal(false)}>
                  <strong>X</strong>
                </Text>
              </Col>
            </Row>

            <Text variant="small" color="#000000">
              You have to record three videos (three variations of your ramp walk in three different outfits with three different music) and then combine them into one video and upload it.<br />
              <br />
              You have to present your video in the following order:
              <br />
              <br />
              a. Slow Pace Walk: Traditional Outfit or State Costumes (for both males and females).<br />
              b. Medium Pace Walk: Formals for males (Blazer is compulsory) and gowns for females.
              <br />
              c. Fast Pace Walk: Western Outfit/high fashion casuals (for both males and females).<br />
              <br />
              Three Music / tracks will be shared with you through WhatsApp.{" "}
              <br />
              <br />
              Points to remember : <br />
              •	Your total video limit should not exceed more than 2 minutes and should show all three walks in the order of Slow-Medium-Fast.<br /><br />
•	In the three variations of your ramp walk, you should be presentable like you are doing a fashion show (Makeup and hairstyling should be on point).<br /><br />
•	Your video size should not exceed more than 60 MB.<br /><br />
•	Your video orientation can be in horizontal or vertical format.<br /><br />
•	You can only use the music/tracks we have given to you.<br /><br />
•	Keep your phone in an angle where it covers your walk completely and you have to record your video in a presentable space.<br /><br /><br/>
LAST DATE FOR SUBMITTING YOUR VIDEOS: 28th July 2023

            </Text>
          </ReactModal>
        </Container>
      )}
    </Mutation>
  );
};

export default Top20Upload;
