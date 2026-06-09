import request from './request'
import { getCookie } from 'cookies-next'

export const updateCompanyAddress = async (payload) => {
  return await request.patch(`/v1/company-addresses`, payload, {
    headers: {
      Authorization: `Bearer ${getCookie('JWTToken')}`,
    },
  })
}

export const getCompanyAddress = async () => {
  return await request.get(`/v1/company-addresses`, {
    headers: {
      Authorization: `Bearer ${getCookie('JWTToken')}`,
    },
  })
}
