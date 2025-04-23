import { all } from "redux-saga/effects";
import authSagas from "./Auth";
import LayoutSettingSagas from "./LayoutSetting";

export default function* rootSaga(getState) {
  yield all([authSagas(), LayoutSettingSagas()]);
}
