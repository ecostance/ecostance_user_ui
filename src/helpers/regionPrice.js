const regionPrice = (product, userData) => {
  // if (typeof product?.priceList !== "object") {
  //   return {
  //     productPrice: productPrice?.toFixed(2) || 0,
  //     currencySymbol: currencySymbol || "$",
  //     oldPrice: oldPrice?.toFixed(2) || 0,
  //   };
  // }
  // console.log(product, "here is product");
  let productPrice;
  let currencySymbol;
  let oldPrice;
  let currencyCode;
  product?.priceList?.forEach((each) => {
    if (userData?.currency?.toLowerCase() === each?.currency?.toLowerCase()) {
      productPrice = each?.price;
      currencySymbol = each.currencySymbol;
      oldPrice = each?.oldPrice;
      currencyCode = each?.currency;
    }
  });

  if (!productPrice) {
    try {
      productPrice = product?.priceList[0]?.price * 1;
      oldPrice = product?.priceList[0]?.oldPrice * 1;
    } catch (err) {
      console.log("here is error", product);
    }
    currencySymbol = "$";
    currencyCode = "USD";
  }
  // console.log("inside region price", productPrice, currencySymbol);

  return {
    productPrice: productPrice?.toFixed(2) || 0,
    currencySymbol,
    oldPrice: oldPrice?.toFixed(2) || 0,
    currencyCode,
  };
};

export default regionPrice;
