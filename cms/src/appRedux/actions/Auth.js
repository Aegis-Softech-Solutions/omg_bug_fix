import {
  HIDE_MESSAGE,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_USER,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER,
  SIGNOUT_USER_SUCCESS
} from "constants/ActionTypes";

export const userSignIn = user => {
  return {
    type: SIGNIN_USER,
    payload: user
  };
};
export const userSignInSuccess = (authUser, userPermissions) => {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: authUser,
    userPermissions
  };
};

export const userSignOut = () => {
  return {
    type: SIGNOUT_USER
  };
};

export const userSignOutSuccess = () => {
  return {
    type: SIGNOUT_USER_SUCCESS
  };
};

export const showAuthMessage = message => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE
  };
};
export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER
  };
};
