import request from "./request";
import { getCookie } from "cookies-next";


export const addBusiness = async (businessData, businessId) => {
    if (localStorage.getItem("businessCode")) {
        if (getCookie("JWTToken")) {
            return await request.put(`/v1/business-profiles/${businessId}`, businessData, {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            });
        }
    } else {
        if (getCookie("JWTToken")) {
            return await request.post(`/v1/business-profiles`, businessData, {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            });
        }
    }
};

export const getBusinessProfile = async (token) => {
    let userId = localStorage.getItem("userId")
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/business-profiles/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        });
    } else {
        return await request.get(`v1/business-profiles/user/${userId}`, {
            headers: {
                Authorization: token,
            },
        })
    }
}


export const getAllUsersForMyBusiness = async (page, size) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessId = BusinessDetails?._id
    if (getCookie("JWTToken")) {
        return await request.get(`v1/business-user-profiles/business/${businessId}?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const getAllBusiness = async (token) => {
    return await request.get(`/v1/business-profiles?page=1&size=100`)
}


export const getAllUsersCountForMyBusiness = async (page, size) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessId = BusinessDetails?._id
    if (getCookie("JWTToken")) {
        return await request.get(`v1/business-user-profiles/business/stats/${businessId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const removeBusinessUser = async (userId, body) => {
    if (getCookie("JWTToken")) {
        return await request.put(`/v1/business-profiles/remove/user/${userId}`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const changeRole = async (body) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessId = BusinessDetails?._id
    if (getCookie("JWTToken")) {
        return await request.put(`/v1/business-profiles/update/user/${businessId}`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const getAllCarbonFootPrint = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`/v1/business-profiles/get/carbon-calculations?businessCode=${businessCode}`)
}

export const getAllSupportedProducts = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`/v1/business-profiles/me/${businessCode}`)
}

export const getBusinessOrdersData = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`/v1/business-profiles/me/${businessCode}`)
}



export const getAllBusinessOrders = async (page, token) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken") || token) {
        return await request.get(`/v1/business-customer-orders?page=${page}&size=10&businessCode=${businessCode}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken") || token}`,
            },
        });
    }
};


export const getBusinessDetailsByCode = async (businessCode) => {
    return await request.get(`/v1/business-profiles/profile?businessCode=${businessCode}`)
}


export const getAirportsList = async () => {
    return await request.get(`/airports`)
}

export const createBusinessEvent = async () => {

    return await request.post(`/v1/business-events`, body, {
        headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
    })
}

export const getBusinessEvent = async (page, size) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`v1/business-events/${businessCode}?page=${page}&size=${size}`)
}


export const getSingleBusinessEvent = async (code) => {
    return await request.get(`v1/business-events?conferanceCode=${code}`)
}


export const getBusinessStatsEvent = async (page, size) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`/v1/business-events/stats/${businessCode}?page=${page}&size=${size}`)
}

export const getParticularBusinessEvent = async (data) => {
    let conferenceCode = data ? data : localStorage.getItem("conferenceCode")
    return await request.get(`v1/business-events/event/${conferenceCode}`)
}




export const saveWorkCalculatedFields = async (payload) => {
    if (getCookie('JWTToken')) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request.patch(
                    '/v1/business-user-profiles/save-carbon-calculations',
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

export const saveEventCalculatedFields = async (payload) => {
    if (getCookie('JWTToken')) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request.post(
                    '/v1/business-event-user-carbon-foot-prints',
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


export const addBusinessEvent = async (data) => {
    if (getCookie("JWTToken")) {
        return await request.post(
            `/v1/business-events`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                    "content-type": "multipart/form-data",
                },
            }
        );
    }
};

export const EditBusinessEvent = async (data, eventid) => {
    if (getCookie('JWTToken')) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request.put(
                    `/v1/business-events/${eventid}`,
                    data,
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


export const getAllBusinessCarbonCalculations = async (page, token) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken") || token) {
        return await request.get(`v1/orders/graph?businessCode=${businessCode}&isBusiness=true`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken") || token}`,
            },
        });
    }
};



