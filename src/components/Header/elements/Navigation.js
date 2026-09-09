import Link from "next/link";
import { useState } from "react";
import { isDynamicPricingAdmin } from "src/constants/dynamicPricingAdmins";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import SearchOverlay from "./SearchOverlay";
const Navigation = ({ handleTrackWindow, userData }) => {
  const [offCanvasSearchActive, setOffCanvasSearchActive] = useState(false);

  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;
  const isLoggedIn = userData?.isLoggedIn || false;
  const showDynamicPricing =
    isLoggedIn && isDynamicPricingAdmin(currentUserEmail);

  return (
    <nav className="header-content__navigation d-none d-xl-block">
      <ul>
        <li
          // onClick={() => setOffCanvasSearchActive(true)}
          className="position-relative"
          //   onClick={handleTrackWindow}
        >
          <Link
            href="/shop/left-sidebar"
            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
          >
            <a>Shop</a>
          </Link>
        </li>
        <li className="position-relative">
          <Link href="/other/individuals">
            <a>Individuals&nbsp;</a>
          </Link>
          <IoIosArrowDown />
          <ul
            className="sub-menu sub-menu--one-column about-dropdown-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li>
              <Link href="/other/individuals">
                {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/about-us/`}
                as={`${process.env.PUBLIC_BLOG_URL}/about-us/`}
              > */}
                <a>Overview</a>
              </Link>
            </li>
            <li>
              {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
                as={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
              > */}
              <Link href="/other/carbon-offset">
                <a>Carbon Footprint</a>
              </Link>
            </li>
            <li>
              {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
                as={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
              > */}
              <Link href="/other/work-carbon-offset">
                <a>Work Carbon Footprint</a>
              </Link>
            </li>
            <li>
              {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
                as={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
              > */}
              <Link href="/other/conference-carbon-offset">
                <a>Conference Carbon Footprint</a>
              </Link>
            </li>
            <li>
              {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/technology-2`}
                as={`${process.env.PUBLIC_BLOG_URL}/technology-2`}
              > */}
              <Link href="/shop/left-sidebar">
                <a>Shop</a>
              </Link>
            </li>
            <li>
              <Link href="/other/my-account?sustainability=true">
                <a>EcoStance Page</a>
              </Link>
            </li>
            {showDynamicPricing && (
              <li>
                <Link href="/other/dynamic-pricing">
                  <a>Dynamic Pricing</a>
                </Link>
              </li>
            )}
          </ul>
        </li>
        {/* <li className="position-relative">
          <Link href="/other/business">
            <a>Business&nbsp;</a>
          </Link>
          <IoIosArrowDown />
          <ul
            className="sub-menu sub-menu--one-column about-dropdown-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
          
            <li>
              <Link href="/other/business">
                <a>Overview</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>Stakeholder Engagement</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>Carbon Footprint</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>Buy Carbon Offsets</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>GHG Reporting</a>
              </Link>
            </li>
          </ul>
        </li> */}
        {/* <li className="position-relative">
          <Link href="/other/business">
            <a>Engagement&nbsp;</a>
          </Link>
          <IoIosArrowDown />
          <ul
            className="sub-menu sub-menu--one-column about-dropdown-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li>
              <Link href="/other/business">
                <a>Overview</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>With Employers</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>With Customers</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>With Suppliers</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>With Partners</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>For Events</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>For Consumer Products</a>
              </Link>
            </li>
            <li>
              <Link href="/other/business">
                <a>At Point Of Sale</a>
              </Link>
            </li>
          </ul>
        </li> */}
        <li className="position-relative">
          <Link href="/faq">
            <a>Resources&nbsp;</a>
          </Link>
          <IoIosArrowDown />
          <ul
            className="sub-menu sub-menu--one-column about-dropdown-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li>
              <Link href="/faq">
                <a>FAQ</a>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <a>Blog</a>
              </Link>
            </li>
            {/* <li>
              <Link href="/media">
                <a>Media</a>
              </Link>
            </li> */}
            {/* <li>
              <Link href="/reports">
                <a>Reports</a>
              </Link>
            </li> */}
            {/* <li>
              <Link href="/faq">
                <a>Whitepaper</a>
              </Link>
            </li> */}
            {/* <li>
              <Link href="/faq">
                <a>ActNow</a>
              </Link>
            </li> */}
          </ul>
        </li>
        {/* <li className="position-relative">
          <Link href="/other/business">
            <a>Businesses&nbsp;</a>
          </Link>
          <IoIosArrowDown />
          <ul
            className="sub-menu sub-menu--one-column about-dropdown-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li>
              <Link href="/other/business">
                <a>Overview</a>
              </Link>
            </li>
            <li>
              <Link href="/other/industries">
                <a>Industries</a>
              </Link>
            </li>
          </ul>
        </li> */}

        {/* <li className="position-relative">
          <Link href="/other/individuals">
            <a>Blog/Media&nbsp;</a>
          </Link>
          <IoIosArrowDown />
          <ul
            className="sub-menu sub-menu--one-column about-dropdown-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li>
              <Link href="/blog">
              
                <a>Blog</a>
              </Link>
            </li>
            <li>
              
              <Link href="/media">
                <a>Media</a>
              </Link>
            </li>
            <li>
              
              <Link href="/reports">
                <a>Reports</a>
              </Link>
            </li>
          </ul>
        </li> */}

        {/* <li className="position-relative">
          <Link href="/media">
            <a>Media&nbsp;</a>
          </Link>
        </li> */}
        {/* <li
          // onClick={() => setOffCanvasSearchActive(true)}
          className="position-relative"
          //   onClick={handleTrackWindow}
        >
          <Link href="/reports">
            <a>Reports</a>
          </Link>
        </li> */}
        {/* <li
          // onClick={() => setOffCanvasSearchActive(true)}
          className="position-relative"
          //   onClick={handleTrackWindow}
        >
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </li> */}
        {/* <li
          className="position-relative"
        >
          <Link href="/faq">
            <a>FAQ</a>
          </Link>
        </li> */}
        {/* <li
          className="position-relative"
        >
          <Link href="/faq">
            <a>FAQ</a>
          </Link>
        </li> */}
        <li
          // onClick={() => setOffCanvasSearchActive(true)}
          className="position-relative"
          //   onClick={handleTrackWindow}
        >
          <Link href="/other/track">
            <a>Track</a>
          </Link>
        </li>
        {/* <li>
					<Link
						href="/shop/left-sidebar"
						as={process.env.PUBLIC_URL + '/shop/left-sidebar'}
					>
						<a>Shop</a>
					</Link>
					<IoIosArrowDown />

					<ul className="sub-menu sub-menu--mega sub-menu--mega--column-4">
						<li className="sub-menu--mega__title">
							<Link
								href="/shop/left-sidebar"
								as={process.env.PUBLIC_URL + '/shop/left-sidebar'}
							>
								<a>Group One</a>
							</Link>
							<ul className="sub-menu--mega__list">
								<li>
									<Link
										href="/shop/left-sidebar"
										as={process.env.PUBLIC_URL + '/shop/left-sidebar'}
									>
										<a>Left Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/right-sidebar"
										as={process.env.PUBLIC_URL + '/shop/right-sidebar'}
									>
										<a>Right Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/no-sidebar"
										as={process.env.PUBLIC_URL + '/shop/no-sidebar'}
									>
										<a>No Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/fullwidth-no-space"
										as={process.env.PUBLIC_URL + '/shop/fullwidth-no-space'}
									>
										<a>Full Width No Space</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/fullwidth-no-sidebar"
										as={process.env.PUBLIC_URL + '/shop/fullwidth-no-sidebar'}
									>
										<a>Full Width No Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/fullwidth-left-sidebar"
										as={process.env.PUBLIC_URL + '/shop/fullwidth-left-sidebar'}
									>
										<a>Full Width Left Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/fullwidth-right-sidebar"
										as={
											process.env.PUBLIC_URL + '/shop/fullwidth-right-sidebar'
										}
									>
										<a>Full Width Right Sidebar</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="sub-menu--mega__title">
							<Link
								href="/shop/left-sidebar"
								as={process.env.PUBLIC_URL + '/shop/left-sidebar'}
							>
								<a>Group Two</a>
							</Link>
							<ul className="sub-menu--mega__list">
								<li>
									<Link
										href="/shop/product-basic/[slug]?slug=kariba-red"
										as={
											process.env.PUBLIC_URL +
											'/shop/product-basic/kariba-red'
										}
									>
										<a>Basic</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/product-fullwidth/[slug]?slug=kariba-red"
										as={
											process.env.PUBLIC_URL +
											'/shop/product-fullwidth/kariba-red'
										}
									>
										<a>Full Width</a>
									</Link>
								</li>
								<li>
									<Link
										href="/shop/product-fullwidth-right-thumb/[slug]?slug=kariba-red"
										as={
											process.env.PUBLIC_URL +
											'/shop/product-fullwidth-right-thumb/kariba-red'
										}
									>
										<a>Full Width Right Thumb</a>
									</Link>
								</li>

								<li>
									<Link
										href="/shop/product-sticky/[slug]?slug=kariba-red"
										as={
											process.env.PUBLIC_URL +
											'/shop/product-sticky/kariba-red'
										}
									>
										<a>Sticky Details</a>
									</Link>
								</li>
								<li>
									<Link
										href="/other/cart"
										as={process.env.PUBLIC_URL + '/other/cart'}
									>
										<a>Shopping Cart</a>
									</Link>
								</li>
								<li>
									<Link
										href="/other/wishlist"
										as={process.env.PUBLIC_URL + '/other/wishlist'}
									>
										<a>Wishlist</a>
									</Link>
								</li>
								<li>
									<Link
										href="/other/compare"
										as={process.env.PUBLIC_URL + '/other/compare'}
									>
										<a>Compare</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="sub-menu--mega__title">
							<Link href="/" as={process.env.PUBLIC_URL + '/'}>
								<a>Shop Pages</a>
							</Link>
							<ul className="sub-menu--mega__list">
								<li>
									<Link
										href="/other/checkout"
										as={process.env.PUBLIC_URL + '/other/checkout'}
									>
										<a>Checkout</a>
									</Link>
								</li>
								<li>
									<Link
										href="/other/order-tracking"
										as={process.env.PUBLIC_URL + '/other/order-tracking'}
									>
										<a>Order Tracking</a>
									</Link>
								</li>
								<li>
									<Link
										href="/other/my-account"
										as={process.env.PUBLIC_URL + '/other/my-account'}
									>
										<a>My Account</a>
									</Link>
								</li>
								<li>
									<Link
										href="/other/login-register"
										as={process.env.PUBLIC_URL + '/other/login-register'}
									>
										<a>Login Register</a>
									</Link>
								</li>
							</ul>
						</li>
						<li>
							<div className="sub-menu--mega__image">
								<img
									src={
										process.env.PUBLIC_URL +
										'/assets/images/menu-image/megamenu-shop.png'
									}
									className="img-fluid"
									alt=""
								/>
							</div>
						</li>
					</ul>
				</li> */}

        {/* <li className="position-relative">
					<Link
						href="/blog/standard-left-sidebar"
						as={process.env.PUBLIC_URL + '/blog/standard-left-sidebar'}
					>
						<a>Blog</a>
					</Link>
					<IoIosArrowDown />
					<ul className="sub-menu sub-menu--one-column">
						<li>
							<Link
								href="/blog/standard-left-sidebar"
								as={process.env.PUBLIC_URL + '/blog/standard-left-sidebar'}
							>
								<a>Standard Layout</a>
							</Link>
							<IoIosArrowForward />
							<ul className="sub-menu--one-column sub-menu--one-column--child-menu">
								<li>
									<Link
										href="/blog/standard-left-sidebar"
										as={process.env.PUBLIC_URL + '/blog/standard-left-sidebar'}
									>
										<a>Left Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/standard-right-sidebar"
										as={process.env.PUBLIC_URL + '/blog/standard-right-sidebar'}
									>
										<a>Right Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/standard-fullwidth"
										as={process.env.PUBLIC_URL + '/blog/standard-fullwidth'}
									>
										<a>Full Width</a>
									</Link>
								</li>
							</ul>
						</li>
						<li>
							<Link
								href="/blog/grid-left-sidebar"
								as={process.env.PUBLIC_URL + '/blog/grid-left-sidebar'}
							>
								<a>Grid Layout</a>
							</Link>
							<IoIosArrowForward />
							<ul className="sub-menu--one-column sub-menu--one-column--child-menu">
								<li>
									<Link
										href="/blog/grid-left-sidebar"
										as={process.env.PUBLIC_URL + '/blog/grid-left-sidebar'}
									>
										<a>Left Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/grid-right-sidebar"
										as={process.env.PUBLIC_URL + '/blog/grid-right-sidebar'}
									>
										<a>Right Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/grid-fullwidth"
										as={process.env.PUBLIC_URL + '/blog/grid-fullwidth'}
									>
										<a>Full Width</a>
									</Link>
								</li>
							</ul>
						</li>
						<li>
							<Link
								href="/blog/list-left-sidebar"
								as={process.env.PUBLIC_URL + '/blog/list-left-sidebar'}
							>
								<a>List Layout</a>
							</Link>
							<IoIosArrowForward />
							<ul className="sub-menu--one-column sub-menu--one-column--child-menu">
								<li>
									<Link
										href="/blog/list-left-sidebar"
										as={process.env.PUBLIC_URL + '/blog/list-left-sidebar'}
									>
										<a>Left Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/list-right-sidebar"
										as={process.env.PUBLIC_URL + '/blog/list-right-sidebar'}
									>
										<a>Right Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/list-fullwidth"
										as={process.env.PUBLIC_URL + '/blog/list-fullwidth'}
									>
										<a>Full Width</a>
									</Link>
								</li>
							</ul>
						</li>
						<li>
							<Link
								href="/blog/post-left-sidebar"
								as={process.env.PUBLIC_URL + '/blog/post-left-sidebar'}
							>
								<a>Single Post Layout</a>
							</Link>
							<IoIosArrowForward />
							<ul className="sub-menu--one-column sub-menu--one-column--child-menu">
								<li>
									<Link
										href="/blog/post-left-sidebar"
										as={process.env.PUBLIC_URL + '/blog/post-left-sidebar'}
									>
										<a>Left Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/post-right-sidebar"
										as={process.env.PUBLIC_URL + '/blog/post-right-sidebar'}
									>
										<a>Right Sidebar</a>
									</Link>
								</li>
								<li>
									<Link
										href="/blog/post-fullwidth"
										as={process.env.PUBLIC_URL + '/blog/post-fullwidth'}
									>
										<a>Full Width</a>
									</Link>
								</li>
							</ul>
						</li>
					</ul>
				</li> */}

        {/* <li className="position-relative">
					<Link
						href="/contact"
						to={process.env.PUBLIC_URL + '/contact'}
					>
						<a>Contact Us</a>
					</Link>
				</li>
				<li className="position-relative">
					<Link
						href="/about"
						as={process.env.PUBLIC_URL + '/about'}
					>
						<a>About Us</a>
					</Link>
				</li> */}
      </ul>
      <SearchOverlay
        placeholder={"Track"}
        activeStatus={offCanvasSearchActive}
        getActiveStatus={setOffCanvasSearchActive}
      />
    </nav>
  );
};

export default Navigation;
