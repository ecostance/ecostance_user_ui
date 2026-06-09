import request from "./request";

export const subscribe = async (emailId) => {
  return await request.post(`${process.env.API_BASE}/v1/mailing-lists`, {
    email: emailId,
  });
};

export const verifyEmailForNewsLetter = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.get(
        `${process.env.API_BASE}/v1/mailing-lists/verify?tk=${token}`
      );
      resolve(res);
    } catch (error) {
      reject(error.message);
    }
  });
};
