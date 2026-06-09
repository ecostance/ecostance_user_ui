export const PLACE_ORDER = "PLACE_ORDER";

export const addOrder = (isOrderPlaced, item = {}) => {
    return dispatch => {
        dispatch({ type: PLACE_ORDER, payload: { isOrderPlaced, order: item } });
    };
};
