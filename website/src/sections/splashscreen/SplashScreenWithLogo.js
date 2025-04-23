import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Router from "next/router";
import { setCookie } from "nookies";
import { Title, Button, Section, Box, Text } from "../../components/Core";

import logoImage from "../../assets/image/logo/black-logo-lg.png";
import skinWorksImg from "../../assets/image/splashscreen/skin-works.jpg";
import topupImg from "../../assets/image/splashscreen/topup.jpg";

import logoAnimation from "../../assets/videos/omg-logo-animation.mp4";
import season3Animation from "../../assets/image/homepage/splash_screen_unit_black.png";
import loaderAnimation from "../../assets/loader_animation.svg";
import { display } from "styled-system";

class SplashScreenWithLogo extends Component {
  componentDidMount() {
    setCookie(null, "utm_campaign", this.props.utm_campaign, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setCookie(null, "utm_source", this.props.utm_source, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setCookie(null, "utm_medium", this.props.utm_medium, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setCookie(null, "utm_adgroup", this.props.utm_adgroup, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setCookie(null, "utm_content", this.props.utm_content, {
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
    });

    setTimeout(() => {
      Router.push({
        pathname: "/home",
      });
    }, 7000);
  }

  render() {
    return (
      <>
        {/* <!-- SplashScreenWithLogo Area --> */}
        <Section className="p-0" style={{ display: "table", height: "90vh" }}>
          <Container
            className="p-0 text-center"
            style={{ display: "table-cell", verticalAlign: "middle", }}
          >
            {/* <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              dangerouslySetInnerHTML={{
                __html: `
                  <video
                    muted
                    autoplay
                    playsinline
                    loop
                    src="${logoAnimation}#t=0.1"
                    style="height:100vh;width:auto;margin-left:50vw;transform:translate(-50%);"
                  />
                `,
              }}
            /> */}
           
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:"100px"}}>
            <img src={season3Animation} width="60%" />
            <img src={loaderAnimation} width="20%" style={{display:"block", textAlign:"center"}}/>

            </div>

            {/* <img
              src={topupImg}
              alt="skin-works"
              className="img-fluid"
              width="40%"
              style={{ padding: "0.5rem" }}
            />
            <Text
              variant="very-small"
              color="#000000"
              className="text-center"
              style={{ paddingBottom: "30px" }}
            >
              ------ Presents ------
            </Text> */}

            {/* <img src={logoImage} width="50%" /> */}
            {/* <Text
              variant="very-small"
              color="#000000"
              className="text-center"
              style={{ paddingTop: "30px" }}
            >
              ------ Powered By ------
            </Text>
            <img
              src={skinWorksImg}
              alt="skin-works"
              className="img-fluid"
              width="40%"
              style={{ padding: "0.5rem" }}
            /> */}
            
          </Container>
        </Section>
        
      </>
    );
  }
}

export default SplashScreenWithLogo;
