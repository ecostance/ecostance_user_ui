import { BreadcrumbOne } from '../../../components/Breadcrumb'
import { LayoutTwo } from '../../../components/Layout'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'
import success from '../../../assets/images/tick.svg'
import error from '../../../assets/images/Icon-alert-triangle.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import { verifyEmail } from "../../../apiClient/auth.js";
import { deleteCookie } from 'cookies-next'
import { deleteAllFromCartLocally } from 'src/redux/actions/cartActions'
import { deleteAllFromWishlist } from 'src/redux/actions/wishlistActions'
import { connect } from 'react-redux'
import { addOrder } from 'src/redux/actions/orderActions'
import { verifyLoggedIn } from 'src/apiClient/user'
import { verifyEmailForNewsLetter } from 'src/apiClient/subscribe'
const Success = ({
  addOrder,
  deleteAllFromCartLocally,
  deleteAllFromWishlist,
  userData,
}) => {
  const router = useRouter()
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
    'Thank you for verifying your email for newsletter!'
  )

  const [showUI, setShowUI] = useState(false)

  const emailSuccessAsync = async () => {
    // const resLogIn = await verifyLoggedIn();
    // const loggedIn = resLogIn?.data?.isLoggedIn;
    // if (loggedIn) {
    //   deleteCookie("JWTToken");
    //   deleteCookie("checkout");
    //   deleteCookie("stripeSession");
    //   deleteAllFromCartLocally();
    //   deleteAllFromWishlist();
    // }
    setShowUI(true)
    const { tk, redirect } = router.query
    const res = await verifyEmailForNewsLetter(tk)
    if (res.data.message === 'Email already verified!') {
      setIsAlreadyVerified(true)
      setSuccessMessage('Email is already verified!')
    }
  }

  useEffect(() => {
    emailSuccessAsync().catch((err) => console.log(err))
  }, [])

  const ConfirmEmail = (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Thank you"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.NEXT_PUBLIC_UI_URL + '/'}>
              <a>Home</a>
            </Link>
          </li>

          <li>Thank you</li>
        </ul>
      </BreadcrumbOne>

      <Container className="mt-space--100 mb-space--100">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Image
              src={isAlreadyVerified ? error : success}
              alt="sustainable"
              className=""
            />
            <h3 className="mt-2">{successMessage}</h3>
          </Col>
        </Row>
        {/* <Row className="justify-content-center space-mt--50">
          <Link
            href="/login-register"
            as={process.env.PUBLIC_URL + "/login-register"}
          >
            <a>Proceed to Login page</a>
          </Link>
        </Row> */}
      </Container>
    </LayoutTwo>
  )

  return <>{showUI && ConfirmEmail}</>
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAllFromCartLocally: (addToast) => {
      dispatch(deleteAllFromCartLocally())
    },
    addOrder: (isOrder, item) => {
      dispatch(addOrder(isOrder, item))
    },
    deleteAllFromWishlist: (addToast) => {
      dispatch(deleteAllFromWishlist())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Success)
