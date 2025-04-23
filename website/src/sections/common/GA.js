import React from "react";
import { initGA, logPageView } from "../../utils/analytics";
import { hotjar } from "react-hotjar";
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "GTM-5B5336X",
};

export default class GA extends React.Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
    TagManager.initialize(tagManagerArgs);
    hotjar.initialize(2106777, 6);
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
