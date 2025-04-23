import React from "react";
import { withTheme } from "styled-components";

import Select, { NonceProvider } from "react-select";

const defaultOptions = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const getCustomStyles = (theme) => {
  return {
    dropdownIndicator: () => ({
      padding: "0px!important",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "#000000",
      backgroundColor: theme.colors.white,
      fontSize: "15px!important",
    }),
    control: (provided, state) => {
      return {
        ...provided,
        border: "none",
        borderBottom: `1px solid #dedede !important`,
        // border:
        //   state.menuIsOpen || state.isFocused
        //     ? `1px solid ${theme.colors.secondary} !important`
        //     : `1px solid ${theme.colors.border} !important`,
        // borderRadius: 10,
        // padding: "1.275rem 1rem",
        outline: "none",
        boxShadow: "none",
        fontSize: "15px!important",
        minHeight: "30px!important",
        borderRadius: 0,
      };
    },
  };
};

const SelectStyled = ({
  theme,
  name = "item",
  options = defaultOptions,
  ...rest
}) => {
  return (
    <Select
      styles={getCustomStyles(theme)}
      defaultValue={options[1]}
      name={name}
      options={options}
      {...rest}
      isSearchable={false}
    />
  );
};

export default withTheme(SelectStyled);
