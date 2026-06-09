import request from "./request";

export const verifyAuthenticity = async (documentId) => {
  const response = await request.post(
    `v1/user-certificates/verify?documentId=${documentId}`,
    {}
  );
  return response.data;
};

export const getCertificate = async (documentId) => {
  const response = await request.get(
    `${process.env.API_BASE}v1/user-certificates/${documentId}/details`
  );
  return response;
};
