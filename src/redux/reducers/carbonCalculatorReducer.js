import {
  ADD_CIRCLE_INDEX,
  RESET_CIRCLE_INDEX,
  SAVE_CARBON_API_UPDATED,
  SAVE_CARBON_CALCULATION,
} from '../actions/carbonCalculatorActions';

export const initState = {
  dataIndex: 0,
  houseHoldMembers: 0,
  publicTransportationMembers: 0,
  income: 'medium',
  houseSize: 'medium',
  airTravel: 'medium',
  meatConsumption: 'medium',
  totalCarbonEmissions: '0',
  apiUpdated: false,
  localDataUpdated: false,
};

const circleSliderReducer = (state = initState, action) => {
  if (action.type == ADD_CIRCLE_INDEX) {
    return { ...state, ...action.payload };
  }
  if (action.type == RESET_CIRCLE_INDEX) {
    return { ...state, ...action.payload };
  }

  if (action.type == SAVE_CARBON_API_UPDATED) {
    return { ...state, ...action.payload };
  }

  if (action.type == SAVE_CARBON_CALCULATION) {
    return {
      ...state,
      ...action.payload.data,
      apiUpdated: action.payload.apiUpdated,
      localDataUpdated: action.payload.localDataUpdated,
    };
  }

  return state;
};

export default circleSliderReducer;
