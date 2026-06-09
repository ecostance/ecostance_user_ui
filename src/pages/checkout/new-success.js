import React, { useState } from 'react'
import Link from 'next/link'
import { LayoutTwo } from '../../components/Layout'
import { BreadcrumbOne } from '../../components/Breadcrumb'
import { Spinner } from 'react-bootstrap'
import sampleQRCode from '../../assets/images/qr.svg'
import Image from 'next/image'

const NewSuccess = () => {
  const [isOrderLoaded, setIsOrderLoaded] = useState(false)

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle="Thank you"
        // backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
        // backgroundImageLowRes="/assets/images/backgrounds/breadcrumb-bg-1-small.png"
        className="bg--1"
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
      <div className="order__success__wrapper">
        {isOrderLoaded ? (
          <div className={'d-flex justify-content-center space-mb--10'}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="order__success__main-container">
            <div className="order__success__section_one">
              <div className="order__success__main-container_row">
                <div className="order__success__thankyou-container">
                  <svg
                    className="success_svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="55"
                    height="55"
                    fill="none"
                    viewBox="0 0 55 55"
                  >
                    <path
                      fill="#7BA986"
                      fillRule="evenodd"
                      d="M27.5 54.3c14.8 0 26.8-11.999 26.8-26.8S42.3.7 27.5.7C12.697.7.7 12.7.7 27.5s11.998 26.8 26.8 26.8zM39.917 23.17a3.35 3.35 0 10-4.738-4.738L24.15 29.463l-4.332-4.332a3.35 3.35 0 10-4.738 4.738l6.7 6.7a3.35 3.35 0 004.738 0l13.4-13.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <h1 className="order__success__thankyou-msg">
                    Thanks for your order!
                  </h1>
                </div>
              </div>
            </div>

            <div className="order__success__section_two">
              <div className="order__success__main-container_row">
                <div className="order__success-info-container">
                  <div className="order__success__company-info-container">
                    <p className="text-bold">NETCARBONS LLC</p>
                    <p>Attn: Finance Department</p>
                    <p>4737 N Ocean Dr.Suite 270,</p>
                    <p>Ft. Lauderdale, Florida 33308, United States</p>
                    <p>Contact: finance@netcarbons.com</p>
                  </div>
                  <div className="order__success__buyer-info-container">
                    <p className="text-bold">Sold To</p>
                    <p>John Smith</p>
                    <p>4737 N Ocean Dr.Suite 270,</p>
                    <p>Ft. Lauderdale, Florida 33308, United States</p>
                    <p>Contact: finance@netcarbons.com</p>
                    <p>Phone: +1 781 345 6789</p>
                  </div>
                </div>
                <div className="order__success-order-detail-pdf-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="17"
                    fill="none"
                    viewBox="0 0 15 17"
                  >
                    <path
                      fill="#B7323B"
                      d="M4.008 10.936c0-.282-.196-.45-.542-.45-.14 0-.236.013-.286.027v.905c.059.014.132.018.232.018.368 0 .596-.186.596-.5zM6.142 10.495c-.155 0-.255.014-.314.027v2.006c.06.014.155.014.241.014.628.005 1.038-.34 1.038-1.073.004-.637-.369-.974-.965-.974z"
                    ></path>
                    <path
                      fill="#B7323B"
                      d="M10.121-.001H3.293c-.997 0-1.81.812-1.81 1.81v6.69h-.176a.729.729 0 00-.729.73v4.42c0 .404.327.73.73.73h.176v.81c0 .999.812 1.81 1.81 1.81h9.316c.997 0 1.809-.811 1.809-1.81V4.282L10.12 0zm-7.63 10.027c.214-.036.514-.063.937-.063.428 0 .732.081.937.245.196.155.328.41.328.71s-.1.555-.282.728c-.237.223-.587.323-.997.323-.09 0-.172-.005-.236-.013v1.096H2.49v-3.026zm10.119 5.865H3.293a.702.702 0 01-.7-.701v-.811h8.684c.403 0 .73-.326.73-.73V9.23a.729.729 0 00-.73-.73H2.593v-6.69c0-.386.314-.7.7-.7L9.707 1.1v2.371c0 .693.561 1.255 1.254 1.255l2.323-.007.026 10.47a.701.701 0 01-.7.7zm-7.474-2.853v-3.012c.254-.04.587-.063.937-.063.582 0 .96.104 1.256.327.318.237.518.614.518 1.156 0 .587-.213.992-.51 1.242-.322.268-.814.396-1.414.396-.36 0-.614-.023-.787-.046zm4.965-1.783v.564h-1.1v1.233h-.697V9.986h1.874v.568H9v.7h1.101z"
                    ></path>
                  </svg>
                  <p>Order.pdf</p>
                </div>
                <div className="order__success-order-detail-container">
                  <div className="order__success-order-detail-container-left">
                    <div className="order__success-container-left-keys">
                      <p>Order #:</p>
                      <p>Email ID:</p>
                      <p>Status:</p>
                    </div>
                    <div className="order__success-container-left-values">
                      <p>10000001234</p>
                      <p>example@gmail.com</p>
                      <p>Success</p>
                    </div>
                  </div>
                  <div className="order__success-order-detail-container-right">
                    <div className="order__success-container-right-keys">
                      <p>Date & Time:</p>
                      <p>Payment mode:</p>
                      <p>Payment type:</p>
                    </div>
                    <div className="order__success-container-right-values">
                      <p>2022-12-25 15:45 EST (UTC-5)</p>
                      <p>Card</p>
                      <p>One time payment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order__success__section_three">
              <div className="order__success__main-container_row">
                <div className="order__success__product-table-header">
                  <p className="product-table-header-item-1">Num</p>
                  <p className="product-table-header-item-2">Product Name</p>
                  <p className="product-table-header-item-3">Unit Price</p>
                  <p className="product-table-header-item-4">Qty</p>
                  <p className="product-table-header-item-5">Product Total</p>
                </div>
                <div className="order__success__product-row">
                  <p className="product-table-header-item-1">1</p>
                  <p className="product-table-header-item-2">Kariba Red++</p>
                  <p className="product-table-header-item-3">INR₹ 100.00</p>
                  <p className="product-table-header-item-4">100</p>
                  <p className="product-table-header-item-5">INR₹ 2000.00</p>
                </div>
                <div className="order__success__product-row">
                  <p className="product-table-header-item-1">2</p>
                  <p className="product-table-header-item-2">Kariba Red++</p>
                  <p className="product-table-header-item-3">INR₹ 100.00</p>
                  <p className="product-table-header-item-4">100</p>
                  <p className="product-table-header-item-5">INR₹ 2000.00</p>
                </div>

                <div className="order__success__order-price-container">
                  <div className="order__success__total-items-container">
                    <p className="order__success__total-items-txt">
                      Total items
                    </p>
                    <p className="order__success__total-items">10</p>
                  </div>
                  <div className="order__success__cart-total-container">
                    <p className="order__success__cart-total-txt">Cart Total</p>
                    <p className="order__success__cart-total">INR₹ 2,800.00</p>
                  </div>
                </div>

                <div className="order__success__order-promo-tax-container">
                  <div className="order__success__order-promo-tax-keys">
                    <p>Promotion (CHRISTMAS22) 10%</p>
                    <p>Tax</p>
                    <p>Shipping</p>
                  </div>

                  <div className="order__success__order-promo-tax-values">
                    <p>-INR₹ 280.00</p>
                    <p>INR₹ 123.67</p>
                    <p>INR₹ 0.00</p>
                  </div>
                </div>

                <div className="order__success__footer">
                  <div className="order__success__order-total-container">
                    <p>ORDER TOTAL</p>
                    <p>INR₹ 2,643.67</p>
                  </div>
                  <div className="order__success__media-container">
                    <div className="order__success__qr-container">
                      <div className="order__success__qr-img-wrapper">
                        <Image src={sampleQRCode} alt="sample qr code" />
                      </div>
                      <p className="order__success__profile-link">
                        https:
                        netcarbons.com/id/dhfisf32rtrgfdlmsnffjdoihgbfljsfvfjbdfdd.html
                      </p>
                    </div>
                    <div className="order__success__share-container">
                      <p className="order__success__share-txt">Share: </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="41"
                        height="41"
                        fill="none"
                        viewBox="0 0 41 41"
                      >
                        <g clipPath="url(#clip0_4954_3681)">
                          <path
                            fill="#334C8C"
                            d="M20.13 40.61c11 0 19.919-8.919 19.919-19.92 0-11-8.918-19.919-19.92-19.919C9.13.771.212 9.69.212 20.691c0 11 8.918 19.918 19.919 19.918z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M25.171 18.805l-.33 2.773a.525.525 0 01-.524.467h-2.883v8.23a.373.373 0 01-.367.374h-2.938a.371.371 0 01-.367-.377l.016-8.227h-2.183a.524.524 0 01-.525-.524v-2.773a.524.524 0 01.524-.524h2.17v-2.69c0-3.11 1.851-4.804 4.561-4.804h2.22a.524.524 0 01.524.525v2.335a.524.524 0 01-.524.524h-1.36c-1.473.024-1.751.729-1.751 1.782v2.32h3.226a.524.524 0 01.511.59z"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_4954_3681">
                            <path
                              fill="#fff"
                              d="M0 0H39.838V39.838H0z"
                              transform="translate(.219 .771)"
                            ></path>
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="41"
                        height="41"
                        fill="none"
                        viewBox="0 0 41 41"
                      >
                        <g clipPath="url(#clip0_4954_3686)">
                          <path
                            fill="#00A6DE"
                            d="M20.435 40.61c11 0 19.919-8.919 19.919-19.92 0-11-8.918-19.919-19.92-19.919C9.435.771.517 9.69.517 20.691c0 11 8.918 19.918 19.919 19.918z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M30.363 14.662a8.41 8.41 0 01-1.706 1.873.728.728 0 00-.262.57v.065a11.947 11.947 0 01-.77 4.156 12.173 12.173 0 01-2.268 3.8 11.2 11.2 0 01-4.914 3.248 12.292 12.292 0 01-3.863.6c-2.08 0-4.124-.55-5.923-1.596a.34.34 0 01-.163-.377.328.328 0 01.32-.247h.498a7.926 7.926 0 004.44-1.347 4.304 4.304 0 01-3.407-2.925.225.225 0 01.262-.29c.238.044.48.067.723.068h.092a4.306 4.306 0 01-2.508-3.96.226.226 0 01.332-.197c.308.171.638.3.98.38a4.303 4.303 0 01-.694-5.221.224.224 0 01.37-.032 11.253 11.253 0 007.734 4.136h.02a.162.162 0 00.158-.175 4.55 4.55 0 01.1-1.573 4.17 4.17 0 012.804-2.998 4.61 4.61 0 011.36-.21 4.288 4.288 0 012.841 1.072c.102.091.234.141.37.142a.563.563 0 00.131-.019 7.864 7.864 0 002.097-.867.223.223 0 01.327.262 4.253 4.253 0 01-1.13 1.8 7.92 7.92 0 001.374-.464.226.226 0 01.275.325z"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_4954_3686">
                            <path
                              fill="#fff"
                              d="M0 0H39.838V39.838H0z"
                              transform="translate(.508 .771)"
                            ></path>
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="41"
                        height="41"
                        fill="none"
                        viewBox="0 0 41 41"
                      >
                        <g clipPath="url(#clip0_4954_3691)">
                          <path
                            fill="#2AA81A"
                            d="M20.653 40.717c11.001 0 19.92-8.918 19.92-19.92 0-11-8.919-19.918-19.92-19.918C9.653.879.734 9.797.734 20.798c0 11 8.918 19.919 19.92 19.919z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M27.68 13.772a9.881 9.881 0 00-15.83 11.433l-1.048 5.09a.37.37 0 00.06.296.38.38 0 00.404.157l4.98-1.182a9.88 9.88 0 0011.427-15.794h.007zm-1.556 12.416a7.747 7.747 0 01-8.912 1.46l-.697-.346-3.058.723v-.04l.644-3.084-.34-.671a7.731 7.731 0 016.893-11.246 7.74 7.74 0 015.47 2.264l.034.047a7.737 7.737 0 01-.04 10.898l.006-.005z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M25.855 23.944c-.375.59-.97 1.31-1.711 1.491-1.31.315-3.305 0-5.803-2.31l-.031-.028c-2.173-2.029-2.75-3.719-2.621-5.058.076-.763.71-1.45 1.245-1.9a.712.712 0 011.114.262l.804 1.819a.706.706 0 01-.086.723l-.41.524a.695.695 0 00-.054.773c.388.573.853 1.09 1.381 1.536a8.172 8.172 0 001.913 1.37.695.695 0 00.758-.159l.469-.477a.71.71 0 01.715-.2l1.914.549a.718.718 0 01.403 1.085z"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_4954_3691">
                            <path
                              fill="#fff"
                              d="M0 0H39.838V39.838H0z"
                              transform="translate(.75 .879)"
                            ></path>
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="41"
                        height="41"
                        fill="none"
                        viewBox="0 0 41 41"
                      >
                        <g clipPath="url(#clip0_4954_3698)">
                          <path
                            fill="#0B69C7"
                            d="M20.919 40.61c11 0 19.919-8.919 19.919-19.92 0-11-8.918-19.919-19.919-19.919C9.918.771 1 9.69 1 20.691c0 11 8.918 19.918 19.919 19.918z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M16.465 13.45a2.721 2.721 0 11-5.443.004 2.721 2.721 0 015.443-.005zM15.176 17.302h-2.862a.674.674 0 00-.673.673v12.002c0 .372.301.673.673.673h2.862a.674.674 0 00.674-.673V17.974a.674.674 0 00-.674-.673zM30.81 24.222v5.81a.619.619 0 01-.618.62H27.12a.618.618 0 01-.619-.62v-5.629c0-.841.244-3.67-2.196-3.67-1.892 0-2.278 1.945-2.359 2.818v6.495a.618.618 0 01-.613.605H18.36a.616.616 0 01-.619-.618V17.924a.618.618 0 01.619-.621h2.972a.621.621 0 01.632.621v1.049c.702-1.049 1.745-1.867 3.965-1.867 4.909-.002 4.88 4.592 4.88 7.116z"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_4954_3698">
                            <path
                              fill="#fff"
                              d="M0 0H39.838V39.838H0z"
                              transform="translate(.992 .771)"
                            ></path>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order__success__closing-text mt-4">
              Within a few minutes, you will also receive an email at
              ritiksinha91@gmail.com with order details. You can also visit your
              "MyAccount" Page to view your orders.
            </div>
          </div>
        )}
      </div>
    </LayoutTwo>
  )
}

export default NewSuccess
