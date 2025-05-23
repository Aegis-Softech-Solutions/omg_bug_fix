import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";

import GlobalContext from "../../context/GlobalContext";
import Offcanvas from "../Offcanvas";
import { Button, Box } from "../Core";
import NestedMenu from "../NestedMenu";
import { device } from "../../utils";
import Logo from "../Logo";
import { menuItems } from "./menuItems";
import { loggedInMenuItems } from "./loggedInMenuItems";

import { destroyCookie } from "nookies";

const SiteHeader = styled.header`
  padding: 5px 0 5px 0;
  position: absolute !important;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 999;
  border-bottom: ${({ dark, theme }) =>
    dark ? `none` : `1px solid #dcdcdc`}!important;
  @media ${device.xs} {
    position: fixed !important;
    transition: 0.4s;
    // &.scrolling {
    //   transform: translateY(-100%);
    //   transition: 0.4s;
    // }
    &.reveal-header {
      // transform: translateY(0%);
      // box-shadow: 0 12px 34px -11px rgba(65, 62, 101, 0.1);
      z-index: 9999;
      background: ${({ dark, theme }) =>
        dark ? theme.colors.dark : theme.colors.light}!important;
    }
  }
`;

const ToggleButton = styled.button`
  color: ${({ dark, theme }) =>
    dark ? theme.colors.lightShade : theme.colors.darkShade}!important;
  border-color: ${({ dark, theme }) =>
    dark ? theme.colors.lightShade : theme.colors.darkShade}!important;
`;

const Menu = styled.ul`
  @media ${device.lg} {
    display: flex;
    justify-content: flex-end;
  }
  .dropdown-toggle {
    cursor: pointer;
  }
  > li {
    > .nav-link {
      @media ${device.lg} {
        color: ${({ dark, theme }) =>
          dark ? theme.colors.light : theme.colors.darkShade}!important;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        padding-top: 18px !important;
        padding-bottom: 18px !important;
        padding-left: 18px !important;
        padding-right: 18px !important;
      }
      &:hover {
        color: ${({ theme }) => theme.colors.primary} !important;
      }
    }
  }
  .nav-item.dropdown {
    @media ${device.lg} {
      position: relative;
      z-index: 99;
    }
    &:hover {
      > .menu-dropdown {
        @media ${device.lg} {
          top: 90%;
          opacity: 1;
          pointer-events: visible;
        }
      }
    }
  }
`;

const MenuDropdown = styled.ul`
  list-style: none;
  @media ${device.lg} {
    top: 110%;
    position: absolute;
    min-width: 227px;
    max-width: 227px;
    box-shadow: 0 52px 54px rgba(65, 62, 101, 0.3);
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    background-color: #ffffff;
    padding: 15px 0px;
    z-index: 99;
    opacity: 0;
    transition: opacity 0.4s, top 0.4s;
    pointer-events: none;
    left: -90%;
    border-radius: 0 0 10px 10px;
    border: 1px solid #eae9f2;
    background-color: #ffffff;
    display: block;
    border-top: ${({ theme }) => `3px solid ${theme.colors.secondary}`};
  }
  > .drop-menu-item {
    color: ${({ theme }) => theme.colors.dark};
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.5px;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 10px;
    padding-bottom: 10px;

    a {
      color: ${({ theme }) => theme.colors.dark};
      transition: all 0.3s ease-out;
      position: relative;
      display: flex;
      align-items: center;
      &.dropdown-toggle::after {
        display: inline-block;
        vertical-align: 0.255em;
        content: "";
        border-top: 0.325em solid;
        border-right: 0.325em solid transparent;
        border-bottom: 0;
        border-left: 0.325em solid transparent;
        position: relative;
        top: 1px;
        margin-left: auto;
        transform: rotate(-90deg);
        transition: 0.4s;
      }
    }

    &:hover {
      > a {
        color: ${({ theme }) => theme.colors.secondary};
        text-decoration: none;
        &::after {
          transform: rotate(0deg);
        }
      }
    }
    &.dropdown {
      position: relative;

      &:hover {
        > .menu-dropdown {
          @media ${device.lg} {
            top: 10px;
            opacity: 1;
            pointer-events: visible;
            transform: translateX(-100%);
          }
        }
      }
      > .menu-dropdown {
        border-top-color: ${({ theme }) => theme.colors.primary};
        @media ${device.lg} {
          top: 10px;
          left: 0%;
          opacity: 0;
          transform: translateX(-110%);
          transition: 0.4s;
          pointer-events: none;
        }
        > .drop-menu-item {
          @media ${device.lg} {
            padding-left: 30px;
            padding-right: 30px;
          }
        }
      }
    }
  }
  &.dropdown-right {
    left: auto;
    right: -90%;
  }
