import {
  deleteAllFromCartAPI,
  deleteItemFromCart,
  updateCart,
} from "src/apiClient/cart";
import { applyCouponToAPI } from "src/apiClient/coupon";
import { updateApiCartData } from "../store";

export const ADD_TO_CART = "ADD_TO_CART";
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const DELETE_ALL_FROM_CART = "DELETE_ALL_FROM_CART";
export const DELETE_ALL_FROM_CART_LOCAL = "DELETE_ALL_FROM_CART_LOCAL";
export const ADD_API_TO_CART = "ADD_API_TO_CART";
export const UPDATE_CART_FOR_CURRENCY = "UPDATE_CART_FOR_CURRENCY";
export const APPLY_COUPON_TO_CART = "APPLY_COUPON_TO_CART";
export const ADD_COUPON = "ADD_COUPON";
export const DELETE_COUPON = "DELETE_COUPON";
export const ADD_COUPON_FROM_CART = "ADD_COUPON_FROM_CART";
export const UPDATE_CART_FOR_STRIPE = "UPDATE_CART_FOR_STRIPE";
export const ADD_HIDDEN_PRODUCTS = "ADD_HIDDEN_PRODUCTS";
export const REMOVE_HIDDEN_PRODUCTS = "REMOVE_HIDDEN_PRODUCTS";
export const ADD_EXPRESS_PRICE_DATA = "ADD_EXPRESS_PRICE_DATA";
export const REMOVE_COUPON = "REMOVE_COUPON";
export const UPDATE_LOCAL_CART_COUNT = "UPDATE_LOCAL_CART_COUNT";
export const SET_CART_CURRENCY = "SET_CART_CURRENCY";
export const ADD_BULK_ITEMS_TO_CART = "ADD_BULK_ITEMS_TO_CART";

export const ADD_EXPRESS_ITEM_ADDED_TO_CART = "ADD_EXPRESS_ITEM_ADDED_TO_CART";
export const REMOVE_EXPRESS_ITEM_ADDED_TO_CART_LOCAL =
  "REMOVE_EXPRESS_ITEM_ADDED_TO_CART_LOCAL";

export const REMOVE_EXPRESS_ITEM_ADDED_TO_CART =
  "REMOVE_EXPRESS_ITEM_ADDED_TO_CART";

const calculateCartItemsCount = (cartItems) => {
  const total = 0;
  cartItems?.map((each) => (total += each?.quantity));
  return total;
};

const returnAPIResponseObject = (data) => {
  if (data?.products) {
    return {
      products: data?.products,
      orderTotal: data?.orderTotal,
      subTotal: data?.subTotal,
      moduleOrderTotal: data?.moduleOrderTotal,
      moduleSubTotal: data?.moduleSubTotal,
      moduleDiscount: data?.moduleDiscount,
      discount: data?.discount,
      discountUnit: data?.discountUnit,
      orderTotalWithinStripeRange: data?.orderTotalWithinStripeRange,
      couponData: {
        coupon: data?.coupon,
        stripePaymentCouponId: data?.stripePaymentCouponId,
        stripeSubscriptionCouponId: data?.stripeSubscriptionCouponId,
        type: data?.couponType,
      },
    };
  } else if (data?.moduleProducts) {
    // Handle module products structure
    return {
      moduleProducts: data?.moduleProducts,
      isModuleProduct: data?.isModuleProduct || true,
      orderTotal: data?.orderTotal,
      subTotal: data?.subTotal,
      moduleOrderTotal: data?.moduleOrderTotal,
      moduleSubTotal: data?.moduleSubTotal,
      moduleDiscount: data?.moduleDiscount,
      discount: data?.discount,
      discountType: data?.discountType,
      discountUnit: data?.discountUnit,
      oneTimeFee: data?.oneTimeFee,
      paymentPlan: data?.paymentPlan,
      orderTotalWithinStripeRange: data?.orderTotalWithinStripeRange,
      couponData: {
        coupon: data?.coupon,
        stripePaymentCouponId: data?.stripePaymentCouponId,
        stripeSubscriptionCouponId: data?.stripeSubscriptionCouponId,
        type: data?.couponType,
      },
    };
  } else {
    return {
      orderTotal: data?.orderTotal,
      subTotal: data?.subTotal,
      moduleOrderTotal: data?.moduleOrderTotal,
      moduleSubTotal: data?.moduleSubTotal,
      moduleDiscount: data?.moduleDiscount,
      discount: data?.discount,
      discountUnit: data?.discountUnit,
      orderTotalWithinStripeRange: data?.orderTotalWithinStripeRange,
      couponData: {
        coupon: data?.coupon,
        stripePaymentCouponId: data?.stripePaymentCouponId,
        stripeSubscriptionCouponId: data?.stripeSubscriptionCouponId,
        type: data?.couponType,
      },
    };
  }
};

