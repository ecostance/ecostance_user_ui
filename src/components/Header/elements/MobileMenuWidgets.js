import {
  IoIosPhonePortrait,
  IoMdMail,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoPinterest,
  IoMdPerson,
  IoLogoYoutube,
  IoLogoLinkedin,
} from "react-icons/io";

import Link from "next/link";

const MobileMenuWidgets = ({ loggedInUserInfo }) => {
  {
    // console.log(loggedInUserInfo);
  }
  return (
    <div className="offcanvas-mobile-menu__widgets">
      <div className="contact-widget space-mb--30">
        <ul>
          <li>
            <IoMdPerson />
            {!loggedInUserInfo.isLoggedIn ? (
              <Link
                href="/login-register"
                as={process.env.PUBLIC_URL + "/login-register"}
              >
                <a>Login / Register</a>
              </Link>
            ) : (
              <Link
                href="/other/my-account"
                as={process.env.PUBLIC_URL + "/other/my-account"}
              >
                <a>
                  {loggedInUserInfo?.slug?.firstName &&
                  loggedInUserInfo?.slug?.lastName
                    ? `${loggedInUserInfo?.slug.firstName} ${loggedInUserInfo?.slug.lastName}`
                    : `${loggedInUserInfo?.user?.email}`}
                </a>
              </Link>
            )}
          </li>
          <li>
            <IoIosPhonePortrait />
            <a href="tel://12452456012">(+1) 602.688.2330</a>
          </li>
          <li>
            <IoMdMail />
            <a href="mailto:info@yourdomain.com">service@ecostance.com</a>
          </li>
        </ul>
      </div>

      <div className="social-widget">
        <a href="https://www.x.com/EcoStance_" target="_blank">
          <IoLogoTwitter />
        </a>
        <a href="https://www.facebook.com" target="_blank">
          <IoLogoFacebook />
        </a>
        <a href="https://www.instagram.com/ecostance_" target="_blank">
          <IoLogoInstagram />
        </a>
        <a
          href="https://www.youtube.com/channel/UCM6PvekUmQeeK6rDAhOiCdg"
          target="_blank"
        >
          <IoLogoYoutube />
        </a>
        <a
          href="https://www.linkedin.com/in/ecostance-93476a289/"
          target="_blank"
        >
          <IoLogoLinkedin />
        </a>
      </div>
    </div>
  );
};

export default MobileMenuWidgets;
