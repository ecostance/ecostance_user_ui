<ul
  className="sub-menu sub-menu--mega sub-menu--mega--column-2"
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }}
>
  <li className="sub-menu--mega__title">
    <ul className="sub-menu--mega__list">
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
                href={`${process.env.PUBLIC_BLOG_URL}/technology-2`}
                as={`${process.env.PUBLIC_BLOG_URL}/technology-2`}
              > */}
        <Link href="/shop/left-sidebar">
          <a>Shop</a>
        </Link>
      </li>
      <li>
        <Link href="/other/my-account">
          <a>EcoStance Page</a>
        </Link>
      </li>
    </ul>
  </li>
  <li>
    <div className="sub-menu--mega__image">
      <img
        src={
          process.env.PUBLIC_URL + "/assets/images/menu-image/menu-element.png"
        }
        className="img-fluid"
        alt=""
      />
    </div>
  </li>
</ul>;
