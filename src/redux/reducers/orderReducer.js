import { PLACE_ORDER } from "../actions/orderActions";

const initState = {
    isOrderPlaced: false,
    order: {}
};

const orderReducer = (state = initState, action) => {
    if (action.type === PLACE_ORDER) {
        const newOrder = {
            ...state,
            isOrderPlaced: action.payload?.isOrderPlaced,
            order: action.payload?.order
        }
        state = newOrder
    }
    return state;
};

export default orderReducer;
