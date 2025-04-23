import React from "react";
import { Route, Switch } from "react-router-dom";
import requireAuth from "../../util/requireAuth"; //import requireAuth for checking session validity
import asyncComponent from "util/asyncComponent";

const UserManagement = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/users/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Users")))}
    />
    <Route
      path={`${match.url}/roles/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Roles")))}
    />
  </Switch>
);

export default UserManagement;
