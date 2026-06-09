import { getCookie } from 'cookies-next'
import request from './request'

export const carbonReduced = async () => {
  if (getCookie('JWTToken') || token) {
    const carbonRes = await request.get('v1/total-carbon-offset', {
      headers: {
        Authorization: `Bearer ${getCookie('JWTToken')}`,
      },
    })

    if (carbonRes.status !== 200) throw 'read user failed'
    else return carbonRes.data
  }
}

export const saveCalculatedFields = async (payload) => {
  if (getCookie('JWTToken') || token) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request.patch(
          'v1/save-carbon-calculations',
          payload,
          {
            headers: {
              Authorization: `Bearer ${getCookie('JWTToken')}`,
            },
          }
        )
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  }
}
