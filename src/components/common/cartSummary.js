import React from "react";
import { useEffect } from "react";
import formatCurrency from "src/helpers/formatCurrency";
import regionPrice from "src/helpers/regionPrice";
import CurrencyOption from "../Stripe/currencyOption";

const CartSummary = ({
  cartItems,
  localTotalQuantity,
  localTotal,
  currencyCode,
  setLocalTotalQuantity,
  setLocalTotal,
  setCurrencyCode,
  getCouponText,
  addCoupon,
  saveCoupon,
  couponCode,
  addAPIDataToCart,
  express,
  updateCartForCurrency,
  setUserCurrencyForce,
  setShowCurrencyOverlay,
  setUserCurrencyPreference,
  setCartCurrency,
  userData,
  currencySymbol,
  addExpressPriceData,
  handleShowCurrency,
  showCurrencyOverlay,
  showChangeCurrency,
  setCurrencyChangeInProgress,
  isModuleOrder = false, // Add this new prop
}) => {
  // Debug: Log cart data received
  console.log("=== CARTSUMMARY DEBUGGING ===");
  console.log("cartItems received:", cartItems);
  console.log("localTotal received:", localTotal);
  console.log("localTotalQuantity received:", localTotalQuantity);
  console.log("isModuleOrder:", isModuleOrder);
  console.log("moduleProducts:", cartItems?.moduleProducts);
  console.log("products:", cartItems?.products);
  
  const items = cartItems?.moduleProducts?.length
    ? cartItems.moduleProducts
    : (cartItems?.products || []);

  // Determine the active currency: temporaryCheckoutCurrency > checkoutDefaultCurrency > USD
  const activeCurrency = cartItems?.currency || userData?.currency || "USD";

  // Helper to find the price entry matching the active currency from any price list
  const findPriceEntry = (priceList, currency) => {
    if (!priceList || !Array.isArray(priceList) || priceList.length === 0) return null;
    return priceList.find(p => p?.currency?.toLowerCase() === currency?.toLowerCase()) || priceList[0];
  };

  const getCurrencySymbolForCode = (currency) => {
    const map = { USD: "$", CAD: "$", GBP: "£", EUR: "€", INR: "₹", JPY: "¥", CNY: "¥" };
    return map[currency] || "$";
  };

  // Override currencySymbol prop with the correct symbol for the active currency
  currencySymbol = getCurrencySymbolForCode(activeCurrency);

  // Function to calculate module breakdown for display
  const getModuleBreakdown = () => {
    if (!isModuleOrder || !cartItems?.moduleProducts || !Array.isArray(cartItems.moduleProducts)) {
      return null;
    }

    let totalModuleCost = 0;
    let totalAdditionalCostMonthly = 0;
    let totalMaintenanceCostMonthly = 0;

    // Get one-time fee from cart or localStorage
    let oneTimeFee = cartItems?.oneTimeFee || 0;
    if (!oneTimeFee) {
      const storedFee = typeof window !== 'undefined' ? localStorage.getItem('dynamicPricingOneTimeFee') : null;
      oneTimeFee = storedFee ? parseFloat(storedFee) : 0;
    }

    // Get discount data from cart or localStorage
    let discountValue = cartItems?.moduleDiscount || cartItems?.discount || 0;
    let discountType = cartItems?.discountType || "percentage";
    if (!discountValue && typeof window !== 'undefined') {
      const storedDiscount = localStorage.getItem('dynamicPricingDiscount');
      const storedDiscountType = localStorage.getItem('dynamicPricingDiscountType');
      discountValue = storedDiscount ? parseFloat(storedDiscount) : 0;
      discountType = storedDiscountType || "percentage";
    }

    cartItems.moduleProducts.forEach((item) => {
      // Calculate main module cost
      if (item.quantity > 0) {
        const mainPrice = item.mainPrice || item.price || 0;
        totalModuleCost += mainPrice * item.quantity;
      }

      // Calculate additional units cost (monthly)
      if (item.additionalUnit > 0) {
        const additionalPrice = item.additionalPrice || item.price || 0;
        totalAdditionalCostMonthly += additionalPrice * item.additionalUnit;
      }

      // Calculate maintenance cost (monthly)
      if (item.quantity > 0) {
        // Prefer explicit maintenancePrice, otherwise fallback to product.priceList (monthly maintenance)
        let maintenance = 0;
        if (item.maintenancePrice && item.maintenancePrice > 0) {
          maintenance = item.maintenancePrice;
        } else if (item.product && typeof item.product === 'object' && Array.isArray(item.product.priceList) && item.product.priceList.length > 0) {
          const maintEntry = findPriceEntry(item.product.priceList, activeCurrency);
          maintenance = maintEntry?.price || 0;
        }
        totalMaintenanceCostMonthly += maintenance * item.quantity;
      }
    });

    const paymentPlan =
      typeof window !== "undefined"
        ? localStorage.getItem("dynamicPricingPaymentPlan") || "full"
        : "full";
    const isMonthlyPlan = paymentPlan === "monthly";
    const monthlyRecurring =
      totalAdditionalCostMonthly + totalMaintenanceCostMonthly;

    // Calculate subtotal before discount based on selected plan
    const subtotalOneTime = isMonthlyPlan
      ? totalModuleCost + monthlyRecurring + oneTimeFee
      : totalModuleCost + monthlyRecurring * 12 + oneTimeFee;

    // Calculate discount amount
    let discountAmount = 0;
    if (discountValue > 0) {
      if (discountType === "percentage") {
        discountAmount = (subtotalOneTime * discountValue) / 100;
      } else {
        discountAmount = Math.min(discountValue, subtotalOneTime);
      }
    }

    const grandTotal = Math.max(0, subtotalOneTime - discountAmount);

    return {
      totalModuleCost,
      totalAdditionalCostMonthly,
      totalMaintenanceCostMonthly,
      totalAdditionalCostYearly: totalAdditionalCostMonthly * 12,
      totalMaintenanceCostYearly: totalMaintenanceCostMonthly * 12,
      oneTimeFee: oneTimeFee,
      discount: discountValue,
      discountType: discountType,
      discountAmount: discountAmount,
      subtotalBeforeDiscount: subtotalOneTime,
      grandTotalOneTime: grandTotal,
      grandTotalCurrentMonth:
        totalModuleCost + monthlyRecurring + oneTimeFee - discountAmount,
      isMonthlyPlan,
      monthlyRecurring,
      payToday: grandTotal,
      monthlyAfter: isMonthlyPlan ? monthlyRecurring : 0,
      remainingMonths: isMonthlyPlan ? 11 : 0,
    };
  };
  
  if (cartItems?.moduleProducts && cartItems.moduleProducts.length > 0) {
    console.log("First module product:", cartItems.moduleProducts[0]);
    console.log("First module product price:", cartItems.moduleProducts[0]?.price);
    console.log("First module product product object:", cartItems.moduleProducts[0]?.product);
    if (cartItems.moduleProducts[0]?.product) {
      console.log("First module product priceList:", cartItems.moduleProducts[0].product.priceList);
      console.log("First module product priceListAdditional:", cartItems.moduleProducts[0].product.priceListAdditional);
    }
  }
  
  // Handle both old and new cart structures
  let componentTotalPrice = 0;
  let componentTotalQuantity =
    cartItems?.useHiddenProducts && express
      ? cartItems?.hiddenProducts?.[0]?.cartData?.quantity
      : 0;

  // Calculate totals for all items first
  if (cartItems?.moduleProducts || cartItems?.products) {
    const items = cartItems?.moduleProducts?.length
      ? cartItems.moduleProducts
      : (cartItems?.products || []);
    
    items.forEach((item, i) => {
            // For module products, the product field is now a full object with pricing arrays
            let product = item?.product;
            let productPrice = 0;
            let productCurrency = "USD";
            let productCurrencySymbol = "$";
            let productName = item?.name || "Product";
            
            // Check if product is a full object with pricing arrays
            if (product && typeof product === 'object' && product.priceList) {
              // Product is a full object with pricing arrays
              // First check for startupPriceList (one-time startup cost)
              if (product.startupPriceList && Array.isArray(product.startupPriceList) && product.startupPriceList.length > 0) {
                // Use the startup price (one-time cost) for the active currency
                const startupEntry = findPriceEntry(product.startupPriceList, activeCurrency);
                productPrice = startupEntry?.price || 0;
                productCurrency = startupEntry?.currency || activeCurrency;
                productCurrencySymbol = startupEntry?.currencySymbol || getCurrencySymbolForCode(productCurrency);
                productName = product?.name || item?.name || "Product";
                console.log(`Using startupPriceList pricing: ${productPrice} ${productCurrency}`);
              } else if (product.priceList && Array.isArray(product.priceList) && product.priceList.length > 0) {
                // Use regionPrice to find the correct price for the active currency
                const regionPricing = regionPrice(product, { currency: activeCurrency });
                productPrice = parseFloat(regionPricing?.productPrice) || 0;
                productCurrency = regionPricing?.currencyCode || activeCurrency;
                productCurrencySymbol = regionPricing?.currencySymbol || getCurrencySymbolForCode(productCurrency);
                productName = product?.name || item?.name || "Product";
                console.log(`Using priceList pricing: ${productPrice} ${productCurrency}`);
              } else if (product.priceListAdditional && Array.isArray(product.priceListAdditional) && product.priceListAdditional.length > 0) {
                // Use the price for the active currency from priceListAdditional
                const additionalEntry = findPriceEntry(product.priceListAdditional, activeCurrency);
                productPrice = additionalEntry?.price || 0;
                productCurrency = additionalEntry?.currency || activeCurrency;
                productCurrencySymbol = additionalEntry?.currencySymbol || getCurrencySymbolForCode(productCurrency);
                productName = product?.name || item?.name || "Product";
                console.log(`Using priceListAdditional pricing: ${productPrice} ${productCurrency}`);
              } else {
                // Try to use regionPrice as fallback
                try {
                  const regionPricing = regionPrice(product, {
                    currency: activeCurrency,
                  });

                  productPrice = parseFloat(regionPricing?.productPrice) || 0;
                  productCurrency = regionPricing.currencyCode || activeCurrency;
                  productCurrencySymbol = regionPricing.currencySymbol || getCurrencySymbolForCode(activeCurrency);
                  productName = product?.name || item?.name || "Product";
                  console.log(`Using regionPrice fallback: ${productPrice} ${productCurrency}`);
                } catch (error) {
                  console.warn("Error getting region pricing:", error);
                  // Fallback to stored pricing if available
                  productPrice = item?.price || 0;
                  productCurrency = item?.currency || activeCurrency;
                  productCurrencySymbol = item?.currencySymbol || getCurrencySymbolForCode(activeCurrency);
                  productName = item?.name || product?.name || "Product";
                  console.log(`Using stored pricing fallback: ${productPrice} ${productCurrency}`);
                }
              }
            } else {
              // Product is just an ID or doesn't have pricing arrays
              // Use the item's stored price information
              productPrice = item?.price || 0;
              productCurrency = item?.currency || activeCurrency;
              productCurrencySymbol = item?.currencySymbol || getCurrencySymbolForCode(activeCurrency);
              productName = item?.name || "Product";

              // Create a minimal product object for display
              product = {
                _id: item?.product || item?.productId,
                name: productName,
                thumbImage: item?.thumbImage || [],
                slug: item?.slug || ""
              };
            }

            // Ensure we have valid pricing - prioritize stored pricing from the item
            if (item?.price && item.price > 0) {
              productPrice = item.price;
            }
            if (item?.currency) {
              productCurrency = item.currency;
            }
            if (item?.currencySymbol) {
              productCurrencySymbol = item.currencySymbol;
            }

            const itemQuantity = item?.quantity || 1;
            const additionalUnits = item?.additionalUnit || 0;
            const totalItemQuantity = itemQuantity + additionalUnits;
            
            // Calculate totals for this item with proper pricing
            let mainModuleTotal = 0;
            let additionalUnitsTotal = 0;
            let maintenanceCost = 0;
            
            if (itemQuantity > 0) {
              // For main modules, use the main price from the item if available
              if (item?.mainPrice && item.mainPrice > 0) {
                mainModuleTotal = item.mainPrice * itemQuantity;
                console.log(`[TOTALS] Using item mainPrice: ${item.mainPrice} × ${itemQuantity} = ${mainModuleTotal} for ${productName}`);
              } else {
                // Fallback to product price
                mainModuleTotal = productPrice * itemQuantity;
                console.log(`[TOTALS] Using product price fallback: ${productPrice} × ${itemQuantity} = ${mainModuleTotal} for ${productName}`);
              }
            }
            
            if (additionalUnits > 0) {
              // For additional units, use the additional price from the item if available
              if (item?.additionalPrice && item.additionalPrice > 0) {
                additionalUnitsTotal = item.additionalPrice * additionalUnits;
                console.log(`[TOTALS] Using item additionalPrice: ${item.additionalPrice} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              } else if (product && product.priceListAdditional && Array.isArray(product.priceListAdditional) && product.priceListAdditional.length > 0) {
                // Use the additional units price list for the active currency
                const addEntry = findPriceEntry(product.priceListAdditional, activeCurrency);
                const additionalUnitPrice = addEntry?.price || 0;
                additionalUnitsTotal = additionalUnitPrice * additionalUnits;
                console.log(`[TOTALS] Using product priceListAdditional: ${additionalUnitPrice} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              } else if (item?.price && item.price > 0) {
                // Use the stored price from the item as fallback
                additionalUnitsTotal = item.price * additionalUnits;
                console.log(`[TOTALS] Using stored item price fallback: ${item.price} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              } else {
                // Last resort fallback
                additionalUnitsTotal = productPrice * additionalUnits;
                console.log(`[TOTALS] Using product price last resort: ${productPrice} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              }
            }
            
            // Calculate maintenance cost for modules only (not regular products)
            if (isModuleOrder && itemQuantity > 0) {
              // PRIORITIZE item.maintenancePrice - this is the correct value set by selectfields.js
              if (item?.maintenancePrice && item.maintenancePrice > 0) {
                // Use stored maintenance price if available
                maintenanceCost = item.maintenancePrice;
                console.log(`[TOTALS] Using item maintenancePrice: ${maintenanceCost} for ${productName}`);
              } else if (product && typeof product === 'object' && Array.isArray(product.priceList) && product.priceList.length > 0) {
                // Fallback to monthly maintenance from product.priceList for active currency
                const maintEntry = findPriceEntry(product.priceList, activeCurrency);
                maintenanceCost = maintEntry?.price || 0;
                console.log(`[TOTALS] Using product.priceList for maintenance: ${maintenanceCost} for ${productName}`);
              } else {
                maintenanceCost = 0;
                console.log(`[TOTALS] No maintenance price found for ${productName}`);
              }
            }
            
            // For one-time payment calculation, multiply monthly costs by 12
            const monthlyTotal = additionalUnitsTotal + maintenanceCost;
            const itemTotal = mainModuleTotal + (monthlyTotal * 12);

            componentTotalPrice += itemTotal;
            componentTotalQuantity += totalItemQuantity;

            console.log(`CartSummary item ${productName}: main=${mainModuleTotal}, additional=${additionalUnitsTotal}, maintenance=${maintenanceCost}, monthly×12=${monthlyTotal * 12}, total=${itemTotal}`);
            console.log(`Running totals: componentTotalPrice=${componentTotalPrice}, componentTotalQuantity=${componentTotalQuantity}`);
    });
            
    // Set the totals after calculating all items
              console.log(`Final totals calculated: componentTotalPrice=${componentTotalPrice}, componentTotalQuantity=${componentTotalQuantity}`);
              console.log(`Setting localTotal to: ${componentTotalPrice}`);
              console.log(`Setting localTotalQuantity to: ${componentTotalQuantity}`);
              
    // Use useEffect to update state after calculation
    // Always update when componentTotalPrice changes or currency changes
    useEffect(() => {
      if (componentTotalPrice > 0) {
        setLocalTotal(componentTotalPrice);
      }

      if (componentTotalQuantity > 0) {
        setLocalTotalQuantity(componentTotalQuantity);
      }

      setCurrencyCode(activeCurrency);
    }, [items.length, cartItems?.currency, showChangeCurrency]); // React to currency changes
  }

  useEffect(() => {
    console.log(
      {
        componentTotalPrice,
        componentTotalQuantity,
        express,
        localTotal,
        localTotalQuantity
      },
      "component price"
    );
  }, [componentTotalPrice, componentTotalQuantity, express, localTotal, localTotalQuantity]);

  return (
    <div className="checkout-cart-total">
      <div className="checkout-cart-total-main">
        <h4>
          Product <span>Total</span>
        </h4>
        <ul>
          {items.map((item, i) => {
            // For module products, the product field is now a full object with pricing arrays
            let product = item?.product;
            let productPrice = 0;
            let productCurrency = "USD";
            let productCurrencySymbol = "$";
            let productName = item?.name || "Product";
            
            // Check if product is a full object with pricing arrays
            if (product && typeof product === 'object' && product.priceList) {
              // Product is a full object with pricing arrays
              // First check for startupPriceList (one-time startup cost)
              if (product.startupPriceList && Array.isArray(product.startupPriceList) && product.startupPriceList.length > 0) {
                // Use the startup price (one-time cost) for the active currency
                const startupEntry = findPriceEntry(product.startupPriceList, activeCurrency);
                productPrice = startupEntry?.price || 0;
                productCurrency = startupEntry?.currency || activeCurrency;
                productCurrencySymbol = startupEntry?.currencySymbol || getCurrencySymbolForCode(productCurrency);
                productName = product?.name || item?.name || "Product";
              } else if (product.priceList && Array.isArray(product.priceList) && product.priceList.length > 0) {
                // Use regionPrice to find the correct price for the active currency
                const regionPricing = regionPrice(product, { currency: activeCurrency });
                productPrice = parseFloat(regionPricing?.productPrice) || 0;
                productCurrency = regionPricing?.currencyCode || activeCurrency;
                productCurrencySymbol = regionPricing?.currencySymbol || getCurrencySymbolForCode(productCurrency);
                productName = product?.name || item?.name || "Product";
              } else if (product.priceListAdditional && Array.isArray(product.priceListAdditional) && product.priceListAdditional.length > 0) {
                // Use the price for the active currency from priceListAdditional
                const additionalEntry = findPriceEntry(product.priceListAdditional, activeCurrency);
                productPrice = additionalEntry?.price || 0;
                productCurrency = additionalEntry?.currency || activeCurrency;
                productCurrencySymbol = additionalEntry?.currencySymbol || getCurrencySymbolForCode(productCurrency);
                productName = product?.name || item?.name || "Product";
              } else {
                // Fallback to stored pricing if available
                productPrice = item?.price || 0;
                productCurrency = item?.currency || activeCurrency;
                productCurrencySymbol = item?.currencySymbol || getCurrencySymbolForCode(activeCurrency);
                productName = item?.name || product?.name || "Product";
              }
            } else {
              // Product is just an ID or doesn't have pricing arrays
              // Use the item's stored price information
              productPrice = item?.price || 0;
              productCurrency = item?.currency || activeCurrency;
              productCurrencySymbol = item?.currencySymbol || getCurrencySymbolForCode(activeCurrency);
              productName = item?.name || "Product";

              // Create a minimal product object for display
              product = {
                _id: item?.product || item?.productId,
                name: productName,
                thumbImage: item?.thumbImage || [],
                slug: item?.slug || ""
              };
            }

            // Ensure we have valid pricing - prioritize stored pricing from the item
            if (item?.price && item.price > 0) {
              productPrice = item.price;
            }
            if (item?.currency) {
              productCurrency = item.currency;
            }
            if (item?.currencySymbol) {
              productCurrencySymbol = item.currencySymbol;
            }

            const itemQuantity = item?.quantity || 1;
            const additionalUnits = item?.additionalUnit || 0;
            
            // Calculate totals for this item with proper pricing (same logic as above)
            let mainModuleTotal = 0;
            let additionalUnitsTotal = 0;
            let maintenanceCost = 0;
            
            if (itemQuantity > 0) {
              // For main modules, use the main price from the item if available
              if (item?.mainPrice && item.mainPrice > 0) {
                mainModuleTotal = item.mainPrice * itemQuantity;
                console.log(`[DISPLAY] Using item mainPrice: ${item.mainPrice} × ${itemQuantity} = ${mainModuleTotal} for ${productName}`);
              } else {
                // Fallback to product price
                mainModuleTotal = productPrice * itemQuantity;
                console.log(`[DISPLAY] Using product price fallback: ${productPrice} × ${itemQuantity} = ${mainModuleTotal} for ${productName}`);
              }
            }
            
            if (additionalUnits > 0) {
              // For additional units, use the additional price from the item if available
              if (item?.additionalPrice && item.additionalPrice > 0) {
                additionalUnitsTotal = item.additionalPrice * additionalUnits;
                console.log(`[DISPLAY] Using item additionalPrice: ${item.additionalPrice} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              } else if (product && product.priceListAdditional && Array.isArray(product.priceListAdditional) && product.priceListAdditional.length > 0) {
                // Use the additional units price list for the active currency
                const addEntry = findPriceEntry(product.priceListAdditional, activeCurrency);
                const additionalUnitPrice = addEntry?.price || 0;
                additionalUnitsTotal = additionalUnitPrice * additionalUnits;
                console.log(`[DISPLAY] Using product priceListAdditional: ${additionalUnitPrice} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              } else if (item?.price && item.price > 0) {
                // Use the stored price from the item as fallback
                additionalUnitsTotal = item.price * additionalUnits;
                console.log(`[DISPLAY] Using stored item price fallback: ${item.price} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              } else {
                // Last resort fallback
                additionalUnitsTotal = productPrice * additionalUnits;
                console.log(`[DISPLAY] Using product price last resort: ${productPrice} × ${additionalUnits} = ${additionalUnitsTotal} for ${productName}`);
              }
            }
            
            // Calculate maintenance cost only for module orders
            if (isModuleOrder && itemQuantity > 0) {
              // PRIORITIZE item.maintenancePrice - this is the correct value set by selectfields.js
              if (item?.maintenancePrice && item.maintenancePrice > 0) {
                // Use stored maintenance price if available
                maintenanceCost = item.maintenancePrice;
                console.log(`[DISPLAY] Using item maintenancePrice: ${maintenanceCost} for ${productName}`);
              } else if (product && typeof product === 'object' && Array.isArray(product.priceList) && product.priceList.length > 0) {
                // Fallback to monthly maintenance from product.priceList for active currency
                const maintEntry = findPriceEntry(product.priceList, activeCurrency);
                maintenanceCost = maintEntry?.price || 0;
                console.log(`[DISPLAY] Using product.priceList for maintenance: ${maintenanceCost} for ${productName}`);
              } else {
                // Fallback: no maintenance cost
                maintenanceCost = 0;
                console.log(`[DISPLAY] No maintenance price found for ${productName}`);
              }
            } else {
              maintenanceCost = 0;
            }
            
            console.log(`[DISPLAY] Item ${productName}: main=${mainModuleTotal}, additional=${additionalUnitsTotal}, maintenance=${maintenanceCost}, total=${mainModuleTotal + additionalUnitsTotal + maintenanceCost}`);

            return (
              <li key={i} className={isModuleOrder ? "module-order-item" : ""}>
                {/* Main module line */}
                {itemQuantity > 0 && (
                  <div className="cart-item-row">
                    <span className="cart-item-name">{productName} x{itemQuantity}</span>
                    <span className="cart-item-price">
                      {productCurrency} {productCurrencySymbol}
                      {formatCurrency(
                        mainModuleTotal.toFixed(2),
                        productCurrency
                      )}
                    </span>
                  </div>
                )}

                {/* Additional units line - show 12 months total for module orders */}
                {additionalUnits > 0 && (
                  <div className="cart-item-row cart-item-subrow">
                    {isModuleOrder ? (
                      <>
                        <span className="cart-item-name">Add. Users × {additionalUnits} ({productCurrencySymbol}{(additionalUnitsTotal).toFixed(2)}/mo × 12)</span>
                        <span className="cart-item-price">{productCurrency} {productCurrencySymbol}{formatCurrency((additionalUnitsTotal * 12).toFixed(2), productCurrency)}</span>
                      </>
                    ) : (
                      <>
                        <span className="cart-item-name">Additional {productName} × {additionalUnits}</span>
                        <span className="cart-item-price">{productCurrency} {productCurrencySymbol}{formatCurrency(additionalUnitsTotal.toFixed(2), productCurrency)}</span>
                      </>
                    )}
                  </div>
                )}
                {/* Monthly Maintenance line (module orders only) - show 12 months total */}
                {isModuleOrder && maintenanceCost > 0 && (
                  <div className="cart-item-row cart-item-subrow">
                    <span className="cart-item-name">Maintenance ({productCurrencySymbol}{maintenanceCost.toFixed(2)} × 12)</span>
                    <span className="cart-item-price">{productCurrency} {productCurrencySymbol}{formatCurrency((maintenanceCost * 12).toFixed(2), productCurrency)}</span>
                  </div>
                )}
              </li>
            );
          })}
          {express &&
            cartItems?.hiddenProducts?.map((each) => {
              const product = each?.product;
              const regionPricing = regionPrice(each?.cartData, {
                currency: activeCurrency,
              });
              currencyCode = regionPricing.currencyCode;
              const discountedPrice = regionPricing?.productPrice;

              return (
                <li key={each._id || each.name}>
                  {each?.name} x{each?.stripeData[0]?.quantity}{" "}
                  <span>
                    {currencyCode || cartItems?.currency || userData?.currency}{" "}
                    {currencySymbol}
                    {formatCurrency(
                      cartItems?.expressPriceData?.subTotal?.toFixed(2) ||
                        (regionPricing.productPrice * each?.cartData?.quantity),
                      cartItems?.currency || userData?.currency
                    )}
                  </span>
                </li>
              );
            })}
          

        </ul>

        {/* One-Time Fee (for module orders) */}
        {isModuleOrder && getModuleBreakdown()?.oneTimeFee > 0 && (
          <div style={{
            borderTop: "1px dashed #ddd",
            padding: "10px 0",
            margin: "10px 0",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "500"
          }}>
            <span>One-Time Fee (Setup)</span>
            <span>
              {currencyCode || cartItems?.currency || userData?.currency}{" "}
              {currencySymbol}
              {formatCurrency(
                getModuleBreakdown().oneTimeFee.toFixed(2),
                cartItems?.currency || userData?.currency
              )}
            </span>
          </div>
        )}

        <div className="total--cart--total">
          {!isModuleOrder && (
            <p>
              Total item(s) <span>{localTotalQuantity}</span>
            </p>
          )}
          <p>
            Cart Total{" "}
            {express ? (
              <span>
                {currencyCode || cartItems?.currency || userData?.currency}{" "}
                {currencySymbol}
                {formatCurrency(
                  cartItems?.expressPriceData?.subTotal?.toFixed(2) ||
                    localTotal,
                  cartItems?.currency || userData?.currency
                )}
              </span>
            ) : (
              <span>
                {currencyCode || cartItems?.currency || userData?.currency}{" "}
                {currencySymbol}
                {formatCurrency(
                  isModuleOrder && getModuleBreakdown()
                    ? getModuleBreakdown().subtotalBeforeDiscount
                    : localTotal,
                  cartItems?.currency || userData?.currency
                )}
              </span>
            )}
          </p>
        </div>
        {/* <p>
                            Shipping Fee <span>{currencySymbol}00.00</span>
                          </p> */}
        {cartItems?.couponData?.coupon ||
        cartItems?.expressPriceData?.coupon ? (
          <div className="promotion--price--wrapper">
            <p>Promotion</p>
            <div>
              {!express && cartItems?.couponData?.coupon ? (
                <span>
                  -{currencyCode || cartItems?.currency || userData?.currency}{" "}
                  {currencySymbol}
                  {formatCurrency(
                    (isModuleOrder ? (cartItems?.moduleDiscount || cartItems?.discount) : cartItems?.discount)?.toFixed(2),
                    cartItems?.currency || userData?.currency
                  )}
                </span>
              ) : (
                ""
              )}
              {express && cartItems?.expressPriceData?.coupon ? (
                <span>
                  - {currencyCode || cartItems?.currency || userData?.currency}{" "}
                  {currencySymbol}
                  {formatCurrency(
                    cartItems?.expressPriceData?.discount?.toFixed(2),
                    cartItems?.currency || userData?.currency
                  )}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="order--extra--info">
          {!express && cartItems?.couponData?.coupon ? (
            <>
              <p className="discount--information">
                {getCouponText({
                  code: cartItems?.couponData?.coupon,
                  type: cartItems?.couponData?.type,
                  discountUnit: cartItems?.discountUnit,
                })}
              </p>
            </>
          ) : (
            ""
          )}
          {express && cartItems?.expressPriceData?.coupon ? (
            <p className="discount--information">
              {getCouponText({
                code: cartItems?.expressPriceData?.coupon,
                type: cartItems?.expressPriceData?.couponType,
                discountUnit: cartItems?.expressPriceData?.discountUnit,
              })}
            </p>
          ) : (
            ""
          )}
          <p>
            Tax{" "}
            <span>
              {currencyCode || cartItems?.currency || userData?.currency}{" "}
              {currencySymbol}
              0.00
            </span>
          </p>
          <p>
            Shipping{" "}
            <span>
              {currencyCode || cartItems?.currency || userData?.currency}{" "}
              {currencySymbol}
              0.00
            </span>
          </p>
        </div>

        {/* Module Order Breakdown - Only show for module orders */}
        {isModuleOrder && (() => {
          const breakdown = getModuleBreakdown();
          if (!breakdown) return null;

          return (
            <div className="module-breakdown-box">
              <h5 className="module-breakdown-title">Module Order Breakdown</h5>

              <div className="module-breakdown-content">
                <div className="module-breakdown-row">
                  <span className="module-breakdown-label">Total Module Order:</span>
                  <span className="module-breakdown-value">
                    {currencyCode || cartItems?.currency || userData?.currency} {currencySymbol}
                    {formatCurrency(breakdown.totalModuleCost, cartItems?.currency || userData?.currency)}
                  </span>
                </div>

                <div className="module-breakdown-row">
                  <span className="module-breakdown-label">
                    {breakdown.isMonthlyPlan
                      ? "Recurring (1st month included):"
                      : "Total Additional Order:"}
                  </span>
                  <span className="module-breakdown-value">
                    {currencyCode || cartItems?.currency || userData?.currency} {currencySymbol}
                    {formatCurrency(
                      breakdown.isMonthlyPlan
                        ? breakdown.monthlyRecurring
                        : breakdown.totalAdditionalCostYearly +
                          breakdown.totalMaintenanceCostYearly,
                      cartItems?.currency || userData?.currency,
                    )}
                  </span>
                </div>

                {breakdown.isMonthlyPlan && breakdown.monthlyAfter > 0 && (
                  <div className="module-breakdown-row">
                    <span className="module-breakdown-label">
                      Then monthly for {breakdown.remainingMonths} months:
                    </span>
                    <span className="module-breakdown-value">
                      {currencyCode || cartItems?.currency || userData?.currency}{" "}
                      {currencySymbol}
                      {formatCurrency(
                        breakdown.monthlyAfter,
                        cartItems?.currency || userData?.currency,
                      )}
                      /mo
                    </span>
                  </div>
                )}

                {breakdown.oneTimeFee > 0 && (
                  <div className="module-breakdown-row">
                    <span className="module-breakdown-label">One-Time Fee:</span>
                    <span className="module-breakdown-value">
                      {currencyCode || cartItems?.currency || userData?.currency} {currencySymbol}
                      {formatCurrency(breakdown.oneTimeFee, cartItems?.currency || userData?.currency)}
                    </span>
                  </div>
                )}

                <div className="module-breakdown-row module-breakdown-total">
                  <span className="module-breakdown-label">
                    {breakdown.isMonthlyPlan ? "Pay Today:" : "Total:"}
                  </span>
                  <span className="module-breakdown-value">
                    {currencyCode || cartItems?.currency || userData?.currency} {currencySymbol}
                    {formatCurrency(
                      breakdown.isMonthlyPlan
                        ? breakdown.payToday
                        : breakdown.subtotalBeforeDiscount,
                      cartItems?.currency || userData?.currency,
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Hide Order Total for module orders since we have detailed breakdown above */}
        {!isModuleOrder && (
          <h4 className="order--total--holder">
            Order Total{" "}
            {express ? (
              <span>
                {currencyCode || cartItems?.currency || userData?.currency}{" "}
                {currencySymbol}
                {formatCurrency(
                  cartItems?.expressPriceData?.orderTotal?.toFixed(2) ||
                    localTotal,
                  cartItems?.currency || userData?.currency
                )}
              </span>
            ) : (
              <span>
                {currencyCode || cartItems?.currency || userData?.currency}{" "}
                {currencySymbol}
                {formatCurrency(
                  cartItems?.discount > 0 ? cartItems?.orderTotal : localTotal,
                  cartItems?.currency || userData?.currency
                )}
              </span>
            )}
          </h4>
        )}
        {showChangeCurrency ? (
          <div className="change--currency-holder--main">
            <button
              className="checkout--change-currency"
              onClick={handleShowCurrency}
            >
              Change currency
            </button>
            {showCurrencyOverlay && (
              <CurrencyOption
                setCurrencyChangeInProgress={setCurrencyChangeInProgress}
                addCoupon={addCoupon}
                saveCoupon={saveCoupon}
                couponCode={couponCode}
                addAPIDataToCart={addAPIDataToCart}
                cartItems={cartItems}
                express={express}
                expressPriceData={cartItems?.expressPriceData}
                updateCartForCurrency={updateCartForCurrency}
                setUserCurrencyForce={setUserCurrencyForce}
                setShowCurrencyOverlay={setShowCurrencyOverlay}
                setUserCurrencyPreference={setUserCurrencyPreference}
                setCartCurrency={setCartCurrency}
                setCurrencyCode={setCurrencyCode}
                prevTotal={
                  !express
                    ? (isModuleOrder ? cartItems?.moduleOrderTotal : cartItems?.orderTotal)
                    : cartItems?.expressPriceData?.orderTotal
                }
                userData={{
                  isLoggedIn: userData?.isLoggedIn,
                  currency: cartItems?.currency || userData?.currency,
                }}
                currencySymbol={currencySymbol}
                addExpressPriceData={addExpressPriceData}
                localTotal={localTotal}
                isLoggedIn={userData?.isLoggedIn}
              />
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CartSummary;
