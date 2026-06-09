import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { IoIosArrowRoundUp } from "react-icons/io";
import { animateScroll } from "react-scroll";
import { SubscribeEmailTwo } from "../Newsletter";
import TrackOverlay from "../Header/elements/TrackOverlay";
import router from "next/router";
import Link from "next/link";
const FooterTwo = ({ footerBgClass }) => {
  const tweetText = `Hey, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page. %23saveplanet %23make the world sustainable`;

  const [scroll, setScroll] = useState(0);
  const [top, setTop] = useState(0);
  const [offCanvasTrackActive, setOffCanvasTrackActive] = useState(false);
  useEffect(() => {
    setTop(100);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    animateScroll.scrollToTop();
  };
  const handleTrackWindow = () => {
    setOffCanvasTrackActive(true);
  };
  const handleScroll = () => {
    setScroll(window.scrollY);
  };
  return (
    <footer
      className={`space-pt--100 space-pb--50 ${
        footerBgClass ? footerBgClass : "bg-color--grey"
      } footer`}
    >
      <Container className="wide">
        <Row>
          <Col className="footer-single-widget space-mb--50">
            {/* logo */}
            <div className="logo space-mb--35">
              <img
                style={{ cursor: "pointer", maxWidth: "125px" }}
                onClick={() => router.push("/")}
                src={
                  process.env.PUBLIC_URL + footerBgClass ===
                  "bg-color--blue-two"
                    ? "/assets/images/logo-alt.png"
                    : "/assets/images/logo.big1.png"
                }
                className="img-fluid"
                // style={{ maxWidth: "200px" }}
                alt=""
              />
            </div>

            {/*=======  copyright text  =======*/}
            <div className="footer-single-widget__copyright footer--netcarbon-text-copyright">
              <div style={{ marginBottom: "5px" }}>
                &copy; {new Date().getFullYear() + " "}
                <a href={process.env.NEXT_PUBLIC_UI_URL}>ECOSTANCE.</a>
              </div>
              <span>All Rights Reserved</span>
              <nav className="footer-single-widget__nav">
                <ul className="single--footer-section">
                  <li style={{ padding: 0, paddingTop: 6 }}>
                    <Link href={`/terms`}>Terms & Conditions</Link>
                  </li>
                  <li style={{ padding: 0, paddingTop: 6 }}>
                    <Link href={`/privacy`}>Privacy Policy</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title footer--section-heading">
              ABOUT
            </h5>
            <nav className="footer-single-widget__nav">
              <ul className="single--footer-section">
                <li>
                  <Link href="/about">Company</Link>
                </li>
                {/* <li>
                  <Link href="/other/why">Why Us</Link>
                </li>
                <li>
                  <Link href="/other/technology">Technology</Link>
                </li> */}
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title footer--section-heading">
              USEFUL LINKS
            </h5>
            <nav className="footer-single-widget__nav">
              <ul className="single--footer-section">
                <li>
                  <Link
                    // target="_blank"
                    href={`${process.env.PUBLIC_URL}/other/individuals`}
                  >
                    Individuals
                  </Link>
                </li>
                {/* <li>
                  <Link
                    // target="_blank"
                    href={`${process.env.PUBLIC_URL}/other/business`}
                  >
                    Businesses
                  </Link>
                </li>
                <li>
                  <Link
                    // target="_blank"
                    href={`${process.env.PUBLIC_URL}/other/industries`}
                  >
                    Industries
                  </Link>
                </li>{" "}
                <li>
                 
                  <Link href="/other/media">Media</Link>
                </li> */}
                <li>
                  <Link
                    // target="_blank"
                    href={`${process.env.PUBLIC_URL}/other/track/`}
                  >
                    Track
                  </Link>
                </li>
                {/* <li>
                  <Link
                    // target="_blank"
                    href={`${process.env.PUBLIC_URL}/support/`}
                  >
                    Support
                  </Link>
                </li> */}
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title footer--section-heading">
              FOLLOW US ON
            </h5>
            <nav className="footer-single-widget__nav footer-single-widget__nav--social">
              <ul className="single--footer-section">
                <li>
                  {/* <a href="https://x.com/EcoStance_" target="_blank"> */}
                  <a href="https://x.com/EcoStance_" target="_blank">
                    <FaTwitter /> Twitter
                  </a>
                </li>
                <li>
                  <a>
                    <FaFacebookF /> Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/ecostance_"
                    target="_blank"
                  >
                    <FaInstagram /> Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCM6PvekUmQeeK6rDAhOiCdg"
                    target="_blank"
                  >
                    <FaYoutube /> Youtube
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/ecostance-93476a289/"
                    target="_blank"
                  >
                    <FaLinkedin /> LinkedIn
                  </a>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <div className="footer-subscribe-widget">
              <h2 className="footer-subscribe-widget__title">Newsletter.</h2>
              <p className="footer-subscribe-widget__subtitle footer-subscribe-text-subheading">
                Receive news, updates and cutting-edge insight on
                Sustainability.
              </p>
              {/* email subscription */}
              <SubscribeEmailTwo mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef" />
            </div>
          </Col>
        </Row>
      </Container>
      <button
        className={`scroll-top ${scroll > top ? "show" : ""}`}
        onClick={() => scrollToTop()}
      >
        <IoIosArrowRoundUp />
      </button>
      <TrackOverlay
        placeholder={"Document or Certificate..."}
        activeStatus={offCanvasTrackActive}
        getActiveStatus={setOffCanvasTrackActive}
      />
    </footer>
  );
};

export default FooterTwo;
