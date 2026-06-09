import { getCookie } from "cookies-next";
import request from "./request";



export const checkBusinessSlug = async (slug) => {
    return await request.get(`${process.env.API_BASE}/v1/business/users/${slug}`);
};

export const getPublicBusinessPageBySlug = async (slug) => {
    return await request.get(
        `${process.env.API_BASE}/v1/business/sustainability-page-settings/${slug}/public`
    );
};

export const businessSlugData = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
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
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
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

export const updateUserBusinessSettingInfo = async (data) => {
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

export const publishBusinessPage = async (data = {}) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
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

export const getUserBusinessSettings = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
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

export const getPublicBusinessUserCertPageViaSlug = async (slug) => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    return await request.get(
        `${process.env.API_BASE}/v1/sustainability-page-settings/${slug}/public?businessCode=${businessCode}`
    );
};

export const getCurrentBusinessSustainabilityPage = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
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

export const getPublicDppPage = async (businessSlugName, slug) => {
    return await request.get(
        `${process.env.API_BASE}/v1/business-product-page-settings/${businessSlugName}/${slug}/public`
    );
};

export const getPreviousBusinessSustainabilityPage = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
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
