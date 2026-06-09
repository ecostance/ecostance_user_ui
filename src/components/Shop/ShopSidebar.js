import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import {
  getIndividualCategories,
  getIndividualColors,
  getIndividualTags,
  setActiveSort,
  getProducts,
  getDiscountPrice,
  getIndividualSDGS,
} from "../../lib/product";
import { ProductRating } from "../Product";
import router from "next/router";
import regionPrice from "src/helpers/regionPrice";
import formatCurrency from "src/helpers/formatCurrency";

const ShopSidebar = ({
  products,
  getSortParams,
  userData,
  selectedSdg,
  setSelectedSdg,
}) => {
  const categories = getIndividualCategories(products);
  const colors = getIndividualColors(products);
  const tags = getIndividualTags(products);
  const sdgs = getIndividualSDGS(products);
  const popularProducts = getProducts(products, "decor", "popular", 3);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    router.push(`${process.env.NEXT_PUBLIC_UI_URL}/shop/search/${searchText}`);
  };

  return (
    <div className="shop-sidebar">
      <div className="single-sidebar-widget space-mb--40">
        {/* search widget */}
        <div className="search-widget">
          <form>
            <input
              style={{ display: "none" }}
              type="search"
              placeholder="Search products ..."
            />
            <input
              onKeyDown={(e) => e.keyCode === 13 && handleSearch()}
              onChange={(e) => setSearchText(e.target.value)}
              type="search"
              placeholder="Search Products ..."
            />
            <button type="button">
              <IoIosSearch />
            </button>
          </form>
        </div>
      </div>

      {/* category list */}
      <div className="single-sidebar-widget space-mb--40">
        <h2 className="single-sidebar-widget__title space-mb--30">
          Categories
        </h2>
        {categories.length > 0 ? (
          <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
            <li>
              <button
                onClick={(e) => {
                  getSortParams("category", "");
                  setActiveSort(e);
                }}
                className="active"
              >
                All categories
              </button>
            </li>
            {categories.map((category, i) => {
              return (
                <li key={i}>
                  <button
                    onClick={(e) => {
                      getSortParams("category", category);
                      setActiveSort(e);
                    }}
                  >
                    {category}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          "No categories found"
        )}
      </div>

      {/* color list */}
      <div className="single-sidebar-widget space-mb--40">
        <h2 className="single-sidebar-widget__title space-mb--30">Sdgs</h2>
        {sdgs.length > 0 ? (
          <ul className="single-sidebar-widget__list single-sidebar-widget__list--color">
            <div
              className="d-flex flex-wrap align-items-center"
              style={{ gap: "10px" }}
            >
              {sdgs.map((sdg, index) => {
                return (
                  <li key={index} style={{ marginRight: "0px " }}>
                    {/* the div below used to be a button */}
                    <div
                      onClick={(e) => {
                        getSortParams("sdgs", sdg?.sdg?._id);
                        setActiveSort(e);
                        setSelectedSdg(sdg?.sdg?.name);
                      }}
                      style={{
                        cursor: "pointer",
                        border:
                          selectedSdg === sdg?.sdg?.name
                            ? "2px solid #e7e7e7"
                            : "2px solid white",
                        padding: "2px",
                      }}
                      // style={{ backgroundColor: color.colorCode }}
                    >
                      <img style={{ maxWidth: "40px" }} src={sdg?.sdg?.image} />
                    </div>
                  </li>
                );
              })}
              <li className="d-flex align-items-center">
                <button
                  style={{ marginBottom: "0px" }}
                  onClick={(e) => {
                    getSortParams("sdgs", "");
                    setActiveSort(e);
                    setSelectedSdg("");
                  }}
                >
                  x
                </button>
              </li>
            </div>
          </ul>
        ) : (
          "No colors found"
        )}
      </div>

      {/* popular products */}
      <div className="single-sidebar-widget space-mb--40">
        <h2 className="single-sidebar-widget__title space-mb--30">
          Popular products
        </h2>
        {popularProducts.length > 0 ? (
          <div className="widget-product-wrapper">
            {popularProducts.map((product, i) => {
              const regionPricing = regionPrice(product, userData);

              const productPrice = regionPricing?.productPrice;
              const currencySymbol = regionPricing?.currencySymbol;
              const oldPrice = regionPricing?.oldPrice;
              const currencyCode = regionPricing?.currencyCode;
              const discount = product?.discount;

              const discountedPrice = regionPricing?.productPrice;
              return (
                <div className="single-widget-product-wrapper" key={i}>
                  <div className="single-widget-product">
                    <div className="single-widget-product__image">
                      <Link
                        href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                        as={
                          process.env.PUBLIC_URL +
                          "/shop/product-basic/" +
                          product.slug
                        }
                      >
                        <a className="image-wrap">
                          <img
                            src={product.thumbImage[0]}
                            className="img-fluid"
                            alt={product.name}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="single-widget-product__content">
                      <div className="single-widget-product__content__top">
                        <h3 className="product-title space-mb--10">
                          <Link
                            href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                            as={
                              process.env.PUBLIC_URL +
                              "/shop/product-basic/" +
                              product.slug
                            }
                          >
                            <a>{product.name}</a>
                          </Link>
                        </h3>
                        <div className="price space-mb--10">
                          <span
                            className="discounted-price"
                            style={{ marginRight: "5px" }}
                          >
                            {currencyCode}
                          </span>
                          {discount > 0 ? (
                            <Fragment>
                              <span className="main-price discounted">
                                {currencySymbol}
                                {formatCurrency(oldPrice, currencyCode)}
                              </span>
                              <span
                                style={{ fontSize: "12px", marginRight: "5px" }}
                              >
                                /
                              </span>
                              <span className="discounted-price">
                                {currencySymbol}
                                {formatCurrency(discountedPrice, currencyCode)}
                              </span>
                            </Fragment>
                          ) : (
                            <span className="main-price">
                              {currencySymbol}
                              {formatCurrency(productPrice, currencyCode)}
                            </span>
                          )}
                        </div>
                        <div className="rating">
                          <ProductRating ratingValue={product.avgRating} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          "No products found"
        )}
      </div>

      {/* tag list */}
      <div className="single-sidebar-widget">
        <h2 className="single-sidebar-widget__title space-mb--30">Tags</h2>
        {tags.length > 0 ? (
          <div className="tag-container">
            {tags.map((tag, i) => {
              return (
                <button
                  key={i}
                  onClick={(e) => {
                    getSortParams("tag", tag);
                    setActiveSort(e);
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        ) : (
          "No tags found"
        )}
      </div>
    </div>
  );
};

export default ShopSidebar;
