import React from "react";
import { Route, Switch } from "react-router-dom";
import requireAuth from "../../util/requireAuth"; //import requireAuth for checking session validity
import asyncComponent from "util/asyncComponent";

const ContestManagement = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/stages`}
      component={requireAuth(asyncComponent(() => import("./Stages")))}
    />
  </Switch>
);

export default ContestManagement;