const returnCartItemsForAPI = (data) => {
  const cartItems = [];

  data?.map((each) => {
    cartItems.push({
      product: each?.product?._id,
      cartItemId: each?.product?._id,
      quantity: each?.quantity || 1,
    });
  });

  return cartItems;
};

const remainingItems = (cartItems, product) =>
  cartItems?.filter((cartItem) => cartItem.cartItemId !== product._id);

// export const ADD_ALL_TO_CART = "ADD_ALL_TO_CART";
// import { getCart } from "src/apiClient/cart";

//get cart
// Todo: need to add cart
// export const addAllToCart = () => {
//   return async dispatch => {
//     await getCart().then(response => {
//       console.log('response', response);
//       dispatch({
//         type: ADD_ALL_TO_CART,
//         payload: {}
//       });
//     })
//       .catch(error => console.log('error', error))
//   };
// }

// Add Api data to cart

export const addAPIDataToCart = (apiData, cartItems = []) => {
  return (dispatch) => {
    const structuredData = returnAPIResponseObject(apiData);

    // Calculate cart count for both products and moduleProducts
    let localCartCount = 0;
    if (structuredData?.products) {
      localCartCount = calculateCartItemsCount(structuredData?.products);
    } else if (structuredData?.moduleProducts) {
      // For module products, count both quantity and additionalUnit
      localCartCount = structuredData.moduleProducts.reduce((total, item) => {
        return total + (item.quantity || 0) + (item.additionalUnit || 0);
      }, 0);
    }

    return dispatch({
      type: ADD_API_TO_CART,
      payload: {
        ...structuredData,
        localCartCount,
      },
    });
  };
};

// export const addBulkItemsToCart = (items, addToast, cartData) => {
//   const cartItems = cartData?.products;
//   const apiItems = [];
//   items.forEach((each) => {
//     const sameItem = cartItems?.find(
//       (cartItem) => cartItem?.cartItemId === each?.cartItemId
//     );
//     if (sameItem) sameItem.quantity += each?.quantity;
//     else cartItems.push(each);
//     apiItems.push({
//       cartItemId: sameItem?.cartItemId || each?.cartItemId,
//       product: sameItem?.cartItemId || each?.cartItemId,
//       quantity: sameItem?.quantity || each?.quantity,
//     });
//   });
//   return (dispatch) => {
//     updateApiCartData(apiItems, "", false).then((res) => {
//       const apiData = res?.data?.data;
//       const structuredData = returnAPIResponseObject(apiData);
//       let localCartCount = 0;
//       if (res?.status === 200)
//         localCartCount += calculateCartItemsCount(structuredData?.products);
//       else localCartCount += calculateCartItemsCount(items);

//       if (addToast)
//         addToast("Added to cart Successfully", {
//           appearance: "success",
//           autoDismiss: true,
//         });
//       dispatch({
//         type: ADD_TO_CART,
//         payload: {
//           products: cartItems,
//           localCartCount,
//           ...structuredData,
//         },
//       });
//     });
//   };
// };

