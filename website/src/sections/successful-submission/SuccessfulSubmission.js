import React, { Component } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
} from "../../components/Core";

const FormStyled = styled.form``;

class SuccessfulSubmission extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>
        <Section pb={"30px"} style={{ minHeight: "90vh" }}>
          <Box
            // mb={"40px"}
            mt={"40px"}
            mr={"20px"}
            ml={"20px"}
            pb={"30px"}
            pt={"30px"}
            pl={"10px"}
            pr={"10px"}
          >
            <Container>
              <Title variant="card" mb="40px" style={{ textAlign: "center" }}>
                Submission Successful
              </Title>
              <Text variant="regular" mb="30px" style={{ textAlign: "center" }}>
                Profile submitted successfully. Your profile is currently under
                review. You would recieve an email with further updates within
                48 hours.
                <br />
                <br />
              </Text>
              <Row className="text-center">
                <Col xs={12}>
                  <Link href="/home">
                    <a>
                      <Button
                        width="100%"
                        type="submit"
                        variant="custom"
                        borderRadius={10}
                      >
                        Home
                      </Button>
                    </a>
                  </Link>
                </Col>
              </Row>
            </Container>
          </Box>
        </Section>
      </>
    );
  }
}

export default SuccessfulSubmission;
