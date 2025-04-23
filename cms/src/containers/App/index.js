import React, { Component } from "react";
import { connect } from "react-redux";
import URLSearchParams from "url-search-params";
import { Redirect, Route } from "react-router-dom";
import { LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";

import AppLocale from "lngProvider";
import MainApp from "./MainApp";
import SignIn from "../SignIn";
import Auxiliary from "../../util/Auxiliary";
import {
  onLayoutTypeChange,
  onNavStyleChange,
  setThemeType
} from "appRedux/actions/Setting";

import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  THEME_TYPE_DARK
} from "../../constants/ThemeSetting";

import VerifyEmail from "../../routes/VerifyEmail";
import ResetCustomerPassword from "../../routes/ResetCustomerPassword";
import SuccessResetPassword from "../../routes/ResetCustomerPassword/success";

class App extends Component {
  setLayoutType = layoutType => {
    if (layoutType === LAYOUT_TYPE_FULL) {
      document.body.classList.remove("boxed-layout");
      document.body.classList.remove("framed-layout");
      document.body.classList.add("full-layout");
    } else if (layoutType === LAYOUT_TYPE_BOXED) {
      document.body.classList.remove("full-layout");
      document.body.classList.remove("framed-layout");
      document.body.classList.add("boxed-layout");
    } else if (layoutType === LAYOUT_TYPE_FRAMED) {
      document.body.classList.remove("boxed-layout");
      document.body.classList.remove("full-layout");
      document.body.classList.add("framed-layout");
    }
  };

  setNavStyle = navStyle => {
    if (
      navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
      navStyle === NAV_STYLE_DARK_HORIZONTAL ||
      navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
      navStyle === NAV_STYLE_ABOVE_HEADER ||
      navStyle === NAV_STYLE_BELOW_HEADER
    ) {
      document.body.classList.add("full-scroll");
      document.body.classList.add("horizontal-layout");
    } else {
      document.body.classList.remove("full-scroll");
      document.body.classList.remove("horizontal-layout");
    }
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);

    if (params.has("theme")) {
      this.props.setThemeType(params.get("theme"));
    }
    if (params.has("nav-style")) {
      this.props.onNavStyleChange(params.get("nav-style"));
    }
    if (params.has("layout-type")) {
      this.props.onLayoutTypeChange(params.get("layout-type"));
    }
  }

  render() {
    const {
      match,
      location,
      themeType,
      layoutType,
      navStyle,
      locale,
      authUser
    } = this.props;

    if (themeType === THEME_TYPE_DARK) {
      document.body.classList.add("dark-theme");
    }
    if (location.pathname === "/") {
      if (authUser === null) {
        return <Redirect to={"/signIn"} />;
      }
      return <Redirect to={"/contestant-management/contestants"} />;
    }

    this.setLayoutType(layoutType);

    this.setNavStyle(navStyle);

    const currentAppLocale = AppLocale[locale.locale];
    return (
      <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <Auxiliary>
            <Route exact path="/signin" component={SignIn} />
            <Route
              exact
              path="/verify-email/:token?"
              component={props => <VerifyEmail {...props} />}
            />

            <Route
              exact
              path="/reset-password/:token?"
              component={ResetCustomerPassword}
            />
            <Route
              exact
              path="/success-password-reset"
              component={SuccessResetPassword}
            />

            <Route
              path={`${match.url}`}
              authUser={authUser}
              component={MainApp}
            />
          </Auxiliary>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { locale, navStyle, themeType, layoutType } = settings;
  const { authUser, initURL } = auth;
  return { locale, navStyle, themeType, layoutType, authUser, initURL };
};
export default connect(mapStateToProps, {
  setThemeType,
  onNavStyleChange,
  onLayoutTypeChange
})(App);