//add to cart
export const addToCart = (
  item,
  addToast,
  quantityCount,
  selectedProductColor,
  selectedProductSize,
  cartData = { products: [] }
) => {
  return async (dispatch) => {
    if (!item) {
      return;
    }
    const cartItems = cartData?.products || [];

    let product = {
      ...item,
      quantity: quantityCount,
      selectedProductColor: selectedProductColor
        ? selectedProductColor
        : item.selectedProductColor
          ? item.selectedProductColor
          : null,
      selectedProductSize: selectedProductSize
        ? selectedProductSize
        : item.selectedProductSize
          ? item.selectedProductSize
          : null,
    };

    if (product.variation === undefined) {
      const cartItem = cartItems?.filter(
        (item) => item.cartItemId === product._id
      )[0];
      if (cartItem === undefined) {
        const items = returnCartItemsForAPI([
          ...cartItems,
          {
            product: product,
            quantity: product?.quantity || 1,
            cartItemId: product?._id,
          },
        ]);
        const oldItems = [
          ...cartItems,
          {
            product: { ...product },
            cartItemId: product?._id,
            quantity: product?.quantity || 1,
          },
        ];
        updateApiCartData(items, "", false)
          .then((res) => {
            const apiData = res?.data?.data;
            const structuredData = returnAPIResponseObject(apiData);
            let localCartCount = 0;
            if (res?.status === 200) {
              localCartCount += calculateCartItemsCount(
                structuredData?.products
              );
            } else {
              localCartCount += calculateCartItemsCount(oldItems);
            }
            if (addToast) {
              addToast("Added to cart Successfully", {
                appearance: "success",
                autoDismiss: true,
              });
            }
            dispatch({
              type: ADD_TO_CART,
              payload: {
                products: oldItems,
                localCartCount,
                ...structuredData,
              },
            });
          })
          .catch((err) => {
            if (addToast) {
              addToast("Please try after sometime", {
                appearance: "error",
                autoDismiss: true,
              });
            }
            console.log(err);
          });
        // await UpdateApiData(items);
        return;
      } else {
        let previousItems = cartItems?.map((item) =>
          item?.product?._id === cartItem?.product?._id
            ? {
              ...item,
              quantity: product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1,
            }
            : item
        );

        let apiPreviousItems = cartItems?.map((item) =>
          item._id === cartItem._id
            ? {
              ...item,
              quantity: product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1,
            }
            : item
        );
        const items = returnCartItemsForAPI(apiPreviousItems);
        updateApiCartData(items, "", false)
          .then((res) => {
            const apiData = res?.data?.data;
            const structuredData = returnAPIResponseObject(apiData);

            let localCartCount = 0;

            if (res?.status === 200) {
              localCartCount += calculateCartItemsCount(
                structuredData?.products
              );
            } else {
              localCartCount += calculateCartItemsCount(previousItems);
            }

            if (addToast) {
              addToast("Added to cart Successfully", {
                appearance: "success",
                autoDismiss: true,
              });
            }
            dispatch({
              type: ADD_TO_CART,
              payload: {
                products: previousItems,
                localCartCount,
                ...structuredData,
              },
            });
          })
          .catch((err) => {
            if (addToast) {
              addToast("Please try after sometime", {
                appearance: "error",
                autoDismiss: true,
              });
            }
            console.log(err);
          });

        // await UpdateApiData(items);
        return;
      }
      // for variant products
    } else {
      const cartItem = cartItems?.filter(
        (item) =>
          item.cartItemId === product.id &&
          product.selectedProductColor &&
          product.selectedProductColor === item.selectedProductColor &&
          product.selectedProductSize &&
          product.selectedProductSize === item.selectedProductSize &&
          (product._id ? product._id === item._id : true)
      )[0];

      if (cartItem === undefined) {
        const items = returnCartItemsForAPI([
          ...cartItems,
          { product: product },
        ]);
        const oldItems = [...cartItems, { product: product }];
        updateApiCartData(items, "", false)
          .then((res) => {
            const apiData = res?.data?.data;
            const structuredData = returnAPIResponseObject(apiData);
            if (addToast) {
              addToast("Added to cart Successfully", {
                appearance: "success",
                autoDismiss: true,
              });
            }

            let localCartCount = 0;

            if (res?.status === 200) {
              localCartCount += calculateCartItemsCount(
                structuredData?.products
              );
            } else {
              localCartCount += calculateCartItemsCount(oldItems);
            }

            dispatch({
              type: ADD_TO_CART,
              payload: {
                products: oldItems,
                localCartCount,
                ...structuredData,
              },
            });
          })
          .catch((err) => {
            if (addToast) {
              addToast("Please try after sometime", {
                appearance: "error",
                autoDismiss: true,
              });
            }
            console.log(err);
          });

        // await UpdateApiData(items);
        return;
      } else if (
        cartItem !== undefined &&
        (cartItem.selectedProductColor !== product.selectedProductColor ||
          cartItem.selectedProductSize !== product.selectedProductSize)
      ) {
        const items = returnCartItemsForAPI([
          ...cartItems,
          { product: product },
        ]);

        const oldItems = [...cartItems, { product: product }];

        updateApiCartData(items, "", false)
          .then((res) => {
            const apiData = res?.data?.data;
            const structuredData = returnAPIResponseObject(apiData);
            if (addToast) {
              addToast("Added to cart Successfully", {
                appearance: "success",
                autoDismiss: true,
              });
            }
            let localCartCount = 0;

            if (res?.status === 200) {
              localCartCount += calculateCartItemsCount(
                structuredData?.products
              );
            } else {
              localCartCount += calculateCartItemsCount(oldItems);
            }

            dispatch({
              type: ADD_TO_CART,
              localCartCount,
              payload: {
                products: oldItems,
                ...structuredData,
              },
            });
          })
          .catch((err) => {
            if (addToast) {
              addToast("Please try after sometime", {
                appearance: "error",
                autoDismiss: true,
              });
            }
            console.log(err);
          });
        // await UpdateApiData(items);
        return;
      } else {
        const previousItems = cartItems?.map((item) =>
          item._id === cartItem._id
            ? {
              ...item,
              quantity: product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1,
              selectedProductColor: product.selectedProductColor,
              selectedProductSize: product.selectedProductSize,
            }
            : item
        );

        const items = returnCartItemsForAPI(previousItems);

        updateApiCartData(items, "", false)
          .then((res) => {
            const apiData = res?.data?.data;
            const structuredData = returnAPIResponseObject(apiData);
            if (addToast) {
              addToast("Added to cart Successfully", {
                appearance: "success",
                autoDismiss: true,
              });
            }

            let localCartCount = 0;

            if (res?.status === 200) {
              localCartCount += calculateCartItemsCount(
                structuredData?.products
              );
            } else {
              localCartCount += calculateCartItemsCount(previousItems);
            }

            dispatch({
              type: ADD_TO_CART,
              payload: {
                products: previousItems,
                localCartCount,
                ...structuredData,
              },
            });
          })
          .catch((err) => {
            if (addToast) {
              addToast("Please try after sometime", {
                appearance: "error",
                autoDismiss: true,
              });
            }
            console.log(err);
          });

        // await UpdateApiData(items);
        return;
      }
    }
  };

  // console.log("here is the cart items from addTOcart", cartItems);
  // return (dispatch) => {
  //   if (addToast) {
  //     addToast("Added To Cart", { appearance: "success", autoDismiss: true });
  //   }
  //   dispatch({
  //     type: ADD_TO_CART,
  //     payload: {
  //       products,
  //     },
  //   });
  // };
};

