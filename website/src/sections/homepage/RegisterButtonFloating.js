import React, { Component } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

import { Title, Button, Section, Box, Text } from "../../components/Core";

class RegisterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showButton: true });
    }, 1500);
  }

  render() {
    return (
      <Row
        className="justify-content-center text-center"
        style={{
          position: "fixed",
          bottom: "33px",
          zIndex: "1000",
          width: "100%",
          // margin: "0px!important",
          marginLeft: "0px",
          marginRight: "0px",
        }}
      >
        {this.state.showButton ? (
          <Link href="/registration">
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
                  border: 1px solid #dadada !important;
                  box-shadow: 2px 2px 0px #ff0000;
                  padding: 0px !important;
                `}
                className="register-floating-button"
              >
                REGISTER NOW
              </Button>
            </a>
          </Link>
        ) : null}
      </Row>
    );
  }
}

export default RegisterButton;
