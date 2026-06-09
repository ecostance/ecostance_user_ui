import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../../components/Layout";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import { BlogSidebar, BlogPostGridWrapper } from "../../../components/Blog";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

const GridRightSidebar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    axios
      .get(process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/posts?per_page=100`)
      .then((res) => {
        setAllPosts(res.data);
        // setPageCount(res.headers["x-wp-totalpages"]);
        const tempFilter = res.data.filter(
          (o) => o?.x_author === router.query.slug
        );
        console.log(tempFilter, "liwhedliwhedlwhed");
        setFilteredPosts(tempFilter);
        setLoading(false);
      });
  }, [router.query.slug]);

  return (
    <LayoutTwo>
      <Head>
        <title>Blog - ECOSTANCE</title>
      </Head>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={`Blogs By ${router.query.slug}`}
        backgroundImage="/assets/images/backgrounds/blog.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>
            <Link href="/blog">
              <a>Blog</a>
            </Link>
          </li>
          <li>Author</li>
        </ul>
      </BreadcrumbOne>
      <div className="blog-page-wrapper space-mb--r130 space-mt--r130">
        <Container>
          <Row>
            <Col lg={3} className="order-2 space-mt-mobile-only--50">
              {/* sidebar */}
              <BlogSidebar allPosts={allPosts} />
            </Col>

            <Col lg={9} className="order-1">
              {/* post list */}

              <BlogPostGridWrapper column={2} allPosts={filteredPosts} />

              {/* <div className="pro-pagination-style text-center">
                <ul>
                  {Array(
                    (filteredPosts.length / 2).toFixed(0) < 1
                      ? 1
                      : (filteredPosts.length / 2).toFixed(0)
                  )
                    .fill("")
                    .map((item, index) => (
                      <li
                        className={
                          page === index + 1 ? "active page-item" : "page-item"
                        }
                        onClick={(e) => setPage(index + 1)}
                      >
                        <a className="page-link" href="#">
                          {index + 1}
                        </a>
                      </li>
                    ))}

                  <li className="page-item">
                    <a className="page-link" href="#">
                      NEXT
                    </a>
                  </li>
                </ul>
              </div> */}
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default GridRightSidebar;
