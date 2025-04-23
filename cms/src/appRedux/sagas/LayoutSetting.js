import { all, fork, put, takeEvery } from "redux-saga/effects";

import { UPDATE_LAYOUT } from "constants/ActionTypes";
import { layoutUpdateSuccess } from "../../appRedux/actions/LayoutSetting";

function* layoutUpdateWithData({ payload }) {
  localStorage.setItem("layoutSettings", JSON.stringify(payload));
  yield put(layoutUpdateSuccess(payload)); //pass this to other function
}

export function* updateLayout() {
  yield takeEvery(UPDATE_LAYOUT, layoutUpdateWithData);
}

export default function* rootSaga() {
  yield all([fork(updateLayout)]);
}
