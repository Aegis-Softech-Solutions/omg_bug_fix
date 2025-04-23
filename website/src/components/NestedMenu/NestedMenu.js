import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ListGroup, Collapse, Row, Col } from "react-bootstrap";
import {
  FaAngleRight,
  FaAngleDown,
  FaInstagramSquare,
  FaFacebookSquare,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import joshImg from "../../assets/image/icons/josh.png";
import mojImg from "../../assets/image/icons/moj.jpg";
import trillerImg from "../../assets/image/icons/triller.png";
import takatakImg from "../../assets/image/icons/takatak.png";
import Link from "next/link";
import GlobalContext from "../../context/GlobalContext";

const NestedMenuContainer = styled.div`
  a {
    color: #ffffff;
    transition: all 0.3s ease-out;
    &:hover,
    &:active {
      color: #ffffff;
      text-decoration: none;
    }
  }

  .collapse.list-group > .list-group-item > a {
    margin-left: 15px;
    color: red !important;
  }

  .list-group-item {
    font-size: 16px !important;
    background: #000000;
    color: #ffffff !important;
    padding: 0.35rem 0rem !important;
    padding-left: 0px !important;
    a {
      color: #ffffff !important;
    }
    & + .collapse:not(.show) {
      .list-group-item {
        border: none !important;
        border-width: 0 !important;
      }
    }
    & + .collapse.show {
      .list-group-item {
        &:first-child {
          border-top: none !important;
        }
      }
    }
  }
  .collapse + .list-group-item {
    border-top-width: 0;
  }
  /* .list-group-flush:last-child .list-group-item:last-child {
    border-bottom-width: 1px;
  } */
`;

const defaultMenuItems = [{ name: "home", label: "Home" }];

const MenuItem = ({
  label,
  isExternal = false,
  isPrimary = false,
  name,
  items,
  depthStep = 20,
  depth = 0,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const hasSubItems = Array.isArray(items);

  const gContext = useContext(GlobalContext);

  return (
    <>
      {hasSubItems ? (
        <ListGroup.Item
          {...rest}
          css={`
            padding-left: ${depth * depthStep}px !important;
            cursor: pointer;
          `}
          onClick={() => setOpen(!open)}
          className="d-flex align-items-center justify-content-between"
        >
          <span>{label}</span>
          <span>{open ? <FaAngleDown /> : <FaAngleRight />}</span>
        </ListGroup.Item>
      ) : (
        <ListGroup.Item
          {...rest}
          css={`
            padding-left: ${depth * depthStep}px !important;
          `}
        >
          {isExternal ? (
            <a
              href={`${name}`}
              onClick={() => {
                if (gContext.visibleOffCanvas) {
                  gContext.toggleOffCanvas();
                }
              }}
              target="_blank"
            >
              {label}
            </a>
          ) : (
            <Link href={`/${name}`}>
              <a
                onClick={() => {
                  if (gContext.visibleOffCanvas) {
                    gContext.toggleOffCanvas();
                  }
                }}
                className={isPrimary ? "primary-menu-item" : ""}
              >
                {label}
              </a>
            </Link>
          )}
        </ListGroup.Item>
      )}

      {hasSubItems ? (
        <Collapse in={open}>
          <ListGroup>
            {items.map((subItem) => (
              <MenuItem
                key={subItem.name}
                depth={depth + 1}
                depthStep={depthStep}
                {...subItem}
              />
            ))}
          </ListGroup>
        </Collapse>
      ) : null}
    </>
  );
};

const NestedMenu = ({ menuItems = defaultMenuItems }) => {
  const socialMenuItems = [
    {
      name: "https://instagram.com/omg.foy",
      label: "Instagram",
      isExternal: true,
    },
    {
      name: "https://www.facebook.com/omg.foy",
      label: "Facebook",
      isExternal: true,
    },
    {
      name: "https://www.youtube.com/channel/UCu5HqCmSVNgY0hpYpXPwJcQ",
      label: "YouTube",
      isExternal: true,
    },
    {
      name: "https://twitter.com/omgfoy",
      label: "Twitter",
      isExternal: true,
    },
  ];
  const otherMenuItems = [
    {
      name: "frequently-asked-questions",
      label: "FAQs",
    },
    {
      name: "terms-and-conditions",
      label: "Terms And Conditions",
    },
    {
      name: "contact-us",
      label: "Contact",
    },
  ];
  return (
    <NestedMenuContainer>
      <Row>
        <Col xs="12">
          <ListGroup variant="flush">
            {menuItems.map((menuItem, index) => (
              <MenuItem
                key={`${menuItem.name}${index}`}
                depthStep={20}
                depth={0}
                {...menuItem}
                isPrimary={true}
                className="main-menu-item"
              />
            ))}
          </ListGroup>
        </Col>
        {/* <Col xs="4"></Col> */}
        {/* <Col xs="8" style={{ marginTop: "30px" }}></Col> */}
        {/* <Col xs="4" style={{ marginTop: "30px" }}>
          <ListGroup variant="flush">
            {socialMenuItems.map((menuItem, index) => (
              <MenuItem
                key={`${menuItem.name}${index}`}
                depthStep={20}
                depth={0}
                {...menuItem}
                className="social-menu-item"
              />
            ))}
          </ListGroup>
        </Col> */}
        <Col xs="12" style={{ marginTop: "30px" }}>
          <ListGroup variant="flush">
            {otherMenuItems.map((menuItem, index) => (
              <MenuItem
                key={`${menuItem.name}${index}`}
                depthStep={20}
                depth={0}
                {...menuItem}
                isPrimary={true}
                className="social-menu-item"
              />
            ))}
          </ListGroup>
        </Col>
        <Col xs="12" style={{ marginTop: "30px" }}>
          <a href="https://instagram.com/omg.foy" target="_blank">
            <FaInstagramSquare style={{ color: "#fff" }} className="mr-4" />
          </a>

          <a href="https://www.facebook.com/omg.foy" target="_blank">
            <FaFacebookSquare style={{ color: "#fff" }} className="mr-4" />
          </a>

          <a
            href="https://www.youtube.com/channel/UCu5HqCmSVNgY0hpYpXPwJcQ"
            target="_blank"
          >
            <FaYoutube style={{ color: "#fff" }} className="mr-4" />
          </a>
          <a href="https://twitter.com/omgfoy" target="_blank">
            <FaTwitter style={{ color: "#fff" }} className="mr-3" />
          </a>
          <a
            href="https://share.myjosh.in/profile/68334f62-a322-486a-b900-ee607eaf891a?u=0xc7df787b11b41122"
            target="_blank"
          >
            <img
              src={joshImg}
              className="mr-4"
              style={{ height: "1.5em", width: "1.5em" }}
            />
          </a>

          <a
            href="https://mojapp.in/@omgfoy?referrer=TdfvaFT-1MInSp9"
            target="_blank"
          >
            <img
              src={mojImg}
              className="mr-4"
              style={{ height: "1.2em", width: "1.2em" }}
            />
          </a>

          <a href="https://triller.co/@omg-faceoftheyear" target="_blank">
            <img
              src={trillerImg}
              className="mr-3"
              style={{ height: "1.5em", width: "1.5em" }}
            />
          </a>
          {/* 
          <a href="https://share.mxtakatak.com/Arf3d4qb-qEu" target="_blank">
            <img
              src={takatakImg}
              className="mr-0"
              style={{ height: "1.2em", width: "1.2em" }}
            />
          </a> */}
        </Col>
        {/* <Col xs="4" style={{ marginTop: "30px" }}></Col> */}
      </Row>
    </NestedMenuContainer>
  );
};

export default NestedMenu;
