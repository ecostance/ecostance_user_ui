// import { useRouter } from 'next/router'
// import { Container, Row, Col, Spinner } from 'react-bootstrap'
// import { useEffect, useState } from 'react'
// import { login, me } from '../../apiClient/auth'
// import { setCookies, getCookie } from 'cookies-next'
// import Registration from '../../pages/other/registration'
// import Link from 'next/link'
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
// import { useToasts } from 'react-toast-notifications'
// import { validateUser } from 'src/redux/actions/userAction'

// const LoginRegisterModel = ({ closeModel, showSuccessModel }) => {
//   const { addToast } = useToasts()
//   const router = useRouter()
//   const [isError, setIsError] = useState({})
//   const [isFocus, setIsFocus] = useState({})
//   const [initialValues, setInitialValues] = useState({
//     userName: '',
//     password: '',
//   })
//   const [isShowPassword, setIsShowPassword] = useState(false)
//   const [isLoginLoading, setIsLoginLoading] = useState(false)
//   const handleLogin = async (e) => {
//     e.preventDefault()
//     const validation = validate(initialValues)
//     setIsError(validation)
//     setIsFocus(validation)
//     if (Object.keys(validation).length) {
//       return null
//     }
//     try {
//       setIsLoginLoading(true)
//       const { userName, password } = initialValues
//       const loginResponse = await login(userName, password, true)
//       if (loginResponse.status == 200) {
//         setIsLoginLoading(true)
//         const { userName, password } = initialValues
//         const loginResponse = await login(userName, password, true)

//         if (loginResponse.status == 200) {
//           setCookies('JWTToken', loginResponse?.data?.token)

//           const allCartitems = cartItems
//           const allWishListItems = wishlistItems

//           const apiCartItems = await updateApiCartData(
//             allCartitems,
//             userData?.currency,
//             true
//           )

//           const currentApiCartData = apiCartItems?.data?.data
//           const coupon = currentApiCartData?.coupon
//           const type = currentApiCartData?.couponType
//           const discount = currentApiCartData?.discount
//           const total = currentApiCartData?.orderTotal
//           const subTotal = currentApiCartData?.subTotal
//           const discountUnit = currentApiCartData?.discountUnit

//           const stripeCode = {
//             regular: currentApiCartData?.stripePaymentCouponId,
//             subscription: currentApiCartData?.stripeSubscriptionCouponId,
//           }

//           const resWishList = await getWishlist()

//           const resCartProducts = currentApiCartData?.products
//           const resWishListProducts = resWishList?.data?.products

//           addAPIDataToCart(resCartProducts)

//           addAPIDataToWishlist(resWishListProducts, allWishListItems)
//           // addCoupon(
//           //   type,
//           //   coupon,
//           //   discount,
//           //   subTotal,
//           //   total,
//           //   discountUnit,
//           //   stripeCode,
//           //   (name = "a")
//           // );
//           if (
//             loginResponse?.data?.user?.emailVerificationStatus === 'UNVERIFIED'
//           ) {
//             setUserEmail(userName)
//             return router.push('/userlogin')
//           }
//           router.push({
//             pathname: '/',
//             query: { loggedIn: 'true' },
//           })
//         } else if (loginResponse.status === 403) {
//           addToast(loginResponse.data?.message, {
//             appearance: 'error',
//             autoDismiss: true,
//           })
//         } else {
//           addToast(loginResponse.data, {
//             appearance: 'error',
//             autoDismiss: true,
//           })
//         }
//       }
//     } catch (e) {
//       addToast('Failed to Login', {
//         appearance: 'error',
//         autoDismiss: true,
//       })
//       console.log(e)
//     } finally {
//       setIsLoginLoading(false)
//     }
//   }

//   const handleChangeValue = (e) => {
//     setInitialValues({
//       ...initialValues,
//       [e.target.name]: e.target.value.trim(),
//     })
//     setIsError({ ...isError, [e.target.name]: '' })
//   }

//   const handleFocus = (e) => {
//     const validation = validate(initialValues)
//     setIsError(validation)
//     setIsFocus({ ...isFocus, [e.target.name]: true })
//   }

//   const validate = (values) => {
//     const emailRegex =
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     let errors = {}
//     if (!values.userName) {
//       errors.userName = 'Please enter email'
//     }
//     if (values.userName && !values.userName.match(emailRegex)) {
//       errors.userName = 'Please enter a valid email'
//     }
//     if (!values.password) {
//       errors.password = 'Password is required'
//     }
//     return errors
//   }

//   const handleEyeIconClick = () => setIsShowPassword(!isShowPassword)

//   return (
//     <>
//       <Container>
//         <Row>
//           <Col lg={6} className="space-mb-mobile-only--50">
//             <div className="lezada-form login-form">
//               <form onSubmit={handleLogin} className="space-mb--20">
//                 <Row>
//                   <Col lg={12}>
//                     <div className="section-title--login text-center space-mb--50">
//                       <h2 className="space-mb--20">Login</h2>
//                       <p>Great to have you back!</p>
//                     </div>
//                   </Col>
//                   <Col lg={12} className="space-mb--60">
//                     <label htmlFor="regEmail">
//                       Email Address <span className="required">*</span>{' '}
//                     </label>
//                     <input
//                       name="userName"
//                       type="text"
//                       value={initialValues.userName}
//                       onBlur={handleFocus}
//                       onChange={(e) => handleChangeValue(e)}
//                       placeholder="Email"
//                     />
//                     {isFocus.userName && isError.userName ? (
//                       <p className="error-msg">{isError.userName}</p>
//                     ) : (
//                       ''
//                     )}
//                   </Col>
//                   <Col lg={12} className="space-mb--60">
//                     <label htmlFor="regEmail">
//                       Password <span className="required">*</span>{' '}
//                     </label>
//                     <div className="d-flex align-item-center">
//                       <input
//                         name="password"
//                         value={initialValues.password}
//                         onChange={(e) => handleChangeValue(e)}
//                         type={isShowPassword ? 'text' : 'password'}
//                         placeholder="Password"
//                       />
//                       {isShowPassword ? (
//                         <FaRegEye
//                           onClick={handleEyeIconClick}
//                           className="eye-icon"
//                         />
//                       ) : (
//                         <FaRegEyeSlash
//                           onClick={handleEyeIconClick}
//                           className="eye-icon"
//                         />
//                       )}
//                     </div>
//                     {isFocus.password && isError.password ? (
//                       <p className="error-msg">{isError.password}</p>
//                     ) : (
//                       ''
//                     )}
//                   </Col>
//                   <Col lg={12} className="space-mb--30">
//                     <button className="lezada-button lezada-button--medium space-mb--10">
//                       login{' '}
//                       {isLoginLoading ? (
//                         <Spinner size="sm" animation="border" />
//                       ) : null}
//                     </button>
//                   </Col>
//                   <Col>
//                     <input type="checkbox" />{' '}
//                     <span className="remember-text">Remember me</span>
//                   </Col>
//                 </Row>
//               </form>
//               <Link
//                 href={process.env.PUBLIC_URL + '/other/forgot-password'}
//                 className="reset-pass-link"
//               >
//                 Forgot password?
//               </Link>
//             </div>
//           </Col>
//           <Col lg={6}>
//             <Registration isModal={true} showSuccessModel={showSuccessModel} />
//           </Col>
//         </Row>
//       </Container>
//     </>
//   )
// }

// export default LoginRegisterModel
