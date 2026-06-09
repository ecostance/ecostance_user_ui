import productReducer from './productReducer';
import cartReducer from './cartReducer';
import wishlistReducer from './wishlistReducer';
import compareReducer from './compareReducer';
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import orderReducer from './orderReducer';
import sustainabilityReducer from './sustainabilityReducer';
import businessSustainabilityReducer from './businessSustainabilityReducer';
import popupReducer from './popupReducer';
import circleSliderReducer from './carbonCalculatorReducer';

const rootReducer = combineReducers({
  productData: productReducer,
  cartData: cartReducer,
  wishlistData: wishlistReducer,
  compareData: compareReducer,
  userData: userReducer,
  orderData: orderReducer,
  sustainabilityData: sustainabilityReducer,
  businessSustainabilityData: businessSustainabilityReducer,
  popupData: popupReducer,
  circleSliderData: circleSliderReducer,
});

export default rootReducer;
