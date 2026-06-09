import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import LezadaBackdrop from 'src/components/lezadaBackdrop'
import NewLoginRegisterModal from 'src/components/NewLoginRegisterModal'
import { validateUser } from 'src/redux/actions/userAction'

const LoginReg = ({ userData, cartItems, validateUser }) => {
  const [quantityCount] = useState(1)
  //   const { addToast } = useToasts();
  const [couponUsage, setCouponUsage] = useState({})
  //   let cartTotalPrice = 0;
  const router = useRouter()
  const [useCoupon, setUseCoupon] = useState(true)
  const [reRender, setreRender] = useState(false)
  const [couponApplied, setCouponApplied] = useState(false)
  const [previousTotal, setPreviousTotal] = useState(1)
  const [discount, setDiscount] = useState('')
  const [APICartData, setAPICartData] = useState({})
  const [discountInfo, setDiscountInfo] = useState([])
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  useEffect(() => {
    // !userData.isLoggedIn && router.push("/login-register");
    userData.isLoggedIn && setUserLoggedIn(true)
  }, [])

  const checkoutElement = useRef()

  useEffect(() => {
    document.querySelector('body').classList.remove('overflow-hidden')
  }, [])

  useEffect(() => {
    if (!userData.isLoggedIn) return
    setUserDetail(userData)
    setIsShowModel(false)
  }, [userData])

  const handleCheckout = () => {
    if (!userData.isLoggedIn) {
      return setIsShowModel(true)
    }
    router.push('/other/checkout')
  }

  const [isShowModel, setIsShowModel] = useState(true)
  const [userDetail, setUserDetail] = useState({})
  const [couponCode, setCouponCode] = useState(cartItems.code || '')
  const [shouldShowSuccessModel, setShouldShowSuccessModel] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const showSuccessModel = (shouldShow, message) => {
    setIsShowModel(!shouldShow)
    setShouldShowSuccessModel(shouldShow)
    setSuccessMessage(message)
    setTimeout(() => {
      setShouldShowSuccessModel(false)
    }, 5000)
  }

  const closeLoginModel = () => {
    router.push('/other/checkout')
    validateUser()
  }

  return (
    <div>
      {' '}
      <NewLoginRegisterModal
        closeModel={closeLoginModel}
        showSuccessModel={showSuccessModel}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    userData: state.userData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    increaseQuantity: (item, addToast, quantityCount, cartItems) => {
      dispatch(
        increaseQuantity(item, addToast, quantityCount, (cartItems = cartItems))
      )
    },
    decreaseQuantity: (item, addToast, cartItems) => {
      dispatch(decreaseQuantity(item, addToast, cartItems))
    },
    deleteFromCart: (item, addToast, cartItems) => {
      dispatch(deleteFromCart(item, addToast, cartItems))
    },
    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart(addToast))
    },
    validateUser: () => {
      dispatch(validateUser())
    },
    applyCoupon: (type, unit) => {
      dispatch(applyCoupon(type, unit))
    },
    addCoupon: (
      type,
      coupon,
      discount,
      subTotal,
      total,
      discountUnit,
      name
    ) => {
      dispatch(
        addCoupon(type, coupon, discount, subTotal, total, discountUnit, name)
      )
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginReg)
