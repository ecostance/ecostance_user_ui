import regionPrice from "src/helpers/regionPrice";

// get products
export const getProducts = (products, category, type, limit) => {
  const finalProducts = products;

  // const finalProducts = category
  // 	? products.filter(
  // 			(product) =>
  // 				product?.category?.filter((single) => single === category)[0]
  // 	  )
  // 	: products;

  if (type && type === "new") {
    const newProducts = finalProducts.filter((single) => single.new);
    return newProducts.slice(0, limit ? limit : newProducts.length);
  }
  if (type && type === "popular") {
    return (
      finalProducts &&
      finalProducts
        .sort((a, b) => {
          return b.saleCount - a.saleCount;
        })
        .slice(0, limit ? limit : finalProducts.length)
    );
  }
  if (type && type === "topRated") {
    return (
      finalProducts &&
      finalProducts
        .sort((a, b) => {
          return b.rating - a.rating;
        })
        .slice(0, limit ? limit : finalProducts.length)
    );
  }
  if (type && type === "sale") {
    const saleItems =
      finalProducts &&
      finalProducts.filter((single) => single.discount && single.discount > 0);
    return saleItems.slice(0, limit ? limit : saleItems.length);
  }
  return (
    finalProducts &&
    finalProducts.slice(0, limit ? limit : finalProducts.length)
  );
};

// get product discount price
export const getDiscountPrice = (price, discount) => {
  const discountedPrice =
    discount && discount > 0 ? price - price * (discount / 100) : price;

  return Number(discountedPrice)?.toFixed(2);
};

// get product cart quantity
export const getProductCartQuantity = (cartItems, product, color, size) => {
  if (cartItems instanceof Array) {
    let productInCart = cartItems?.products?.filter(
      (single) =>
        single.id === product.id &&
        (single.selectedProductColor
          ? single.selectedProductColor === color
          : true) &&
        (single.selectedProductSize
          ? single.selectedProductSize === size
          : true)
    )[0];
    if (cartItems?.products?.length >= 1 && productInCart) {
      if (product.variation) {
        return cartItems?.products?.filter(
          (single) =>
            single.id === product.id &&
            single.selectedProductColor === color &&
            single.selectedProductSize === size
        )[0].quantity;
      } else {
        return cartItems?.products?.filter(
          (single) => product.id === single.id
        )[0].quantity;
      }
    } else {
      return 0;
    }
  }
};

//get products based on category
export const getSortedProducts = (products, sortType, sortValue, userData) => {
  if (products && sortType && sortValue) {
    if (sortType === "sdgs") {
      const newProducts = {};

      products.map((product) => {
        product?.details?.sdgs?.forEach((sdg) => {
          if (sdg?.sdg?._id === sortValue) {
            newProducts[product._id] = product;
          }
        });
      });
      return Object.values(newProducts);
    }
    if (sortType === "countries") {
      const newProducts = [];

      products.map((product) => {
        product.country === sortValue && newProducts.push(product);
      });
      return newProducts;
    }
    if (sortType === "category") {
      return products.filter(
        (product) =>
          product.categoryList.filter(
            (single) => single.category === sortValue
          )[0]
      );
    }
    if (sortType === "tag") {
      return products.filter(
        (product) => product.tag.filter((single) => single === sortValue)[0]
      );
    }
    if (sortType === "color") {
      return products.filter(
        (product) =>
          product.variation &&
          product.variation.filter((single) => single.color === sortValue)[0]
      );
    }

    if (sortType === "size") {
      return products.filter(
        (product) =>
          product.variation &&
          product.variation.filter(
            (single) =>
              single.size.filter((single) => single.name === sortValue)[0]
          )[0]
      );
    }
    if (sortType === "filterSort") {
      let sortProducts = [...products];
      if (sortValue === "default") {
        return sortProducts;
      }
      if (sortValue === "priceHighToLow") {
        return sortProducts.sort((a, b) => {
          const regionPricingA = regionPrice(a, userData);
          const regionPricingB = regionPrice(b, userData);

          return regionPricingB?.productPrice - regionPricingA?.productPrice;
        });
      }
      if (sortValue === "priceLowToHigh") {
        return sortProducts.sort((a, b) => {
          const regionPricingA = regionPrice(a, userData);
          const regionPricingB = regionPrice(b, userData);
          return regionPricingA?.productPrice - regionPricingB?.productPrice;
        });
      }
    }
  }
  return products;
};