export const increaseQuantity = (
  item,
  addToast,
  quantityCount,
  cartData = { products: [] },
  fullItem = false,
  loggedIn = true
) => {
  return async (dispatch) => {
    const cartItems = cartData?.products || [];
    let product = item;
    const found = false;
    const previousItems = cartItems?.map((item) => {
      if (item.cartItemId === product._id) {
        found = true;
        return { ...item, quantity: quantityCount };
      } else {
        return item;
      }
    });

    if (!found && fullItem) {
      previousItems.push(item);
    }

    if (!loggedIn) {
      if (addToast) {
        addToast("Quantity increased successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      }

      let localCartCount = 0;

      localCartCount += calculateCartItemsCount(previousItems);

      return dispatch({
        type: ADD_TO_CART,
        payload: {
          products: previousItems,
          localCartCount,
        },
      });
    }

    const items = returnCartItemsForAPI(previousItems);

    updateApiCartData(items, "", false)
      .then((res) => {
        const apiData = res?.data?.data;
        const structuredData = returnAPIResponseObject(apiData);
        let localCartCount = 0;
        if (res?.status === 200) {
          localCartCount += calculateCartItemsCount(structuredData?.products);
        } else {
          localCartCount += calculateCartItemsCount(previousItems);
        }
        if (addToast) {
          addToast("Quantity increased successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        }
        dispatch({
          type: ADD_TO_CART,
          payload: {
            products: previousItems,
            localCartCount,
            ...structuredData,
          },
        });
      })
      .catch((err) => {
        if (addToast) {
          addToast("Please try after sometime", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      });
    // await UpdateApiData(items);
  };
};

//decrease from cart
export const decreaseQuantity = (
  item,
  addToast,
  cartData = { products: [] },
  specifyQuantity = false,
  itemQuantity = 0,
  fullItem = false,
  loggedIn = true,
  notDelete = false
) => {
  const cartItems = cartData?.products || [];
  return async (dispatch) => {
    let product = item;
    cartItems?.map((item) =>
      item.cartItemId === product._id ? (product = item) : ""
    );

    if (product.quantity === 1 && !notDelete) {
      const items = remainingItems(cartItems, product);
      const getStripe = window.location.pathname === "/other/checkout";

      deleteItemFromCart(item?._id, getStripe)
        .then((res) => {
          const apiData = res?.data?.data;
          const structuredData = returnAPIResponseObject(apiData);
          if (addToast) {
            addToast("Item Removed from cart", {
              appearance: "warning",
              autoDismiss: true,
            });
          }
          let localCartCount = 0;
          localCartCount += calculateCartItemsCount(structuredData?.products);
          dispatch({
            type: DECREASE_QUANTITY,
            payload: {
              ...structuredData,
              localCartCount,
            },
          });
        })
        .catch((err) => {
          if (addToast) {
            addToast("Please try after sometime", {
              appearance: "error",
              autoDismiss: true,
            });
          }
          console.log(err);
        });

      // await UpdateApiData(items);
    } else {
      const found = false;

      if (!loggedIn) {
        const newCartItems = cartItems?.map((each) => {
          if (each?.cartItemId === product.cartItemId) {
            found = true;
            return { ...each, quantity: itemQuantity };
          } else {
            return each;
          }
        });

        if (!found && fullItem) {
          cartItems.push(product);
        }

        let localCartCount = 0;

        localCartCount += calculateCartItemsCount(newCartItems);

        if (addToast) {
          addToast("Item quantity decreased from cart", {
            appearance: "warning",
            autoDismiss: true,
          });
        }

        return dispatch({
          type: DECREASE_QUANTITY,
          payload: {
            products: newCartItems,
            localCartCount,
          },
        });
      }

      const items = cartItems?.map((item) => {
        if (item.cartItemId === product.cartItemId) {
          found = true;
          return {
            quantity: specifyQuantity ? itemQuantity : item?.quantity - 1,
            product: item?.cartItemId,
            cartItemId: item?.cartItemId,
          };
        } else {
          return {
            quantity: item?.quantity,
            product: item?.cartItemId,
            cartItemId: item?.cartItemId,
          };
        }
      });

      if (!found && fullItem) {
        items.push({
          quantity: item?.quantity,
          product: item?.cartItemId,
          cartItemId: item?.cartItemId,
        });
      }

      updateApiCartData(items, "", false)
        .then((res) => {
          const apiData = res?.data?.data;
          const structuredData = returnAPIResponseObject(apiData);
          if (addToast) {
            addToast("Item quantity decreased from cart", {
              appearance: "warning",
              autoDismiss: true,
            });
          }

          let localCartCount = 0;
          localCartCount += calculateCartItemsCount(structuredData?.products);

          // if (addToast) {
          //   addToast('Item quantity decreased from cart', {
          //     appearance: 'warning',
          //     autoDismiss: true,
          //   })
          // }

          dispatch({
            type: DECREASE_QUANTITY,
            payload: { ...structuredData, localCartCount },
          });
        })
        .catch((err) => {
          if (addToast) {
            addToast("Please try after sometime", {
              appearance: "error",
              autoDismiss: true,
            });
          }
          console.log(err);
        });
      // await UpdateApiData(items);
    }
  };
};
//delete from cart
export const deleteFromCart = (item, addToast, cartData) => {
  const cartItems = cartData?.products || [];
  return async (dispatch) => {
    let product = item;

    const items = remainingItems(cartItems, product);
    const getStripe = window.location.pathname === "/other/checkout";

    deleteItemFromCart(item?._id, getStripe)
      .then((res) => {
        const apiData = res?.data?.data;
        const structuredData = returnAPIResponseObject(apiData);
        if (addToast) {
          addToast("Item Removed from cart", {
            appearance: "warning",
            autoDismiss: true,
          });
        }
        let localCartCount = 0;

        if (res?.status === 200) {
          localCartCount += calculateCartItemsCount(structuredData?.products);
        } else {
          localCartCount += calculateCartItemsCount(items);
        }
        dispatch({
          type: DELETE_FROM_CART,
          payload: {
            products: items,
            localCartCount,
            ...structuredData,
          },
        });
      })
      .catch((err) => {
        if (addToast) {
          addToast("Please try after sometime", {
            appearance: "error",
            autoDismiss: true,
          });
        }
        console.log(err);
      });

    // await UpdateApiData(items);
  };
};
//delete all from cart
export const deleteAllFromCart = (addToast) => {
  return async (dispatch) => {
    // Not required for now

    deleteAllFromCartAPI().then((res) => {
      if (addToast && typeof addToast === "function") {
        localStorage.removeItem("conferenceCode")
        localStorage.removeItem("lowestProduct")
        localStorage.removeItem("userEventId")
        addToast("Removed All From Cart", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      dispatch({ type: DELETE_ALL_FROM_CART });
    });
  };
};

export const deleteAllFromCartLocally = (addToast) => {
  return (dispatch) => {
    dispatch({ type: DELETE_ALL_FROM_CART_LOCAL });
  };
};

// get stock of cart item
export const cartItemStock = (item, color, size) => {
  if (item.stock) {
    return item?.stock;
  } else {
    return item?.variation
      ?.filter((single) => single?.color === color)?.[0]
      ?.size.filter((single) => single?.name === size)?.[0]?.stock;
  }
};

export const updateCartForCurrency = (currency, origin = "", data = {}) => {
  return (dispatch) => {
    if (origin === "CART_PAGE") {
      const localCartCount = calculateCartItemsCount(data?.products);

      return dispatch({
        type: UPDATE_CART_FOR_CURRENCY,
        payload: {
          products: data?.products,
          localCartCount,
          ...returnAPIResponseObject(data),
        },
      });
    }
    const getStripe = window.location.pathname === "/other/checkout";
    updateCart([], currency, false, getStripe).then((res) => {
      const localCartCount = calculateCartItemsCount(res?.data?.data?.products);
      dispatch({
        type: UPDATE_CART_FOR_CURRENCY,
        payload: {
          products: res?.data?.data?.products,
          localCartCount,
          ...returnAPIResponseObject(res?.data?.data),
        },
      });
    });
  };
};

export const updateCartForStripe = (currency) => {
  return (dispatch) => {
    // const getStripe = window.location.pathname === "/other/checkout";
    updateCart([], currency, false, true).then((res) => {
      const localCartCount = calculateCartItemsCount(res?.data?.data?.products);

      dispatch({
        type: UPDATE_CART_FOR_STRIPE,
        localCartCount,
        payload: {
          ...returnAPIResponseObject(res?.data?.data),
        },
      });
    });
  };
};

export const addCoupon = (
  type,
  code,
  discount,
  subTotal,
  total,
  discountUnit,
  stripeCode,
  orderTotalWithinStripeRange
) => {
  return (dispatch) => {
    const couponDataStructure = {
      orderTotal: total,
      subTotal,
      discount,
      discountUnit,
      orderTotalWithinStripeRange,
      couponData: {
        coupon: code,
        type,
        stripePaymentCouponId: stripeCode?.regular,
        stripeSubscriptionCouponId: stripeCode?.subscription,
      },
    };
    dispatch({
      type: ADD_COUPON,
      payload: {
        ...couponDataStructure,
      },
    });
  };
};

export const deleteCoupon = () => {
  return (dispatch) => {
    dispatch({ type: DELETE_COUPON, payload: {} });
  };
};

export const addHiddenProducts = (products) => {
  return (dispatch) => {
    dispatch({ type: ADD_HIDDEN_PRODUCTS, payload: { products } });
  };
};

export const removeHiddenProducts = () => {
  return (dispatch) => {
    dispatch({ type: REMOVE_HIDDEN_PRODUCTS, payload: {} });
  };
};

export const addExpressPriceData = (data) => {
  return (dispatch) => {
    dispatch({ type: ADD_EXPRESS_PRICE_DATA, payload: { data } });
  };
};

export const addExpressItemAddedToCart = () => {
  return (dispatch) => {
    dispatch({
      type: ADD_EXPRESS_ITEM_ADDED_TO_CART,
      payload: { expressAddedToCart: true },
    });
  };
};

export const addModuleItemsToCartLocal = (items = []) => {
  return (dispatch) => {
    const localCartCount = items.reduce(
      (total, item) => total + (item.quantity || 0) + (item.additionalUnit || 0),
      0
    );
    dispatch({
      type: ADD_API_TO_CART,
      payload: {
        moduleProducts: items,
        isModuleProduct: true,
        localCartCount,
      },
    });
  };
};

export const removeExpressItemAddedToCartLocal = () => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_EXPRESS_ITEM_ADDED_TO_CART_LOCAL,
      payload: { expressAddedToCart: false },
    });
  };
};

export const removeExpressItemAddedToCart = (id = "") => {
  return (dispatch) => {
    deleteItemFromCart(id, false)
      .then((res) => {
        const apiData = res?.data?.data;
        const structuredData = returnAPIResponseObject(apiData);

        dispatch({
          type: REMOVE_EXPRESS_ITEM_ADDED_TO_CART,
          payload: {
            ...structuredData,
            expressAddedToCart: false,
          },
        });
      })
      .catch((err) => {
        if (addToast) {
          addToast("Error while removing item from cart", {
            appearance: "error",
            autoDismiss: true,
          });
        }
        console.log(err);
      });
  };
};

export const removeCoupon = (subTotal, total, orderTotalWithinStripeRange) => {
  const couponDataStructure = {
    orderTotal: total,
    subTotal,
    orderTotalWithinStripeRange,
  };

  return (dispatch) =>
    dispatch({
      type: REMOVE_COUPON,
      payload: {
        ...couponDataStructure,
      },
    });
};

export const updateLocalCartCount = (count) => {
  return (dispatch) =>
    dispatch({
      type: UPDATE_LOCAL_CART_COUNT,
      payload: { localCartCount: count },
    });
};

export const setCartCurrency = (currency) => {
  return (dispatch) => {
    dispatch({ type: SET_CART_CURRENCY, payload: { currency } });
  };
};
