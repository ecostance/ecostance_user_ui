const getCouponText = (coupon) => {
  let refferalCheck = localStorage.getItem("ReferralID") && localStorage.getItem("userId") !== localStorage.getItem("ReferralID") && localStorage.getItem("TotalOrders") == 0
  let txt = refferalCheck ? '(REFFERAL)' : `(${coupon?.code})`
  if (coupon?.type === 'percentage') return (txt += ` ${coupon?.discountUnit}%`)
  if (coupon?.type === 'quantity') {
    if (coupon?.discountUnit <= 1)
      return (txt += ` ${coupon?.discountUnit} Free Item`)
    if (coupon?.discountUnit > 1)
      return (txt += ` ${coupon?.discountUnit} Free Items`)
  }
}

export default getCouponText
