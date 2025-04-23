import React from "react";
import { Route, Switch } from "react-router-dom";
import requireAuth from "../../util/requireAuth"; //import requireAuth for checking session validity
import asyncComponent from "util/asyncComponent";

const CustomerManagement = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/contestants/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Customers")))}
    />
    <Route
      path={`${match.url}/voting-approved/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./OnlineVotes")))}
    />
    <Route
      path={`${match.url}/top-1000/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Top500")))}
    />
    <Route
      path={`${match.url}/top-300/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Top150")))}
    />
    <Route
      path={`${match.url}/top-150/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Top75")))}
    />
    <Route
      path={`${match.url}/top-60/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Top30")))}
    />
    <Route
      path={`${match.url}/top-40/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Top20")))}
    />
    <Route
      path={`${match.url}/top-20/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Top10")))}
    />
    <Route
      path={`${match.url}/top-10/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Top5")))}
    />
    <Route
      path={`${match.url}/transactions/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Transactions")))}
    />
  </Switch>
);

export default CustomerManagement;
