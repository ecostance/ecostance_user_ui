import axios from 'axios'
import { getCookie } from 'cookies-next'
import request from './request'

export const checkCoupon = async (coupon) => {
  if (getCookie('JWTToken')) {
    return await request.get(`/v1/coupons/${coupon}`, {
      headers: {
        Authorization: `Bearer ${getCookie('JWTToken')}`,
      },
    })
  }
}

export const applyCouponToAPI = async (coupon, getStripeCoupon = false) => {
  if (getCookie('JWTToken') && coupon) {
    return await request.post(
      `/v1/coupons/${coupon}/apply`,
      { type: 'regular', getStripeCoupon },
      {
        headers: {
          Authorization: `Bearer ${getCookie('JWTToken')}`,
        },
      }
    )
  }
}

export const unApplyCouponToAPI = async () => {
  if (getCookie('JWTToken')) {
    return await request.patch(
      'v1/coupons/unapply',
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie('JWTToken')}`,
        },
      }
    )
  }
}
