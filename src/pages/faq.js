import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { LayoutTwo } from "../components/Layout";
import { BreadcrumbOne } from "../components/Breadcrumb";
import axios from "axios";
import Head from "next/head";

const Faq = () => {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    axios
      .get(process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/pages?slug=f-a-q`)
      .then(({ data }) => {
        // const dataFiltered = data.find((item) => item.slug === "business");
        setPageData(data[0]);
      });
  }, []);
  return (
    <LayoutTwo>
      <Head>
        <title>FAQ - ECOSTANCE</title>
      </Head>
      <BreadcrumbOne
        pageTitle="F.A.Q"
        // backgroundImage="/assets/images/backgrounds/faq.png"
        className="bg--1"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>FAQ</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="faq-wrapper">
                {/* <div className="single-faq space-mb--r100">
                  <h2 className="faq-title space-mb--20">
                    {pageData?.acf?.section_1_header}
                  </h2>
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_1_question_1}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <p>{pageData?.acf?.section_1_answer_1}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_1_question_2}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <p>{pageData?.acf?.section_1_answer_2}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_1_question_3}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          <p>{pageData?.acf?.section_1_answer_3}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="3">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_1_question_4}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="3">
                        <Card.Body>
                          <p>{pageData?.acf?.section_1_answer_4}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    {pageData?.acf?.section_1_question_5 && (
                      <Card className="single-my-account space-mb--20">
                        <Card.Header className="panel-heading">
                          <Accordion.Toggle variant="link" eventKey="3">
                            <h3 className="panel-title">
                              {pageData?.acf?.section_1_question_5}
                            </h3>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                          <Card.Body>
                            <p>{pageData?.acf?.section_1_answer_5}</p>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    )}
                  </Accordion>
                </div> */}
                {Array(4)
                  .fill("")
                  .map((item, index) => (
                    <div className="single-faq space-mb--r100">
                      <h2 className="faq-title space-mb--20">
                        {/* {pageData?.acf?.section_1_header} */}
                        {pageData?.acf[`section_${index + 1}_header`]}
                      </h2>

                      <Accordion defaultActiveKey="0">
                        {Array(6)
                          .fill("a")
                          .map((item1, index1) => {
                            if (
                              pageData?.acf[
                                `section_${index + 1}_question_${index1 + 1}`
                              ]
                            ) {
                              return (
                                <Card className="single-my-account space-mb--20">
                                  <Card.Header className="panel-heading">
                                    <Accordion.Toggle
                                      variant="link"
                                      eventKey={`section_${
                                        index + 1
                                      }_question_${index1 + 1}`}
                                    >
                                      <h3 className="panel-title">
                                        {
                                          pageData?.acf[
                                            `section_${index + 1}_question_${
                                              index1 + 1
                                            }`
                                          ]
                                        }
                                        {/* {pageData?.acf?.section_1_question_1} */}
                                      </h3>
                                    </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse
                                    eventKey={`section_${index + 1}_question_${
                                      index1 + 1
                                    }`}
                                  >
                                    <Card.Body>
                                      <p>
                                        {/* {pageData?.acf?.section_1_answer_1} */}
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              pageData?.acf[
                                                `section_${index + 1}_answer_${
                                                  index1 + 1
                                                }`
                                              ],
                                          }}
                                        />
                                        {/* {
                                          pageData?.acf[
                                            `section_${index + 1}_answer_${
                                              index1 + 1
                                            }`
                                          ]
                                        } */}
                                      </p>
                                    </Card.Body>
                                  </Accordion.Collapse>
                                </Card>
                              );
                            }
                          })}
                      </Accordion>

                      {/* <Card className="single-my-account space-mb--20">
                          <Card.Header className="panel-heading">
                            <Accordion.Toggle variant="link" eventKey="1">
                              <h3 className="panel-title">
                                {pageData?.acf?.section_1_question_2}
                              </h3>
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>
                              <p>{pageData?.acf?.section_1_answer_2}</p>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>

                        <Card className="single-my-account space-mb--20">
                          <Card.Header className="panel-heading">
                            <Accordion.Toggle variant="link" eventKey="2">
                              <h3 className="panel-title">
                                {pageData?.acf?.section_1_question_3}
                              </h3>
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>
                              <p>{pageData?.acf?.section_1_answer_3}</p>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>

                        <Card className="single-my-account space-mb--20">
                          <Card.Header className="panel-heading">
                            <Accordion.Toggle variant="link" eventKey="3">
                              <h3 className="panel-title">
                                {pageData?.acf?.section_1_question_4}
                              </h3>
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="3">
                            <Card.Body>
                              <p>{pageData?.acf?.section_1_answer_4}</p>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                        {pageData?.acf?.section_1_question_5 && (
                          <Card className="single-my-account space-mb--20">
                            <Card.Header className="panel-heading">
                              <Accordion.Toggle variant="link" eventKey="3">
                                <h3 className="panel-title">
                                  {pageData?.acf?.section_1_question_5}
                                </h3>
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                              <Card.Body>
                                <p>{pageData?.acf?.section_1_answer_5}</p>
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        )} */}
                      {/* </Accordion> */}
                    </div>
                  ))}
                {/* <div className="single-faq space-mb--r100">
                  <h2 className="faq-title space-mb--20">
                    {pageData?.acf?.section_2_header}
                  </h2>
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_2_question_1}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <p>{pageData?.acf?.section_2_answer_1}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_2_question_2}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <p>{pageData?.acf?.section_2_answer_2}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_2_question_3}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <p>{pageData?.acf?.section_2_answer_3}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>

                <div className="single-faq">
                  <h2 className="faq-title space-mb--20">
                    {pageData?.acf?.section_3_header}
                  </h2>
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_3_question_1}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <p>{pageData?.acf?.section_3_answer_1}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_3_question_2}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <p>{pageData?.acf?.section_3_answer_2}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                    <Card className="single-my-account space-mb--20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            {pageData?.acf?.section_3_question_3}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          <p>{pageData?.acf?.section_3_answer_3}</p>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default Faq;
