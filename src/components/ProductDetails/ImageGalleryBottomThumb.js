import { Fragment, useEffect, useState } from "react";
import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";
import Swiper from "react-id-swiper";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdExpand,
  IoIosHeartEmpty,
  IoIosHeart,
} from "react-icons/io";
import { Tooltip } from "react-tippy";

const ImageGalleryBottomThumb = ({
  product,
  oldPrice,
  discountedPrice,
  wishlistItem,
  addToast,
  addToWishlist,
  deleteFromWishlist,
  wishlistItems,
}) => {
  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);

  // useEffect(() => {
  //   console.log(product, "kwgckfjwegkfe3f");
  // }, []);

  // effect for swiper slider synchronize
  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  // swiper slider settings
  const gallerySwiperParams = {
    getSwiper: getGallerySwiper,
    spaceBetween: 10,
    loopedSlides: 4,
    loop: true,
    effect: "fade",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };

  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    loopedSlides: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    centeredSlides: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <IoIosArrowBack />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <IoIosArrowForward />
      </button>
    ),
  };

  const conditionalImage = (productType) => {
    if (productType === "Renewable Energy") {
      return (
        <img
          src="/assets/images/renewable.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
        />
      );
    } else if (productType === "REDD+") {
      return (
        <img
          src="/assets/images/reddplus.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
        />
      );
    } else if (productType === "CORSIA") {
      return (
        <img
          src="/assets/images/corsia.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
          // style={{ width: "100px !important", height: "100px !important" }}
        />
      );
    } else if (productType === "Gas Abatement") {
      return (
        <img
          src="/assets/images/co2.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
          // style={{ width: "42px", height: "42px" }}
        />
      );
    }
  };

  return (
    <Fragment>
      <div className="product-large-image-wrapper space-mb--30">
        {/* floating badges */}
        <div className="product-large-image-wrapper__floating-badges">
          <Tooltip
            title={`${product?.productType}`}
            position="right"
            trigger="mouseenter"
            animation="shift"
            arrow={true}
            duration={200}
            distance={-10}
            offset={0}
            style={{ marginBottom: "10px" }}
          >
            {/* <span className="fivestar" style={{ background: "gray" }}>
                        <IoIosAdd style={{ width: "20px", height: "20px" }} />
                      </span> */}
            <div
              className="fivestar"
              style={{
                width: "50px",
                height: "50px",
                // border: "1px solid #e7e7e7",
                // borderRadius: "50%",
              }}
            >
              {conditionalImage(product?.productType)}
            </div>
          </Tooltip>
          {product.discount && product.discount > 0 ? (
            <Tooltip
              title="Discount"
              position="right"
              trigger="mouseenter"
              animation="shift"
              arrow={true}
              duration={200}
            >
              <span className="onsale">
                {product.discount}%
                {/* {Math.floor(100 - (discountedPrice * 100) / oldPrice)}% */}
                {/* {product.priceList[0].oldPrice}%{product.discount}% */}
              </span>
            </Tooltip>
          ) : (
            ""
          )}

          {/* {product.new ? <span className="hot">New</span> : ""} */}
          {product.tag.includes("new") ? (
            <Tooltip
              title="New Product"
              position="right"
              trigger="mouseenter"
              animation="shift"
              arrow={true}
              duration={200}
              style={{ marginTop: "15px" }}
            >
              <span
                className={`hot ${
                  product.tag?.includes("5star") ? "fivestar" : ""
                }`}
              >
                New
              </span>
            </Tooltip>
          ) : (
            ""
          )}
          {product.tag.includes("5star") ? (
            <Tooltip
              title="Star Product"
              position="right"
              trigger="mouseenter"
              animation="shift"
              arrow={true}
              duration={200}
              style={{ marginTop: "15px" }}
            >
              <span
                className="out-of-stock"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                }}
              >
                <img
                  src="/assets/images/star.png"
                  style={{ width: "30px", height: "30px" }}
                />
              </span>
            </Tooltip>
          ) : (
            ""
          )}
          {product.stock < 1 ? (
            <Tooltip
              title="Out of stock"
              position="right"
              trigger="mouseenter"
              animation="shift"
              arrow={true}
              duration={200}
              style={{ marginTop: "15px" }}
            >
              <span className="out-of-stock">out</span>
            </Tooltip>
          ) : (
            ""
          )}
        </div>

        {/* wishlist button */}
        <div className="product-details-button-wrapper">
          <Tooltip
            title={
              wishlistItem !== undefined
                ? "Added to wishlist"
                : "Add to wishlist"
            }
            position="left"
            trigger="mouseenter"
            animation="shift"
            arrow={true}
            duration={200}
          >
            <button
              onClick={
                wishlistItem !== undefined
                  ? () => deleteFromWishlist(product, addToast, wishlistItems)
                  : () => addToWishlist(product, addToast, wishlistItems)
              }
              className={`wishlist-icon ${
                wishlistItem !== undefined ? "active" : ""
              }`}
            >
              {wishlistItem !== undefined ? (
                <IoIosHeart />
              ) : (
                <IoIosHeartEmpty />
              )}
            </button>
          </Tooltip>
        </div>
        <LightgalleryProvider>
          <Swiper {...gallerySwiperParams}>
            {product.image &&
              product.image.map((image, i) => {
                return (
                  <div key={i}>
                    <LightgalleryItem group="any" src={image}>
                      <Tooltip
                        title="Click to enlarge"
                        position="left"
                        trigger="mouseenter"
                        animation="shift"
                        arrow={true}
                        duration={200}
                      >
                        <button className="enlarge-icon">
                          <IoMdExpand />
                        </button>
                      </Tooltip>
                    </LightgalleryItem>
                    <div className="single-image">
                      <img src={image} className="img-fluid" alt="" />
                    </div>
                  </div>
                );
              })}
          </Swiper>
        </LightgalleryProvider>
      </div>
      <div className="product-small-image-wrapper">
        <Swiper {...thumbnailSwiperParams}>
          {product.image &&
            product.image.map((image, i) => {
              return (
                <div key={i}>
                  <div className="single-image">
                    <img src={image} className="img-fluid" alt="" />
                  </div>
                </div>
              );
            })}
        </Swiper>
      </div>
    </Fragment>
  );
};

export default ImageGalleryBottomThumb;
