import React, { useState } from "react";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

import { Box, Text } from "../../components/Core";
import { device } from "../../utils";

const TitleContainer = styled(Box)`
  position: relative;
  padding-left: 0.5rem;
  &:after {
    content: "";
    height: 1px;
    position: absolute;
    right: 0;
    top: 50%;
    width: 32%;
    background: ${({ theme }) => theme.colors.border};
    margin-top: 0.5px;
    display: none;

    @media ${device.md} {
      width: 40%;
      display: block;
    }
    @media ${device.lg} {
      width: 52%;
    }
    @media ${device.xl} {
      width: 60%;
    }
  }
`;

const PRAndMedia = (props) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Box
        pb={"10px"}
        pt={"30px"}
        style={{ background: "#ffffff" }}
        mt={"-5px"}
      >
        <Container>
          <TitleContainer mb={"20px"}>
            <Text fontSize="18px" as="h4" className="" variant="custom-title">
              PR And Media
              <br />
            </Text>
          </TitleContainer>
        </Container>
        <Container>
          <Row style={{ marginRight: "0px", marginLeft: "0px" }}>
            {props.newsPRList &&
              props.newsPRList.newsPRList &&
              props.newsPRList.newsPRList.slice(0, 2).map((news) => {
                return (
                  <>
                    <Col
                      xs="6"
                      style={{ padding: "0.5rem", height: "30vh" }}
                      key={news.id}
                    >
                      <Link href={"/pr-and-media/" + news.slug} key={news.id}>
                        <div style={{ height: "100%" }} key={news.id}>
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
                              playing={false}
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
                            // variant="bold"
                            color="#000000"
                            className="pt-2"
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
        <Container className="pt-5">
          <Link href="/pr-and-media">
            <a>
              <Text variant="more-link">more</Text>
            </a>
          </Link>
        </Container>
      </Box>
      <Box></Box>
    </>
  );
};

export default PRAndMedia;
