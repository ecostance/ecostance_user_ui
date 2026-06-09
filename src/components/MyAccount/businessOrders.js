import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { SpinnerCircular } from "spinners-react";

import { getAllBusinessOrders } from "src/apiClient/business";

// import Stripe from 'stripe';
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { getSubscriptions } from "src/apiClient/subscription";
import axios from "axios";
import router from "next/router";
import Link from "next/link";
import fileDownload from "js-file-download";

import { getCookie } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import {
    getFormattedDate,
    getFormattedTime,
    returnOneYearForwardDate,
} from "src/helpers/formatDateTime";
import formatCurrency from "src/helpers/formatCurrency";
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BusinessOrders = ({ reviewPopUpHandler }) => {
    const { addToast } = useToasts();

    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [metaData, setMetaData] = useState({});
    const [hasMore, setHasMore] = useState(true);

    const handleManageSubscription = async (item) => {
        if (item?.isSubscriptionCycleCompleted !== 1) {
            addToast("Subscription cannot be managed. Please try after 15 minutes", {
                appearance: "error",
                autoDismiss: true,
            });
            return;
        }
        try {
            const res = await axios.post(
                "/api/get_stripeId",
                { id: item.paymentLogs[0].id },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            router.push(res.data.session.url);
        } catch (err) {
            console.log("STRIPE ERROR", err);
        }
    };

    // const handleSubDelete = async (id) => {
    // 	stripe.subscriptions
    // 		.del(id)
    // 		.then((res) => {
    // 			console.log(res);
    // 		})
    // 		.catch((err) => {
    // 			console.log(err);
    // 		});
    // };

    const handleDocumentPdf = (id) => {
        router.push("/other/track");
    };

    const handleCancelSubscription = async (item) => {
        if (item?.isSubscriptionCycleCompleted !== 1) {
            addToast(
                "Subscription cannot be cancelled. Please try after 15 minutes",
                {
                    appearance: "error",
                    autoDismiss: true,
                }
            );
            return;
        }
        if (getCookie("JWTToken")) {
            // const res = await getSubscriptions(item.paymentLogs[0].id);
            try {
                const answer = await axios.delete(
                    `${process.env.API_BASE}/v1/cancel-subscription/${item.paymentLogs[0].id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie("JWTToken")}`,
                        },
                    }
                );
                console.log(answer, "kwjedkwjehdlwed");
                if (answer?.data?.success) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    addToast(
                        "Subscription cannot be cancelled. Please try after 15 minutes",
                        {
                            appearance: "error",
                            autoDismiss: true,
                        }
                    );
                }
            } catch (err) {
                console.log(
                    "Error happened in line handleCancelSubscription, orders.js inside my account",
                    err
                );
            }
        }
    };

    const getCurrentPageAllOrder = async () => {
        await getAllBusinessOrders(currentPage)
            .then((response) => {
                if (response.status == 200) {
                    const orderList = [...orders, ...response.data?.data];
                    const hashObj = {};
                    const returnOrderList = [];
                    orderList.forEach((each) => {
                        if (!hashObj[each?._id]) {
                            returnOrderList.push(each);
                            hashObj[each?._id] = true;
                        }
                    });
                    setOrders(returnOrderList || []);
                    setOrderLoading(false);
                    setMetaData(response?.data?.metadata);
                    if (!response?.data?.metadata?.nextPage) {
                        setHasMore(false);
                    }
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    };

    useEffect(() => {
        getCurrentPageAllOrder().catch((err) => console.log(err));
    }, [currentPage]);

    const returnShortenParagraph = (para) => {
        const limit = 120;
        let returnPara = "";
        let counter = 0;
        const splitChars = para?.split("");
        if (!splitChars) return "";
        for (let i = 0; i < splitChars.length; i++) {
            if (counter >= limit) {
                break;
            }
            returnPara += splitChars[i];
            counter += 1;
        }
        return returnPara + "...";
    };

    const handleFileDownload = async (link, orderNum) => {
        axios
            .get(link, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data, `ORDER-No-${orderNum}.pdf`);
            })
            .catch((err) => {
                console.log(err, "here is download error");
                addToast("Download Failed!", {
                    appearance: "error",
                    autoDismiss: true,
                });
            });
    };
    const getPrice = (priceList, currency) => {
        if (!priceList) return { currencySymbol: "USD", oldPrice: 0, price: 0 };
        const { currencySymbol, oldPrice, price } = priceList?.find(
            (price) => price.currency === currency
        );
        return {
            currencySymbol,
            oldPrice: oldPrice?.toFixed(2),
            price: price?.toFixed(2),
        };
    };
    function padTo2Digits(num) {
        return num.toString().padStart(2, "0");
    }

    function getUTCTimeHandler(date = new Date()) {
        return [
            padTo2Digits(date.getUTCHours()),
            padTo2Digits(date.getUTCMinutes()),
        ].join(":");
    }
    const formatCertificateNumber = (certificateNumber) => {
        let certNumber = "";
        if (!certificateNumber) return certNumber;
        certificateNumber.split("").forEach((item, index) => {
            certNumber += item;
            if (index == 3 || index == 7) certNumber += " ";
        });
        return certNumber;
    };

    const getTotalItemsInOrder = (products) =>
        products.reduce((acc, product) => (acc += product?.quantity), 0);

    const order = orders.length
        ? orders.map((item, index) => (
            <div key={index} className="orders-order-box">
                <Card key={index} className="my-account--order-card">
                    <div className="orders-main-container d-flex justify-content-between">
                        <div className="orders--left-side">
                            <div className="orders--orderNumber-PDF-holder">
                                <p className="orders--orderNumber-Holder">
                                    Order #: <b>{formatCertificateNumber(item?.orderNumber)}</b>
                                </p>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <a
                                        target="_blank"
                                        onClick={() =>
                                            handleFileDownload(
                                                item?.invoice?.filePath,
                                                item?.orderNumber
                                            )
                                        }
                                        // href={`${item?.invoice?.filePath}`}
                                        download
                                    >
                                        <div
                                            className="orders--download-pdf-holder"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22"
                                                height="26"
                                                fill="none"
                                                viewBox="0 0 22 26"
                                            >
                                                <path
                                                    fill="#B7323B"
                                                    d="M5.66 16.727c0-.431-.3-.689-.829-.689-.216 0-.362.021-.438.042v1.385c.09.02.201.027.355.027.563 0 .911-.284.911-.765zM8.931 16.053c-.236 0-.39.02-.48.041v3.069c.09.02.237.02.37.02.96.008 1.586-.521 1.586-1.641.007-.974-.564-1.49-1.476-1.49z"
                                                ></path>
                                                <path
                                                    fill="#B7323B"
                                                    d="M15.011 0H4.57A2.771 2.771 0 001.8 2.767V13h-.27c-.616 0-1.115.499-1.115 1.115v6.763c0 .616.5 1.115 1.115 1.115h.27v1.24A2.77 2.77 0 004.57 26h14.248a2.77 2.77 0 002.767-2.767V6.549L15.01 0zM3.341 15.335a8.742 8.742 0 011.434-.096c.654 0 1.12.124 1.433.375.3.236.501.627.501 1.086 0 .459-.153.849-.431 1.113-.362.34-.898.494-1.524.494-.14 0-.264-.007-.362-.02v1.676h-1.05v-4.628zm15.476 8.97H4.57c-.591 0-1.072-.48-1.072-1.072v-1.24h13.282c.616 0 1.116-.5 1.116-1.115v-6.763c0-.616-.5-1.115-1.116-1.115H3.497V2.767c0-.59.481-1.07 1.072-1.07l9.808-.01v3.625c0 1.059.86 1.919 1.92 1.919l3.551-.01.04 16.012c0 .591-.48 1.072-1.07 1.072zm-11.43-4.363v-4.607c.39-.062.897-.096 1.433-.096.89 0 1.468.16 1.92.5.488.362.793.94.793 1.768 0 .897-.326 1.517-.779 1.9-.494.41-1.245.605-2.164.605-.55 0-.94-.035-1.204-.07zm7.594-2.727v.862h-1.684v1.886h-1.065v-4.69H15.1v.87h-1.802v1.072h1.684z"
                                                ></path>
                                            </svg>
                                            <p>Order</p>
                                        </div>
                                    </a>
                                    {/* <div
									onClick={() => handleGetStripeId(item?.paymentLogs[0]?.id)}
									style={{ cursor: 'pointer' }}>
									<Image width='25px' height='25px' src={CertIcon} />
								</div> */}
                                </div>
                            </div>
                            <div className="orders--date-time-holder--mobile">
                                <div className="orders--date-time-holder--mobile">
                                    <p
                                        className="orders--date-holder"
                                        style={{ textAlign: "right" }}
                                    >
                                        Date: <b>{getFormattedDate(item?.createdAt)} </b>
                                    </p>
                                    <p
                                        className="orders--time-holder"
                                        style={{ textAlign: "right" }}
                                    >
                                        Time:{" "}
                                        <b>
                                            {getFormattedTime(item?.createdAt)}
                                            {/* {new Date(item.createdAt).toISOString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} */}
                                        </b>
                                    </p>
                                </div>
                            </div>
                            {item.products.length === 0
                                ? "No Products"
                                : item.products.map((product, productIndex) => {
                                    const { currencySymbol, oldPrice, price } = getPrice(
                                        product?.product?.priceList,
                                        item?.currency
                                    );
                                    return (
                                        <div key={productIndex}>
                                            <div className="my-account--order-card-holder">
                                                <div
                                                    key={productIndex}
                                                    className="my-account--order-card__products"
                                                >
                                                    <div className="my-account--order-card__img-wrapper">
                                                        <Link
                                                            href={`/shop/product-basic/[slug]?slug=${product?.product?.slug}`}
                                                            as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.product?.slug}`}
                                                        >
                                                            <a target="blank">
                                                                <img
                                                                    className="order_product_img"
                                                                    src={
                                                                        Array.isArray(
                                                                            product?.product?.image
                                                                        ) && product?.product?.image.length
                                                                            ? product?.product?.image[0]
                                                                            : ""
                                                                    }
                                                                    style={
                                                                        {
                                                                            // height: '220px',
                                                                            // width: '165px',
                                                                        }
                                                                    }
                                                                    alt="Product Image"
                                                                />
                                                            </a>
                                                        </Link>
                                                    </div>

                                                    <div className="orders-order-product-info">
                                                        <a
                                                            target="_blank"
                                                            href={product?.certificate?.certificateURL}
                                                        >
                                                            <div className="orders--order-cert-holder">
                                                                <h5 className="orders--order-cert-text">
                                                                    Certificate:{" "}
                                                                    <span>
                                                                        {formatCertificateNumber(
                                                                            product?.certificate?.originNumber
                                                                        )}
                                                                    </span>
                                                                    {/* <span>{product?.certificateNumber}</span> */}
                                                                </h5>
                                                                <div
                                                                    onClick={() =>
                                                                        handleDocumentPdf(
                                                                            item?.paymentLogs[0]?.id
                                                                        )
                                                                    }
                                                                    className="orders-cert-svg-holder"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="22"
                                                                        fill="none"
                                                                        viewBox="0 0 24 22"
                                                                    >
                                                                        <path
                                                                            fill="#000002"
                                                                            d="M22.338.623H1.662C.746.623 0 1.369 0 2.285v14.027c0 .917.746 1.663 1.662 1.663h12.056l-.364 2.22c-.068.418.07.796.37 1.012.3.216.703.228 1.078.03l2.6-1.369a.548.548 0 01.346 0l2.6 1.37c.179.093.363.14.54.14a.913.913 0 00.538-.17c.3-.217.439-.595.37-1.013l-.364-2.22h.906c.916 0 1.662-.746 1.662-1.663V2.285c0-.916-.746-1.662-1.662-1.662zm-4.763 14.502a2.9 2.9 0 01-2.897-2.897 2.9 2.9 0 012.897-2.897 2.9 2.9 0 012.898 2.897 2.9 2.9 0 01-2.898 2.897zm.837 3.482c-.485-.255-1.188-.255-1.673 0l-1.839.968.585-3.566c.62.345 1.332.541 2.09.541.758 0 1.47-.197 2.091-.54l.228 1.39.001.007.356 2.168-1.84-.968zm4.163-2.295a.24.24 0 01-.237.238h-1.14l-.26-1.587c0-.007-.002-.013-.004-.019a4.3 4.3 0 00.964-2.716 4.327 4.327 0 00-4.323-4.322 4.327 4.327 0 00-4.322 4.322c0 1.028.362 1.973.963 2.716 0 .006-.003.012-.004.018l-.26 1.59-.024-.002H1.662a.24.24 0 01-.237-.238V2.285a.24.24 0 01.237-.237h20.676a.24.24 0 01.237.237v14.027z"
                                                                        ></path>
                                                                        <path
                                                                            fill="#000002"
                                                                            d="M19.819 4.724H3.669a.712.712 0 100 1.425h16.15a.712.712 0 100-1.425zM10.51 8.587H3.67a.712.712 0 100 1.425h6.84a.712.712 0 100-1.425z"
                                                                        ></path>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <p className="orders--order-date">
                                                            {/* {new Date(item.createdAt).toLocaleDateString()} */}
                                                            {/* Price:{" "} */}
                                                            <span className="orders--old-price">
                                                                {/* {product?.quantity}{" "} x {" "} */}
                                                                {/* {currencySymbol}
                                {oldPrice} */}
                                                            </span>
                                                            {product?.quantity} x {item?.currency}{" "}
                                                            {currencySymbol}
                                                            {formatCurrency(price, item?.currency)}
                                                            {/* <span className="orders--tons-txt">Tons</span> */}
                                                        </p>
                                                        <p className="orders--order-carbon-offset-quantity-holder">
                                                            {/* Carbon offset quantity: {product?.quantity} */}
                                                            Total: {item?.currency} {currencySymbol}
                                                            {formatCurrency(
                                                                (price * product?.quantity)?.toFixed(2),
                                                                item?.currency
                                                            )}
                                                            {/* <span className="orders-order-carbon-offset-quantity-small-text">
                              Tons
                            </span> */}
                                                        </p>
                                                        <div className="orders--order-product-info-holder">
                                                            <div className="orders-order-name">
                                                                <Link
                                                                    href={`/shop/product-basic/[slug]?slug=${product?.product?.slug}`}
                                                                    as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.product?.slug}`}
                                                                >
                                                                    <a target="blank">
                                                                        {product?.product?.name}
                                                                    </a>
                                                                </Link>
                                                            </div>

                                                            <div className="orders-order-description">
                                                                <Link
                                                                    href={`/shop/product-basic/[slug]?slug=${product?.product?.slug}`}
                                                                    as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.product?.slug}`}
                                                                >
                                                                    <a target="blank">
                                                                        {returnShortenParagraph(
                                                                            product?.product?.shortDescription
                                                                        )}
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="orders--order-breaker" />
                                        </div>
                                    );
                                })}
                            {/* <div className="orders--product-info-wrapper">
                  <div className="orders--each-order">
                    <div className="orders--each-image-holder">
                      <img
                        src={
                          Array.isArray(product?.product?.image) &&
                          product?.product?.image.length &&
                          product?.product?.image[0]
                        }
                        height={100}
                        width={90}
                        alt="Product Image"
                      />
                    </div>
                    <div className="orders--each-info-holder"></div>
                  </div>
                </div> */}
                        </div>
                        <div className="orders--right-side-holder">
                            <div className="orders--date-time-holder">
                                <p
                                    className="orders--date-holder"
                                    style={{ textAlign: "right" }}
                                >
                                    Date: <b>{getFormattedDate(item.createdAt)} </b>
                                </p>
                                <p
                                    className="orders--time-holder"
                                    style={{ textAlign: "right" }}
                                >
                                    Time:{" "}
                                    <b>
                                        {/* {new Date(item.createdAt).toUTCString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} */}
                                        {getFormattedTime(item.createdAt)}

                                        {/* {timezone.tz().zoneAbbr()} */}
                                        {/* {getUTCTimeHandler(new Date(item?.createdAt))} UTC */}
                                    </b>
                                </p>
                            </div>
                            {/* {item?.paymentLogs[0]?.mode === "subscription" &&
                  item?.subscriptionCancelledAt === 0 && (
                    <button
                      onClick={() => handleCancelSubscription(item)}
                      className="d-flex align-items-center lezada-button lezada-button--medium space-mt--20"
                      style={{
                        marginTop: 15,
                        width: "100%",
                      }}
                    >
                      Cancel Subscription
                    </button>
                  )}
                {item?.paymentLogs[0]?.mode === "subscription" && (
                  <button
                    onClick={() => handleManageSubscription(item)}
                    className="d-flex align-items-center lezada-button lezada-button--medium space-mt--20"
                    style={{
                      marginTop: 15,
                    }}
                  >
                    Manage Subscription
                  </button>
                )} */}
                            <div className="orders--order-total-holder">
                                <div className="orders-total-holder">
                                    <h3>Order Total:</h3>
                                    <h3>
                                        {item?.currency} {item?.currencySymbol}
                                        {/* {item?.paymentLogs[0]?.mode === "subscription"
                        ? formatCurrency(
                            (
                              (item?.paymentLogs[0]?.amount_total / 100) *
                              12
                            )?.toFixed(2),
                            item?.currency
                          )
                        : formatCurrency(
                            (item?.paymentLogs[0]?.amount_total / 100)?.toFixed(
                              2
                            ),
                            item?.currency
                          )} */}
                                        {formatCurrency(item?.orderTotal, item?.currency)}
                                    </h3>
                                </div>
                                {item?.calculatedCouponDiscount !== 0 && (
                                    <div className="orders-total-items-holder">
                                        <h4>
                                            Discount Applied: {item?.currency}{" "}
                                            {item?.currencySymbol}
                                            {formatCurrency(
                                                item?.calculatedCouponDiscount?.toFixed(2),
                                                item?.currency
                                            )}
                                        </h4>
                                    </div>
                                )}
                                <div className="orders-total-items-holder">
                                    <h4>Total Items: {getTotalItemsInOrder(item.products)}</h4>{" "}
                                    {/* <h4>{getTotalItemsInOrder(item.products)}</h4>{" "} */}
                                </div>
                                <div className="orders--total-line-breaker" />
                                <div className="orders--card-details">
                                    <div>Method: Credit Card</div>
                                    <div>
                                        Payment type:{" "}
                                        {item?.paymentLogs[0]?.mode === "subscription"
                                            ? "Monthly Subscription"
                                            : "One Time Payment"}
                                    </div>
                                    <div>
                                        Total paid: {item?.currency} {item?.currencySymbol}
                                        {formatCurrency(item?.amountPaid, item?.currency)}
                                    </div>
                                    {item?.paymentLogs[0]?.mode === "subscription" && (
                                        <div>
                                            Payment remaining: {item?.currency}{" "}
                                            {item?.currencySymbol}
                                            {formatCurrency(item?.amountRemaining, item?.currency)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {item?.paymentLogs[0]?.mode === "subscription" && (
                                <>
                                    <div className="orders--subscription-info-holder">
                                        <b>Subscription Term</b>
                                        <div className="orders--subscription-info">
                                            <p>Start Date: {getFormattedDate(item?.createdAt)}</p>
                                            <p>
                                                End Date: {returnOneYearForwardDate(item.createdAt)}
                                            </p>
                                            <p>
                                                Monthly payment: {item?.currency}{" "}
                                                {item?.currencySymbol}
                                                {formatCurrency(
                                                    (item?.paymentLogs[0]?.amount_total / 100).toFixed(
                                                        2
                                                    ),
                                                    item?.currency
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="subscription-holder">
                                        {item?.amountRemaining == 0 ||
                                            item?.subscriptionCancelledAt ? (
                                            ""
                                        ) : (
                                            <button
                                                onClick={() => handleManageSubscription(item)}
                                                className="orders--manage-subscription orders--write-review order button--white"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="#333"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                    ></path>
                                                    <path
                                                        stroke="#333"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                                <span style={{ marginLeft: "10.56px" }}>
                                                    Manage Payment
                                                </span>
                                            </button>
                                        )}
                                        {item?.subscriptionCancelledAt > 0 ? (
                                            ""
                                        ) : (
                                            <button
                                                onClick={() => handleCancelSubscription(item)}
                                                className="orders--cancel-subscription orders--write-review order button--black"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="21"
                                                    height="20"
                                                    fill="none"
                                                    viewBox="0 0 21 20"
                                                >
                                                    <path
                                                        fill="#fff"
                                                        fillRule="evenodd"
                                                        d="M4.473 4.293a1 1 0 011.414 0l4.293 4.293 4.293-4.293a1 1 0 111.414 1.414L11.594 10l4.293 4.293a1 1 0 01-1.414 1.414l-4.293-4.293-4.293 4.293a1 1 0 01-1.414-1.414L8.765 10 4.473 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                                <span style={{ marginLeft: "10.56px" }}>
                                                    Cancel Subscription
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <button
                                    className="orders--write-review order"
                                    onClick={() =>
                                        reviewPopUpHandler({
                                            products: item.products,
                                            orderId: item._id,
                                            currency: item.currency,
                                            businessReview: true
                                        })
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 17 16"
                                    >
                                        <path
                                            fill="#fff"
                                            d="M13.922 2.462l.308-.326-.308.326zM4.667 13.475v.45a.45.45 0 00.309-.123l-.309-.327zm-2.353 0h-.449c0 .248.201.45.45.45v-.45zm0-2.273l-.308-.326a.45.45 0 00-.14.326h.448zm9.54-8.414a1.299 1.299 0 011.759 0l.617-.652a2.197 2.197 0 00-2.994 0l.618.652zm1.759 0c.469.445.469 1.154 0 1.598l.617.653a1.981 1.981 0 000-2.903l-.617.652zm0 1.598L4.358 13.15l.618.653 9.255-8.763-.618-.653zm-8.946 8.64H2.314v.899h2.353v-.899zm6.57-10.89l-9.231 8.74.617.653 9.23-8.74-.617-.653zm-9.372 9.066v2.273h.899v-2.273h-.899zm8.363-7.459l2.376 2.25.618-.652-2.376-2.25-.618.652z"
                                        ></path>
                                    </svg>{" "}
                                    <span style={{ marginLeft: "10.56px" }}>
                                        Write a Product Review
                                    </span>
                                </button>
                            </div>
                            {item?.subscriptionCancelledAt > 0 && (
                                <div style={{ paddingTop: "20px", color: "red" }}>
                                    Subscription cancelled at:{" "}
                                    {new Date(
                                        item?.subscriptionCancelledAt * 1000
                                    ).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className="space-mt--10 my-account--order-card__total">
              Total: ${item?.orderTotal}
            </div> */}
                </Card>
            </div>
        ))
        : null;

    const fetchData = () => {
        if (metaData.nextPage) {
            const page = currentPage + 1;
            setCurrentPage(page);
        } else {
        }
    };

    return (
        <div>
            <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none", marginBottom: "-45px", marginTop: "50px" }}>Business Name:  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
            {localStorage.getItem("MyBusinessDetails") ?
                orders.length ? (
                    <div className="orders-page">
                        {order}
                        {hasMore && (
                            <button
                                className="orders--show-more-button button--black"
                                onClick={fetchData}
                            >
                                Show more
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center" style={{ marginTop: "50px" }}>
                        {orderLoading ? (
                            <Spinner animation="border" role="status" />
                        ) : (
                            <p style={{ marginTop: "50px" }} className="text-center">
                                No Orders Yet!
                            </p>
                        )}
                    </div>
                )
                : <p style={{ marginTop: "50px" }} className="text-center">
                    Create a business to view orders
                </p>
            }
        </div>
    );
};

export default BusinessOrders;
