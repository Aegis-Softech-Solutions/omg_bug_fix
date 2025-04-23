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
                <br />
                <br />
                LEADERBOARD HAS BEEN PAUSED. <br />
                <br />
                <br />
                STAY TUNED FOR UPDATES
              </Title>
            </Col>
          </Row>
        </Container>
      </Section>
    );
  }
}

export default SearchList;
