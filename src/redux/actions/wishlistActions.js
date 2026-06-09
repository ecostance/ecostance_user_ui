import { updateWishlist } from 'src/apiClient/wishlist'

export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST'
export const DELETE_FROM_WISHLIST = 'DELETE_FROM_WISHLIST'
export const DELETE_ALL_FROM_WISHLIST = 'DELETE_ALL_FROM_WISHLIST'
export const ADD_API_TO_WISHLIST = 'ADD_API_TO_WISHLIST'

const UpdateApiData = async (items) => {
  const apiWishlist = []

  items.forEach((each) => {
    const currentItem = {}
    currentItem['product'] = each._id
    currentItem['quantity'] = each?.quantity || 1
    currentItem['cartItemId'] = each?.cartItemId
    apiWishlist.push(currentItem)
  })

  await updateWishlist(apiWishlist)
}

export const addAPIDataToWishlist = (apiItems, cartItems = []) => {
  // console.log("HERE ARE THE ACTIONS ITEMS Wishlist", apiItems, cartItems);
  return async (dispatch) => {
    const product = { items: apiItems, cartItems }
    let products = []

    product?.items?.map((each) => {
      if (each.product) {
        each.product['quantity'] = each.quantity

        products.push(each.product)
      }
    })

    if (product.cartItems.length > 0) {
      const allItems = [...products, ...product.cartItems]

      const finalProducts = {}

      allItems.map((each) => {
        if (each._id in finalProducts) {
          finalProducts[each._id]['quantity'] += each['quantity']
        } else {
          finalProducts[each._id] = each
        }
      })

      dispatch({
        type: ADD_API_TO_WISHLIST,
        payload: { products: Object.values(finalProducts) },
      })
    }
    // await UpdateApiData(products);
    dispatch({
      type: ADD_API_TO_WISHLIST,
      payload: { products },
    })
  }
}

export const addToWishlist = (item, addToast, wishlistItems = []) => {
  return async (dispatch) => {
    if (addToast) {
      addToast('Added To Wishlist', {
        appearance: 'success',
        autoDismiss: true,
      })
    }

    let product = item

    const wishlistItem = wishlistItems?.filter(
      (item) => item.id === product.id
    )[0]
    if (wishlistItem === undefined) {
      dispatch({
        type: ADD_TO_WISHLIST,
        payload: { products: [...wishlistItems, product] },
      })
      // await UpdateApiData([...wishlistItems, product]);
    } else {
      dispatch({
        type: ADD_TO_WISHLIST,
        payload: { products: wishlistItems },
      })
      // await UpdateApiData(wishlistItems);
    }
  }
}

// delete from wishlist
export const deleteFromWishlist = (item, addToast, wishlistItems) => {
  return async (dispatch) => {
    if (addToast) {
      addToast('Removed From Wishlist', {
        appearance: 'error',
        autoDismiss: true,
      })
    }
    let product = item
    const remainingItems = (wishlistItems, product) =>
      wishlistItems.filter((wishlistItem) => wishlistItem.id !== product.id)
    const itemsRemain = remainingItems(wishlistItems, product)
    dispatch({
      type: DELETE_FROM_WISHLIST,
      payload: { products: itemsRemain },
    })
    // await UpdateApiData(itemsRemain);
  }
}

//delete all from wishlist
export const deleteAllFromWishlist = (addToast) => {
  return (dispatch) => {
    if (addToast) {
      addToast('Removed All From Wishlist', {
        appearance: 'error',
        autoDismiss: true,
      })
    }
    dispatch({ type: DELETE_ALL_FROM_WISHLIST })
  }
}
