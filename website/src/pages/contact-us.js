import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import WhatsappFloatingButton from "../sections/common/WhatsappFloatingButton";
import Link from "next/link";
import { Title, Button, Section, Box, Text, Input } from "../components/Core";
import MapGoogle from "../components/MapGoogle";

import PageWrapper from "../components/PageWrapper";

const FormStyled = styled.form``;

const Contact2 = () => {
  return (
    <>
      <PageWrapper>
        <Section className="text-center">
          <WhatsappFloatingButton delay="0" />
          <div className="pt-5"></div>
          <Container className="position-relative">
            <Row>
              <Col xs={12} className="mb-5 mb-lg-0">
                <Title variant="card" color="#000000" className="mb-4">
                  Contact Us
                </Title>
                <Text
                  variant="small"
                  color="#000000"
                  style={{ paddingLeft: "20px", paddingRight: "20px" }}
                >
                  424, 4th Floor, Laxmi Plaza, Suresh Nagar, Andheri West,
                  Mumbai 400102, MH IN
                  <br />
                  <br />
                  <a href="tel:+919326411989">+91 9326411989</a>
                  <br />
                  <br />
                  <a href="mailto:enquiry@omgfaceoftheyear.com">
                    enquiry@omgfaceoftheyear.com
                  </a>
                </Text>
              </Col>
              <Col xs={12} className="position-static">
                {/* <MapGoogle /> */}

                <div className="google-map-code" style={{ maxWidth: "100%" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.3467222966965!2d72.82915741511923!3d19.136294387053336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b6231bc333af%3A0x8db0b76305b546f7!2sLaxmi%20Plaza!5e0!3m2!1sen!2sin!4v1635504984345!5m2!1sen!2sin"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </div>
              </Col>
            </Row>
          </Container>
        </Section>
      </PageWrapper>
    </>
  );
};
export default Contact2;
