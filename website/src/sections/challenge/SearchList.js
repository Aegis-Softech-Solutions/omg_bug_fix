import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
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

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const NavStyled = styled(Nav)`
  padding-top: 15px;
  padding-bottom: 20px;
  a {
    width: 150px;
    text-align: center;
  }
`;
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: props.searchTerm,
      searchTermIntermediate: props.searchTerm,
      data: props.initialData,
      hasMoreRecords: props.initialData.length === 20 ? true : false,
      isOpen: {},
      showMessage: props.showMessage,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.searchTerm !== nextProps.searchTerm) {
      return {
        searchTerm: nextProps.searchTerm,
        searchTermIntermediate: nextProps.searchTerm,
        data: nextProps.initialData,
        hasMoreRecords: nextProps.initialData.length === 20 ? true : false,
      };
    }
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

  onChangeSearchText = (e) => {
    this.setState({ searchTermIntermediate: e.target.value });
  };

  submitSearch = (e) => {
    e.preventDefault();
    this.setState({ searchTerm: this.state.searchTermIntermediate });
    if (this.state.searchTermIntermediate.length > 2) {
      Router.push({
        pathname: "/challenges",
        query: {
          search: this.state.searchTermIntermediate,
        },
      });
    }
  };

  clearSearch = (e) => {
    e.preventDefault();
    this.setState({ searchTerm: "" });
    Router.push({
      pathname: "/challenges",
    });
  };

  handleSelect(key) {
    Router.push({
      pathname: "/challenges",
    });
  }

  render() {
    return (
      <Section className="mt-5" pb={"30px"} style={{ minHeight: "85vh" }}>
        <Container>
          <Row className="text-center">
            <Col xs="12">
              <Title variant="card" color="#000000" className="mb-2">
                CHALLENGES FEED
              </Title>
            </Col>
          </Row>
          <Tab.Container
            defaultActiveKey="m"
            onSelect={(key) => this.handleSelect(key)}
          >
            <Row>
              <Col xs="12">
                <Tab.Content>
                  <Tab.Pane eventKey="m">
                    <Box pb={"10px"} pt={"10px"} pl={"10px"} pr={"10px"}>
                      <>
                        {/* Search Row */}
                        <Row>
                          <Col
                            xs="7"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                          >
                            <Input
                              type="text"
                              placeholder=""
                              // isRequired={true}
                              onChange={(e) => this.onChangeSearchText(e)}
                              value={this.state.searchTermIntermediate}
                              variant="dark"
                            />
                          </Col>
                          <Col
                            xs="5"
                            style={{
                              paddingRight: "0.5rem",
                              textAlign: "right",
                            }}
                          >
                            <Button
                              type="submit"
                              variant="custom"
                              borderRadius={10}
                              onClick={(e) => this.submitSearch(e)}
                            >
                              Search
                            </Button>
                          </Col>
                        </Row>
                        <div style={{ minHeight: "30px", marginLeft: "-5px" }}>
                          {this.state.searchTermIntermediate &&
                          this.state.searchTermIntermediate.length < 3 ? (
                            <Text variant="small" style={{ textAlign: "left" }}>
                              Please enter 3 or more letters to search
                            </Text>
                          ) : this.state.searchTermIntermediate !== "" ? (
                            <Text
                              variant="small"
                              style={{ textAlign: "left" }}
                              onClick={(e) => this.clearSearch(e)}
                            >
                              Clear
                            </Text>
                          ) : null}
                        </div>

                        {/* <div className="mt-2 mb-2">
                          <Link href="/challenge-winners">
                            <a>
                              <Button
                                size="sm"
                                css={`
                                  font-size: 1.2rem !important;
                                  min-width: 40vw !important;
                                  height: 5vh !important;
                                  background: #ffd700 !important;
                                  border-radius: 0px !important;
                                  color: #000000 !important;
                                  border: 1px solid #000000 !important;
                                  // box-shadow: 2px 2px 0px #ff0000;
                                  padding: 0px !important;
                                  width: 100%;
                                `}
                              >
                                Previous Challenge Winners
                              </Button>
                            </a>
                          </Link>
                        </div> */}

                        {this.state.showMessage && (
                          <div>
                            <Link href="/challenge-upload">
                              <a>
                                <Button
                                  size="sm"
                                  css={`
                                    font-size: 1.2rem !important;
                                    min-width: 40vw !important;
                                    height: 5vh !important;
                                    background: #000 !important;
                                    border-radius: 0px !important;
                                    // border: none !important;
                                    color: #ffffff !important;
                                    // border: 1px solid #dadada !important;
                                    // box-shadow: 2px 2px 0px #ff0000;
                                    padding: 0px !important;
                                    width: 100%;
                                  `}
                                >
                                  Click here to participate.
                                </Button>
                              </a>
                            </Link>
                          </div>
                        )}

                        {/* Leaderboard Rows */}
                        <Query
                          query={COMPETITION_SUBMISSION_BY_SEARCH}
                          variables={{
                            search_term: this.state.searchTerm,
                          }}
                        >
                          {({ loading, error, data, fetchMore }) => {
                            if (loading) return "Loading...";
                            if (error) return "";
                            return this.state.data.length > 0 ? (
                              <InfiniteScroll
                                style={{ overflow: "inherit" }}
                                dataLength={this.state.data.length}
                                // next={() => this.fetchMoreData(fetchMore)}
                                next={() =>
                                  fetchMore({
                                    variables: {
                                      offset: this.state.data.length,
                                    },
                                    updateQuery: (
                                      prev,
                                      { fetchMoreResult }
                                    ) => {
                                      if (!fetchMoreResult) return prev;
                                      let updatedData = [
                                        ...this.state.data,
                                        ...fetchMoreResult.competitionSubmissionBySearch,
                                      ];

                                      this.setState({
                                        data: updatedData,
                                        hasMoreRecords:
                                          fetchMoreResult
                                            .competitionSubmissionBySearch
                                            .length === 20
                                            ? true
                                            : false,
                                      });
                                    },
                                  })
                                }
                                hasMore={this.state.hasMoreRecords}
                                loader={<h4>Loading...</h4>}
                              >
                                {this.state.data.map((profile, index) => {
                                  let fullNameArray = profile.full_name
                                    ? profile.full_name.split(" ")
                                    : [""];

                                  let firstName, lastName;

                                  if (fullNameArray.length > 1) {
                                    firstName = fullNameArray[0] + "";
                                    fullNameArray.shift();
                                    lastName = fullNameArray.join(" ");
                                  } else {
                                    firstName = fullNameArray[0];
                                  }
                                  return (
                                    <Row
                                      key={profile.id}
                                      style={{ marginBottom: "1.5rem" }}
                                    >
                                      <Col
                                        xs="12"
                                        style={{
                                          padding: "0.5rem",
                                        }}
                                      >
                                        {profile.upload_type === "image" ? (
                                          <img
                                            src={
                                              process.env.REACT_APP_IMAGE_URL +
                                              process.env
                                                .REACT_APP_PROFILE_IMAGE_PATH +
                                              profile.media
                                            }
                                            width="100%"
                                          />
                                        ) : (
                                          <ReactPlayer
                                            url={
                                              process.env.REACT_APP_IMAGE_URL +
                                              process.env
                                                .REACT_APP_PROFILE_IMAGE_PATH +
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
                                        <Link
                                          href={`/profiles/${profile.slug}`}
                                        >
                                          <img
                                            src={
                                              profile.profile_pic
                                                ? process.env
                                                    .REACT_APP_IMAGE_URL +
                                                  process.env
                                                    .REACT_APP_PROFILE_IMAGE_PATH +
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
                                          zIndex: this.state.isOpen[profile.id]
                                            ? 0
                                            : 999,
                                        }}
                                      >
                                        {!this.state.isOpen[profile.id] && (
                                          <>
                                            <Link
                                              href={`/profiles/${profile.slug}`}
                                            >
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                // variant="leader-name"
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
                                              {profile.competition_name}
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
                                          isOpen={this.state.isOpen[profile.id]}
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
                                              const intermediateIsOpen =
                                                JSON.parse(
                                                  JSON.stringify(
                                                    this.state.isOpen
                                                  )
                                                );
                                              intermediateIsOpen[profile.id] =
                                                !intermediateIsOpen[profile.id];
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
                                                  profile.id
                                                }
                                              >
                                                <img src={facebookIcon} />
                                              </FacebookShareButton>
                                            }
                                            size={35}
                                          />
                                          <ChildButton
                                            icon={
                                              <WhatsappShareButton
                                                title="Hey ! Vote on my OMG profile , share it to your friends & family, and make me Face of the year !"
                                                url={
                                                  process.env.CLIENT_URL +
                                                  "challenge-submission/" +
                                                  profile.id
                                                }
                                              >
                                                <img src={whatsappIcon} />
                                              </WhatsappShareButton>
                                            }
                                            size={35}
                                          />
                                          <ChildButton
                                            icon={
                                              <TwitterShareButton
                                                title="Hey ! Vote on my OMG profile , share it to your friends & family, and make me Face of the year !"
                                                url={
                                                  process.env.CLIENT_URL +
                                                  "challenge-submission/" +
                                                  profile.id
                                                }
                                              >
                                                <img src={twitterIcon} />
                                              </TwitterShareButton>
                                            }
                                            size={35}
                                          />
                                          <ChildButton
                                            icon={
                                              <CopyToClipboard
                                                text={
                                                  process.env.CLIENT_URL +
                                                  "challenge-submission/" +
                                                  profile.id
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
                                            size={35}
                                          />
                                        </FloatingMenu>
                                      </Col>
                                      <Col xs="12">
                                        <hr />
                                      </Col>
                                    </Row>
                                  );
                                })}
                              </InfiniteScroll>
                            ) : (
                              <div>No results to display</div>
                            );
                          }}
                        </Query>
                      </>
                    </Box>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </Section>
    );
  }
}

export default SearchList;
