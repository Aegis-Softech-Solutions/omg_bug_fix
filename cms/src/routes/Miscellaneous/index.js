import React from "react";
import { Route, Switch } from "react-router-dom";
import requireAuth from "../../util/requireAuth"; //import requireAuth for checking session validity
import asyncComponent from "util/asyncComponent";

const Settings = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/news-and-pr/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./NewsPR")))}
    />

    <Route
      path={`${match.url}/homeBanners/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./HomeBanners")))}
    />

    <Route
      path={`${match.url}/competitions/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Competitions")))}
    />

    <Route
      path={`${match.url}/webinars/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Webinars")))}
    />

    <Route
      path={`${match.url}/coupons/:useraction?/:id?`}
      component={requireAuth(asyncComponent(() => import("./Coupons")))}
    />
  </Switch>
);

export default Settings;
