import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { breakpoints } from "../../utils";
import { Query } from "react-apollo";
import { VOTING_PHASE_CUSTOMERS_BY_SEARCH } from "./queries.js";
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
        pathname: "/leaderboard",
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
      pathname: "/leaderboard",
      query: {
        gender: this.state.gender,
      },
    });
  };

  handleSelect(key) {
    Router.push({
      pathname: "/leaderboard",
      query: { gender: key },
    });
  }

  render() {
    return (
      <Section className="mt-5" pb={"30px"} style={{ minHeight: "85vh" }}>
        <Container>
          <Row className="text-center">
            <Col xs="12">
              <Title variant="card" color="#000000" className="mb-2">
                LEADERBOARD
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
    <NavStyled style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
      <Nav.Link
        eventKey="m"
        style={{
          background: "#797979",
        }}
        className="leaderboard-navlink"
      >
        <span style={{ color: "#FFFFFF" }}>Mr. OMG</span>
      </Nav.Link>
      <Nav.Link
        eventKey="f"
        style={{
          background: "#797979",
        }}
        className="leaderboard-navlink"
      >
        <span style={{ color: "#FFFFFF" }}>Miss/Mrs. OMG</span>
      </Nav.Link>
      <Nav.Link
        eventKey="h"
        style={{
          background: "#797979",
          width: "200px",
        }}
        className="leaderboard-navlink"
      >
        <span style={{ color: "#FFFFFF"}}>Streax Hairstyle Icon</span>
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
                        <div style={{ minHeight: "30px", marginLeft: "-15px" }}>
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
                          query={VOTING_PHASE_CUSTOMERS_BY_SEARCH}
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
                                      // let updatedData = [
                                      //   ...JSON.parse(
                                      //     JSON.stringify(this.state.data)
                                      //   ),
                                      //   ...JSON.parse(
                                      //     JSON.stringify(
                                      //       fetchMoreResult.votingPhaseCustomersBySearch
                                      //     )
                                      //   ),
                                      // ];

                                      // this.setState(
                                      //   {
                                      //     data: [
                                      //       this.state.data,
                                      //       // ...fetchMoreResult.votingPhaseCustomersBySearch,
                                      //     ],
                                      //     hasMoreRecords:
                                      //       fetchMoreResult
                                      //         .votingPhaseCustomersBySearch
                                      //         .length === 20
                                      //         ? true
                                      //         : false,
                                      //   },
                                      //   () => console.log("!!!!!!", this.state)
                                      // );
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
                                    return index % 2 === 0 ? (
                                      <React.Fragment key={profile.id}>
                                        <Col
                                          xs="5"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                            display: "table",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{
                                                display: "table-cell",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <div
                                                className="leaderboard-rank"
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    leaderRankBackground +
                                                    ")",
                                                }}
                                              >
                                                {profile.votes_rank}
                                              </div>
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                variant="leader-name"
                                                style={{
                                                  maxWidth: "30vw",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {firstName}
                                                <br />
                                                {lastName}
                                              </Text>
                                              {this.abbreviateNumber(
                                                profile.votes
                                              )}{" "}
                                              votes
                                            </div>
                                          </Link>
                                        </Col>
                                        <Col
                                          xs="7"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{ height: "100%" }}
                                              key={profile.id}
                                            >
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
                                        </Col>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment key={profile.id}>
                                        <Col
                                          xs="7"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{ height: "100%" }}
                                              key={profile.id}
                                            >
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
                                        </Col>
                                        <Col
                                          xs="5"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                            display: "table",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{
                                                display: "table-cell",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <div
                                                className="leaderboard-rank"
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    leaderRankBackground +
                                                    ")",
                                                }}
                                              >
                                                {profile.votes_rank}
                                              </div>
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                variant="leader-name"
                                                style={{
                                                  maxWidth: "30vw",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {firstName}
                                                <br />
                                                {lastName}
                                              </Text>
                                              {this.abbreviateNumber(
                                                profile.votes
                                              )}{" "}
                                              votes
                                            </div>
                                          </Link>
                                        </Col>
                                      </React.Fragment>
                                    );
                                  })}
                                </Row>
                              </InfiniteScroll>
                            ) : (
                              <div>No results to display</div>
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

                        <div style={{ minHeight: "30px", marginLeft: "-15px" }}>
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
                          query={VOTING_PHASE_CUSTOMERS_BY_SEARCH}
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
                                        ...fetchMoreResult.votingPhaseCustomersBySearch,
                                      ];

                                      this.setState({
                                        data: updatedData,
                                        hasMoreRecords:
                                          fetchMoreResult
                                            .votingPhaseCustomersBySearch
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
                                    return index % 2 === 0 ? (
                                      <React.Fragment key={profile.id}>
                                        <Col
                                          xs="5"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                            display: "table",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{
                                                display: "table-cell",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <div
                                                className="leaderboard-rank"
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    leaderRankBackground +
                                                    ")",
                                                }}
                                              >
                                                {profile.votes_rank}
                                              </div>
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                variant="leader-name"
                                                style={{
                                                  maxWidth: "30vw",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {firstName}
                                                <br />
                                                {lastName}
                                              </Text>
                                              {this.abbreviateNumber(
                                                profile.votes
                                              )}{" "}
                                              votes
                                            </div>
                                          </Link>
                                        </Col>
                                        <Col
                                          xs="7"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{ height: "100%" }}
                                              key={profile.id}
                                            >
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
                                        </Col>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment key={profile.id}>
                                        <Col
                                          xs="7"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{ height: "100%" }}
                                              key={profile.id}
                                            >
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
                                        </Col>
                                        <Col
                                          xs="5"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                            display: "table",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{
                                                display: "table-cell",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <div
                                                className="leaderboard-rank"
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    leaderRankBackground +
                                                    ")",
                                                }}
                                              >
                                                {profile.votes_rank}
                                              </div>
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                variant="leader-name"
                                                style={{
                                                  maxWidth: "30vw",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {firstName}
                                                <br />
                                                {lastName}
                                              </Text>
                                              {this.abbreviateNumber(
                                                profile.votes
                                              )}{" "}
                                              votes
                                            </div>
                                          </Link>
                                        </Col>
                                      </React.Fragment>
                                    );
                                  })}
                                </Row>
                              </InfiniteScroll>
                            ) : (
                              <div>No results to display</div>
                            );
                          }}
                        </Query>
                      </>
                    </Box>
                  </Tab.Pane>
                  <Tab.Pane eventKey="h">
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

                        <div style={{ minHeight: "30px", marginLeft: "-15px" }}>
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
                          query={VOTING_PHASE_CUSTOMERS_BY_SEARCH}
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
                                        ...fetchMoreResult.votingPhaseCustomersBySearch,
                                      ];

                                      this.setState({
                                        data: updatedData,
                                        hasMoreRecords:
                                          fetchMoreResult
                                            .votingPhaseCustomersBySearch
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
                                    return index % 2 === 0 ? (
                                      <React.Fragment key={profile.id}>
                                        <Col
                                          xs="5"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                            display: "table",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{
                                                display: "table-cell",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <div
                                                className="leaderboard-rank"
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    leaderRankBackground +
                                                    ")",
                                                }}
                                              >
                                                {profile.votes_rank}
                                              </div>
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                variant="leader-name"
                                                style={{
                                                  maxWidth: "30vw",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {firstName}
                                                <br />
                                                {lastName}
                                              </Text>
                                              {this.abbreviateNumber(
                                                profile.votes
                                              )}{" "}
                                              votes
                                            </div>
                                          </Link>
                                        </Col>
                                        <Col
                                          xs="7"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{ height: "100%" }}
                                              key={profile.id}
                                            >
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
                                        </Col>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment key={profile.id}>
                                        <Col
                                          xs="7"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{ height: "100%" }}
                                              key={profile.id}
                                            >
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
                                        </Col>
                                        <Col
                                          xs="5"
                                          style={{
                                            padding: "0.5rem",
                                            height: "35vh",
                                            display: "table",
                                          }}
                                        >
                                          <Link
                                            href={"/profiles/" + profile.slug}
                                            key={profile.id}
                                          >
                                            <div
                                              style={{
                                                display: "table-cell",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <div
                                                className="leaderboard-rank"
                                                style={{
                                                  backgroundImage:
                                                    "url(" +
                                                    leaderRankBackground +
                                                    ")",
                                                }}
                                              >
                                                {profile.votes_rank}
                                              </div>
                                              <Text
                                                fontSize="16px"
                                                as="h4"
                                                variant="leader-name"
                                                style={{
                                                  maxWidth: "30vw",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {firstName}
                                                <br />
                                                {lastName}
                                              </Text>
                                              {this.abbreviateNumber(
                                                profile.votes
                                              )}{" "}
                                              votes
                                            </div>
                                          </Link>
                                        </Col>
                                      </React.Fragment>
                                    );
                                  })}
                                </Row>
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