// get individual element
const getIndividualItemArray = (array) => {
  let individualItemArray = array.filter((v, i, self) => i === self.indexOf(v));
  return individualItemArray;
};

// get individual element object
const getIndividualCountryArray = (array) => {
  const uniqueVals = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  return array.filter(uniqueVals);
};

const getIndividualColorObjectArray = (array) => {
  let individualObjectArray = array.filter((v, i, self) => {
    return (
      i ===
      self.findIndex(
        (t) => t.colorName === v.colorName && t.colorCode === v.colorCode
      )
    );
  });
  return individualObjectArray;
};

// get individual categories
export const getIndividualCategories = (products) => {
  let productCategories = [];
  products &&
    products.map((product) => {
      return (
        product?.categoryList &&
        product?.categoryList?.map((single) => {
          return productCategories.push(single.category);
        })
      );
    });
  const individualProductCategories = getIndividualItemArray(productCategories);
  return individualProductCategories;
};

export const getIndividualSDGS = (products) => {
  let productCategories = [];
  const checkSDGS = {};
  products &&
    products.map((product) => {
      product?.details?.sdgs &&
        product?.details?.sdgs?.map((single) => {
          if (!checkSDGS[single?.sdg?._id]) {
            productCategories.push(single);
            checkSDGS[single?.sdg?._id] = true;
          }
        });
    });

  return productCategories;
};

// get individual tags
export const getIndividualTags = (products) => {
  let productTags = [];
  products &&
    products.map((product) => {
      if (product.tag.length > 0) {
        product.tag.map((single) => {
          single.length > 0 && productTags.push(single);
        });
      }
    });
  const individualProductTags = getIndividualItemArray(productTags);
  return individualProductTags;
};

export const getIndividualCountry = (products) => {
  let productCountry = [];
  products &&
    products.map((product) => {
      product.country.length > 0 && productCountry.push(product.country);
    });

  const individualCountries = getIndividualCountryArray(productCountry);
  return individualCountries;
};

// get individual colors
export const getIndividualColors = (products) => {
  let productColors = [];
  products &&
    products.map((product) => {
      return (
        product.variation &&
        product?.variation?.map((single) => {
          return productColors.push({
            colorName: single?.color,
            colorCode: single?.colorCode,
          });
        })
      );
    });
  const individualProductColors = getIndividualColorObjectArray(productColors);
  return individualProductColors;
};

// get individual sizes
export const getProductsIndividualSizes = (products) => {
  let productSizes = [];
  products &&
    products.map((product) => {
      return (
        product.variation &&
        product.variation.map((single) => {
          return single.size.map((single) => {
            return productSizes.push(single.name);
          });
        })
      );
    });
  const individualProductSizes = getIndividualItemArray(productSizes);
  return individualProductSizes;
};

// get product individual sizes
export const getIndividualSizes = (product) => {
  let productSizes = [];
  product.variation &&
    product.variation.map((singleVariation) => {
      return (
        singleVariation.size &&
        singleVariation.size.map((singleSize) => {
          return productSizes.push(singleSize.name);
        })
      );
    });
  const individualSizes = getIndividualItemArray(productSizes);
  return individualSizes;
};

export const setActiveSort = (e) => {
  const filterButtons = document.querySelectorAll(
    ".single-sidebar-widget__list button, .tag-container button, .single-filter-widget__list button"
  );
  filterButtons.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const setActiveLayout = (e) => {
  const gridSwitchBtn = document.querySelectorAll(".grid-icons button");
  gridSwitchBtn.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};
