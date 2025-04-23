import { UPDATE_LAYOUT_SUCCESS } from "constants/ActionTypes";

const INIT_STATE = {
  layoutSettings: localStorage.getItem("layoutSettings") //get the layoutSettings from local storage and descrypt it
    ? JSON.parse(localStorage.getItem("layoutSettings"))
    : {}
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_LAYOUT_SUCCESS: {
      return {
        ...state,
        layoutSettings: action.payload
      };
    }
    default:
      return state;
  }
};
