import React from "react";
import styled from "styled-components";
import {
  color,
  background,
  space,
  border,
  typography,
  shadow,
  flexbox,
  layout,
} from "styled-system";

const ButtonUploadVideo = styled.button`
  padding: 0.3rem 2rem;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: -0.66px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: perspective(1px) translateZ(0);
  overflow: hidden;
  outline: none !important;
  white-space: nowrap;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  color: #a9aaa9;
`;

const ButtonUpload = styled.button`
  padding: 0.3rem 2rem;
  font-size: 12px;
  font-weight: 100;
  letter-spacing: -0.66px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // transform: perspective(1px) translateZ(0);
  overflow: hidden;
  outline: none !important;
  white-space: nowrap;
  background: #000000;
  // border: 1px solid #e1e1e1;
  border: none !important;
  color: #ffffff;
`;

const ButtonCustom = styled.button`
  padding: 0.3rem 2rem;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: -0.66px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: perspective(1px) translateZ(0);
  position: relative;
  overflow: hidden;
  outline: none !important;
  white-space: nowrap;
  background: #000;
  color: #fff;

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: scaleX(0);
    transform-origin: 100% 50%;
    transition-property: transform;
    transition-duration: 0.5s;
    transition-timing-function: ease-out;
  }

  &:hover:before,
  &:focus:before,
  &:active:before {
    transform: scaleX(1);
    transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
  }
`;

const ButtonSolid = styled.button`
  padding: 0.85rem 1.75rem;
  min-width: 200px;
  border-radius: 5px;
  font-size: 21px;
  font-weight: 500;
  letter-spacing: -0.66px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: perspective(1px) translateZ(0);
  position: relative;
  overflow: hidden;
  outline: none !important;
  white-space: nowrap;
  ${color};
  ${background};
  ${border};
  ${space};
  ${typography};
  ${shadow};
  ${flexbox};
  ${layout};

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: scaleX(0);
    transform-origin: 100% 50%;
    transition-property: transform;
    transition-duration: 0.5s;
    transition-timing-function: ease-out;
  }

  &:hover:before,
  &:focus:before,
  &:active:before {
    transform: scaleX(1);
    transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
  }
`;

const ButtonOutline = styled(ButtonSolid)`
  background: transparent;
  /* border: 1px solid ${({ theme, color }) => theme.colors[color]}; */
  /* color: ${({ theme, color }) => theme.colors[color]}; */

  &:before {
    background: ${({ theme, color }) => theme.colors[color]};
  }

  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) => theme.colors.dark};
  }
  &:hover:before,
  &:focus:before,
  &:active:before {
    transform: scaleX(1);
    transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
    background: ${({ theme, color }) => theme.colors[color]};
  }
`;

const Button = ({
  variant = "solid",
  color = "light",
  bg = "primary",
  ...rest
}) => {
  switch (variant) {
    case "solid":
      return (
        <ButtonSolid
          color={color}
          border={`1px solid`}
          borderColor={bg}
          bg={bg}
          {...rest}
        />
      );
      break;
    case "custom":
      return (
        <ButtonCustom
          color={color}
          border={`1px solid`}
          borderColor={bg}
          bg={bg}
          {...rest}
        />
      );
      break;
    case "upload":
      return (
        <ButtonUpload
          color={color}
          bg={bg}
          border={`1px solid`}
          borderColor={color}
          {...rest}
        />
      );
      break;
    case "upload-video":
      return (
        <ButtonUploadVideo
          color={color}
          bg={bg}
          border={`1px solid`}
          borderColor={color}
          {...rest}
        />
      );
      break;
    default:
      return (
        <ButtonOutline
          color={color}
          bg={bg}
          border={`1px solid`}
          borderColor={color}
          {...rest}
        />
      );
  }

  // return variant === "solid" ? (

  // ) : variant === "custom" ? (

  // ) : variant === "upload" ? (

  // ) : (
  //   <ButtonOutline
  //     color={color}
  //     bg={bg}
  //     border={`1px solid`}
  //     borderColor={color}
  //     {...rest}
  //   />
  // );
};

export default Button;
