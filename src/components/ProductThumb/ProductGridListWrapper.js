import { Fragment, useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../lib/product";
import { addAPIDataToCart, addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import {
  addToCompare,
  deleteFromCompare,
} from "../../redux/actions/compareActions";
import ProductGridList from "./ProductGridList";
import regionPrice from "src/helpers/regionPrice";
import { updateCartBulk } from "src/helpers/updateCartBulk";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import ProductGrid from "./ProductGrid";

const ProductGridWrapper = ({
  products,
  bottomSpace,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  cartItems,
  compareItems,
  userData,
  setShowComparePopup,
  wishlistItems,
  // setDebounce,
  // removeDebounce,
  addAPIDataToCart,
}) => {
  const { addToast } = useToasts();
  const { setDebounce, removeDebounce } = _newDebounce();
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

  // products = products.sort((a, b) => a.actualStock - b.actualStock);

  return (
    <Fragment>
      {products.length > 0 ? (
        products.map((product) => {
          const regionPricing = regionPrice(product, userData);

          const productPrice = regionPricing.productPrice;
          const currencySymbol = regionPricing.currencySymbol;
          const oldPrice = regionPricing.oldPrice;
          const currencyCode = regionPricing.currencyCode;
          const discount = product?.discount;

          const discountedPrice = regionPricing.productPrice;
          // console.log("HERE IS CART ITEM", cartItems);
          let cartItem;
          if (cartItems instanceof Array) {
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
            <ProductGridList
              oldPrice={oldPrice}
              discount={discount}
              key={product.id}
              addItemToCart={addItemToCart}
              product={product}
              discountedPrice={discountedPrice}
              productPrice={productPrice}
              cartItem={cartItem}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
              bottomSpace={bottomSpace}
              addToCart={addToCart}
              wishlistItems={wishlistItems}
              addToWishlist={addToWishlist}
              deleteFromWishlist={deleteFromWishlist}
              addToCompare={addToCompare}
              deleteFromCompare={deleteFromCompare}
              addToast={addToast}
              cartItems={cartItems}
              currencySymbol={currencySymbol}
              currencyCode={currencyCode}
              userData={userData}
              setShowComparePopup={setShowComparePopup}
            />
          );
        })
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>No Products Found</div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAPIDataToCart: (data) => {
      dispatch(addAPIDataToCart(data));
    },
    addToCart: (
      product,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      cartItems
    ) => {
      dispatch(
        addToCart(
          product,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          cartItems
        )
      );
    },
    addToWishlist: (item, addToast, wishlistItems) => {
      dispatch(addToWishlist(item, addToast, wishlistItems));
    },
    deleteFromWishlist: (item, addToast, wishlistItems) => {
      dispatch(deleteFromWishlist(item, addToast, wishlistItems));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    deleteFromCompare: (item, addToast) => {
      dispatch(deleteFromCompare(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridWrapper);
