import React from "react";
import { Route, Switch } from "react-router-dom";
import requireAuth from "../../util/requireAuth"; //import requireAuth for checking session validity
import asyncComponent from "util/asyncComponent";

const Attributes = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/sample-records/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./SampleRecord")))}
    />
  </Switch>
);

export default Attributes;
