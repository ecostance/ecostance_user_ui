import { getCookie } from "cookies-next";
import request from "./request";



export const checkEmployerSlug = async (slug) => {
    return await request.get(`${process.env.API_BASE}/v1/business/users/${slug}`);
};

export const employerSlugData = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    console.log("joinedData" , BusinessDetails)
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken")) {
        return await request.get(
            `${process.env.API_BASE}/v1/business/user-certificate-slugs/${businessCode}`,
            {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            }
        );
    }
}

export const updateSlug = async (slug, newSlug) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken")) {
        return await request.patch(
            `${process.env.API_BASE}/v1/user-certificate-slugs/${slug}`,
            { newSlug },
            {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            }
        );
    }
};

export const updateUserEmployerSettingInfo = async (data) => {
    if (getCookie("JWTToken")) {
        // const config = {
        //   headers: {
        //     "content-type": "multipart/form-data",
        //   },
        // };
        return await request.patch(
            `${process.env.API_BASE}/v1/business/sustainability-page-settings`,
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

export const publishEmployerPage = async (data = {}) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken")) {
        return await request.patch(
            `${process.env.API_BASE}/v1/business/sustainability-page-settings/publish`,
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

export const getUserEmployerSettings = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken")) {
        return await request.get(
            `${process.env.API_BASE}/v1/sustainability-page-settings?businessCode=${businessCode}`,
            {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            }
        );
    }
};

export const getPublicEmployerUserCertPageViaSlug = async (slug) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(
        `${process.env.API_BASE}/v1/sustainability-page-settings/${slug}/public?businessCode=${businessCode}`
    );
};

export const getCurrentEmployerSustainabilityPage = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken")) {
        return await request.get(
            `${process.env.API_BASE}/v1/business/sustainability-page-settings?businessCode=${businessCode}`,
            {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            }
        );
    }
};

export const getPreviousEmployerSustainabilityPage = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    if (getCookie("JWTToken")) {
        return await request.get(
            `${process.env.API_BASE}/v1/business/sustainability-page-settings/previous?businessCode=${businessCode}`,
            {
                headers: {
                    Authorization: `Bearer ${getCookie("JWTToken")}`,
                },
            }
        );
    }
};
