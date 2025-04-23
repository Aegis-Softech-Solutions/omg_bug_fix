import React from "react";
import { Route, Switch } from "react-router-dom";

import requireAuth from "../util/requireAuth"; //import requireAuth for checking session validity
import asyncComponent from "util/asyncComponent";

/**
 * 
 * Some hints while developing
 *@useraction = create/read/update    //This will be the main action depends on three values where user want to create, edit , view the page
  @id = will be used in the field where the useraction is edit or view
 */

const App = ({ match }) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      {/* requireAuth will check for the me if its null then it will redirect to login */}

      <Route
        path={`${match.url}user-management`}
        component={requireAuth(
          asyncComponent(() => import("./UserManagement"))
        )}
      />

      <Route
        path={`${match.url}contestant-management`}
        component={requireAuth(
          asyncComponent(() => import("./CustomerManagement"))
        )}
      />

      <Route
        path={`${match.url}contest`}
        component={requireAuth(asyncComponent(() => import("./Contest")))}
      />

      <Route
        path={`${match.url}misc`}
        component={requireAuth(asyncComponent(() => import("./Miscellaneous")))}
      />

      <Route
        path={`${match.url}error-404`}
        component={asyncComponent(() => import("./404"))}
      />
    </Switch>
  </div>
);

export default App;