export const getAnnualBusinessGraph = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`/v1/orders/annual/graph?businessCode=${businessCode}&isBusiness=true`, {
        headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
    });
};


export const getUserBusinessCalculations = async (businessCode) => {
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/business-user-carbon-foot-prints/user/${businessCode}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}



export const getEventDataForUser = async (conferenceCode, businessCode) => {
    let email = localStorage.getItem("email")
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/business-event-user-carbon-foot-prints/specific?email=${email}&conferanceCode=${conferenceCode}&businessCode=${businessCode}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const addBusinessProduct = async (formdata) => {
    if (getCookie("JWTToken")) {
        return await request.post(
            `/v1/business-product-page-settings`,
            formdata,
            {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                    "content-type": "multipart/form-data",
                },
            }
        );
    }
};


export const getBusinessProduct = async () => {
    if (getCookie("JWTToken")) {
        return await request.get(`v1/business-products`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const getSingleBusinessProduct = async (productId) => {
    if (getCookie("JWTToken")) {
        return await request.get(`v1/business-product-page-settings/${productId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const editBusinessProductPage = async (data, productId) => {
    if (getCookie('JWTToken')) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request.put(
                    `/v1/business-product-page-settings/${productId}`,
                    data,
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

export const slugChange = async (body, businessId) => {
    if (getCookie('JWTToken')) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request.put(
                    `/v1/business-profiles/business-slug/${businessId}`,
                    body,
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

export const keepUpdatedBusiness = async (businessData, businessId) => {
    if (localStorage.getItem("businessCode")) {
        if (getCookie("JWTToken")) {
            return await request.put(`/v1/business-profiles/${businessId}`, businessData, {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            });
        }
    }
}


export const businessProductSlugCheck = async (slug) => {
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/business-product-page-settings/slug/${slug}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const businessProductNameCheck = async (name) => {
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/business-products/name/${name}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const businessProductCodeCheck = async (code) => {
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/business-products/code/${code}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const deleteBusinessProductPage = async (productId) => {
    if (getCookie("JWTToken")) {
        return await request.delete(`v1/business-product-page-settings/${productId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const uploadImage = async (data) => {
    if (getCookie('JWTToken')) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request.post(
                    `/v1/user-galleries`,
                    data,
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


export const reverseBusinessCart = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken")) {
        return await request.put(`/v1/carts/transfer/reverse`, { businessCode: businessCode }, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        });
    }
}


export const addSupplierApi = async (body) => {
    if (getCookie("JWTToken")) {
        return await request.post(`/v1/user-chains`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const getPartnerDetails = async (partner, acceptanceCode, requestedCode) => {
    let apiRequest
    if (acceptanceCode) {
        apiRequest = `/v1/user-chains?relationship=${partner}&acceptanceStatus=${acceptanceCode}`
    } else if (requestedCode) {
        apiRequest = `/v1/user-chains?relationship=${partner}&requested=true`
    } else {
        apiRequest = `/v1/user-chains?relationship=${partner}`
    }
    if (getCookie("JWTToken")) {
        return await request.get(apiRequest, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const getSinglePartnerDetails = async (id) => {
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/user-chains/${id}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const getSupplyChain = async (id) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let BuyerProfileId = BusinessDetails?.userId
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/user-chains/tree/${BuyerProfileId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const joinSupplyChain = async (body) => {
    if (getCookie("JWTToken")) {
        return await request.post(`/v1/user-chains/join`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const getAllRegisteredBusiness = async () => {
    if (getCookie("JWTToken")) {
        return await request.get(`v1/business-profiles?page=1&size=100`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const inviteBusinessApi = async (body) => {
    if (getCookie("JWTToken")) {
        return await request.post(`v1/user-chains/join/request`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const inviteUserApi = async (body) => {
    if (getCookie("JWTToken")) {
        return await request.post(`/v1/user-chains`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}

export const confirmPartner = async (theid,body) => {
    if (getCookie("JWTToken")) {
        return await request.put(`v1/user-chains/confirm/${theid}`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const deleteSupplyChain = async (id) => {
    if (getCookie("JWTToken")) {
        return await request.delete(`v1/user-chains/${id}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}