import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { Title, Box } from "../Core";
import Logo from "../Logo";

const TitleStyled = styled(Title)`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 22px;
`;

const UlStyled = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    line-height: 2.25;
    a {
      color: ${({ theme, color }) => theme.colors[color]} !important;

      &:hover {
        text-decoration: none;
        color: ${({ theme, color }) => theme.colors.secondary} !important;
      }
    }
  }
`;

const CopyRightArea = styled.div`
  padding: 15px 0;
  p {
    color: ${({ dark, theme }) =>
      dark ? theme.colors.lightShade : theme.colors.darkShade};
    font-size: 13px;
    font-weight: 300;
    letter-spacing: -0.41px;
    line-height: 38px;
    margin-bottom: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    a {
      color: #858585 !important;
      opacity: 0.7;
      font-size: 1.1rem;
      transition: 0.4s;
      padding: 0 3px;
      margin: 0 2.5px;
      &:visited {
        text-decoration: none;
      }
      &:hover {
        text-decoration: none;
        color: #000000 !important;
      }
    }
  }
`;

const Footer = ({ isDark = false, isHomepage = false }) => {
  return (
    <>
      {/* <!-- Footer section --> */}
      <Box
        bg={isDark ? "dark" : "light"}
        className="text-center"
        pb={isHomepage ? "15vh" : "0px"}
        mt={"-5px"}
      >
        <Container>
          <CopyRightArea dark={0}>
            <Row style={{ marginBottom: "0.2rem" }}>
              <Col sm="12">
                <ul className="social-icons">
                  <li>
                    <Link href="/contact-us">
                      <a className="footer-link">Contact</a>
                    </Link>
                  </li>
                  <li>
                    <a>|</a>
                  </li>
                  <li>
                    <Link href="/about-us">
                      <a className="footer-link">About Us</a>
                    </Link>
                  </li>
                  <li>
                    <a>|</a>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions">
                      <a className="footer-link">T&Cs</a>
                    </Link>
                  </li>
                </ul>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <ul className="social-icons">
                  <li>
                    <a
                      href="https://www.instagram.com/omg.foy/"
                      target="_blank"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/omgfoy" target="_blank">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/omg.foy" target="_blank">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/channel/UCu5HqCmSVNgY0hpYpXPwJcQ"
                      target="_blank"
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/+919326411989" target="_blank">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </CopyRightArea>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
