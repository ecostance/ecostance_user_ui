import { getCookie } from "cookies-next";
import request from "./request";

export const getSubscriptions = async (sessionId) => {
  return await request.get(
    `${process.env.API_BASE}v1/subscriptions/search?sessionId=${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    }
  );
};

export const cancelSubscription = async (subId) => {
  return await request.get(`${process.env.API_BASE}v1/subscription/${subId}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });
};
