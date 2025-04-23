import { all, fork, put, takeEvery } from "redux-saga/effects";

import { SIGNIN_USER, SIGNOUT_USER } from "constants/ActionTypes";
import {
  showAuthMessage,
  userSignInSuccess,
  userSignOutSuccess
} from "../../appRedux/actions/Auth";

function* signInUserWithEmailPassword({ payload }) {
  // console.log("layoutSettings", layoutSettings);

  //pass token
  const { token, userDetails } = payload;

  if (token !== null && token !== undefined) {
    localStorage.setItem("user_id", userDetails.id); //set the user id into local storage
    localStorage.setItem("token", token); //set the token into local storage
    //now put permissions in localStorage
    localStorage.setItem(
      "permissions",
      window.btoa(userDetails.permissions) //encode permissions
    );
    yield put(
      userSignInSuccess(
        userDetails.id,
        window.btoa(userDetails.permissions) //encode permissions,
      )
    ); //pass this to other function
  } else {
    /*
      * to show errors graphql gives error on graphQLErros array inside message method

    */
    yield put(
      showAuthMessage(
        payload.graphQLErrors[0]
          ? payload.graphQLErrors[0].message
          : "Something went wrong! Please try again"
      )
    ); //show error
  }
}

function* signOut() {
  try {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token"); //remove the token
    localStorage.removeItem("permissions");
    localStorage.removeItem("layoutSettings");
    yield put(userSignOutSuccess(signOutUser));
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([fork(signInUser), fork(signOutUser)]);
}