`;

const Header = ({ isDark = false }) => {
  const gContext = useContext(GlobalContext);
  const [showScrolling, setShowScrolling] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  useScrollPosition(({ prevPos, currPos }) => {
    if (currPos.y < 0) {
      setShowScrolling(true);
    } else {
      setShowScrolling(false);
    }
    if (currPos.y < -10) {
      setShowReveal(true);
    } else {
      setShowReveal(false);
    }
    if (currPos.y > 0) {
      // console.log("!!");
    }
  });

  return (
    <>
      <SiteHeader
        className={`sticky-header  ${showReveal ? "reveal-header" : ""}`}
        dark={isDark ? 1 : 0}
      >
        <Container fluid>
          <nav className="navbar site-navbar offcanvas-active navbar-expand-lg navbar-light">
            {/* <!-- Brand Logo--> */}
            <div className="brand-logo">
              {isDark ? (
                <Box
                  data-aos="fade-right"
                  data-aos-duration="2000"
                  data-aos-once="true"
                  data-aos-delay="1500"
                >
                  <Logo white={isDark} />
                </Box>
              ) : (
                <Box
                  data-aos="fade-right"
                  data-aos-duration="2000"
                  data-aos-once="true"
                  data-aos-delay="1500"
                >
                  <Logo />
                </Box>
              )}
            </div>

            <div className="collapse navbar-collapse">
              <div className="navbar-nav ml-lg-auto mr-3">
                <Menu
                  className="navbar-nav d-none d-lg-flex"
                  dark={isDark ? 1 : 0}
                >
                  {menuItems.map(
                    (
                      { label, isExternal = false, name, items, ...rest },
                      index
                    ) => {
                      const hasSubItems = Array.isArray(items);
                      return (
                        <React.Fragment key={name + index}>
                          {hasSubItems ? (
                            <li className="nav-item dropdown" {...rest}>
                              <a
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-toggle="dropdown"
                                aria-expanded="false"
                                href="/#"
                                onClick={(e) => e.preventDefault()}
                              >
                                {label}
                              </a>
                              <MenuDropdown
                                className="menu-dropdown dropdown-right"
                                dark={isDark ? 1 : 0}
                              >
                                {items.map((subItem, indexSub) => {
                                  const hasInnerSubItems = Array.isArray(
                                    subItem.items
                                  );
                                  return (
                                    <React.Fragment
                                      key={subItem.name + indexSub}
                                    >
                                      {hasInnerSubItems ? (
                                        <li className="drop-menu-item dropdown">
                                          <a
                                            className="dropdown-toggle"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-expanded="false"
                                            href="/#"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            {subItem.label}
                                          </a>
                                          <MenuDropdown
                                            className="menu-dropdown dropdown-right"
                                            dark={isDark ? 1 : 0}
                                          >
                                            {subItem.items.map(
                                              (itemInner, indexInnerMost) => (
                                                <li
                                                  className="drop-menu-item"
                                                  key={
                                                    itemInner.name +
                                                    indexInnerMost
                                                  }
                                                >
                                                  {itemInner.isExternal ? (
                                                    <a
                                                      href={`${itemInner.name}`}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      {itemInner.label}
                                                    </a>
                                                  ) : (
                                                    <Link
                                                      href={`/${itemInner.name}`}
                                                    >
                                                      <a>{itemInner.label}</a>
                                                    </Link>
                                                  )}
                                                </li>
                                              )
                                            )}
                                          </MenuDropdown>
                                        </li>
                                      ) : (
                                        <li className="drop-menu-item">
                                          {subItem.isExternal ? (
                                            <a
                                              href={`${subItem.name}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {subItem.label}
                                            </a>
                                          ) : (
                                            <Link href={`/${subItem.name}`}>
                                              <a>{subItem.label}</a>
                                            </Link>
                                          )}
                                        </li>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </MenuDropdown>
                            </li>
                          ) : (
                            <li className="nav-item" {...rest}>
                              {isExternal ? (
                                <a
                                  className="nav-link"
                                  href={`${name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {label}
                                </a>
                              ) : (
                                <Link href={`/${name}`}>
                                  <a
                                    className="nav-link"
                                    role="button"
                                    aria-expanded="false"
                                  >
                                    {label}
                                  </a>
                                </Link>
                              )}
                            </li>
                          )}
                        </React.Fragment>
                      );
                    }
                  )}
                </Menu>
              </div>
            </div>
            {/* <div className="header-btns ml-auto ml-lg-0 d-none d-md-block">
              <Button
                size="sm"
                css={`
                  font-size: 16px !important;
                  min-width: 141px !important;
                  height: 45px !important;
                `}
              >
                Get Started
              </Button>
            </div> */}
            <Box
              data-aos="fade-left"
              data-aos-duration="2000"
              data-aos-once="true"
              data-aos-delay="1500"
            >
              <div style={{ paddingTop: "5px" }}>
                <ToggleButton
                  className={`navbar-toggler btn-close-off-canvas ml-3 ${
                    gContext.visibleOffCanvas ? "collapsed" : ""
                  }`}
                  type="button"
                  data-toggle="collapse"
                  data-target="#mobile-menu"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  dark={isDark ? 1 : 0}
                >
                  <Link
                    href={
                      gContext.customerDetails && gContext.customerDetails.id
                        ? "/my-profile"
                        : "/login"
                    }
                  >
                    <a>
                      <i
                        className={
                          isDark
                            ? "icon icon-single-02 d-block white-icon header-icon-user"
                            : "icon icon-single-02 d-block header-icon-user"
                        }
                      ></i>
                    </a>
                  </Link>
                </ToggleButton>
                <ToggleButton
                  className={`navbar-toggler btn-close-off-canvas ml-3 ${
                    gContext.visibleOffCanvas ? "collapsed" : ""
                  }`}
                  type="button"
                  data-toggle="collapse"
                  data-target="#mobile-menu"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  onClick={gContext.toggleOffCanvas}
                  dark={isDark ? 1 : 0}
                >
                  <i
                    className={
                      isDark
                        ? "icon icon-menu-34-2 icon-burger d-block white-icon header-icon-hamburger"
                        : "icon icon-menu-34-2 icon-burger d-block header-icon-hamburger"
                    }
                  ></i>
                </ToggleButton>
              </div>
            </Box>
          </nav>
        </Container>
      </SiteHeader>
      <Offcanvas
        show={gContext.visibleOffCanvas}
        onHideOffcanvas={gContext.toggleOffCanvas}
      >
        <NestedMenu
          menuItems={
            gContext.customerDetails && gContext.customerDetails.id
              ? loggedInMenuItems
              : menuItems
          }
        />
      </Offcanvas>
    </>
  );
};
export default Header;
