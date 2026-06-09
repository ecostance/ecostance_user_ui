import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { LayoutTwo } from "../../components/Layout";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
// import { connect } from 'react-redux';
import alert from "../../assets/images/Icon-alert-triangle.svg";
import Image from "next/image";

const Cancel = (props) => {
  const Router = useRouter();
  const [order, setOrder] = useState({});

  useEffect(() => {
    localStorage.removeItem("BusinessOrderSelection")
    // handleStripeSession()
  }, []);

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle="Payment cancel"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Payment cancel</li>
        </ul>
      </BreadcrumbOne>

      <Container className="mt-space--100 mb-space--100">
        {/* <h3 className="mt-2">Payment Cancelled</h3> */}

        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Image src={alert} alt="sustainable" className="" />
            <h3 className="mt-2">Payment Cancelled</h3>
          </Col>
        </Row>
        <Row className="mt-5 justify-content-center">
          <Col md={10} className="order-details-custom mt-0">
            {/* <Row className="mb-5">
                            <Col>
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th>
                                                Date/ Time
                                            </th>
                                            <th>
                                                Account No.
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="">
                                                {order?.order?.orderDate}
                                            </td>
                                            <td>
                                                {order?.accountNumber}
                                            </td>
                                            <td>
                                                {order?.status}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row> */}
            <Row className="justify-content-between">
              <Col xs={12}>
                <h5 style={{ color: "#333" }}>
                  <b>Have a question? Contact Us</b>
                </h5>
              </Col>
            </Row>
            <Row className="mt-3 justify-content-between">
              <Col xs={12}>
                <h6 style={{ color: "#333" }}>
                  <span className="mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22.089"
                      height="17.5"
                      viewBox="0 0 22.089 17.5"
                    >
                      <g
                        id="Icon_feather-mail"
                        data-name="Icon feather-mail"
                        transform="translate(-1.955 -5.25)"
                      >
                        <path
                          id="Path_396"
                          data-name="Path 396"
                          d="M5,6H21a2.006,2.006,0,0,1,2,2V20a2.006,2.006,0,0,1-2,2H5a2.006,2.006,0,0,1-2-2V8A2.006,2.006,0,0,1,5,6Z"
                          fill="none"
                          stroke="#333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                        <path
                          id="Path_397"
                          data-name="Path 397"
                          d="M23,9,13,16,3,9"
                          transform="translate(0 -1)"
                          fill="none"
                          stroke="#333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </g>
                    </svg>
                  </span>
                  support@ecostance.com
                </h6>
              </Col>
            </Row>
            <Row className="mt-3 justify-content-between">
              <Col xs={12}>
                <h6 style={{ color: "#333" }}>
                  <span className="mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21.501"
                      height="21.542"
                      viewBox="0 0 21.501 21.542"
                    >
                      <path
                        id="Icon_feather-phone"
                        data-name="Icon feather-phone"
                        d="M23.167,18V21.02a2.011,2.011,0,0,1-2.192,2.011A19.9,19.9,0,0,1,12.3,19.944a19.609,19.609,0,0,1-6.034-6.034A19.9,19.9,0,0,1,3.176,5.192,2.011,2.011,0,0,1,5.177,3H8.194a2.011,2.011,0,0,1,2.011,1.73,12.912,12.912,0,0,0,.7,2.826,2.011,2.011,0,0,1-.453,2.122L9.179,10.954a16.09,16.09,0,0,0,6.034,6.034l1.277-1.277a2.011,2.011,0,0,1,2.122-.453,12.912,12.912,0,0,0,2.826.7A2.011,2.011,0,0,1,23.167,18Z"
                        transform="translate(-2.417 -2.25)"
                        fill="none"
                        stroke="#333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  +1 1234 567891
                </h6>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </LayoutTwo>
  );
};

export default Cancel;
