export const ADD_ITEMS_TO_SUSTAINABILITY_PAGE =
  'ADD_ITEMS_TO_SUSTAINABILITY_PAGE'

export const REMOVE_ALL_ITEMS_FROM_SUSTAINABILITY_PAGE =
  'REMOVE_ALL_ITEMS_FROM_SUSTAINABILITY_PAGE'

export const addItemsToSustainabilityPage = (items) => {
  return (dispatch) => {
    dispatch({ type: ADD_ITEMS_TO_SUSTAINABILITY_PAGE, payload: items })
  }
}

export const removeAllItemsFromSustainabilityPage = () => {
  return (dispatch) => {
    dispatch({ type: REMOVE_ALL_ITEMS_FROM_SUSTAINABILITY_PAGE, payload: {} })
  }
}
