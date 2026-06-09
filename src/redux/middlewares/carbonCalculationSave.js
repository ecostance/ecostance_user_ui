import { SAVE_CARBON_CALCULATION } from "../actions/carbonCalculatorActions";

let saveTimer;
let debounceTime = 10000;

const saveDebounce = (data, func, apiUpdatedFunc, store) => {
  if (!store?.getState()?.userData?.isLoggedIn) return;
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  // saveTimer = setTimeout(() => {
  //   func(data).then((success) => {
  //     apiUpdatedFunc();
  //   });
  // }, debounceTime);
};

export const carbonOffsetMiddleware = (store) => (next) => (action) => {
  if (action?.type === SAVE_CARBON_CALCULATION) {
    saveDebounce(
      action.payload?.data,
      action.payload?.updateDataFunc,
      action.payload?.apiUpdatedFunc,
      store
    );
  }

  return next(action);
};
