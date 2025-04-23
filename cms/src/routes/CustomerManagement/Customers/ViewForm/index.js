import React, { Component } from "react";
import { connect } from "react-redux";
// import { Query, Mutation } from "react-apollo";
import { Link } from "react-router-dom";
// prettier-ignore
import { Button, Card, Row, Col, Select, Input, Tooltip, Collapse, notification } from "antd";
import moment from "moment";
import ReactPlayer from "react-player";
import ImageEvaluation from "../../../../pixelsComponents/ImageEvaluation";
import ImageUpload from "../../../../pixelsComponents/ImageUpload";
import "./viewFormStyle.less";

const { Option } = Select;
const { Panel } = Collapse;

class CustomerInfoForm extends Component {
  state = {
    updateObj: {},
    stateFinalStatus: null,
    introVideoPlayed: false,
    top150VideoPlayed: false,
    top150VideoFile: null,
    top75VideoPlayed: false,
    top75VideoFile: null,
    top30VideoPlayed: false,
    top30VideoFile: null,
    top20VideoPlayed: false,
    top20VideoFile: null,
    top10VideoPlayed: false,
    top10VideoFile: null,
    finallyRejectedState: false,
    score: this.props.top500ScoreByCustomerId || 0,
    votes: this.props.votesByCustomerId || 0,

    top150VideoScore: this.props.top150DataByCustomerId
      ? this.props.top150DataByCustomerId.score
      : 0,

    top75VideoScore: this.props.top75DataByCustomerId
      ? this.props.top75DataByCustomerId.score
      : 0,

    top30VideoScore: this.props.top30DataByCustomerId
      ? this.props.top30DataByCustomerId.score
      : 0,

    top20VideoScore: this.props.top20DataByCustomerId
      ? this.props.top20DataByCustomerId.score
      : 0,

    top10VideoScore: this.props.top10DataByCustomerId
      ? this.props.top10DataByCustomerId.score
      : 0,

    defaultActiveKey: this.props.top10DataByCustomerId
      ? "top10Activity"
      : this.props.top20DataByCustomerId
      ? "top20Activity"
      : this.props.top30DataByCustomerId
      ? "top30Activity"
      : this.props.top75DataByCustomerId
      ? "top75Activity"
      : this.props.top150DataByCustomerId
      ? "top150Activity"
      : "profileActivity"
  };

  getFormData = props => {};

  getImageData = stateObj =>
    this.setState({
      updateObj: {
        ...this.state.updateObj,
        ...stateObj
      }
    });

  setIntroVideoPlayedTrue = () =>
    setTimeout(() => this.setState({ introVideoPlayed: true }), 15000);

  setTop150VideoPlayedTrue = () =>
    setTimeout(() => this.setState({ top150VideoPlayed: true }), 15000);

  setTop75VideoPlayedTrue = () =>
    setTimeout(() => this.setState({ top75VideoPlayed: true }), 15000);

  setTop30VideoPlayedTrue = () =>
    setTimeout(() => this.setState({ top30VideoPlayed: true }), 15000);

  setTop20VideoPlayedTrue = () =>
    setTimeout(() => this.setState({ top20VideoPlayed: true }), 15000);

  setTop10VideoPlayedTrue = () =>
    setTimeout(() => this.setState({ top10VideoPlayed: true }), 15000);

  updateProfile = (customer_id, changeStatusScore) => {
    const { updateObj } = this.state;
    if (updateObj && Object.keys(updateObj).length) {
      if (updateObj.final_status === "rejected" && !updateObj.reject_reason) {
        notification.error({
          message: "Reject reason is empty",
          description:
            "If final status of the Profile is 'Rejected', reject reason must be given."
        });
        return;
      }

      changeStatusScore({
        variables: { customer_id, ...updateObj }
      }).then(data => {
        notification.success({
          message: "Update Successful!",
          description: "Profile has been successfully updated."
        });
      });
    }
  };

