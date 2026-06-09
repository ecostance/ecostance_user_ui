<li className="position-relative">
          <Link
            href="/other/carbon-offset"
            // as={process.env.PUBLIC_URL + '/other/carbon-offset'}
          >
            <a>Calculator</a>
          </Link>
        </li>
        <li
          // onClick={() => setOffCanvasSearchActive(true)}
          className="position-relative"
          //   onClick={handleTrackWindow}
        >
          <Link href="/other/track">
            <a>Track</a>
          </Link>
        </li>
        <li className="position-relative">
          {/* <Link
            href={`${process.env.PUBLIC_BLOG_URL}/business-2/`}
            as={`${process.env.PUBLIC_BLOG_URL}/business-2/`}
          > */}
          <Link href="/other/business">
            <a>Business</a>
          </Link>
        </li>
        <li className="position-relative">
          {/* <Link
            href={`${process.env.PUBLIC_BLOG_URL}/f-a-q/`}
            as={`${process.env.PUBLIC_BLOG_URL}/f-a-q/`}
          > */}
          <Link href="/other/faq">
            <a>F.A.Q</a>
          </Link>
        </li>
        <li className="position-relative">
          {/* <Link
            href={`${process.env.PUBLIC_BLOG_URL}/blog`}
            as={`${process.env.PUBLIC_BLOG_URL}/blog`}
          > */}
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </li>
        <li className="position-relative">
          <Link href="/about">
            <a>About&nbsp;</a>
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
              <Link href="/about">
                {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/about-us/`}
                as={`${process.env.PUBLIC_BLOG_URL}/about-us/`}
              > */}
                <a>Company</a>
              </Link>
            </li>
            <li>
              {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
                as={`${process.env.PUBLIC_BLOG_URL}/why-us-2`}
              > */}
              <Link href="/other/why">
                <a>Why Us</a>
              </Link>
            </li>
            <li>
              {/* <Link
                href={`${process.env.PUBLIC_BLOG_URL}/technology-2`}
                as={`${process.env.PUBLIC_BLOG_URL}/technology-2`}
              > */}
              <Link href="/other/technology">
                <a>Technology</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a>Contact</a>
              </Link>
            </li>
          </ul>
        </li>