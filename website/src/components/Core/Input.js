import React from "react";
import styled from "styled-components";
import {
  color,
  space,
  typography,
  shadow,
  layout,
  border,
} from "styled-system";
import Text from "./Text";

const InputSolidDark = styled.input`
  border: ${({ as }) =>
    as === "textarea" ? `solid 1px #dedede !important` : `0 !important`};
  outline: 0 !important;
  background: transparent !important;
  border-bottom: 1px solid #dedede !important;
  border-top: ${({ as }) =>
    as === "textarea" ? `solid 1px #dedede !important` : `0 !important`};
  border-radius: 0 !important;
  font-size: 15px;
  font-weight: 300;
  letter-spacing: -0.56px;
  display: block;
  padding: 0.5rem 0rem 0.2rem 0rem;
  // ${color};
  color: #000000;
  ${space};
  ${typography};
  // ${shadow};
  ${layout};
  &:focus,
  &:active,
  &.active {
    border-color: ${({ theme, focusColor }) => theme.colors[focusColor]};
    outline: 0;
    box-shadow: none;
  }
`;

const InputSolid = styled.input`
  border: ${({ as }) =>
    as === "textarea" ? `solid 1px black important` : `0 !important`};
  outline: 0 !important;
  background: transparent !important;
  border-bottom: 1px solid white !important;
  border-radius: 0 !important;
  font-size: 15px;
  font-weight: 300;
  letter-spacing: -0.56px;
  display: block;
  padding: 0.5rem 0rem 0.2rem 0rem;
  // ${color};
  color: #ffffff;
  ${space};
  ${typography};
  // ${shadow};
  ${layout};
  &:active,
  &.active {
    border-color: ${({ theme, focusColor }) => theme.colors[focusColor]};
    outline: 0;
    box-shadow: none;
  }
`;

const InputAnimation = styled.div`
  position: relative;
  ${color};
  ${space};
  ${typography};
  ${shadow};
  ${layout};
  ${border};
  input {
    width: 100%;
    padding: 1.275rem 1rem;
    border: ${({ theme }) => `1px solid ${theme.colors.border}`};
    background-color: ${({ theme }) => theme.colors.light};
    color: ${({ theme }) => theme.colors.dark};
    font-size: 21px;
    font-weight: 300;
    line-height: 1.5;
    letter-spacing: -0.56px;
    border-radius: 10px;
    background-clip: padding-box;
    transition: all 0.3s ease-out;
  }
  input:focus ~ label {
    top: 0px;
    left: 15px;
  }

  label {
    background-color: ${({ theme }) => theme.colors.light};
    font-size: 18px;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.darkShade};
    top: 50%;
    padding: 0 10px;
    left: 15px;
    border-radius: 5px;
    margin-bottom: 0;
    transform: translateY(-50%);
    position: absolute;
    transition: 0.4s;
    pointer-events: none;
  }
`;

const Input = ({
  variant = "solid",
  type = "text",
  focusColor = "secondary",
  placeholder,
  isRequired = false,
  isMobileNumber = false,
  isInstaHandle = false,
  as,
  ...rest
}) => {
  return variant === "animation" ? (
    <InputAnimation {...rest}>
      <input width="100%" type={type} color="text" bg="light" />
      <label>{placeholder}</label>
    </InputAnimation>
  ) : (
    <>
      <Text
        variant="very-small"
        className="pt-2 input-title"
        color={variant === "dark" ? "#000000" : "#FFFFFF"}
      >
        {placeholder}
        <span style={{ color: "red" }}>{isRequired ? "*" : ""}</span>
      </Text>
      {isMobileNumber ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: "10%",
              color: variant === "dark" ? "#000000" : "#FFFFFF",
              fontSize: "15px",
              fontWeight: "300",
              letterSpacing: "-0.56px",
              padding: "0.5rem 0rem 0.2rem 0rem",
              borderBottom: "1px solid white",
            }}
          >
            {" "}
            +91
          </span>
          {variant === "dark" ? (
            <InputSolidDark
              width="100%"
              type={type}
              color="text"
              bg="light"
              // placeholder={placeholder}
              focusColor={focusColor}
              {...rest}
            />
          ) : (
            <InputSolid
              width="100%"
              type={type}
              color="text"
              bg="light"
              // placeholder={placeholder}
              focusColor={focusColor}
              {...rest}
            />
          )}
        </>
      ) : isInstaHandle ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: "10%",
              color: "#000000",
              fontSize: "15px",
              fontWeight: "300",
              letterSpacing: "-0.56px",
              padding: "0.5rem 0rem 0.2rem 0rem",
              borderBottom: "1px solid white",
            }}
          >
            {" "}
            @
          </span>
          {variant === "dark" ? (
            <InputSolidDark
              width="100%"
              type={type}
              color="text"
              bg="light"
              // placeholder={placeholder}
              focusColor={focusColor}
              {...rest}
            />
          ) : (
            <InputSolid
              width="100%"
              type={type}
              color="text"
              bg="light"
              // placeholder={placeholder}
              focusColor={focusColor}
              {...rest}
            />
          )}
        </>
      ) : (
        <>
          {variant === "dark" ? (
            <InputSolidDark
              width="100%"
              type={type}
              color="text"
              bg="light"
              // placeholder={placeholder}
              focusColor={focusColor}
              as={as}
              {...rest}
            />
          ) : (
            <InputSolid
              width="100%"
              type={type}
              color="text"
              bg="light"
              // placeholder={placeholder}
              focusColor={focusColor}
              {...rest}
              as={as}
            />
          )}
        </>
      )}
    </>
  );
};

export default Input;
