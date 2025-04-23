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
import { UPLOAD_TOP_30_VIDEO } from "./queries.js";

const Top30Upload = ({ profileData }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [introVideoPath, setIntroVideoPath] = useState(
    profileData && profileData.top_30_video_link
      ? profileData.top_30_video_link
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

  const uploadVideo = (uploadTop30VideoMutation) => {
    let variables = {
      video: introVideoPath,
    };

    setUploading(true);

    uploadTop30VideoMutation({ variables })
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
    <Mutation mutation={UPLOAD_TOP_30_VIDEO}>
      {(uploadTop30VideoMutation, { data, loading, error }) => (
        <Container>
          {(introVideo || introVideoPath) && (
            <ReactPlayer
              url={
                introVideoChanged
                  ? introVideo
                  : introVideoPath
                  ? process.env.REACT_APP_IMAGE_URL +
                    process.env.REACT_APP_TOP_30_VIDEO_PATH +
                    introVideoPath +
                    "#t=0.1"
                  : introVideo
                  ? introVideo + "#t=0.1"
                  : femaleSampleVideo + "#t=0.1"
              }
              width="100%"
              height="30vh"
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
                  onClick={() => uploadVideo(uploadTop30VideoMutation)}
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
              Create a video by doing 4 exercises back to back for 20 seconds
              each (in total 80 seconds) following are the exercises:
              <br />
              <br />
              a. Push ups for boys and Knee Push ups for girls (20 seconds){" "}
              <br />
              b. Jumping squats (Side View) (20 seconds) <br />
              c. Jumping Jacks (20 seconds) <br />
              d. Crunches (20 seconds)
              <br />
              <br />
              <br />
              Points to remember : <br />
              1. Your total video limit should not exceed more than 1 min and 45
              seconds including your 10 sec introduction in starting, 80 seconds
              main workout video and 4 seconds switching between the four
              exercises
              <br />
              <br />
              2. The entire workout video should be shot in one go and the order
              of the exercises should be in the same order mentioned above.
              <br />
              <br />
              3. You will be judged on the basis of your maximum reps completed
              in each exercise of the allotted time (20 seconds) and also on the
              postures in you video.
              <br />
              <br />
              4. Your video size should not exceed more than 60 MB.
              <br />
              <br />
              5. You will also be marked for having a proper workout outfit and
              shoes.
              <br />
              <br />
              6. Keep your phone in an angle where it covers you and your entire
              posture during all the four exercises
              <br />
              <br />
              7. Ask someone to keep track of time and notify you to change
              workouts every 20 seconds. You can ask your friend to record your
              video.
              <br />
              <br />
              8. Your video should be clearly visible and audible properly
              without any distractions.
              <br />
              <br />
              9. Apart from your routine the visual representation of the video
              will also add up marks to your judgement.
              <br />
              <br />
              10. Your video should only include you during every exercise. No
              external help should be taken for performance during the workouts.
              <br />
              <br />
              11. Your video quality, background and look and feel of the video
              will also add up marks in your judgement.
            </Text>
          </ReactModal>
        </Container>
      )}
    </Mutation>
  );
};

export default Top30Upload;
