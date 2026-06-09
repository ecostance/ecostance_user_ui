import request from './request'
import { getCookie } from 'cookies-next'

export const getWishlist = async () => {
  return await request.get('/v1/wishlists', {
    headers: {
      Authorization: `Bearer ${getCookie('JWTToken')}`,
    },
  })
}

export const updateWishlist = async (items) => {
  // console.log(" -> 13, HERE ARE THE Update Wishlist items", items);
  try {
    if (getCookie('JWTToken')) {
      const res = await request.patch(
        '/v1/wishlists',
        { products: items },
        {
          headers: {
            Authorization: `Bearer ${getCookie('JWTToken')}`,
          },
        }
      )
    }
  } catch (err) {
    console.log('HERE IS THE API ERROR', err)
  }
}
