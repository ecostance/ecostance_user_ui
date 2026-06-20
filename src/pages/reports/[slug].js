import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { BlogSidebar } from "../../components/Blog";
import {
  IoIosCalendar,
  IoIosPerson,
  IoMdChatbubbles,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoGoogleplus,
  IoLogoPinterest,
  IoMdPricetags,
  IoIosRedo,
  IoIosDownload,
} from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { useRouter } from "next/router";
import axios from "axios";

const PostRightSidebar = ({ post }) => {
  const router = useRouter();

  const [postObj, setPostObj] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");
  const [authorComment, setAuthorComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  const [downloadFname, setDownloadFname] = useState("");
  const [downloadLname, setDownloadLname] = useState("");
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadBusiness, setDownloadBusiness] = useState("");

  const verifyReportUser = () => {
    setLoading(true);
    axios
      .get(`${process.env.API_BASE}/v1/user-reports?email=${downloadEmail}`)
      .then(({ data }) => {
        console.log(data, "lkwehklwjef");
        if (data.data.length > 0) {
          window.open(postObj?.acf?.upload_report?.url, "_blank");
          setLoading(false);
          setShowDownloadPopup(false);
          setShowEmailInput(false);
          setDownloadEmail("");
          setDownloadFname("");
          setDownloadLname("");
          setDownloadBusiness("");
        } else {
          setLoading(false);
          setShowDownloadPopup(true);
        }
      });
  };

  const saveReportUserData = () => {
    setLoading(true);
    axios
      .post(`${process.env.API_BASE}/v1/user-reports`, {
        firstName: downloadFname,
        lastName: downloadLname,
        email: downloadEmail,
        businessName: downloadBusiness,
        urlLink: postObj?.acf?.upload_report?.url,
      })
      .then(({ data }) => {
        if (data.success) {
          setLoading(false);
          window.open(postObj?.acf?.upload_report?.url, "_blank");
          setShowEmailInput(false);
          setShowDownloadPopup(false);
          setDownloadEmail("");
          setDownloadFname("");
          setDownloadLname("");
          setDownloadBusiness("");
        }
      });
  };

  useEffect(() => {
    axios
      .get(process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/posts`)
      .then(({ data }) => {
        setAllPosts(data);
        const foundPost = data.find((o) => o.slug === router.query.slug);
        setPostObj(foundPost);
        console.log(foundPost, "ihkjkkjgkgb");
      });
  }, []);

  useEffect(() => {
    if (postObj) {
      axios.get(postObj?._links?.replies[0]?.href).then(({ data }) => {
        setComments(data);
      });
    }
  }, [postObj]);

  const postComment = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post(
        process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/comments`,
        {
          author_name: authorName,
          author_email: authorEmail,
          author_url: authorWebsite,
          content: authorComment,
          post: postObj?.id,
        },
      );
      setComments([...comments, response.data]);
      setLoading(false);
      setAuthorName("");
      setAuthorEmail("");
      setAuthorWebsite("");
      setAuthorComment("");
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
      setErrorMsg(error.response.data.message);
    }
  };

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Reports"
        pageSubtitle="Blog Details"
        className="bg--6"
        // backgroundImage="/assets/images/backgrounds/page-title-bg.jpg"
        postPage={true}
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/media">
              <a>Reports</a>
            </Link>
          </li>

          {/* <li>{postObj?.title?.rendered}</li> */}
        </ul>
      </BreadcrumbOne>
      <div className="blog-page-wrapper space-mb--r130 space-mt--r130">
        <Container>
          <Row>
            <Col lg={3} className="order-2 space-mt-mobile-only--50">
              {/* sidebar */}
              <BlogSidebar allPosts={allPosts} type="reports" />
            </Col>
            {postObj ? (
              <Col lg={9} className="order-1">
                <div className="blog-grid-post blog-grid-post--sticky space-pb--50 space-mb--40">
                  <div className="blog-grid-post__image blog-grid-post--sticky__image space-mb--30">
                    <img
                      src={postObj?.x_featured_media_large}
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="blog-grid-post__content blog-grid-post--sticky__content">
                    <div className="post-category space-mb--10">
                      <Link
                        href={`/reports/category/${postObj?.x_categories}`}
                        as={
                          process.env.PUBLIC_URL +
                          "/reports/standard-left-sidebar"
                        }
                      >
                        <a>{postObj?.x_categories}</a>
                      </Link>
                    </div>
                    <h2 className="post-title">
                      {/* <span
                        dangerouslySetInnerHTML={{
                          __html: postObj?.title?.rendered,
                        }}
                      /> */}
                      {postObj?.title?.rendered}
                    </h2>

                    <div className="post-info d-flex flex-wrap align-items-center space-mb--50">
                      <div className="post-user">
                        <IoIosPerson /> By
                        <Link href={`/reports/author/${postObj?.x_author}`}>
                          <a>&nbsp;{postObj?.x_author}</a>
                        </Link>
                      </div>
                      <div className="post-date mb-0 space-pl--30">
                        <IoIosCalendar />
                        <Link
                          href="/reports/standard-left-sidebar"
                          as={
                            process.env.PUBLIC_URL +
                            "/reports/standard-left-sidebar"
                          }
                        >
                          <a>{new Date(postObj?.date).toDateString()}</a>
                        </Link>
                      </div>
                      {/* <div className="post-category space-pl--30">
                      <Link
                        href="/reports/standard-left-sidebar"
                        as={
                          process.env.PUBLIC_URL + "/reports/standard-left-sidebar"
                        }
                      >
                        <a>{postObj?.x_categories}</a>
                      </Link>
                    </div> */}
                      <div className="post-comment space-pl--30">
                        <IoMdChatbubbles />
                        <a href="#"> {comments?.length} Comments</a>
                      </div>
                    </div>

                    <div
                      className="single-blog-post-section"
                      dangerouslySetInnerHTML={{
                        __html: postObj?.content?.rendered,
                      }}
                    />
                    <Col
                      lg={12}
                      className="space-mb--30"
                      style={{ paddingLeft: "0px" }}
                    >
                      {/* <a
                        href={postObj?.acf?.upload_report?.url}
                        download="report"
                      > */}
                      <button
                        className="lezada-button lezada-button--medium space-mb--10"
                        onClick={(e) => {
                          // e.preventDefault();
                          setShowEmailInput(true);
                        }}
                      >
                        <FiDownload
                          style={{ fontSize: "20px", marginRight: "5px" }}
                        />{" "}
                        Download Report
                        {/* {isLoginLoading ? (
                            <Spinner size="sm" animation="border" />
                          ) : null} */}
                      </button>
                      {/* </a> */}
                    </Col>
                    {/* <h3 className="space-mb--30">Sequins</h3>
                    <p className="space-mb--30">
                      To say sequins and sparkles will be a big deal next summer
                      is an understatement. In every fashion capital, glitter
                      prevailed, starting with Tom Ford and Marc Jacobs right
                      through to Gucci (pictured here), Dior and Chanel. Style
                      yours with a sweatshirt to give them daytime longevity.
                    </p>
                    <h3 className="space-mb--30">Pastels</h3>
                    <p className="space-mb--30">
                      Whether lilac, pink, lemon or duck egg blue, expect to see
                      an array of fashion’s prettiest shades next season. But as
                      Victoria Beckham (pictured) said “delicacy can be strong”;
                      saccharine these colours are not – consider tailoring in
                      ice cream hues or wearing them in unexpected ways like at
                      Celine.
                    </p>
                    <h3 className="space-mb--30">Checks</h3>
                    <p className="space-mb--30">
                      It looks as if heritage checks are going nowhere for the
                      season ahead. Balenciaga’s came via voluminous coats as
                      seen here, while Victoria Beckham’s had a more traditional
                      appeal. Anyone looking for floaty feminine styles should
                      turn to Sonia Rykiel where they were bright and
                      summer-ready. Burberry’s homage was perhaps the most overt
                      – expect to see its check caps everywhere next season.
                    </p>
                    <h3 className="space-mb--30">Plastic</h3>
                    <p className="space-mb--30">
                      Perfect for British summers, waterproof plastics were a
                      predominant look for spring/summer 2020. As seen at Chanel
                      (pictured), Isabel, Marant, Burberry, Topshop, Calvin
                      Klein and Fendi, plastic in varying shades will be
                      everywhere in 12 months time.
                    </p> */}

                    <Row className="space-mt--30 align-items-center">
                      <Col
                        md={6}
                        className="text-center text-md-left"
                        style={{ display: "flex" }}
                      >
                        {postObj?.x_tags !== "" && (
                          <IoMdPricetags
                            style={{
                              width: "50px",
                              height: "50px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <div className="post-tags">
                          <div style={{ lineHeight: "1.6" }}>
                            {postObj?.x_tags}
                          </div>
                        </div>
                        {/* {postObj?.tags?.length > 0 && (
                        <div className="post-tags">
                          <IoMdPricetags />
                          <ul className="tag-list">
                            {postObj?.tags?.map((tag) => (
                              <li>
                                <a href="#">accessories</a>,
                              </li>
                            ))}
                          </ul>
                        </div>
                      )} */}
                      </Col>
                      <Col md={6} className="text-center text-md-right">
                        <div className="post-share">
                          <span>Share this post:</span>
                          <ul>
                            <li>
                              <a href="#">
                                <IoLogoFacebook />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <IoLogoTwitter />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <IoLogoGoogleplus />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <IoLogoPinterest />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="single-author space-mb--40">
                  <div className="single-author__image">
                    <img
                      src={process.env.PUBLIC_URL + "/assets/images/logo.png"}
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="single-author__content">
                    <p className="username">
                      {postObj?.x_author?.toUpperCase()}
                    </p>
                    <p className="message">
                      We want to empower everyone to fight the climate crisis.
                      We have created a carbon management, ecommerce and
                      sustainability engagement platform that is simple yet
                      elegant for everyone to use.
                    </p>
                  </div>
                </div>
                <div className="comments-wrapper space-mb--40">
                  <h2 className="comment-title space-mb--30">
                    Comments <span>({comments?.length})</span>
                  </h2>
                  {comments?.map((item, index) => (
                    <div className="single-comment" key={index + 123}>
                      <div
                        className="single-comment__image"
                        style={{
                          width: "70px",
                          height: "70px",
                          background: "#BCBCBC",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#fff",
                          fontSize: "30px",
                        }}
                      >
                        {item?.author_name?.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="single-comment__content">
                        <p className="username">
                          {item?.author_name}
                          <span style={{ fontSize: "14px", color: "#ababab" }}>
                            {item?.status === "hold"
                              ? " (Comment awaiting approval)"
                              : ""}
                          </span>

                          <span className="date">
                            {new Date(item?.date).toDateString()}
                          </span>
                        </p>
                        <div
                          className="message"
                          dangerouslySetInnerHTML={{
                            __html: item?.content?.rendered,
                          }}
                        />
                        {/* <p className="message">{item?.content?.rendered}</p> */}

                        {/* <a href="#" className="reply-link">
                          <IoIosRedo /> reply
                        </a> */}
                      </div>
                    </div>
                  ))}
                  {/* <div className="single-comment">
                    <div className="single-comment__image">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/user/user2.jpeg"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <div className="single-comment__content">
                      <p className="username">
                        Edna Watson{" "}
                        <span className="date">/ April 5, 2020</span>
                      </p>

                      <p className="message">
                        Thanks for always keeping your WordPress themes up to
                        date. Your level of support and dedication is second to
                        none.
                      </p>

                      <a href="#" className="reply-link">
                        <IoIosRedo /> reply
                      </a>
                    </div>
                  </div>

                  <div className="single-comment">
                    <div className="single-comment__image">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/user/user3.jpeg"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <div className="single-comment__content">
                      <p className="username">
                        Owen Christ{" "}
                        <span className="date">/ April 5, 2020</span>
                      </p>

                      <p className="message">
                        Thanks for always keeping your WordPress themes up to
                        date. Your level of support and dedication is second to
                        none.
                      </p>

                      <a href="#" className="reply-link">
                        <IoIosRedo /> reply
                      </a>
                    </div>
                  </div>

                  <div className="single-comment single-comment--reply">
                    <div className="single-comment__image">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/user/user1.jpeg"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <div className="single-comment__content">
                      <p className="username">
                        Scott James{" "}
                        <span className="date">/ April 5, 2020</span>
                      </p>

                      <p className="message">
                        Thanks for always keeping your WordPress themes up to
                        date. Your level of support and dedication is second to
                        none.
                      </p>

                      <a href="#" className="reply-link">
                        <IoIosRedo /> reply
                      </a>
                    </div>
                  </div> */}
                </div>
                <div className="comment-form">
                  <div>
                    <h2 className="comment-title space-mb--30">
                      Leave your thought here
                    </h2>
                    {errorMsg && (
                      <div style={{ color: "red", paddingBottom: "15px" }}>
                        <div
                          className="alert alert-danger"
                          role="alert"
                          dangerouslySetInnerHTML={{
                            __html: errorMsg,
                          }}
                        />
                      </div>
                    )}

                    {/*=======  comment form  =======*/}
                    <div className="lezada-form comment-form">
                      <form>
                        <Row>
                          <Col lg={4} className="space-mb--20">
                            <input
                              type="text"
                              placeholder="Name (*)"
                              required
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                            />
                          </Col>
                          <Col lg={4} className="space-mb--20">
                            <input
                              type="email"
                              placeholder="Email (*)"
                              required
                              value={authorEmail}
                              onChange={(e) => setAuthorEmail(e.target.value)}
                            />
                          </Col>
                          <Col lg={4} className="space-mb--20">
                            <input
                              type="text"
                              placeholder="Website"
                              value={authorWebsite}
                              onChange={(e) => setAuthorWebsite(e.target.value)}
                            />
                          </Col>
                          <Col lg={12} className="space-mb--20">
                            <textarea
                              cols={30}
                              rows={10}
                              placeholder="Message"
                              defaultValue={""}
                              value={authorComment}
                              onChange={(e) => setAuthorComment(e.target.value)}
                            />
                          </Col>
                          <Col lg={12} className="text-center">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                postComment();
                              }}
                              type="submit"
                              className="lezada-button lezada-button--medium"
                            >
                              {loading ? "Submitting.." : "Submit"}
                            </button>
                          </Col>
                        </Row>
                      </form>
                    </div>
                  </div>
                </div>
              </Col>
            ) : (
              <Col lg={9} className="order-1">
                <div className="blog-grid-post blog-grid-post--sticky space-pb--50 space-mb--40">
                  <div className="blog-grid-post__image blog-grid-post--sticky__image space-mb--30">
                    <Skeleton
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="blog-grid-post__content blog-grid-post--sticky__content">
                    <div className="post-category space-mb--10">
                      <Skeleton style={{ width: "200px", height: "10px" }} />
                    </div>
                    <h2 className="post-title">
                      {/* <span
                        dangerouslySetInnerHTML={{
                          __html: postObj?.title?.rendered,
                        }}
                      /> */}
                      {postObj?.title?.rendered}
                    </h2>

                    <div className="post-info d-flex flex-wrap align-items-center space-mb--50">
                      <Skeleton
                        style={{ width: "800px", height: "10px" }}
                        // className="post-user"
                        // multi line skeleton
                      />
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </div>
      {showEmailInput && (
        <>
          <div
            className="modal fade show"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-modal="true"
            style={{ display: "block", paddingRight: "17px" }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              style={{ maxWidth: "600px" }}
            >
              <div className="modal-content">
                <div className="modal-body" style={{ textAlign: "center" }}>
                  <h3>Download Report</h3>
                  <p style={{ paddingTop: "10px" }}>
                    Please fill these details to download the report.
                  </p>

                  <div className="lezada-form comment-form">
                    <form>
                      <Row>
                        {/* <Col lg={6} className="space-mb--20">
                          <input
                            type="text"
                            placeholder="First Name (*)"
                            required
                            value={downloadFname}
                            onChange={(e) => setDownloadFname(e.target.value)}
                          />
                        </Col>
                        <Col lg={6} className="space-mb--20">
                          <input
                            type="text"
                            placeholder="Last Name (*)"
                            required
                            value={downloadLname}
                            onChange={(e) => setDownloadLname(e.target.value)}
                          />
                        </Col> */}
                        {/* <Col lg={6} className="space-mb--20">
                        <input
                          type="text"
                          placeholder="Website"
                          value={authorWebsite}
                          onChange={(e) => setAuthorWebsite(e.target.value)}
                        />
                      </Col> */}
                        <Col lg={12} className="space-mb--20">
                          <input
                            type="email"
                            placeholder="Email"
                            value={downloadEmail}
                            onChange={(e) => setDownloadEmail(e.target.value)}
                          />
                        </Col>
                        {/* <Col lg={12} className="space-mb--20">
                          <input
                            type="text"
                            placeholder="Business Name"
                            value={downloadBusiness}
                            onChange={(e) =>
                              setDownloadBusiness(e.target.value)
                            }
                          />
                        </Col> */}
                        {/* <Col lg={5} className="text-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              postObj?.acf?.upload_report?.url,
                              "_blank"
                            );
                          }}
                          type="submit"
                          className="lezada-button lezada-button--medium"
                        >
                          Cancel
                        </button>
                      </Col>

                      <Col lg={7} className="text-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              postObj?.acf?.upload_report?.url,
                              "_blank"
                            );
                          }}
                          type="submit"
                          className="lezada-button lezada-button--medium"
                        >
                          {loading ? "Downloading.." : "Download Report"}
                        </button>
                      </Col> */}
                      </Row>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDownloadPopup(false);
                      }}
                      type="submit"
                      className="lezada-button lezada-button--medium"
                      style={{
                        background: "#fff",
                        color: "#000",
                        border: "1px solid #000",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        verifyReportUser();
                      }}
                      type="submit"
                      className="lezada-button lezada-button--medium"
                    >
                      {loading ? "Loading..." : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showDownloadPopup && (
        <>
          <div
            className="modal fade show"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-modal="true"
            style={{ display: "block", paddingRight: "17px" }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              style={{ maxWidth: "600px" }}
            >
              <div className="modal-content">
                <div className="modal-body" style={{ textAlign: "center" }}>
                  <h3>Download Report</h3>
                  <p style={{ paddingTop: "10px" }}>
                    Please fill these details to download the report.
                  </p>

                  <div className="lezada-form comment-form">
                    <form>
                      <Row>
                        <Col lg={6} className="space-mb--20">
                          <input
                            type="text"
                            placeholder="First Name (*)"
                            required
                            value={downloadFname}
                            onChange={(e) => setDownloadFname(e.target.value)}
                          />
                        </Col>
                        <Col lg={6} className="space-mb--20">
                          <input
                            type="text"
                            placeholder="Last Name (*)"
                            required
                            value={downloadLname}
                            onChange={(e) => setDownloadLname(e.target.value)}
                          />
                        </Col>
                        {/* <Col lg={6} className="space-mb--20">
                        <input
                          type="text"
                          placeholder="Website"
                          value={authorWebsite}
                          onChange={(e) => setAuthorWebsite(e.target.value)}
                        />
                      </Col> */}
                        <Col lg={12} className="space-mb--20">
                          <input
                            type="email"
                            placeholder="Email"
                            value={downloadEmail}
                            onChange={(e) => setDownloadEmail(e.target.value)}
                          />
                        </Col>
                        <Col lg={12} className="space-mb--20">
                          <input
                            type="text"
                            placeholder="Business Name"
                            value={downloadBusiness}
                            onChange={(e) =>
                              setDownloadBusiness(e.target.value)
                            }
                          />
                        </Col>
                        {/* <Col lg={5} className="text-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              postObj?.acf?.upload_report?.url,
                              "_blank"
                            );
                          }}
                          type="submit"
                          className="lezada-button lezada-button--medium"
                        >
                          Cancel
                        </button>
                      </Col>

                      <Col lg={7} className="text-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              postObj?.acf?.upload_report?.url,
                              "_blank"
                            );
                          }}
                          type="submit"
                          className="lezada-button lezada-button--medium"
                        >
                          {loading ? "Downloading.." : "Download Report"}
                        </button>
                      </Col> */}
                      </Row>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDownloadPopup(false);
                      }}
                      type="submit"
                      className="lezada-button lezada-button--medium"
                      style={{
                        background: "#fff",
                        color: "#000",
                        border: "1px solid #000",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // window.open(postObj?.acf?.upload_report?.url, "_blank");
                        saveReportUserData();
                      }}
                      type="submit"
                      className="lezada-button lezada-button--medium"
                    >
                      {loading ? "Dowlnoading..." : "Dowlnoad Report"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showDownloadPopup || showEmailInput ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor:
              "rgba(0, 0, 0, 0.5)" /* Semi-transparent black background */,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        ></div>
      ) : (
        ""
      )}
    </LayoutTwo>
  );
};

export default PostRightSidebar;
