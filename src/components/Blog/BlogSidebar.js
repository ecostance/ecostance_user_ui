import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import router from "next/router";

const BlogSidebar = ({ allPosts, type }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get(process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/categories`)
      .then(({ data }) => {
        setCategories(data);
      });
    axios
      .get(process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/tags?per_page=100`)
      .then(({ data }) => {
        setTags(data);
      });
  }, []);

  const handleSearch = () => {
    router.push(`${process.env.NEXT_PUBLIC_UI_URL}/shop/search/${searchText}`);
  };

  return (
    <div className="blog-sidebar">
      <div className="single-sidebar-widget space-mb--40">
        <div className="search-widget">
          <form>
            <input
              style={{ display: "none" }}
              type="search"
              placeholder="Search products ..."
            />
            <input
              onKeyDown={(e) => e.keyCode === 13 && handleSearch()}
              onChange={(e) => setSearchText(e.target.value)}
              type="search"
              placeholder="Search Products ..."
            />
            <button type="button">
              <IoIosSearch />
            </button>
          </form>
        </div>
        {/* <div className="search-widget">
          <form>
            <input type="search" placeholder="Search products ..." />
            <button type="button">
              <IoIosSearch />
            </button>
          </form>
        </div> */}
      </div>
      {type !== "reports" && type !== "media" ? (
        <div className="single-sidebar-widget space-mb--40">
          <h2 className="single-sidebar-widget__title space-mb--30">
            Categories
          </h2>
          <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
            {categories.map((item) => {
              if (
                item?.count > 0 &&
                item?.name !== "Uncategorized" &&
                item?.name !== "broder"
              ) {
                return (
                  <li className="category_item">
                    <Link href={`/blog/category/${item?.id}`}>
                      <a>{item?.name}</a>
                    </Link>
                    <div>{item?.count}</div>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      ) : (
        ""
      )}

      <div className="single-sidebar-widget space-mb--40">
        <div className="widget-post-wrapper">
          {allPosts.map((item, index) => {
            if (index < 3) {
              return (
                <div className="single-widget-post">
                  <div className="image">
                    <Link href={`/blog/${item?.slug}`}>
                      <a>
                        <img
                          src={item?.x_featured_media_large}
                          className="img-fluid"
                          alt=""
                          style={{
                            width: "100px",
                            height: "120px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="content">
                    <h3 className="widget-post-title">
                      <Link href={`/blog/${item?.slug}`}>
                        <a>
                          {item?.title?.rendered}
                          {/* <span
                            dangerouslySetInnerHTML={{
                              __html: item?.title?.rendered,
                            }}
                          /> */}
                        </a>
                      </Link>
                    </h3>
                    <p className="widget-post-date">
                      {new Date(item?.date).toDateString()}
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="single-sidebar-widget space-mb--40">
        <div className="blog-sidebar-banner">
          <Link href={`/blog`}>
            <a>
              <img
                src="/assets/images/adBlog.png"
                className="img-fluid"
                alt=""
              />
            </a>
          </Link>
        </div>
      </div>

      <div className="single-sidebar-widget">
        <h2 className="single-sidebar-widget__title space-mb--30">
          Popular Tags
        </h2>
        <div className="tag-container">
          {tags?.map((item) => {
            if (item.count > 0) {
              return (
                <Link href={`/blog`}>
                  <a style={{ paddingBottom: "10px", fontWeight: "300" }}>
                    {item?.name}
                  </a>
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
