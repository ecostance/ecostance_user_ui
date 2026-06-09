import { updateApiCartData } from "src/redux/store";

export const updateCartBulk = ({
  item,
  allProductsAddedToCart,
  setAllProductsAddedToCart,
  addAPIDataToCart,
  saveCartItems,
  cartItems,
  addToast,
}) => {
  const addItemToCart = (item, quantity) => {
    const localAllProducts = allProductsAddedToCart;
    const localProductsForCart = [];
    let sameProduct = false;
    const itemFormatted = {
      product: item?._id,
      quantity: 1,
      cartItemId: item?._id,
    };
    localAllProducts?.forEach((each) => {
      let quantityCount = each?.quantity;
      if (each?.cartItemId === itemFormatted?.cartItemId) {
        sameProduct = true;
        quantityCount += itemFormatted?.quantity;
      }

      localProductsForCart.push({
        ...each,
        quantity: quantityCount,
        product: each?.cartItemId,
      });
    });
    if (!sameProduct) localProductsForCart.push(itemFormatted);
    setAllProductsAddedToCart(localProductsForCart);
    saveCartItems(updateCartToRedux, localProductsForCart);
  };

  const updateCartToRedux = async (items) => {
    const res = await updateApiCartData(items, cartItems?.currency, false);
    if (res?.status === 200)
      addToast("Added to cart Successfully", {
        appearance: "success",
        autoDismiss: true,
      });
    addAPIDataToCart(res?.data?.data);
  };

  addItemToCart(item);
};
