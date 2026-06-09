import {
  ADD_REGISTATION_SUCCESS,
  REMOVE_REGISTATION_SUCCESS,
} from '../actions/popupActions'

const initState = {
  registationSuccess: false,
}

const popupReducer = (state = initState, action) => {
  if (action.type === ADD_REGISTATION_SUCCESS) {
    state.registationSuccess = true
  }

  if (action.type === REMOVE_REGISTATION_SUCCESS) {
    state.registationSuccess = false
  }
  return state
}

export default popupReducer
