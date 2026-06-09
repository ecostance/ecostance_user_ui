import request from "./request";
import { getCookie } from "cookies-next";

export const getBusinessDetails = async (data) => {
    console.log(data)
    return await request.get(`v1/business-profiles/profile?businessCode=${data}`);
}


export const JoinBusiness = async (data) => {
    if (getCookie("JWTToken")) {
        return await request.post(`v1/business-user-profiles/join`, data, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        });
    }
}

export const getJoinedBusiness = async (token) => {
    let userId = localStorage.getItem("userId")
    console.log(userId, "userId")
    if (getCookie("JWTToken")) {
        return await request.get(`v1/business-user-profiles/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    } else {
        return await request.get(`v1/business-user-profiles/user/${userId}`, {
            headers: {
                Authorization: token,
            },
        })
    }
}

export const getAllUsersForJoinedBusiness = async (page,size) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessId = BusinessDetails?.businessId?._id
    if (getCookie("JWTToken")) {
        return await request.get(`v1/business-user-profiles/business/${businessId}?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const getCarbonCalculations = async (businessCode) => {
    let theId
    if (businessCode) {
        theId = businessCode
    } else {
        let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
        theId = BusinessDetails?._id
    }
    if (getCookie("JWTToken")) {
        return await request.get(`/v1/business-user-profiles/${theId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const changeEmployeRole = async (body) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessId = BusinessDetails?.[BusinessDetails.length - 1]?.businessId?._id
    if (getCookie("JWTToken")) {
        return await request.put(`/v1/business-profiles/update/user/${businessId}`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const leaveBusiness = async (body) => {
    if (getCookie("JWTToken")) {
        return await request.put(`/v1/business-user-profiles/exit/business`, body, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken")}`,
            },
        })
    }
}


export const getAllEmployerCarbonFootPrint = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`/v1/business-profiles/get/carbon-calculations?businessCode=${businessCode}`)
}

export const getAllJoinedBusinessCarbonCalculations = async (page, token) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken") || token) {
        return await request.get(`v1/orders/graph?businessCode=${businessCode}&isBusiness=true`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWTToken") || token}`,
            },
        });
    }
};

export const getAnnualJoinedBusinessGraph = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(`/v1/orders/annual/graph?businessCode=${businessCode}&isBusiness=true`, {
        headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
    });
};
