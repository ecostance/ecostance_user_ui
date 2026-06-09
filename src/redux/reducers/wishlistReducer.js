import { updateWishlist } from 'src/apiClient/wishlist'
import {
  ADD_TO_WISHLIST,
  DELETE_FROM_WISHLIST,
  DELETE_ALL_FROM_WISHLIST,
  ADD_API_TO_WISHLIST,
} from '../actions/wishlistActions'

const initState = []

const wishlistReducer = (state = initState, action) => {
  const wishlistItems = state,
    product = action.payload
  // console.log("here is the action type", action.type);

  if (action.type === ADD_API_TO_WISHLIST) {
    return product.products
  }

  if (action.type === ADD_TO_WISHLIST) {
    return product.products
  }

  if (action.type === DELETE_FROM_WISHLIST) {
    return product.products
  }

  if (action.type === DELETE_ALL_FROM_WISHLIST) {
    return []
  }
  return wishlistItems
}

export default wishlistReducer
