import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { breakpoints } from "../../utils";
import { Query } from "react-apollo";
import { TOP_20_LEADERBOARD_BY_SEARCH } from "./queries.js";
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
      gender: props.gender,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.searchTerm !== nextProps.searchTerm ||
      prevState.gender !== nextProps.gender
    ) {
      return {
        searchTerm: nextProps.searchTerm,
        searchTermIntermediate: nextProps.searchTerm,
        data: nextProps.initialData,
        hasMoreRecords: nextProps.initialData.length === 20 ? true : false,
        gender: nextProps.gender,
      };
    }
  }

  // abbreviateNumber(number) {
  //   if (!number) {
  //     number = 0;
  //   }
  //   // what tier? (determines SI symbol)
  //   var tier = (Math.log10(number) / 3) | 0;

  //   // if zero, we don't need a suffix
  //   if (tier == 0) return number;

  //   // get suffix and determine scale
  //   var suffix = SI_SYMBOL[tier];
  //   var scale = Math.pow(10, tier * 3);

  //   // scale the number
  //   var scaled = number / scale;

  //   // format number and add suffix
  //   return scaled.toFixed(1) + suffix;
  // }

  abbreviateNumber(number) {
    return number;
  }

  onChangeSearchText = (e) => {
    this.setState({ searchTermIntermediate: e.target.value });
  };

  submitSearch = (e) => {
    e.preventDefault();
    this.setState({ searchTerm: this.state.searchTermIntermediate });
    if (this.state.searchTermIntermediate.length > 2) {
      Router.push({
        pathname: "/top-40",
        query: {
          search: this.state.searchTermIntermediate,
          gender: this.state.gender,
        },
      });
    }
  };

  clearSearch = (e) => {
    e.preventDefault();
    this.setState({ searchTerm: "" });
    Router.push({
      pathname: "/top-40",
      query: {
        gender: this.state.gender,
      },
    });
  };

  handleSelect(key) {
    Router.push({
      pathname: "/top-40",
      query: { gender: key },
    });
  }

  render() {
    return (
      <Section className="mt-5" pb={"20px"} style={{ minHeight: "85vh" }}>
        <Container>
          <Row className="text-center">
            <Col xs="12">
              <Title variant="card" color="#FF0000" className="mb-2">
                TOP 40
              </Title>
            </Col>
          </Row>
          <Tab.Container
            defaultActiveKey={this.state.gender}
            onSelect={(key) => this.handleSelect(key)}
          >
            {/* Tab Selection */}
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
              <Col xs="12">
                <NavStyled>
                  <Nav.Link
                    eventKey="m"
                    style={{
                      background: "#797979",
                    }}
                    className="leaderboard-navlink"
                  >
                    <span style={{ color: "#FFFFFF" }}>MALE</span>
                  </Nav.Link>
                  <Nav.Link
                    eventKey="f"
                    style={{
                      background: "#797979",
                    }}
                    className="leaderboard-navlink"
                  >
                    <span style={{ color: "#FFFFFF" }}>FEMALE</span>
                  </Nav.Link>
                </NavStyled>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Tab.Content>
                  <Tab.Pane eventKey="m">
                    <Box pb={"10px"} pt={"10px"} pl={"10px"} pr={"10px"}>
                      <>
                        {/* Search Row */}
                        <Row>
                          <Col xs="7" style={{ paddingLeft: "0px" }}>
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
                        <div style={{ minHeight: "20px", marginLeft: "-15px" }}>
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

                        {/* Leaderboard Rows */}
                        <Query
                          query={TOP_20_LEADERBOARD_BY_SEARCH}
                          variables={{
                            searchTerm: this.state.searchTerm,
                            gender: this.props.gender,
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
                                    },
                                  })
                                }
                                hasMore={this.state.hasMoreRecords}
                                loader={<h4>Loading...</h4>}
                              >
                                <Row>
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
                                      <React.Fragment
                                        key={firstName + lastName}
                                      >
                                        <Col
                                          xs="6"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                          >
                                            <div style={{ height: "72%" }}>
                                              <div
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    process.env
                                                      .REACT_APP_IMAGE_URL +
                                                    process.env
                                                      .REACT_APP_PROFILE_IMAGE_PATH +
                                                    profile.profile_pic +
                                                    ")",
                                                  backgroundSize: "cover",
                                                  backgroundPosition: "center",
                                                  backgroundRepeat: "no-repeat",
                                                  height: "100%",
                                                  width: "100%",
                                                }}
                                              />
                                            </div>
                                          </Link>
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                          >
                                            <Text
                                              fontSize="16px"
                                              as="h4"
                                              variant="leader-name"
                                              style={{
                                                maxWidth: "20vw",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              {firstName}
                                              <br />
                                              {lastName}
                                            </Text>
                                          </Link>
                                          {profile.city}
                                        </Col>
                                      </React.Fragment>
                                    );
                                  })}
                                </Row>
                              </InfiniteScroll>
                            ) : (
                              <div>To be announced soon</div>
                            );
                          }}
                        </Query>
                      </>
                    </Box>
                  </Tab.Pane>
                  <Tab.Pane eventKey="f">
                    <Box pb={"10px"} pt={"10px"} pl={"10px"} pr={"10px"}>
                      <>
                        {/* Search Row */}
                        <Row>
                          <Col xs="7" style={{ paddingLeft: "0px" }}>
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

                        <div style={{ minHeight: "20px", marginLeft: "-15px" }}>
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

                        {/* Leaderboard Rows */}
                        <Query
                          query={TOP_20_LEADERBOARD_BY_SEARCH}
                          variables={{
                            searchTerm: this.state.searchTerm,
                            gender: this.props.gender,
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
                                        ...fetchMoreResult.top20LeaderboardBySearch,
                                      ];

                                      this.setState({
                                        data: updatedData,
                                        hasMoreRecords:
                                          fetchMoreResult
                                            .top20LeaderboardBySearch.length ===
                                          20
                                            ? true
                                            : false,
                                      });
                                    },
                                  })
                                }
                                hasMore={this.state.hasMoreRecords}
                                loader={<h4>Loading...</h4>}
                              >
                                <Row>
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
                                      <React.Fragment
                                        key={firstName + lastName}
                                      >
                                        <Col
                                          xs="6"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                          >
                                            <div style={{ height: "72%" }}>
                                              <div
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    process.env
                                                      .REACT_APP_IMAGE_URL +
                                                    process.env
                                                      .REACT_APP_PROFILE_IMAGE_PATH +
                                                    profile.profile_pic +
                                                    ")",
                                                  backgroundSize: "cover",
                                                  backgroundPosition: "center",
                                                  backgroundRepeat: "no-repeat",
                                                  height: "100%",
                                                  width: "100%",
                                                }}
                                              />
                                            </div>
                                          </Link>
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                          >
                                            <div
                                              style={{
                                                display: "table-cell",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                variant="leader-name"
                                                style={{
                                                  maxWidth: "20vw",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {firstName}
                                                <br />
                                                {lastName}
                                              </Text>
                                            </div>
                                          </Link>
                                          {profile.city}
                                        </Col>
                                      </React.Fragment>
                                    );
                                  })}
                                </Row>
                              </InfiniteScroll>
                            ) : (
                              <div>To be announced soon</div>
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
