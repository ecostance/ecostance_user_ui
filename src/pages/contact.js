import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosPin, IoIosCall, IoIosMail, IoIosClock } from "react-icons/io";
import { LayoutTwo } from "../components/Layout";
import { BreadcrumbOne } from "../components/Breadcrumb";
import { SectionTitleOne, SectionTitleTwo } from "../components/SectionTitle";
import Head from "next/head";
import axios from "axios";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // const postComment = async () => {
  //   setErrorMsg("");
  //   try {
  //     const response = await axios.post(
  //       process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/comments`,
  //       {
  //         author_name: authorName,
  //         author_email: authorEmail,
  //         author_url: authorWebsite,
  //         content: authorComment,
  //         post: postObj?.id,
  //       }
  //     );
  //     setComments([...comments, response.data]);
  //     setAuthorName("");
  //     setAuthorEmail("");
  //     setAuthorWebsite("");
  //     setAuthorComment("");
  //   } catch (error) {
  //     console.log(error.response.data.message);

  //     setErrorMsg(error.response.data.message);
  //   }
  // };

  const handleContactForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log(firstName, customerEmail, contactSubject, contactMessage);
    if (firstName && customerEmail && contactSubject && contactMessage) {
      // Send form data to contact form 7 via wordpress api v2

      let formData = new FormData();
      formData.set("your-name", firstName);
      formData.set("your-email", customerEmail);
      formData.set("your-subject", contactSubject);
      formData.set("your-message", contactMessage);

      axios
        .post(
          process.env.PUBLIC_BLOG_URL +
            `/wp-json/contact-form-7/v1/contact-forms/20/feedback`,
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then(({ data }) => {
          if (data.status === "mail_sent") {
            setSuccess(true);
            setFirstName("");
            setCustomerEmail("");
            setContactSubject("");
            setContactMessage("");
            setLoading(false);
          } else {
            setError(data.message);
            setLoading(false);
          }
          // console.log(res, "contact form 7 response");
          // setSuccess(true);
        });
    } else {
      setError("Please fill all the fields.");
      setLoading(false);
    }
  };

  return (
    <LayoutTwo>
      <Head>
        <title>Contact - ECOSTANCE</title>
      </Head>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Contact"
        backgroundImage="/assets/images/backgrounds/contact.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Contact</li>
        </ul>
      </BreadcrumbOne>
      <div className="contact-page-content-wrapper space-mt--r130 space-mb--r130">
        <div className="contact-page-top-info space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleTwo
                  title="Contact detail"
                  // subtitle="COME HAVE A LOOK"
                />
              </Col>
            </Row>
            <Row className="space-mb-mobile-only--m50">
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box" style={{ alignItems: "flex-start" }}>
                  <div
                    className="icon-box__icon"
                    style={{ paddingTop: "30px" }}
                  >
                    <IoIosPin />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">ADDRESS</h3>
                    <p className="content">
                      20 E. Thomas Road, Suite 2200, Century Link Tower,
                      Phoenix, Arizona 85012, USA
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  {/* <div className="icon-box__icon">
                    <IoIosCall />
                  </div> */}
                  <div className="icon-box__content">
                    <h3 className="title" style={{ paddingLeft: "30px" }}>
                      CONTACT
                    </h3>
                    {/* <p className="content">
                      Mobile: (+1) 407.951.0510
                      <span>Hotline: 1800 – 1102</span>
                    </p> */}
                  </div>
                </div>
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosMail />
                  </div>
                  <div className="icon-box__content">
                    <p className="content"> Mail: info@ecostance.com</p>
                  </div>
                </div>

                <div className="icon-box" style={{ paddingTop: "8px" }}>
                  <div className="icon-box__icon">
                    <IoIosCall />
                  </div>
                  <div className="icon-box__content">
                    <p className="content">Phone: +1 602 688 2330 </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box" style={{ alignItems: "flex-start" }}>
                  <div
                    className="icon-box__icon"
                    style={{ paddingTop: "30px" }}
                  >
                    <IoIosClock />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">HOUR OF OPERATION</h3>
                    <p className="content">
                      Monday – Friday: 24/7 x 365
                      <span>Sunday &amp; Saturday: 24/7 x 365</span>
                    </p>
                    <p className="content">
                      Phone: 6AM – 6PM (MST) Phoenix, AZ
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="contact-page-map space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="google-map">
                  {/* <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6777.000026107364!2d-74.08304414937152!3d40.83212940017352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f866a80dcc27%3A0x3e3160910d4d5045!2sHoliday%20Inn%20Express%20%26%20Suites%20Meadowlands%20Area!5e0!3m2!1sen!2sbd!4v1581852597883!5m2!1sen!2sbd"
                    allowFullScreen
                  /> */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.794907218539!2d-112.07397232346045!3d33.48069004769217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b12675eee0cff%3A0xd8e4341aeb64d012!2sCenturyLink%20Tower%2C%2020%20E%20Thomas%20Rd%20%232200%2C%20Phoenix%2C%20AZ%2085012%2C%20USA!5e0!3m2!1sen!2sin!4v1693039224890!5m2!1sen!2sin"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="contact-page-form">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleOne title="Get in touch" />
              </Col>
            </Row>
            <Row>
              <Col lg={8} className="ml-auto mr-auto">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    Your message has been sent successfully.
                  </div>
                )}
                <div className="lezada-form contact-form">
                  <form>
                    <Row>
                      <Col md={6} className="space-mb--40">
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          type="text"
                          placeholder="First Name *"
                          name="customerName"
                          id="customerName"
                          required
                        />
                      </Col>
                      <Col md={6} className="space-mb--40">
                        <input
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          type="email"
                          placeholder="Email *"
                          name="customerEmail"
                          id="customerEmail"
                          required
                        />
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <input
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          type="text"
                          placeholder="Subject"
                          name="contactSubject"
                          id="contactSubject"
                        />
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <textarea
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          cols={30}
                          rows={10}
                          placeholder="Message"
                          name="contactMessage"
                          id="contactMessage"
                          defaultValue={""}
                        />
                      </Col>
                      <Col md={12} className="text-center">
                        <button
                          onClick={(e) => handleContactForm(e)}
                          type="submit"
                          value="submit"
                          id="submit"
                          className="lezada-button lezada-button--medium"
                        >
                          {loading ? "Sending..." : "Submit"}
                        </button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default Contact;
