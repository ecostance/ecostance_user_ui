const initState = { coupon: false };

const couponReducer = (state = initState, action) => {
  const items = action.payload;

  return state;
};

export default couponReducer;
