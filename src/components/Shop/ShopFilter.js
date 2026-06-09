import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { getFilters, getProducts } from "src/apiClient/product";
import {
  getIndividualCategories,
  getIndividualColors,
  getProductsIndividualSizes,
  getIndividualTags,
  setActiveSort,
  getIndividualSDGS,
  getIndividualCountry,
} from "../../lib/product";

const ShopFilter = ({
  products,
  getSortParams,
  selectedSdg,
  setSelectedSdg,
}) => {
  const categories = getIndividualCategories(products);
  // const colors = getIndividualColors(products);
  const countries = getIndividualCountry(products);
  const tags = getIndividualTags(products);
  const sdgs = getIndividualSDGS(products);

  return (
    <div className="shop-advance-filter">
      <Container className="space-pt--50 space-pb--50">
        <Row>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">Categories</h2>

              {categories.length > 0 ? (
                <ul className="single-filter-widget__list">
                  <li>
                    <button
                      onClick={(e) => {
                        getSortParams("category", "");
                        setActiveSort(e);
                      }}
                    >
                      All categories
                    </button>
                  </li>
                  {categories.map((category, i) => {
                    return (
                      <li key={i}>
                        <button
                          onClick={(e) => {
                            getSortParams("category", category);
                            setActiveSort(e);
                          }}
                        >
                          {category}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "No Categories found"
              )}
            </div>
          </Col>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">Sdgs</h2>
              {sdgs.length > 0 ? (
                <ul className="single-filter-widget__list single-filter-widget__list--color">
                  <div
                    className="d-flex flex-wrap align-items-center"
                    style={{ gap: "10px" }}
                  >
                    {sdgs.map((sdg, index) => {
                      return (
                        <li key={index} style={{ marginRight: "0px " }}>
                          {/* the div below used to be a button */}

                          <div
                            onClick={(e) => {
                              getSortParams("sdgs", sdg?.sdg?._id);
                              setActiveSort(e);
                              setSelectedSdg(sdg?.sdg?.name);
                            }}
                            style={{
                              cursor: "pointer",
                              border:
                                selectedSdg === sdg?.sdg?.name
                                  ? "2px solid #e7e7e7"
                                  : "2px solid white",
                              padding: "2px",
                            }}
                          >
                            <img
                              style={{ maxWidth: "40px" }}
                              src={sdg?.sdg?.image}
                            />
                          </div>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        onClick={(e) => {
                          getSortParams("sdgs", "");
                          setActiveSort(e);
                          setSelectedSdg("");
                        }}
                      >
                        x
                      </button>
                    </li>
                  </div>
                </ul>
              ) : (
                "No Sdgs found"
              )}
            </div>
          </Col>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">Countries</h2>
              {countries.length > 0 ? (
                <ul className="single-filter-widget__list single-filter-widget__list--size">
                  <li>
                    <button
                      onClick={(e) => {
                        getSortParams("countries", "");
                        setActiveSort(e);
                      }}
                    >
                      All Countries
                    </button>
                  </li>
                  {countries.map((country, i) => {
                    return (
                      <li key={i}>
                        <button
                          onClick={(e) => {
                            getSortParams("countries", country);
                            setActiveSort(e);
                          }}
                        >
                          {country}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "No country found"
              )}
            </div>
          </Col>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">Tags</h2>
              {tags.length > 0 ? (
                <div className="tag-container">
                  {tags.map((tag, i) => {
                    return (
                      <button
                        key={i}
                        onClick={(e) => {
                          getSortParams("tag", tag);
                          setActiveSort(e);
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              ) : (
                "No Tags found"
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShopFilter;
