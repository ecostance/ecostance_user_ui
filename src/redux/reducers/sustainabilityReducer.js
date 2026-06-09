import {
  ADD_ITEMS_TO_SUSTAINABILITY_PAGE,
  REMOVE_ALL_ITEMS_FROM_SUSTAINABILITY_PAGE,
} from '../actions/sustainabilityActions'

const initState = {
  image: '',
  imageURL: '',
  title: '',
  description: '',
  aboutUs: '',
  country: '',
  name: '',
  phone: '',
  email: '',
  twitter: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  country: '',
  showName: false,
  showPhone: false,
  showEmail: false,
  showTwitter: false,
  showLinkedin: false,
  showInstagram: false,
  showFacebook: false,
  themeSelected: 'blue',
}

const sustainabilityReducer = (state = initState, action) => {
  if (action.type === ADD_ITEMS_TO_SUSTAINABILITY_PAGE) {
    return {
      ...state,
      ...action.payload,
    }
  }

  if (action.type === REMOVE_ALL_ITEMS_FROM_SUSTAINABILITY_PAGE) {
    return initState
  }

  return state
}

export default sustainabilityReducer
