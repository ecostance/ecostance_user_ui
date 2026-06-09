import { applyCouponToAPI, checkCoupon } from "src/apiClient/coupon";

export const saveCoupon = async (
  couponCode,
  addCoupon,
  addToast = false,
  setreRender = false,
  getStripeCoupon = false,
  setCouponCode = false
) => {
  if (couponCode.length === 0) {
    return;
  }

  const couponInfo = await checkCoupon(couponCode);

  if (couponInfo.status !== 200 && addToast) {
    setCouponCode && setCouponCode("");

    return addToast("Invalid Coupon", {
      appearance: "error",
      autoDismiss: true,
    });
  }

  const res = await applyCouponToAPI(couponCode, getStripeCoupon);

  if (res?.status === 500 && addToast) {
    setCouponCode && setCouponCode("");
    return addToast("Please try again later", {
      appearance: "error",
      autoDismiss: true,
    });
  } else if (res?.status === 200 && addToast) {
    if (addToast) {
      addToast("Coupon Applied Successfully", {
        appearance: "success",
        autoDismiss: true,
      });
    }
  } else {
    setCouponCode && setCouponCode("");

    return addToast(res?.data?.message, {
      appearance: "error",
      autoDismiss: true,
    });
  }

  const type = couponInfo?.data?.data?.type;
  const code = couponInfo?.data?.data?.code;
  const stripeCode = {
    regular: res?.data?.stripePaymentCoupon?.id,
    subscription: res?.data?.stripeSubscriptionCoupon?.id,
  };

  const discount = res?.data?.discount || 0;
  const subTotal = res?.data?.subTotal || 0;
  const total = res?.data?.total || 0;
  const orderTotalWithinStripeRange = res?.data?.orderTotalWithinStripeRange;
  const discountUnit = couponInfo?.data?.data?.discountUnit;
  addCoupon(
    type,
    code,
    discount,
    subTotal,
    total,
    discountUnit,
    stripeCode,
    orderTotalWithinStripeRange
  );

  setreRender && res.status === 200 && setreRender((prev) => !prev);
};
