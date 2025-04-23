import React, { Component } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

import whatsappIcon from "../../assets/image/icons/whatsapp-green.png";

class WhatsappFloatingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }

  componentDidMount() {
    if (this.props && this.props.delay && this.props.delay === "0") {
      this.setState({ showButton: true });
    } else {
      setTimeout(() => {
        this.setState({ showButton: true });
      }, 6000);
    }
  }

  render() {
    return this.state.showButton ? (
      <Link href="/">
        <a
          href="https://wa.me/+919326411989"
          target="_blank"
          className="floating-whatsapp"
        >
          <img src={whatsappIcon} height="100%" />
        </a>
      </Link>
    ) : null;
  }
}

export default WhatsappFloatingButton;
