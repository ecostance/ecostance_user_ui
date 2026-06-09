export const ADD_REGISTATION_SUCCESS = "ADD_REGISTATION_SUCCESS";
export const REMOVE_REGISTATION_SUCCESS = "REMOVE_REGISTATION_SUCCESS";

export const addRegistationSuccess = () => {
  return (dispatch) => {
    dispatch({ type: ADD_REGISTATION_SUCCESS });
  };
};

export const removeRegistationSuccess = () => {
  return (dispatch) => {
    dispatch({ type: REMOVE_REGISTATION_SUCCESS });
  };
};