  render() {
    // prettier-ignore
    const { customer_id, userPermissions, customer, profile, votesByCustomerId, upsertVotes,
            changeStatusScore, top500ScoreByCustomerId, addTop500Score,
            top150DataByCustomerId, addTop150VideoScore, upsertTop150Video, top150Refetch,
            top75DataByCustomerId, addTop75VideoScore, upsertTop75Video, top75Refetch,
            top30DataByCustomerId, addTop30VideoScore, upsertTop30Video, top30Refetch,
            top20DataByCustomerId, addTop20VideoScore, upsertTop20Video, top20Refetch,
            top10DataByCustomerId, addTop10VideoScore, upsertTop10Video, top10Refetch
          }
      = this.props;

    // prettier-ignore
    const { updateObj, stateFinalStatus, introVideoPlayed, finallyRejectedState, votes, score, defaultActiveKey,
            top150VideoFile, top150VideoPlayed, top150VideoScore,
            top75VideoFile, top75VideoPlayed, top75VideoScore,
            top30VideoFile, top30VideoPlayed, top30VideoScore,
            top20VideoFile, top20VideoPlayed, top20VideoScore,
            top10VideoFile, top10VideoPlayed, top10VideoScore,
          }
      = this.state;

    const dateFormat = "Do MMM YYYY";

    const finalStatus = stateFinalStatus
      ? stateFinalStatus === "Approved"
        ? "approved"
        : "rejected"
      : profile
      ? profile.final_status
        ? profile.final_status
        : "draft"
      : "draft";

    const finallyRejected = finallyRejectedState
      ? true
      : profile
      ? profile.final_status
        ? profile.final_status === "rejected"
          ? true
          : false
        : false
      : false;

    const rejectedProfile = profile
      ? profile.final_status
        ? profile.final_status === "rejected"
          ? true
          : false
        : false
      : false;

    let partiallyFilled = true;
    // prettier-ignore
    if (profile && profile.id) {
      const basicFieldsMissing = !profile.state || !profile.city || !profile.pincode || !profile.bio || 
                                !profile.insta_link || !profile.height || !profile.weight || !profile.dob || !profile.pic1;
      
      // If gender is 'h', don't check pic2 and pic3
      if (customer.gender === 'h') {
        partiallyFilled = basicFieldsMissing;
      } else {
        partiallyFilled = basicFieldsMissing || !profile.pic2 || !profile.pic3;
      }
    }

    // prettier-ignore
    const showRejectReasonBox = !partiallyFilled && (finalStatus === "rejected" || (finalStatus === "pending" && introVideoPlayed));

    let images = [];

    if (profile && profile.pic1)
      images.push({
        key: "pic1",
        src:
          process.env.REACT_APP_IMAGE_URL +
          process.env.REACT_APP_CUSTOMER_URL +
          profile.pic1,
        statusVariable: "pic1_status",
        status: profile.pic1_status,
        scoreVariable: "pic1_score",
        score: profile.pic1_score
      });

    if (profile && profile.pic2)
      images.push({
        key: "pic2",
        src:
          process.env.REACT_APP_IMAGE_URL +
          process.env.REACT_APP_CUSTOMER_URL +
          profile.pic2,
        statusVariable: "pic2_status",
        status: profile.pic2_status,
        scoreVariable: "pic2_score",
        score: profile.pic2_score
      });

    if (profile && profile.pic3)
      images.push({
        key: "pic3",
        src:
          process.env.REACT_APP_IMAGE_URL +
          process.env.REACT_APP_CUSTOMER_URL +
          profile.pic3,
        statusVariable: "pic3_status",
        status: profile.pic3_status,
        scoreVariable: "pic3_score",
        score: profile.pic3_score
      });
      if (profile && profile.pic4)
        images.push({
          key: "pic4",
          src:
            process.env.REACT_APP_IMAGE_URL +
            process.env.REACT_APP_CUSTOMER_URL +
            profile.pic3,
          statusVariable: "pic4_status",
          status: profile.pic4_status,
          scoreVariable: "pic4_score",
          score: profile.pic4_score
        });

    return (
      <div>
        <div className="nameTitle">{customer.full_name}</div>
        <br />

        {/* prettier-ignore */
        top10DataByCustomerId && (userPermissions.includes("readTop10") || userPermissions.includes("updateTop10")) ? (
          <div>
            <Collapse defaultActiveKey={defaultActiveKey}>
              <Panel
                header={
                  <strong>
                    TOP-10
                    {customer.gender
                      ? customer.gender.toLowerCase() === "m" ? " MALE " : ( customer.gender.toLowerCase() === "f" ? " FEMALE " : "HairStylist")
                      : null}
                    ACTIVITY
                  </strong>
                }
                key="top10Activity"
                className="collapsibleCard"
              >
                <Card className="gx-card">
                  <Row>
                    <Col span={24}>
                      <div>
                        <Row>
                          <Col span={16}>
                            {top10DataByCustomerId && top10DataByCustomerId.video ? (
                                <ReactPlayer
                                  controls={true}
                                  onStart={this.setTop10VideoPlayedTrue}
                                  url={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_TOP10_URL + top10DataByCustomerId.video}
                                />
                              ) : (
                                <>Video hasn't been uploaded yet !</>
                              )
                            }
                          </Col>

                          {userPermissions.includes("updateTop10") ? (
                            <Col span={8}>
                              <strong>{top10DataByCustomerId.video ? "REPLACE": "UPLOAD"} TOP-10 VIDEO</strong>
                              <br />
                              <br />
                              <ImageUpload
                                fileType="video"
                                fileName={top10VideoFile}
                                fileList={
                                  top10VideoFile
                                    ? [
                                        {
                                          uid: top10VideoFile,
                                          url:
                                            process.env.REACT_APP_IMAGE_URL +
                                            process.env.REACT_APP_TOP10_URL +
                                            top10VideoFile
                                        }
                                      ]
                                    : []
                                }
                                getFile={file => { this.setState({ top10VideoFile: file }) }}
                                onRemove={() => { this.setState({ top10VideoFile: null }) }}
                                crud="update"
                              />
                              <br />
                              <br />

                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (!top10VideoFile) {
                                      notification.error({ message: "Please select a video to upload !" });
                                      return;
                                    }
                                    upsertTop10Video({ variables: { customer_id, video: top10VideoFile } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                        this.setState({ top10VideoFile: null });
                                        if(top10Refetch) top10Refetch();
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            </Col>
                          ) : null}
                        </Row>
                        <br />
                        <br />

                        {top10DataByCustomerId && (userPermissions.includes("readTop10") || userPermissions.includes("updateTop10")) ? (
                          <Row>
                            <Col span={6}>
                              <div className="gx-fs-lg moreLineHeight"><strong>Video Score:</strong></div>
                              <div className="gx-fs-md moreLineHeight">
                                (This score will be used to finalise Top 5
                                  {customer.gender
                                    ? customer.gender.toLowerCase() === "m" ? " MALE " : ( customer.gender.toLowerCase() === "f" ? " FEMALE " : "HairStylist")
                                    : null}
                                )
                              </div>
                            </Col>

                            <Col span={3}>
                              <Input
                                disabled={!userPermissions.includes("updateTop10") || !!top30DataByCustomerId || !top10VideoPlayed}
                                type="number"
                                value={top10VideoScore}
                                onChange={e => this.setState({ top10VideoScore: Number(e.target.value) })}
                              />
                            </Col>

                            {userPermissions.includes("updateTop10") && !top30DataByCustomerId && top10VideoPlayed ? (
                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (Number(top10VideoScore) > 10 || Number(top10VideoScore) < 0) {
                                      notification.error({ message: "Video score should be between 0 and 10 !" });
                                      return;
                                    }
                                    addTop10VideoScore({ variables: { customer_id, score: top10VideoScore } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            ) : null}
                          </Row>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Panel>
            </Collapse>
            <br />
          </div>
        ) : null}

        {/* prettier-ignore */
        top20DataByCustomerId && (userPermissions.includes("readTop20") || userPermissions.includes("updateTop20")) ? (
          <div>
            <Collapse defaultActiveKey={defaultActiveKey}>
              <Panel
                header={
                  <strong>
                    TOP-20
                    {customer.gender
                       ? customer.gender.toLowerCase() === "m" ? " MALE " : ( customer.gender.toLowerCase() === "f" ? " FEMALE " : "HairStylist")
                      : null}
                    ACTIVITY
                  </strong>
                }
                key="top20Activity"
                className="collapsibleCard"
              >
                <Card className="gx-card">
                  <Row>
                    <Col span={24}>
                      <div>
                        <Row>
                          <Col span={16}>
                            {top20DataByCustomerId && top20DataByCustomerId.video ? (
                                <ReactPlayer
                                  controls={true}
                                  onStart={this.setTop20VideoPlayedTrue}
                                  url={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_TOP20_URL + top20DataByCustomerId.video}
                                />
                              ) : (
                                <>Video hasn't been uploaded yet !</>
                              )
                            }
                          </Col>

                          {userPermissions.includes("updateTop20") ? (
                            <Col span={8}>
                              <strong>{top20DataByCustomerId.video ? "REPLACE": "UPLOAD"} TOP-20 VIDEO</strong>
                              <br />
                              <br />
                              <ImageUpload
                                fileType="video"
                                fileName={top20VideoFile}
                                fileList={
                                  top20VideoFile
                                    ? [
                                        {
                                          uid: top20VideoFile,
                                          url:
                                            process.env.REACT_APP_IMAGE_URL +
                                            process.env.REACT_APP_TOP20_URL +
                                            top20VideoFile
                                        }
                                      ]
                                    : []
                                }
                                getFile={file => { this.setState({ top20VideoFile: file }) }}
                                onRemove={() => { this.setState({ top20VideoFile: null }) }}
                                crud="update"
                              />
                              <br />
                              <br />

                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (!top20VideoFile) {
                                      notification.error({ message: "Please select a video to upload !" });
                                      return;
                                    }
                                    upsertTop20Video({ variables: { customer_id, video: top20VideoFile } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                        this.setState({ top20VideoFile: null });
                                        if(top20Refetch) top20Refetch();
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            </Col>
                          ) : null}
                        </Row>
                        <br />
                        <br />

                        {top20DataByCustomerId && (userPermissions.includes("readTop20") || userPermissions.includes("updateTop20")) ? (
                          <Row>
                            <Col span={6}>
                              <div className="gx-fs-lg moreLineHeight"><strong>Video Score:</strong></div>
                              <div className="gx-fs-md moreLineHeight">
                                (This score will be used to finalise Top 10
                                  {customer.gender
                                     ? customer.gender.toLowerCase() === "m" ? " MALE " : ( customer.gender.toLowerCase() === "f" ? " FEMALE " : "HairStylist")
                                    : null}
                                )
                              </div>
                            </Col>

                            <Col span={3}>
                              <Input
                                disabled={!userPermissions.includes("updateTop20") || !!top10DataByCustomerId || !top20VideoPlayed}
                                type="number"
                                value={top20VideoScore}
                                onChange={e => this.setState({ top20VideoScore: Number(e.target.value) })}
                              />
                            </Col>

                            {userPermissions.includes("updateTop20") && !top10DataByCustomerId && top20VideoPlayed ? (
                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (Number(top20VideoScore) > 10 || Number(top20VideoScore) < 0) {
                                      notification.error({ message: "Video score should be between 0 and 10 !" });
                                      return;
                                    }
                                    addTop20VideoScore({ variables: { customer_id, score: top20VideoScore } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            ) : null}
                          </Row>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Panel>
            </Collapse>
            <br />
          </div>
        ) : null}

        {/* prettier-ignore */
        top30DataByCustomerId && (userPermissions.includes("readTop30") || userPermissions.includes("updateTop30")) ? (
          <div>
            <Collapse defaultActiveKey={defaultActiveKey}>
              <Panel
                header={
                  <strong>
                    TOP-30
                    {customer.gender
                      ? customer.gender.toLowerCase() === "m" ? " MALE " : " FEMALE "
                      : null}
                    ACTIVITY
                  </strong>
                }
                key="top30Activity"
                className="collapsibleCard"
              >
                <Card className="gx-card">
                  <Row>
                    <Col span={24}>
                      <div>
                        <Row>
                          <Col span={16}>
                            {top30DataByCustomerId && top30DataByCustomerId.video ? (
                                <ReactPlayer
                                  controls={true}
                                  onStart={this.setTop30VideoPlayedTrue}
                                  url={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_TOP30_URL + top30DataByCustomerId.video}
                                />
                              ) : (
                                <>Video hasn't been uploaded yet !</>
                              )
                            }
                          </Col>

                          {userPermissions.includes("updateTop30") ? (
                            <Col span={8}>
                              <strong>{top30DataByCustomerId.video ? "REPLACE": "UPLOAD"} TOP-30 VIDEO</strong>
                              <br />
                              <br />
                              <ImageUpload
                                fileType="video"
                                fileName={top30VideoFile}
                                fileList={
                                  top30VideoFile
                                    ? [
                                        {
                                          uid: top30VideoFile,
                                          url:
                                            process.env.REACT_APP_IMAGE_URL +
                                            process.env.REACT_APP_TOP30_URL +
                                            top30VideoFile
                                        }
                                      ]
                                    : []
                                }
                                getFile={file => { this.setState({ top30VideoFile: file }) }}
                                onRemove={() => { this.setState({ top30VideoFile: null }) }}
                                crud="update"
                              />
                              <br />
                              <br />

                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (!top30VideoFile) {
                                      notification.error({ message: "Please select a video to upload !" });
                                      return;
                                    }
                                    upsertTop30Video({ variables: { customer_id, video: top30VideoFile } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                        this.setState({ top30VideoFile: null });
                                        if(top30Refetch) top30Refetch();
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            </Col>
                          ) : null}
                        </Row>
                        <br />
                        <br />

                        {top30DataByCustomerId && (userPermissions.includes("readTop30") || userPermissions.includes("updateTop30")) ? (
                          <Row>
                            <Col span={6}>
                              <div className="gx-fs-lg moreLineHeight"><strong>Video Score:</strong></div>
                              <div className="gx-fs-md moreLineHeight">
                                (This score will be used to finalise Top 30
                                  {customer.gender
                                    ? customer.gender.toLowerCase() === "m" ? " Males" : " Females"
                                    : null}
                                )
                              </div>
                            </Col>

                            <Col span={3}>
                              <Input
                                disabled={!userPermissions.includes("updateTop30") || !!top20DataByCustomerId || !top30VideoPlayed}
                                type="number"
                                value={top30VideoScore}
                                onChange={e => this.setState({ top30VideoScore: Number(e.target.value) })}
                              />
                            </Col>

                            {userPermissions.includes("updateTop30") && !top20DataByCustomerId && top30VideoPlayed ? (
                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (Number(top30VideoScore) > 10 || Number(top30VideoScore) < 0) {
                                      notification.error({ message: "Video score should be between 0 and 10 !" });
                                      return;
                                    }
                                    addTop30VideoScore({ variables: { customer_id, score: top30VideoScore } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            ) : null}
                          </Row>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Panel>
            </Collapse>
            <br />
          </div>
        ) : null}

        {/* prettier-ignore */
        top75DataByCustomerId && (userPermissions.includes("readTop75") || userPermissions.includes("updateTop75")) ? (
          <div>
            <Collapse defaultActiveKey={defaultActiveKey}>
              <Panel
                header={
                  <strong>
                    TOP-75
                    {customer.gender
                      ? customer.gender.toLowerCase() === "m" ? " MALE " : " FEMALE "
                      : null}
                    ACTIVITY
                  </strong>
                }
                key="top75Activity"
                className="collapsibleCard"
              >
                <Card className="gx-card">
                  <Row>
                    <Col span={24}>
                      <div>
                        <Row>
                          <Col span={16}>
                            {top75DataByCustomerId && top75DataByCustomerId.video ? (
                                <ReactPlayer
                                  controls={true}
                                  onStart={this.setTop75VideoPlayedTrue}
                                  url={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_TOP75_URL + top75DataByCustomerId.video}
                                />
                              ) : (
                                <>Video hasn't been uploaded yet !</>
                              )
                            }
                          </Col>

                          {userPermissions.includes("updateTop75") ? (
                            <Col span={8}>
                              <strong>{top75DataByCustomerId.video ? "REPLACE": "UPLOAD"} TOP-75 VIDEO</strong>
                              <br />
                              <br />
                              <ImageUpload
                                fileType="video"
                                fileName={top75VideoFile}
                                fileList={
                                  top75VideoFile
                                    ? [
                                        {
                                          uid: top75VideoFile,
                                          url:
                                            process.env.REACT_APP_IMAGE_URL +
                                            process.env.REACT_APP_TOP75_URL +
                                            top75VideoFile
                                        }
                                      ]
                                    : []
                                }
                                getFile={file => { this.setState({ top75VideoFile: file }) }}
                                onRemove={() => { this.setState({ top75VideoFile: null }) }}
                                crud="update"
                              />
                              <br />
                              <br />

                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (!top75VideoFile) {
                                      notification.error({ message: "Please select a video to upload !" });
                                      return;
                                    }
                                    upsertTop75Video({ variables: { customer_id, video: top75VideoFile } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                        this.setState({ top75VideoFile: null });
                                        if(top75Refetch) top75Refetch();
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            </Col>
                          ) : null}
                        </Row>
                        <br />
                        <br />

                        {top75DataByCustomerId && (userPermissions.includes("readTop75") || userPermissions.includes("updateTop75")) ? (
                          <Row>
                            <Col span={6}>
                              <div className="gx-fs-lg moreLineHeight"><strong>Video Score:</strong></div>
                              <div className="gx-fs-md moreLineHeight">
                                (This score will be used to finalise Top 30
                                  {customer.gender
                                    ? customer.gender.toLowerCase() === "m" ? " Males" : " Females"
                                    : null}
                                )
                              </div>
                            </Col>

                            <Col span={3}>
                              <Input
                                disabled={!userPermissions.includes("updateTop75") || !!top30DataByCustomerId || !top75VideoPlayed}
                                type="number"
                                value={top75VideoScore}
                                onChange={e => this.setState({ top75VideoScore: Number(e.target.value) })}
                              />
                            </Col>

                            {userPermissions.includes("updateTop75") && !top30DataByCustomerId && top75VideoPlayed ? (
                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (Number(top75VideoScore) > 10 || Number(top75VideoScore) < 0) {
                                      notification.error({ message: "Video score should be between 0 and 10 !" });
                                      return;
                                    }
                                    addTop75VideoScore({ variables: { customer_id, score: top75VideoScore } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            ) : null}
                          </Row>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Panel>
            </Collapse>
            <br />
          </div>
        ) : null}

        {/* prettier-ignore */
        top150DataByCustomerId && (userPermissions.includes("readTop150") || userPermissions.includes("updateTop150")) ? (
          <div>
            <Collapse defaultActiveKey={defaultActiveKey}>
              <Panel
                header={
                  <strong>
                    TOP-150
                    {customer.gender
                      ? customer.gender.toLowerCase() === "m" ? " MALE " : " FEMALE "
                      : null}
                    ACTIVITY
                  </strong>
                }
                key="top150Activity"
                className="collapsibleCard"
              >
                <Card className="gx-card">
                  <Row>
                    <Col span={24}>
                      <div>
                        <Row>
                          <Col span={16}>
                            {top150DataByCustomerId && top150DataByCustomerId.video ? (
                                <ReactPlayer
                                  controls={true}
                                  onStart={this.setTop150VideoPlayedTrue}
                                  url={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_TOP150_URL + top150DataByCustomerId.video}
                                />
                              ) : (
                                <>Video hasn't been uploaded yet !</>
                              )
                            }
                          </Col>

                          {userPermissions.includes("updateTop150") ? (
                            <Col span={8}>
                              <strong>{top150DataByCustomerId.video ? "REPLACE": "UPLOAD"} TOP-150 VIDEO</strong>
                              <br />
                              <br />
                              <ImageUpload
                                fileType="video"
                                fileName={top150VideoFile}
                                fileList={
                                  top150VideoFile
                                    ? [
                                        {
                                          uid: top150VideoFile,
                                          url:
                                            process.env.REACT_APP_IMAGE_URL +
                                            process.env.REACT_APP_TOP150_URL +
                                            top150VideoFile
                                        }
                                      ]
                                    : []
                                }
                                getFile={file => { this.setState({ top150VideoFile: file }) }}
                                onRemove={() => { this.setState({ top150VideoFile: null }) }}
                                crud="update"
                              />
                              <br />
                              <br />

                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (!top150VideoFile) {
                                      notification.error({ message: "Please select a video to upload !" });
                                      return;
                                    }
                                    upsertTop150Video({ variables: { customer_id, video: top150VideoFile } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                        this.setState({ top150VideoFile: null });
                                        if(top150Refetch) top150Refetch();
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            </Col>
                          ) : null}
                        </Row>
                        <br />
                        <br />

                        {top150DataByCustomerId && (userPermissions.includes("readTop150") || userPermissions.includes("updateTop150")) ? (
                          <Row>
                            <Col span={6}>
                              <div className="gx-fs-lg moreLineHeight"><strong>Video Score:</strong></div>
                              <div className="gx-fs-md moreLineHeight">
                                (This score will be used to finalise Top 75
                                  {customer.gender
                                    ? customer.gender.toLowerCase() === "m" ? " Males" : " Females"
                                    : null}
                                )
                              </div>
                            </Col>

                            <Col span={3}>
                              <Input
                                disabled={!userPermissions.includes("updateTop150") || !!top75DataByCustomerId || !top150VideoPlayed}
                                type="number"
                                value={top150VideoScore}
                                onChange={e => this.setState({ top150VideoScore: Number(e.target.value) })}
                              />
                            </Col>

                            {userPermissions.includes("updateTop150") && !top75DataByCustomerId && top150VideoPlayed ? (
                              <Col span={2}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (Number(top150VideoScore) > 10 || Number(top150VideoScore) < 0) {
                                      notification.error({ message: "Video score should be between 0 and 10 !" });
                                      return;
                                    }
                                    addTop150VideoScore({ variables: { customer_id, score: top150VideoScore } })
                                      .then(() => {
                                        notification.success({ message: "Video score successfully updated!" });
                                      });
                                  }}
                                >
                                  Save
                                </Button>
                              </Col>
                            ) : null}
                          </Row>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Panel>
            </Collapse>
            <br />
          </div>
        ) : null}

        {/* prettier-ignore */}
        <Collapse defaultActiveKey={defaultActiveKey}>
          <Panel
            header={<strong>PROFILE ACTIVITY</strong>}
            key="profileActivity"
            className="collapsibleCard"
          >
            <Card className="gx-card">
              {images && images.length ? (
                <ImageEvaluation
                  images={images}
                  getImageData={this.getImageData}
                />
              ) : "Images haven't been uploaded yet !"}
              <br />
              <br />

              <Row>
                <Col span={24}>
                  {profile && profile.intro_video ? (
                    <ReactPlayer
                      controls={true}
                      onStart={this.setIntroVideoPlayedTrue}
                      url={process.env.REACT_APP_IMAGE_URL + process.env.REACT_APP_CUSTOMER_URL + profile.intro_video}
                    />
                  ) : "Intro video hasn't been uploaded yet !"}
                </Col>
              </Row>
              <br />
              <br />

              {profile && profile.id ? (
                <Row>
                  <Col span={3}>
                    <strong>Profile Status:</strong>
                  </Col>
                  <Col span={finalStatus === "rejected" ? 6 : 2}>
                    {/* {finalStatus === "pending" && introVideoPlayed && !partiallyFilled ? ( */}
                    {finalStatus === "pending" && !partiallyFilled ? (
                      <Tooltip title="Approve Profile">
                        <Button
                          type="primary"
                          style={{ padding: "0 8px" }}
                          disabled={!(userPermissions.includes("updateCustomer") || userPermissions.includes("updateProfile") || userPermissions.includes("isIntern"))}
                          onClick={() =>
                            changeStatusScore({
                              variables: { customer_id, final_status: "approved" }
                            }).then(() => {
                              notification.success({
                                message: "Update Successful!",
                                description: "Profile has been approved."
                              });
                              this.setState({ stateFinalStatus: "Approved" });
                            })
                          }
                        >
                          Approve
                        </Button>
                      </Tooltip>
                    ) : finalStatus === "rejected" && !rejectedProfile && !finallyRejectedState
                        ? "Rejected (Please select a reason and click 'Save' to finally reject)"
                        : finalStatus.charAt(0).toUpperCase() + finalStatus.slice(1)}
                  </Col>
                  <Col span={2}>
                    {finalStatus === "pending" && introVideoPlayed && !partiallyFilled ? (
                      <Tooltip title="Reject Profile">
                        <Button
                          type="danger"
                          style={{ padding: "0 8px" }}
                          disabled={!(userPermissions.includes("updateCustomer") || userPermissions.includes("updateProfile") || userPermissions.includes("isIntern"))}
                          onClick={() => 
                            this.setState({ stateFinalStatus: "Rejected (Please select a reason and click 'Save' to finally reject)" })}
                        >
                          Reject
                        </Button>
                      </Tooltip>
                    ) : null}
                  </Col>

                  {showRejectReasonBox && finalStatus !== "rejected" ? <Col span={2} /> : null}

                  {showRejectReasonBox && finalStatus === "rejected" ? <Col span={3}>Reject Reason:</Col> : null}

                  {showRejectReasonBox && finalStatus === "rejected" ? (
                    <Col span={8}>
                      <Select
                        name="reject_reason"
                        disabled={finallyRejected}
                        value={updateObj.reject_reason || (profile ? profile.reject_reason : null)}
                        onChange={value =>
                          this.setState({
                            updateObj: {
                              ...this.state.updateObj,
                              reject_reason: value
                            }
                          })
                        }
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select one option"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option key="Some of the uploaded images are inappropriate." value="Some of the uploaded images are inappropriate.">Inappropriate Photo</Option>
                        <Option key="The uploaded video is inappropriate." value="The uploaded video is inappropriate.">Inappropriate Video</Option>
                      </Select>
                    </Col>
                  ) : null}

                  {showRejectReasonBox && finalStatus === "rejected" ? (
                    <Col span={2}>
                      <Button
                        type="primary"
                        disabled={finallyRejected || !(userPermissions.includes("updateCustomer") || userPermissions.includes("updateProfile") || userPermissions.includes("isIntern"))}
                        onClick={() =>
                          changeStatusScore({
                            variables: {
                              customer_id,
                              final_status: "rejected",
                              reject_reason: updateObj.reject_reason
                            }
                          }).then(() => {
                            notification.success({
                              message: "Update Successful!",
                              description: "Profile has been rejected."
                            });
                            this.setState({ finallyRejectedState: true });
                          })
                        }
                      >
                        Save
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              ) : null}
              <br />
              <br />

              {votesByCustomerId !== null && (userPermissions.includes("readVote") || userPermissions.includes("updateVote")) ? (
                <Row>
                  <Col span={6}>
                    <div className="gx-fs-lg moreLineHeight"><strong>Onlive Votes on Profile:</strong></div>
                    <div className="gx-fs-md moreLineHeight">(These votes will be used to finalise Top 500)</div>
                  </Col>

                  <Col span={3}>
                    <Input
                      disabled={!userPermissions.includes("updateVote") || top500ScoreByCustomerId !== null}
                      type="number"
                      value={votes}
                      onChange={e => this.setState({ votes: Number(e.target.value) })}
                    />
                  </Col>

                  {userPermissions.includes("updateVote") && top500ScoreByCustomerId === null ? (
                    <Col span={2}>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (Number(votes) < 0) {
                            notification.error({ message: "Votes should be more than or equal to 0 !"});
                            return;
                          }
                          upsertVotes({ variables: { customer_id, votes }})
                            .then(() => {
                              notification.success({ message: "Votes successfully updated!" });
                            });
                        }}
                      >
                        Save
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              ) : null}
              <br />
              <br />

              {top500ScoreByCustomerId !== null && (userPermissions.includes("readTop500") || userPermissions.includes("updateTop500")) ? (
                <Row>
                  <Col span={6}>
                    <div className="gx-fs-lg moreLineHeight"><strong>Score in the Top-500 List:</strong></div>
                    <div className="gx-fs-md moreLineHeight">(This score will be used to finalise Top 150)</div>
                  </Col>

                  <Col span={3}>
                    <Input
                      disabled={!userPermissions.includes("updateTop500") || !!top150DataByCustomerId}
                      type="number"
                      value={score}
                      onChange={e => this.setState({ score: Number(e.target.value) })}
                    />
                  </Col>

                  {userPermissions.includes("updateTop500") && !top150DataByCustomerId ? (
                    <Col span={2}>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (Number(score) > 10 || Number(score) < 0) {
                            notification.error({ message: "Score should be between 0 and 10 !" });
                            return;
                          }
                          addTop500Score({ variables: { customer_id, score } })
                            .then(() => {
                              notification.success({ message: "Score successfully updated!" });
                              // this.setState({ finallyRejectedState: true });
                            });
                        }}
                      >
                        Save
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              ) : null}
            </Card>
          </Panel>
        </Collapse>
        <br />

        {/* prettier-ignore */}
        <Collapse>
          <Panel
            header={<strong>CONTESTANT DETAILS</strong>}
            key="1"
            className="formInfoCard"
          >
            <Row>
              <Col span={4}>
                <label>Joined On:</label>
                <div className="formInfoCard-div">
                  {customer.payment_made_date ? moment(Number(customer.payment_made_date)).format(dateFormat) : '-'}
                </div>
              </Col>

              <Col span={5}>
                <label>Category:</label>
                <div className="formInfoCard-div">
                  {customer.gender
                    ? customer.gender.toLowerCase() === "m" ? "Male" : (customer.gender.toLowerCase() === "f" ? "Female" : "Hairstylist")
                    : null}
                </div>
              </Col>

              <Col span={5}>
                <label>e-mail:</label>
                <div className="formInfoCard-div">{customer.email}</div>
              </Col>

              <Col span={5}>
                <label>Phone:</label>
                <div className="formInfoCard-div">{customer.phone}</div>
              </Col>

              <Col span={5}>
                <label>Payment ID:</label>
                <div className="formInfoCard-div">{customer.payment_id || "-"}</div>
              </Col>
            </Row>

            {profile && profile.id ? (
              <Row>
                <Col span={4}>
                  <label>Date of Birth:</label>
                  <div className="formInfoCard-div">
                    {profile.dob ? moment(Number(profile.dob)).format(dateFormat) : "-"}
                  </div>
                </Col>

                <Col span={5}>
                  <label>State:</label>
                  <div className="formInfoCard-div">{profile.state}</div>
                </Col>

                <Col span={5}>
                  <label>City:</label>
                  <div className="formInfoCard-div">{profile.city}</div>
                </Col>

                <Col span={5}>
                  <label>Pincode:</label>
                  <div className="formInfoCard-div">{profile.pincode}</div>
                </Col>

                <Col span={5}>
                  <label>Height:</label>
                  <div className="formInfoCard-div">{profile.height}</div>
                </Col>

                <Col span={4}>
                  <label>Weight:</label>
                  <div className="formInfoCard-div">{profile.weight}</div>
                </Col>

                <Col span={10}>
                  <label>Instagram Link:</label>
                  <div className="formInfoCard-div">
                    {profile.insta_link ? <a target="_blank" href={"https://instagram.com/" + profile.insta_link}>{"https://instagram.com/" + profile.insta_link}</a> : "-"}
                  </div>
                </Col>

                <Col span={10}>
                  <label>Facebook Link:</label>
                  <div className="formInfoCard-div">
                    {profile.fb_link ? <a target="_blank" href={profile.fb_link}>{profile.fb_link}</a> : "-"}
                  </div>
                </Col>

                <Col span={24}>
                  <label>Personality means what?</label>
                  &nbsp;
                  {profile.personality_meaning && profile.personality_meaning.length ? (
                    profile.personality_meaning.map(str => (
                      <span>
                        &emsp;&emsp;•&nbsp;
                        {str.charAt(0).toUpperCase() + str.slice(1)}
                      </span>
                    ))
                  ) : <span>&emsp;&emsp;-</span>}
                </Col>

                <Col span={24}>
                  <label>Bio:</label>
                  <div className="formInfoCard-div">{profile.bio}</div>
                </Col>
              </Row>
            ) : <div>Profile details not updated by contestant yet !<br /><br /></div>}
            
            <Row>
              {userPermissions.includes("updateCustomer") ? (
                <Col span={3}>
                  <Link to={`/contestant-management/contestants/update/${customer_id}`}>
                    <Button type="primary" style={{ marginRight: "10px" }}>
                      Edit Basic Info
                    </Button>
                  </Link>
                </Col>
              ) : null}
              &nbsp;

              {customer && customer.gender && userPermissions.includes("updateCustomer") ? (
                <Col span={3}>
                  <Link to={`/contestant-management/contestants/edit-profile/${customer_id}`}>
                    <Button type="primary" style={{ marginRight: "10px" }}>
                      Edit Profile
                    </Button>
                  </Link>
                </Col>
              ) : null}
            </Row>
          </Panel>
        </Collapse>
        <br />
      </div>
    );
  }
}

//get the mapStateToProps
const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(CustomerInfoForm);
