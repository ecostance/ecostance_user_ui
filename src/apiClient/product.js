import request from "./request";
import { setCookies, getCookie } from "cookies-next";

export const getProducts = async (paginateFields) => {
  let productResult = await request.get("v1/products?showDetails=1");
  // if (paginateFields) {
  //   productResult = await request.get(
  //     `v1/products?${paginateFields}&showDetails=1`
  //   );
  // } else {
  //   productResult = await request.get("v1/products?showDetails=1");
  // }

  // console.log('HERE ARE THE PRODUCT RESULT', productResult);

  // const tempProducts = { products: [] };
  // for (let i = 0; i < productResult?.data?.products.length; i++) {
  // 	const newProduct = productResult?.data?.products[i];
  // 	newProduct['slug'] = `${i}`;
  // 	console.log(newProduct);
  // 	tempProducts.products.push(newProduct);
  // }
  // console.log(tempProducts);
  // return tempProducts;
  if (productResult.status !== 200) throw "Failed to fetch products";
  else {
    productResult.data.data = productResult.data.data.sort((a, b) => a.id - b.id);
    if (paginateFields) {
      productResult.data.data = productResult.data.data.slice(0, 8)
    }
    return productResult.data;
  }
};

export const getdeeplink = async () => {
  let deeplinkdata = await request.get("/auth/referral/deeplink")
  return deeplinkdata

}
export const getProductBySlug = async (slug) => {
  const productResult = await request.get(
    // `v1/productBySlug/${slug}?populate=sdgs.sdg,standards&slug=${slug}`,
    `v1/productBySlug/${slug}`,
    {
      // headers: {
      //   Authorization: getCookie("JWTToken"),
      // },
    }
  );
  // const productResult = await request.get(`v1/productBySlug/${slug}`, {
  // 	// headers: {
  // 	//   Authorization: getCookie("JWTToken"),
  // 	// },
  // });

  if (productResult.status !== 200) throw "Failed to fetch products";
  else return productResult.data;
};

export const getFilters = async () => {
  try {
    return await request.get("v1/filters");
  } catch (err) {
    console.log("error while fetching filters", err);
  }
};

export const getOrderProductReview = (orderId, productId, businessReview) => {
  console.log("getReview", businessReview)
  if (businessReview) {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let BusinessId = BusinessDetails?.buyerprofiles?._id
    return new Promise(async (resolve, reject) => {
      try {
        const res = await request.get(`v1/business/review/${orderId}/${productId}?BusinessId=${BusinessId}`, {
          headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
          },
        });
        resolve(res);
      } catch (error) {
        reject(error.message);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await request.get(`v1/review/${orderId}/${productId}`, {
          headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
          },
        });
        resolve(res);
      } catch (error) {
        reject(error.message);
      }
    });
  }
};

export const updateOrderProductReview = (reviewId, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch(`v1/review/${reviewId}`, { comment: payload.comment, rating: payload.rating }, {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      });
      resolve(res);
    } catch (error) {
      reject(error.message);
    }
  });
};

export const getProductReview = async (productId) => {
  return await request.get(`v1/review/${productId}/product`);
};

export const createReview = async ({ productId, orderId, rating, comment, businessReview }) => {
  console.log(businessReview, "businessReview")
  if (businessReview) {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let BusinessId = BusinessDetails?.buyerprofiles?._id
    return await request.post(
      `v1/business/review`,
      { product: productId, order: orderId, rating, comment, BusinessId },
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  } else {
    return await request.post(
      `v1/review`,
      { product: productId, order: orderId, rating, comment },
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  }
};

export const getFeaturedProduct = async () => {
  return await request.get("v1/products/featured");
};

export const getOfferedProduct = async () => {
  return await request.get("v1/products/offered");
};

export const getAllProducts = async () => {
  return await request.get("v1/products");
};
