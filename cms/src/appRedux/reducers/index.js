import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import LayoutSettings from "./LayoutSetting";
const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  layoutSettings: LayoutSettings
});

export default reducers;
