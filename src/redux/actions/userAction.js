import { getUserInfo } from 'src/lib/userValidation'

export const VALIDATE_USER = 'VALIDATE_USER'
export const SET_USER_REGISTRATION_EMAIL = 'SET_USER_REGISTRATION_EMAIL'
export const UPDATE_SLUG = 'UPDATE_SLUG'
export const SET_USER_CURRENCY = 'SET_USER_CURRENCY'
export const SET_USER_CURRENCY_FORCE = 'SET_USER_CURRENCY_FORCE'
export const SET_IS_VERIFY_POPUP_SHOWN = 'SET_IS_VERIFY_POPUP_SHOWN'
export const ADD_UNVERIFIED_USER_EMAIL = 'ADD_UNVERIFIED_USER_EMAIL'
export const SET_IS_EMAIL_CHANGE_ATTEMPT_LEFT =
  'SET_IS_EMAIL_CHANGE_ATTEMPT_LEFT'
export const VALIDATE_USER_FAST = 'VALIDATE_USER_FAST'
export const SET_USER_CURRENCY_PREFERENCE = 'SET_USER_CURRENCY_PREFERENCE'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_EMAIL_VERIFIED = 'SET_EMAIL_VERIFIED'

// Different currency levels
export const CURRENCY_CHECKOUT_TOP = 3
export const CURRENCY_SELECTED_COUNTRY_MID = 2
export const CURRENCY_ADDRESS_COUNTRY_LOW = 1
export const CURRENCY_AUTO_NONE = 0

// user validation

export const setUserCurrencyPreference = (type, currency) => {
  return (dispatch) => {
    dispatch({
      type: SET_USER_CURRENCY_PREFERENCE,
      payload: { currencyType: type, currency },
    })
  }
}

export const validateUser = (userInfo = {}) => {
  return async (dispatch) => {
    if (!userInfo?.success) {
      const userInfo = await getUserInfo()
      dispatch({
        type: VALIDATE_USER,
        payload: {
          isUserLoggedIn: userInfo ? true : false,
          user: userInfo && userInfo?.data,
          billingAddress: userInfo && userInfo?.billingAddress,
          slug: userInfo && userInfo?.slug,
          // revertCurrency: userInfo?.data ? false : true,
        },
      })
    } else {
      dispatch({
        type: VALIDATE_USER,
        payload: {
          isUserLoggedIn: userInfo ? true : false,
          user: userInfo && userInfo?.data,
          billingAddress: userInfo && userInfo?.billingAddress,
          slug: userInfo && userInfo?.slug,
        },
      })
    }
  }
}

//Add email
export const setUserEmail = (email = '') => {
  return async (dispatch) => {
    dispatch({
      type: SET_USER_REGISTRATION_EMAIL,
      payload: { email },
    })
  }
}

export const setUserCurrency = (currency) => {
  // console.log("set user currency activated");
  if (!currency) return
  return (dispatch) => {
    dispatch({
      type: SET_USER_CURRENCY,
      payload: { currency },
    })
  }
}

export const setUserCurrencyForce = (currency) => {
  return (dispatch) => {
    dispatch({
      type: SET_USER_CURRENCY_FORCE,
      payload: { currency },
    })
  }
}

export const setIsVerifyPopupShown = (isShown) => {
  return (dispatch) => {
    dispatch({
      type: SET_IS_VERIFY_POPUP_SHOWN,
      payload: isShown,
    })
  }
}

export const setIsEmailChangeAttemptLeft = (isEmailChangeAttemptLeft) => {
  return (dispatch) => {
    dispatch({
      type: SET_IS_EMAIL_CHANGE_ATTEMPT_LEFT,
      payload: isEmailChangeAttemptLeft,
    })
  }
}

export const validateUserFast = (data) => {
  return async (dispatch) => {
    dispatch({
      type: VALIDATE_USER_FAST,
      payload: {
        isUserLoggedIn: data?.email ? true : false,
        user: { email: data?.email },
        billingAddress: data?.billingAddress ? data?.billingAddress : '',
        slug: { slug: data?.slug },
      },
    })
  }
}

export const removeCurrentUser = () => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_USER, payload: {} })
  }
}

export const markEmailAsVerified = () => (dispatch) => {
  dispatch({ type: SET_EMAIL_VERIFIED })
}
