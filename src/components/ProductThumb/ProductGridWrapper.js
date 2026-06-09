import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../lib/product";
import {
  addAPIDataToCart,
  // addBulkItemsToCart,
  addToCart,
} from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import {
  addToCompare,
  deleteFromCompare,
} from "../../redux/actions/compareActions";
import ProductGrid from "./ProductGrid";
import regionPrice from "src/helpers/regionPrice";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import { updateApiCartData } from "src/redux/store";
import { updateCartBulk } from "src/helpers/updateCartBulk";

const ProductGridWrapper = ({
  products,
  bottomSpace,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  cartItems,
  wishlistItems,
  compareItems,
  column,
  userData,
  setShowComparePopup,
  // addBulkItemsToCart,
  setDebounce,
  removeDebounce,
  addAPIDataToCart,
}) => {
  const { addToast } = useToasts();
  // const { setDebounce, removeDebounce } = _newDebounce();

  const [allProductsAddedToCart, setAllProductsAddedToCart] = useState([]);

  const saveCartItems = useCallback(
    setDebounce(async (updateCartToRedux, localAllProducts) => {
      updateCartToRedux(localAllProducts);
    }, 700),
    []
  );

  useEffect(() => {
    setAllProductsAddedToCart(cartItems?.products);
  }, [cartItems?.products]);

  const addItemToCart = (item) => {
    updateCartBulk({
      item,
      allProductsAddedToCart,
      setAllProductsAddedToCart,
      addAPIDataToCart,
      saveCartItems,
      cartItems,
      addToast,
    });
  };

  // const addItemToCart = (item, quantity) => {
  //   const localAllProducts = allProductsAddedToCart;
  //   const localProductsForCart = [];
  //   let sameProduct = false;
  //   const itemFormatted = {
  //     product: item?._id,
  //     quantity: 1,
  //     cartItemId: item?._id,
  //   };
  //   localAllProducts?.forEach((each) => {
  //     let quantityCount = each?.quantity;
  //     if (each?.cartItemId === itemFormatted?.cartItemId) {
  //       sameProduct = true;
  //       quantityCount += itemFormatted?.quantity;
  //     }

  //     localProductsForCart.push({
  //       ...each,
  //       quantity: quantityCount,
  //       product: each?.cartItemId,
  //     });
  //   });
  //   if (!sameProduct) localProductsForCart.push(itemFormatted);
  //   setAllProductsAddedToCart(localProductsForCart);
  //   saveCartItems(updateCartToRedux, localProductsForCart);
  // };

  // const updateCartToRedux = async (items) => {
  //   const res = await updateApiCartData(items, cartItems?.currency, false);
  //   if (res?.status === 200)
  //     addToast("Item added to cart", {
  //       autoDismiss: true,
  //       appearance: "success",
  //     });
  //   addAPIDataToCart(res?.data?.data);
  // };

  // products = products.sort((a, b) => a.actualStock - b.actualStock);

  return (
    <Fragment>
      {products &&
        products.map((product, index) => {
          const regionPricing = regionPrice(product, userData);

          const productPrice = regionPricing.productPrice;
          const currencySymbol = regionPricing.currencySymbol;
          const oldPrice = regionPricing.oldPrice;
          const currencyCode = regionPricing.currencyCode;
          const discount = product?.discount;

          const discountedPrice = regionPricing.productPrice;

          // console.log("HERE IS CART ITEM", cartItems);
          let cartItem;
          if (cartItems?.products instanceof Array) {
            cartItem = cartItems?.products?.filter(
              (cartItem) => cartItem.cartItemId === product._id
            )[0];
          }
          const wishlistItem = wishlistItems.filter(
            (wishlistItem) => wishlistItem.id === product.id
          )[0];
          const compareItem = compareItems.filter(
            (compareItem) => compareItem.id === product.id
          )[0];

          return (
            <ProductGrid
              userData={userData}
              key={index}
              product={product}
              discount={discount}
              oldPrice={oldPrice}
              currencySymbol={currencySymbol}
              currencyCode={currencyCode}
              discountedPrice={discountedPrice}
              productPrice={productPrice}
              cartItem={cartItem}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
              bottomSpace={bottomSpace}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              deleteFromWishlist={deleteFromWishlist}
              addToCompare={addToCompare}
              deleteFromCompare={deleteFromCompare}
              addToast={addToast}
              cartItems={cartItems}
              column={column}
              addItemToCart={addItemToCart}
              wishlistItems={wishlistItems}
              setShowComparePopup={setShowComparePopup}
            />
          );
        })}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // addBulkItemsToCart: (items, addToast, cartData) => {
    //   dispatch(addBulkItemsToCart(items, addToast, cartData));
    // },
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      cartItems
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          cartItems
        )
      );
    },
    addToWishlist: (item, addToast, cartItems, wishlistItems) => {
      dispatch(addToWishlist(item, addToast, cartItems, wishlistItems));
    },
    deleteFromWishlist: (item, addToast, cartItems, wishlistItems) => {
      dispatch(deleteFromWishlist(item, addToast, cartItems, wishlistItems));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    deleteFromCompare: (item, addToast) => {
      dispatch(deleteFromCompare(item, addToast));
    },
    addAPIDataToCart: (items) => {
      dispatch(addAPIDataToCart(items));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridWrapper);
