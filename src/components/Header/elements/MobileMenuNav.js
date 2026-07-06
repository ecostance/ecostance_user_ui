import { useEffect } from "react";
import Link from "next/link";

const MobileMenuNav = ({ getActiveStatus, handleLogout, loggedInUserInfo }) => {
  // Allowed emails for Dynamic Pricing
  const allowedEmails = [
    "rofep35802@calunia.com",
    "tgiroti@yahoo.com",
    "vinu988031@gmail.com",
    "rafi496@yopmail.com",
  ];
  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;
  const isLoggedIn = loggedInUserInfo?.isLoggedIn || false;
  const showDynamicPricing =
    isLoggedIn && allowedEmails.includes(currentUserEmail);
  useEffect(() => {
    const offCanvasNav = document.querySelector(
      "#offcanvas-mobile-menu__navigation",
    );
    const offCanvasNavSubMenu =
      offCanvasNav.querySelectorAll(".mobile-sub-menu");
    const anchorLinks = offCanvasNav.querySelectorAll("a");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='menu-expand'><i></i></span>",
      );
    }

    const menuExpand = offCanvasNav.querySelectorAll(".menu-expand");
    const numMenuExpand = menuExpand.length;

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", (e) => {
        sideMenuExpand(e);
      });
    }

    for (let i = 0; i < anchorLinks.length; i++) {
      anchorLinks[i].addEventListener("click", () => {
        getActiveStatus(false);
      });
    }
  }, []);

  const sideMenuExpand = (e) => {
    e.currentTarget.parentElement.classList.toggle("active");
  };
  return (
    <nav
      className="offcanvas-mobile-menu__navigation"
      id="offcanvas-mobile-menu__navigation"
    >
      <ul>
        <li>
          <Link
            href="/shop/left-sidebar"
            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
          >
            <a>Shop</a>
          </Link>
        </li>
        <li
          className="menu-item-has-children"
          // onClick={() => getActiveStatus(false)}
        >
          <Link
            href="/other/individuals"
            as={process.env.PUBLIC_URL + "/other/individuals"}
          >
            <a>Individuals</a>
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link
                href="/other/individuals"
                as={process.env.PUBLIC_URL + "/other/individuals"}
              >
                <a>Overview</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/carbon-offset"
                as={process.env.PUBLIC_URL + "/other/carbon-offset"}
              >
                <a>Carbon Footprint</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/work-carbon-offset"
                as={process.env.PUBLIC_URL + "/other/work-carbon-offset"}
              >
                <a>Work Carbon Footprint</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/conference-carbon-offset"
                as={process.env.PUBLIC_URL + "/other/conference-carbon-offset"}
              >
                <a>Conference Carbon Footprint</a>
              </Link>
            </li>
            <li>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a>Shop</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/my-account"
                as={process.env.PUBLIC_URL + "/other/my-account"}
              >
                <a>EcoStance Page</a>
              </Link>
            </li>
            {showDynamicPricing && (
              <li>
                <Link
                  href="/other/dynamic-pricing"
                  as={process.env.PUBLIC_URL + "/other/dynamic-pricing"}
                >
                  <a>Dynamic Pricing</a>
                </Link>
              </li>
            )}
          </ul>
        </li>
        {/* <li
          className="menu-item-has-children"
        >
          <Link
            href="/other/business"
            as={process.env.PUBLIC_URL + "/other/business"}
          >
            <a>Business</a>
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link
                href="/other/business"
                as={process.env.PUBLIC_URL + "/other/business"}
              >
                <a>Business</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/business1"
                as={process.env.PUBLIC_URL + "/other/business1"}
              >
                <a>Business1</a>
              </Link>
            </li>
            <li>
              <Link
                href="/shop/business2"
                as={process.env.PUBLIC_URL + "/shop/business2"}
              >
                <a>Business2</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/business3"
                as={process.env.PUBLIC_URL + "/other/business3"}
              >
                <a>Business3</a>
              </Link>
            </li>
          </ul>
        </li> */}
        <li
          className="menu-item-has-children"
          // onClick={() => getActiveStatus(false)}
        >
          <Link href="/blog" as={process.env.PUBLIC_URL + "/blog"}>
            <a>Resources</a>
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link href="/blog" as={process.env.PUBLIC_URL + "/blog"}>
                <a>Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/faq" as={process.env.PUBLIC_URL + "/faq"}>
                <a>FAQ</a>
              </Link>
            </li>
            {/* <li>
              <Link href="/media" as={process.env.PUBLIC_URL + "/media"}>
                <a>Media</a>
              </Link>
            </li> */}
            {/* <li>
              <Link href="/reports" as={process.env.PUBLIC_URL + "/reports"}>
                <a>Reports</a>
              </Link>
            </li> */}
          </ul>
        </li>
        {/* <li
          className="menu-item-has-children"
          // onClick={() => getActiveStatus(false)}
        >
          <Link
            href="/other/business"
            as={process.env.PUBLIC_URL + "/other/business"}
          >
            <a>Business</a>
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link
                href="/other/business"
                as={process.env.PUBLIC_URL + "/other/business"}
              >
                <a>Overview</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/industries"
                as={process.env.PUBLIC_URL + "/other/industries"}
              >
                <a>Industries</a>
              </Link>
            </li>
          </ul>
        </li>
        // <li
        //   className="menu-item-has-children"
        //   // onClick={() => getActiveStatus(false)}
        // >
        //   <Link
        //     href="/other/media"
        //     as={process.env.PUBLIC_URL + "/other/media"}
        //   >
        //     <a>Media</a>
        //   </Link>
        //   <ul className="mobile-sub-menu">
        //     <li>
        //       <Link href="/blog" as={process.env.PUBLIC_URL + "/blog"}>
        //         <a>Blog</a>
        //       </Link>
        //     </li>
        //     <li>
        //       <Link
        //         href="/other/media/video"
        //         as={process.env.PUBLIC_URL + "/other/media/video"}
        //       >
        //         <a>Video</a>
        //       </Link>
        //     </li>
        //     <li>
        //       <Link
        //         href="/other/media/reports"
        //         as={process.env.PUBLIC_URL + "/other/media/reports"}
        //       >
        //         <a>Reports</a>
        //       </Link>
        //     </li>
        //     <li>
        //       <Link
        //         href="/other/faq"
        //         as={process.env.PUBLIC_URL + "/other/faq"}
        //       >
        //         <a>FAQ</a>
        //       </Link>
        //     </li>
        //   </ul>
        // </li> */}
        {/* <li>
          <Link href="/media" as={process.env.PUBLIC_URL + "/media"}>
            <a>Media</a>
          </Link>
        </li>
        <li>
          <Link href="/reports" as={process.env.PUBLIC_URL + "/reports"}>
            <a>Reports</a>
          </Link>
        </li> */}
        {/* <li>
          <Link href="/blog" as={process.env.PUBLIC_URL + "/blog"}>
            <a>Blog</a>
          </Link>
        </li> */}
        {/* <li>
          <Link href="/faq" as={process.env.PUBLIC_URL + "/faq"}>
            <a>FAQ</a>
          </Link>
        </li> */}
        {/* <li>
          <Link href="/faq" as={process.env.PUBLIC_URL + "/faq"}>
            <a>FAQ</a>
          </Link>
        </li> */}
        <li>
          <Link
            href="/other/track"
            as={process.env.PUBLIC_URL + "/other/track"}
          >
            <a>Track</a>
          </Link>
        </li>
        {loggedInUserInfo?.isLoggedIn ? (
          <>
            <li>
              <Link href={""}>
                <a onClick={handleLogout}>Logout</a>
              </Link>
            </li>
            <li
              className="menu-item-has-children"
              // onClick={() => getActiveStatus(false)}
            >
              <Link
                href="/other/my-account"
                as={process.env.PUBLIC_URL + "/other/my-account"}
              >
                <a>My Account</a>
              </Link>
              <ul className="mobile-sub-menu">
                <li>
                  <Link
                    href="/other/my-account"
                    as={process.env.PUBLIC_URL + "/other/my-account"}
                  >
                    <a>My Personal Account</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/other/my-employer-account"
                    as={process.env.PUBLIC_URL + "/other/my-employer-account"}
                  >
                    <a>My Employer Account</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/other/my-business-account"
                    as={process.env.PUBLIC_URL + "/other/my-business-account"}
                  >
                    <a>My Business Account</a>
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li>
              <Link
                href="/other/my-account"
                as={process.env.PUBLIC_URL + "/other/my-account"}
              >
                <a>My Personal Account</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/my-employer-account"
                as={process.env.PUBLIC_URL + "/other/my-employer-account"}
              >
                <a>My Employer Account</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/my-business-account"
                as={process.env.PUBLIC_URL + "/other/my-business-account"}
              >
                <a>My Business Account</a>
              </Link>
            </li> */}
          </>
        ) : null}
      </ul>
    </nav>
  );
};

export default MobileMenuNav;
