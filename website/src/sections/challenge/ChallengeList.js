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

class ChallengeList extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  constructor(props) {
    super(props);
    this.state = {
      pageCount: parseInt(props.newsPRListCount, 10) / 10,
      page: props.page ? parseInt(props.page, 10) : 0,
    };
  }

  paginationHandler = (page) => {
    Router.push({
      pathname: "/pr-and-media",
      query: { page: page.selected + 1 },
    });
    window.scrollTo(0, 0);
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
                    OMG Challenges
                  </Title>
                </Col>
              </Row>
            </Container>
            <Container>
              <Row style={{ marginRight: "0px", marginLeft: "0px" }}>
                {this.props.newsPRList &&
                  this.props.newsPRList.newsPRList &&
                  this.props.newsPRList.newsPRList.map((news) => {
                    return (
                      <>
                        <Col
                          xs="6"
                          style={{ padding: "0.5rem", height: "30vh" }}
                          key={news.id}
                        >
                          <Link
                            href={"/pr-and-media/" + news.slug}
                            key={news.id}
                          >
                            <div style={{ height: "80%" }} key={news.id}>
                              {news.media_type === "video" ? (
                                <ReactPlayer
                                  url={
                                    process.env.REACT_APP_IMAGE_URL +
                                    process.env.REACT_APP_MISC_URL +
                                    news.featured_image
                                  }
                                  width="100%"
                                  height="100%"
                                  controls
                                  muted
                                  playing={true}
                                  style={{ background: "black" }}
                                />
                              ) : (
                                <div
                                  // className="profile-page-image"
                                  style={{
                                    backgroundImage: news.featured_image
                                      ? "url(" +
                                        process.env.REACT_APP_IMAGE_URL +
                                        process.env.REACT_APP_MISC_URL +
                                        news.featured_image +
                                        ")"
                                      : placeholder,

                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    height: "100%",
                                    width: "100%",
                                  }}
                                />
                              )}

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
                                {news.title.length > 60
                                  ? news.title.substr(0, 59) + "..."
                                  : news.title}
                              </Text>
                            </div>
                          </Link>
                        </Col>
                      </>
                    );
                  })}
              </Row>
            </Container>
            {this.state.pageCount > 1 ? (
              <Container
                style={{ marginTop: "15%" }}
                className="d-flex justify-content-center"
              >
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={this.paginationHandler}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                  forcePage={this.state.page}
                />
              </Container>
            ) : null}
          </>
        </Box>
      </Section>
    );
  }
}

export default ChallengeList;
