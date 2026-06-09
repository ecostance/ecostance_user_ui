import Link from 'next/link'
import { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { IoIosClose } from 'react-icons/io'
import { connect } from 'react-redux'

const AccountOverlay = ({
  activeStatus,
  getActiveStatus,
  loggedInUserInfo = {},
  handleLogout,
  // loggedInUserSlugInfo,
}) => {
  const [myAccountClicked, setMyAccountClicked] = useState(false)
  const [myBusinessAccountClicked, setMyBusinessAccountClicked] = useState(false)
  const [myEmployeeAccountClicked, setMyEmployeeAccountClicked] = useState(false)
  const [logoutClicked, setLogoutclicked] = useState(false)

  console.log(loggedInUserInfo, "loggedinuser")

  const handleMyAccountClick = () => {
    if (window.location.pathname === '/other/my-account')
      return getActiveStatus(false)
    setMyAccountClicked(true)
    setLogoutclicked(false)
  }

  const handleMyBusinessAccountClick = () => {
    if (window.location.pathname === '/other/my-business-account')
      return getActiveStatus(false)
    setMyBusinessAccountClicked(true)
    setLogoutclicked(false)
  }

  const handleMyEmployerAccountClick = () => {
    if (window.location.pathname === '/other/my-employer-account')
      return getActiveStatus(false)
    setMyEmployeeAccountClicked(true)
    setLogoutclicked(false)
  }

  return (
    <div className={`cart-overlay ${activeStatus ? 'active' : ''}`}>
      <div
        className="cart-overlay__close"
        onClick={() => {
          getActiveStatus(false)
          document.querySelector('body').classList.remove('overflow-hidden')
        }}
      />
      <div className="cart-overlay__content">
        {/*=======  close icon  =======*/}
        <button
          className="cart-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false)
            document.querySelector('body').classList.remove('overflow-hidden')
          }}
        >
          <IoIosClose />
        </button>
        {/*=======  offcanvas cart content container  =======*/}
        <div className="cart-overlay__content-container">
          <h3 className="cart-title">Account Info</h3>
          <div className="user-header-submenu-title">
            <h4 className="mb-3">
              Hello{' '}
              <b>
                {loggedInUserInfo?.firstName
                  ? loggedInUserInfo?.firstName
                  : loggedInUserInfo.email}
              </b>
            </h4>
          </div>
          <hr />
          <div onClick={handleMyAccountClick}>
            <Link
              href={'/other/my-account'}
              as={process.env.PUBLIC_URL + '/other/my-account'}
              style={{ width: '100%' }}
            >
              <div className="user-header-submenu-logout logout_button my__account--button">
                <div>
                  {myAccountClicked ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'My personal account'
                  )}
                </div>
              </div>
            </Link>
          </div>

          <div onClick={handleMyEmployerAccountClick}>
            <Link
              href={"/other/my-employer-account"}
              as={process.env.PUBLIC_URL + '/other/my-employer-account'}
              style={{ width: '100%' }}
            >
              <div className="user-header-submenu-logout logout_button my__account--button">
                <div>
                  {myEmployeeAccountClicked ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'My Employer Account'
                  )}
                </div>
              </div>
            </Link>
          </div>
          <div onClick={handleMyBusinessAccountClick}>
            <Link
              href={'/other/my-business-account'}
              as={'/other/my-business-account'}
              style={{ width: '100%' }}
            >
              <div className="user-header-submenu-logout logout_button my__account--button">
                <div>
                  {myBusinessAccountClicked ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <span>My Own Business Account</span>
                  )}

                </div>
              </div>
            </Link>
          </div>

          {/* {
                        accountData?.roles[1] === "admin" ? <Link
                            href="/other/my-administrator"
                            as={process.env.PUBLIC_URL + "/other/my-administrator"}
                        >
                            <div className="user-header-submenu-logout logout_button">
                                <a>
                                    My Adminstrator
                                </a>
                            </div>
                        </Link> : null
                    } */}

          <div
            onClick={(e) => [
              handleLogout(e),
              setLogoutclicked(true),
              setMyAccountClicked(false),
            ]}
            className="user-header-submenu-logout logout_button my__account--button"
          >
            <span>
              <a>
                {logoutClicked ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Logout'
                )}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div >
  )
}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
  }
}

export default connect(mapStateToProps)(AccountOverlay)
