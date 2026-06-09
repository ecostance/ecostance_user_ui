import Link from "next/link";
import { IoIosClose } from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../../lib/product";
import { deleteFromWishlist } from "../../../redux/actions/wishlistActions";
import regionPrice from "src/helpers/regionPrice";
import formatCurrency from "src/helpers/formatCurrency";

const WishlistOverlay = ({
  activeStatus,
  getActiveStatus,
  wishlistItems,
  deleteFromWishlist,
  userData,
}) => {
  const { addToast } = useToasts();

  return (
    <div className={`wishlist-overlay ${activeStatus ? "active" : ""}`}>
      <div
        className="wishlist-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      />
      <div className="wishlist-overlay__content">
        {/*=======  close icon  =======*/}
        <button
          className="wishlist-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
          >
            <path
              stroke="none"
              d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"
            ></path>
          </svg>
        </button>
        {/*=======  offcanvas wishlist content container  =======*/}
        <div className="wishlist-overlay__content-container">
          <h3 className="wishlist-title">Wishlist</h3>
          {wishlistItems.length >= 1 ? (
            <div className="wishlist-product-wrapper">
              <div className="wishlist-product-container">
                <CustomScroll className="custom-scroll" allowOuterScroll={true}>
                  {wishlistItems.map((product, i) => {
                    const regionPricing = regionPrice(product, userData);
                    const discountedPrice = regionPricing?.productPrice;

                    return (
                      <div className="single-wishlist-product" key={i}>
                        <span className="wishlist-close-icon">
                          <button
                            onClick={() =>
                              deleteFromWishlist(
                                product,
                                addToast,
                                wishlistItems
                              )
                            }
                          >
                            <IoIosClose />
                          </button>
                        </span>
                        <div className="image">
                          <Link
                            href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                            as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                          >
                            <a>
                              <img
                                src={product.thumbImage[0]}
                                className="img-fluid"
                                alt=""
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="content">
                          <h5>
                            <Link
                              href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                            >
                              <a style={{ maxWidth: "200px" }}>
                                {product.name}
                              </a>
                            </Link>
                          </h5>
                          <p>
                            <span className="discounted-price">
                              {regionPricing.currencyCode}{" "}
                              {regionPricing.currencySymbol}
                              {formatCurrency(
                                discountedPrice,
                                regionPricing.currencyCode
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CustomScroll>
              </div>
              {/*=======  wishlist buttons  =======*/}
              <div
                className="wishlist-buttons"
                onClick={() => {
                  getActiveStatus(false);
                  document
                    .querySelector("body")
                    .classList.remove("overflow-hidden");
                }}
              >
                <Link
                  href="/other/wishlist"
                  as={process.env.PUBLIC_URL + "/other/wishlist"}
                >
                  <a>view wishlist</a>
                </Link>
              </div>
            </div>
          ) : (
            "No items found in wishlist"
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    wishlistItems: state.wishlistData,
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromWishlist: (item, addToast, wishlistItems) => {
      dispatch(deleteFromWishlist(item, addToast, wishlistItems));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishlistOverlay);
