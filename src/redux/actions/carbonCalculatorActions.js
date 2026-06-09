export const ADD_CIRCLE_INDEX = 'ADD_CIRCLE_INDEX'
export const RESET_CIRCLE_INDEX = 'RESET_CIRCLE_INDEX'
export const SAVE_CARBON_CALCULATION = 'SAVE_CARBON_CALCULATION'
export const SAVE_CARBON_API_UPDATED = 'SAVE_CARBON_API_UPDATED'

export const addCircleDataIndex = (dataIndex) => {
  return (dispatch) => {
    return dispatch({ type: ADD_CIRCLE_INDEX, payload: { dataIndex } })
  }
}

export const resetCircleDataIndex = () => {
  return (dispatch) => {
    return dispatch({ type: RESET_CIRCLE_INDEX, payload: { dataIndex: 0 } })
  }
}

export const saveCarbonCalculations = (
  data,
  FieldsSaveFunc,
  ApiUpdatedFunc
) => {
  return (dispatch) => {
    return dispatch({
      type: SAVE_CARBON_CALCULATION,
      payload: {
        data: { ...data },
        apiUpdated: false,
        updateDataFunc: FieldsSaveFunc,
        apiUpdatedFunc: ApiUpdatedFunc,
        localDataUpdated: true,
      },
    })
  }
}

export const saveCarbonAPIUpdated = (value) => {
  console.log('saveCarbonAPIHIT', value)
  return (dispatch) => {
    return dispatch({
      type: SAVE_CARBON_API_UPDATED,
      payload: { apiUpdated: value },
    })
  }
}
