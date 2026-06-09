import axios from "axios";

export const getProduct = async (slug) => {
  return await axios.get(`${process.env.API_BASE}/v1/products?search=${slug}`);
};
