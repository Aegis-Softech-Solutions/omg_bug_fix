import React from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import Logo from "../Logo";
import Link from "next/link";

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease-out;
  &.hidden {
    opacity: 0;
    visibility: hidden;
  }
`;

const Drawer = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  z-index: 999999;
  background: #000;
  overflow-y: auto;
  transform: translateX(0);
  transition: all 0.7s ease-out;
  &.hidden {
    transform: translateX(100%);
  }
  .dropdown-menu {
    position: static !important;
    will-change: initial !important;
    transform: initial !important;
    float: none !important;
  }
`;

const LogoContainer = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
`;

const Offcanvas = ({ show, onHideOffcanvas, children, ...rest }) => {
  if (typeof document !== "undefined") {
    if (show) {
      document.querySelector("html").classList.add("has-offcanvas");
      document.body.classList.add("has-offcanvas");
    } else {
      document.querySelector("html").classList.remove("has-offcanvas");
      document.body.classList.remove("has-offcanvas");
    }
  }

  return (
    <div {...rest}>
      <Overlay className={show ? "" : "hidden"} onClick={onHideOffcanvas} />
      <Drawer className={show ? "" : "hidden"}>
        <Container>
          <div className="p-3">
            <LogoContainer>
              <Logo onClick={onHideOffcanvas} white={1} />

              <i
                className="icon icon-simple-remove icon-close float-right"
                style={{
                  fontSize: "4.1vh",
                  color: "#ffffff",
                  paddingTop: "0.5rem",
                }}
                onClick={onHideOffcanvas}
              ></i>
              <Link href="/leaderboard">
                <a>
                  <i
                    className="icon icon-zoom-2 float-right"
                    style={{
                      fontSize: "1.5rem",
                      color: "#ffffff",
                      paddingRight: "0.5rem",
                      paddingTop: "0.8rem",
                    }}
                    onClick={onHideOffcanvas}
                  ></i>
                </a>
              </Link>
            </LogoContainer>
            <div style={{ paddingTop: "3rem" }}>{children}</div>
          </div>
        </Container>
      </Drawer>
    </div>
  );
};

export default Offcanvas;
