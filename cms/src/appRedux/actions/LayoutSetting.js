import { UPDATE_LAYOUT, UPDATE_LAYOUT_SUCCESS } from "constants/ActionTypes";

export const layoutUpdate = layoutSettings => {
  return {
    type: UPDATE_LAYOUT,
    payload: layoutSettings
  };
};

export const layoutUpdateSuccess = layoutSettings => {
  return {
    type: UPDATE_LAYOUT_SUCCESS,
    payload: layoutSettings
  };
};
