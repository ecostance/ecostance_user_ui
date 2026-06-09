import React from "react";
import { useState, useEffect } from "react";
import LezadaBackdrop from "./lezadaBackdrop";
import { Rating } from "react-simple-star-rating";
import {
  createReview,
  getOrderProductReview,
  updateOrderProductReview,
} from "src/apiClient/product";
import { useToasts } from "react-toast-notifications";
import formatCurrency from "src/helpers/formatCurrency";
import { Spinner } from "react-bootstrap";

function ReviewPopup({ setShowReviewPopUp, reviewProduct }) {
  const { addToast } = useToasts();
  const [reviewData, setReviewData] = useState({ ...reviewProduct });
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewId, setReviewId] = useState();
  const [isProductSelected, setIsProductSelected] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [shouldReviewUpdate, setShouldReviewUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isProductSelected)
      return getSelectedProductReview(selectedProduct?.product?._id);
    if (reviewData?.products?.length === 1)
      return getSelectedProductReview(reviewData?.products[0]?.product?._id);
  }, [selectedProduct]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!rating || !review.trim().length) return;
    const reqObj = {
      rating,
      comment: review,
      businessReview: reviewProduct?.businessReview
    };
    try {
      let res;
      if (shouldReviewUpdate === false) {
        reqObj.productId =
          selectedProduct?.product?._id ||
          reviewData?.products[0]?.product?._id;
        reqObj.orderId = reviewData?.orderId;
        res = await createReview(reqObj);
        // console.log("businessReview" , reqObj)
      } else if (shouldReviewUpdate === true) {
        res = await updateOrderProductReview(reviewId, reqObj);
      }
      if (res?.status === 200 || res?.status === 201) {
        setIsLoading(false);
        addToast(
          "We are processing your review. This might take several days, so we appreciate your patience",
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
        setShowReviewPopUp(false);
      } else {
        addToast(res?.data?.messages, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const getSelectedProductReview = async (selectedProductId) => {
    try {
      const {
        data: { data },
      } = await getOrderProductReview(reviewData?.orderId, selectedProductId, reviewProduct?.businessReview);
      setReview("");
      setRating(0);
      setReviewId();
      if (data === undefined || data === null) return;
      setReview(data?.comment);
      setRating(data?.rating);
      setReviewId(data?._id);
      setShouldReviewUpdate(true);
    } catch (error) {
      console.log(error);
    }
  };

  const selectProductForReview = (selectProductIndex) => {
    const products = reviewData?.products?.map((product, index) => {
      if (index === selectProductIndex)
        return {
          ...product,
          isSelected: !product.isSelected,
        };
      return {
        ...product,
        isSelected: false,
      };
    });
    setIsProductSelected(products[selectProductIndex]?.isSelected);
    setSelectedProduct(products[selectProductIndex]);
    setReviewData({
      ...reviewData,
      products,
    });
  };

  const startProductReview = () => {
    setReviewData({
      ...reviewData,
      products: [selectedProduct],
    });
  };

  const getPrice = (priceList) => {
    const { currencySymbol, oldPrice, price } = priceList?.find(
      (price) => price.currency === reviewData.currency
    );
    return {
      currencySymbol,
      oldPrice,
      price,
    };
  };

  const SelectProductComponent = () => {
    return (
      <div className="review-products-container">
        <div className="review-products-wrapper">
          {reviewData?.products?.map((product, index) => {
            const { currencySymbol, oldPrice, price } = getPrice(
              product?.product?.priceList
            );
            return (
              <div key={index} className="review-product-container">
                <div className="review-product-img-wrapper">
                  <div
                    className="review-product-select"
                    onClick={() => selectProductForReview(index)}
                  >
                    {!product.isSelected ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <circle cx="9" cy="9" r="8.5" stroke="#333"></circle>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <circle cx="9" cy="9" r="9" fill="#7BA986"></circle>
                        <path
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5.709 10.042l2.167 2.167 5.416-5.417"
                        ></path>
                      </svg>
                    )}
                  </div>
                  <div className="my-account--order-card__img-wrapper review-product-img-container">
                    <img
                      onClick={() => selectProductForReview(index)}
                      className="review-product-img"
                      src={
                        Array.isArray(product?.product?.image) &&
                          product?.product?.image.length
                          ? product?.product?.image[0]
                          : ""
                      }
                      alt="Product Image"
                    />
                  </div>
                </div>
                <div className="review-product-info-container">
                  <div className="review-product-certificate-container">
                    {/* <div style={{ fontSize: '12px' }}>{product._id}</div> */}
                    <span> {product?.product?.name}</span>
                  </div>

                  <div className="review-product-price-container">
                    <p className="review-product-price">
                      {/* Price:{' '} */}
                      <span className="review-product-old-price">
                        {product.quantity} x{" "}
                        <span style={{ textDecoration: "line-through" }}>
                          {/* {' '} */}
                          {/* {currencySymbol} */}
                          {/* {oldPrice} */}
                        </span>
                        {/* / */}
                      </span>{" "}
                      <span>
                        {reviewData?.currency} {currencySymbol}
                        {formatCurrency(price, reviewData?.currency)}
                      </span>{" "}
                      {/* <span>({product.quantity})</span>{' '}
                      <span className="tons-txt">Tons</span> */}
                    </p>
                    <p className="review-product-description">
                      {product?.product?.shortDescription}
                    </p>
                    {/* <p className="review-product-carbon-container">
                      Carbon offset quantity: {product.quantity}{' '}
                      <span className="tons-txt">Tons</span>
                    </p> */}
                    <p className="review-product-total-price">
                      {/* Total:{' '} */}
                      <span>
                        {reviewData?.currency} {currencySymbol}
                        {formatCurrency(
                          price * product.quantity,
                          reviewData?.currency
                        )}
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="review-product-btn-container">
          <button
            className="button--black"
            style={{
              cursor: `${isProductSelected ? "pointer" : "not-allowed"}`,
            }}
            disabled={isProductSelected ? false : true}
            onClick={startProductReview}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const ReviewComponent = () => (
    <>
      <div className="review-popup-rating-container review-popup-product_name-container">
        <p>Product</p>
        <div className="review-popup-product_name">
          {selectedProduct?.product?.name ||
            reviewData.products[0]?.product?.name}
        </div>
      </div>
      <div className="review-popup-rating-container">
        <p>Your Rating</p>
        <div className="review-popup-rating">
          <Rating
            fillIcon={
              <span style={{ margin: "3px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="28"
                  fill="none"
                  viewBox="0 0 29 28"
                >
                  <path
                    fill="#ffc922"
                    stroke="#ffc922"
                    d="M13.451.65a1.173 1.173 0 012.1 0l3.53 7.083c.171.343.498.58.877.637l7.828 1.17a1.173 1.173 0 01.649 1.995l-5.646 5.548a1.172 1.172 0 00-.335 1.03l1.307 7.807c.16.954-.84 1.68-1.698 1.233l-7.02-3.655a1.172 1.172 0 00-1.084 0l-7.02 3.655A1.172 1.172 0 015.24 25.92l1.306-7.807a1.172 1.172 0 00-.334-1.03L.567 11.535a1.172 1.172 0 01.648-1.996l7.829-1.17c.378-.056.705-.293.876-.636L13.451.65z"
                  ></path>
                </svg>
              </span>
            }
            emptyIcon={
              <span style={{ margin: "2.5px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="28"
                  fill="none"
                  viewBox="0 0 30 28"
                >
                  <path
                    fill="#2222"
                    stroke="#2222"
                    d="M14.504.872a.673.673 0 011.204 0l3.532 7.084c.243.489.71.828 1.25.908l7.828 1.17a.673.673 0 01.372 1.145l-5.646 5.548c-.39.382-.567.93-.477 1.469l1.306 7.806a.673.673 0 01-.973.708l-7.021-3.655a1.673 1.673 0 00-1.545 0l-7.02 3.655a.673.673 0 01-.975-.708l1.307-7.806a1.673 1.673 0 00-.477-1.47L1.523 11.18a.673.673 0 01.372-1.145l7.828-1.17c.54-.08 1.006-.42 1.25-.908L14.504.872z"
                  ></path>
                </svg>
              </span>
            }
            initialValue={rating}
            onClick={(rating) => setRating(rating)}
            transition
          />
        </div>
      </div>
      <div className="review-popup-form-container">
        <form onSubmit={submitReviewHandler}>
          <div className="sustainability--page-input-wrapper review-popup-input-wrapper">
            <textarea
              placeholder="Your Review *"
              maxLength={400}
              style={{ resize: "none" }}
              onChange={({ target: { value } }) => setReview(value)}
              value={review}
              className="sustainability--page-input-holder--description review-popup-input-holder"
            />
            <span
              className={`sustainability--page-input-char-count review-popup-input-char-count ${review?.length >= 400 && `char-disallow`
                }`}
            >{`${review?.length} / 400`}</span>
          </div>
          <div className="review-popup-submit-btn-container">
            <button
              type="submit"
              value="Submit"
              onClick={() => setIsLoading(true)}
            >
              {" "}
              SUBMIT {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                ""
              )}{" "}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  const getCardUI = () => {
    if (reviewData?.products?.length === 1) return ReviewComponent();
    if (reviewData?.products?.length >= 1) return SelectProductComponent();
    // const cardUI = useMemo(() => getCardUI(), [reviewData.products])
  };

  return (
    <LezadaBackdrop>
      <div className="standard-popup-holder review-popup-holder">
        <div
          className="standard-popup-cross-icon review-popup-cross-icon"
          onClick={() => setShowReviewPopUp(false)}
        >
          <img src="/assets/images/cross-sustainability.png" />
        </div>
        <div className="review-popup-content-wrapper">
          <div className="review-popup-title-container">
            <h1>Add a review</h1>
            {/* {JSON.stringify(reviewProduct?.orderId)} */}
          </div>
          {getCardUI()}
        </div>
      </div>
    </LezadaBackdrop>
  );
}

export default ReviewPopup;
