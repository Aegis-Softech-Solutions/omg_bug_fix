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
import ReactPaginate from "react-paginate";
import placeholder from "../../assets/image/placeholder/pr-media.jpg";

class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: props.searchTerm,
      searchTermIntermediate: props.searchTerm,
    };
  }

  onChangeSearchText = (e) => {
    this.setState({ searchTermIntermediate: e.target.value });
  };

  submitSearch = (e) => {
    e.preventDefault();
    this.setState({ searchTerm: this.state.searchTermIntermediate });
    if (this.state.searchTermIntermediate.length > 2) {
      Router.push({
        pathname: "/search-profiles",
        query: { search: this.state.searchTermIntermediate },
      });
    }
  };

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
                  <Title variant="card" color="#000000" className="mb-4">
                    Search
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col xs="7">
                  <Input
                    type="text"
                    placeholder=""
                    // isRequired={true}
                    onChange={(e) => this.onChangeSearchText(e)}
                    value={this.state.searchTermIntermediate}
                    variant="dark"
                  />
                </Col>
                <Col xs="5">
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
              <div style={{ minHeight: "30px" }}>
                {this.state.searchTermIntermediate &&
                this.state.searchTermIntermediate.length < 3 ? (
                  <Text variant="small" style={{ textAlign: "left" }}>
                    Please enter 3 or more letters to search
                  </Text>
                ) : null}
              </div>
            </Container>
            <Container>
              <Row style={{ marginRight: "0px", marginLeft: "0px" }}>
                {this.props.approvedCustomersBySearch &&
                  this.props.approvedCustomersBySearch
                    .approvedCustomersBySearch &&
                  this.props.approvedCustomersBySearch.approvedCustomersBySearch.map(
                    (profile) => {
                      return (
                        <>
                          <Col
                            xs="6"
                            style={{ padding: "0.5rem", height: "35vh" }}
                            key={profile.id}
                          >
                            <Link
                              href={"/profiles/" + profile.slug}
                              key={profile.id}
                            >
                              <div style={{ height: "80%" }} key={profile.id}>
                                <div
                                  // className="profile-page-image"
                                  style={{
                                    backgroundImage:
                                      "url(" +
                                      process.env.REACT_APP_IMAGE_URL +
                                      process.env.REACT_APP_PROFILE_IMAGE_PATH +
                                      profile.profile_pic +
                                      ")",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    height: "100%",
                                    width: "100%",
                                  }}
                                />

                                <Text
                                  variant="small"
                                  color="#000000"
                                  className="pt-2"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    display: "block",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {profile.full_name.length > 60
                                    ? profile.full_name.substr(0, 59) + "..."
                                    : profile.full_name}
                                </Text>
                              </div>
                            </Link>
                          </Col>
                        </>
                      );
                    }
                  )}
              </Row>
            </Container>
          </>
        </Box>
      </Section>
    );
  }
}

export default SearchList;
