import { Row, Col } from "react-bootstrap";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { IoIosCalendar, IoIosAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const BlogPostGridWrapper = ({ column, allPosts, type }) => {
  return (
    <Row>
      {allPosts?.length > 0
        ? allPosts?.map((item, index) => (
            <Col
              key={index}
              lg={column && column === 2 ? 6 : column === 3 ? 4 : 12}
              md={column && column === 2 ? 6 : column === 3 ? 6 : 12}
              className="space-mb--60"
            >
              <div className="blog-grid-post">
                <div className="blog-grid-post__image space-mb--30">
                  <Link
                    href={
                      type === "media"
                        ? `/media/${item?.slug}`
                        : type === "reports"
                        ? `/reports/${item?.slug}`
                        : `/blog/${item?.slug}`
                    }
                  >
                    <a>
                      <img
                        // src={
                        //   process.env.PUBLIC_URL +
                        //   "/assets/images/blog/post-thumbnail.png"
                        // }
                        style={{
                          width: "420",
                          height: "227px",
                          objectFit: "cover",
                        }}
                        src={item?.x_featured_media_large}
                        className="img-fluid"
                        alt=""
                      />
                    </a>
                  </Link>
                </div>
                <div className="blog-grid-post__content">
                  <div className="post-date">
                    <IoIosCalendar />
                    {/* <Link
                      href="/blog/standard-left-sidebar"
                      as={
                        process.env.PUBLIC_URL + "/blog/standard-left-sidebar"
                      }
                    > */}
                    <Link href={`/blog/${item?.slug}`}>
                      <a>{new Date(item?.date).toDateString()}</a>
                    </Link>
                  </div>
                  <h2 className="post-title">
                    <Link
                      href={
                        type === "media"
                          ? `/media/${item?.slug}`
                          : type === "reports"
                          ? `/reports/${item?.slug}`
                          : `/blog/${item?.slug}`
                      }
                    >
                      {/* <div dangerouslySetInnerHTML={createMarkup()} /> */}
                      <a>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item?.title?.rendered,
                          }}
                        />
                        {/* {item?.title?.rendered} */}
                      </a>
                    </Link>
                  </h2>
                  <p className="post-excerpt">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item?.excerpt?.rendered,
                      }}
                    />
                    {/* {item?.excerpt?.rendered
                  ?.substring(0, 200)
                  .replace(/(<([^>]+)>)/gi, "")} */}
                  </p>
                  <Link
                    href={
                      type === "media"
                        ? `/media/${item?.slug}`
                        : type === "reports"
                        ? `/reports/${item?.slug}`
                        : `/blog/${item?.slug}`
                    }
                  >
                    <a className="blog-readmore-btn">
                      <IoIosAdd /> read more
                    </a>
                  </Link>
                </div>
              </div>
            </Col>
          ))
        : Array(6)
            .fill("")
            .map((item, index) => {
              return (
                <Col
                  key={index}
                  lg={column && column === 2 ? 6 : column === 3 ? 4 : 12}
                  md={column && column === 2 ? 6 : column === 3 ? 6 : 12}
                  className="space-mb--60"
                >
                  <div className="blog-grid-post">
                    <div className="blog-grid-post__image space-mb--30">
                      <Skeleton
                        style={{
                          width: "420",
                          height: "227px",
                          objectFit: "cover",
                        }}
                      />

                      {/* <img
                            // src={
                            //   process.env.PUBLIC_URL +
                            //   "/assets/images/blog/post-thumbnail.png"
                            // }
                            style={{
                              width: "420",
                              height: "227px",
                              objectFit: "cover",
                            }}
                            src={item?.x_featured_media_large}
                            className="img-fluid"
                            alt=""
                          /> */}
                    </div>
                    <div className="blog-grid-post__content">
                      {/* <div className="post-date">
                       

                        <Skeleton />
                      </div> */}
                      <h2 className="post-title">
                        <Skeleton />
                        {/* {item?.title?.rendered} */}
                      </h2>
                      <p className="post-excerpt">
                        <Skeleton />
                        {/* <div
                          dangerouslySetInnerHTML={{
                            __html: item?.excerpt?.rendered,
                          }}
                        /> */}
                        {/* {item?.excerpt?.rendered
                ?.substring(0, 200)
                .replace(/(<([^>]+)>)/gi, "")} */}
                      </p>

                      {/* <a className="blog-readmore-btn">
                        <IoIosAdd /> read more
                      </a> */}
                    </div>
                  </div>
                </Col>
              );
            })}
    </Row>
  );
};

export default BlogPostGridWrapper;
