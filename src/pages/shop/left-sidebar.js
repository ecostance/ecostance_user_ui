import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Paginator from "react-hooks-paginator";
import { SlideDown } from "react-slidedown";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { getSortedProducts } from "../../lib/product";
import {
  ShopHeader,
  ShopFilter,
  ShopSidebar,
  ShopProducts,
} from "../../components/Shop";
import ShowPopup from "src/components/showPopup";
import { returnCorrectImage } from "src/components/helpers/returnCorrectImage";
import { _newDebounce } from "src/helpers/debounce";

const LeftSidebar = ({ products, userData, wishlistItems }) => {
  const [layout, setLayout] = useState("grid four-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [shopTopFilterStatus, setShopTopFilterStatus] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [showComparePopup, setShowComparePopup] = useState(false);
  const [selectedSdg, setSelectedSdg] = useState("");
  const [countryFilters, setCountryFilters] = useState([]);
  const { setDebounce, removeDebounce } = _newDebounce();

  const pageLimit = 20;

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  useEffect(() => {
    let sortedProducts = getSortedProducts(products, sortType, sortValue);
    const filterSortedProducts = getSortedProducts(
      sortedProducts,
      filterSortType,
      filterSortValue,
      userData
    );

    sortedProducts = filterSortedProducts;
    setSortedProducts(sortedProducts);
    setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

  return (
    <ShowPopup
      setShowComparePopup={setShowComparePopup}
      showComparePopup={showComparePopup}
    >
      <LayoutTwo>
        {/* breadcrumb */}
        <BreadcrumbOne
          pageTitle="Shop Carbon Offsetting Projects"
          className="bg--1"
          // backgroundImage={
          //   "/assets/images/backgrounds/" +
          //   returnCorrectImage("breadcrumb-bg-1", window.innerWidth)
          // }
          // backgroundImage={
          //   "/assets/images/backgrounds/background-bg-1/big-big.png"
          // }
        >
          <ul className="breadcrumb__list">
            <li>
              <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                <a>Home</a>
              </Link>
            </li>

            <li>Shop Carbon Offsetting Projects</li>
          </ul>
        </BreadcrumbOne>
        <div className="shop-page-content">
          {/* shop page header */}
          <ShopHeader
            getLayout={getLayout}
            getFilterSortParams={getFilterSortParams}
            productCount={products.length}
            sortedProductCount={currentData.length}
            shopTopFilterStatus={shopTopFilterStatus}
            setShopTopFilterStatus={setShopTopFilterStatus}
            selectedSdg={selectedSdg}
            setSelectedSdg={setSelectedSdg}
          />

          {/* shop header filter */}
          <SlideDown closed={shopTopFilterStatus ? false : true}>
            <ShopFilter
              products={products}
              getSortParams={getSortParams}
              selectedSdg={selectedSdg}
              setSelectedSdg={setSelectedSdg}
            />
          </SlideDown>

          {/* shop page body */}
          <div className="shop-page-content__body space-mt--r130 space-mb--r130">
            <Container>
              <Row>
                <Col
                  lg={3}
                  className="order-2 order-lg-1 space-mt-mobile-only--50"
                >
                  {/* shop sidebar */}
                  <ShopSidebar
                    products={products}
                    userData={userData}
                    getSortParams={getSortParams}
                    selectedSdg={selectedSdg}
                    setSelectedSdg={setSelectedSdg}
                  />
                </Col>

                <Col lg={9} className="order-1 order-lg-2">
                  {/* shop products */}
                  <ShopProducts
                    userData={userData}
                    layout={layout}
                    products={currentData}
                    wishlistItems={wishlistItems}
                    setShowComparePopup={setShowComparePopup}
                    setDebounce={setDebounce}
                    removeDebounce={removeDebounce}
                  />

                  {/* shop product pagination */}
                  <div className="pro-pagination-style">
                    <Paginator
                      totalRecords={sortedProducts.length}
                      pageLimit={pageLimit}
                      pageNeighbours={2}
                      setOffset={setOffset}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      pageContainerClass="mb-0 mt-0"
                      pagePrevText="«"
                      pageNextText="»"
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </LayoutTwo>
    </ShowPopup>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.productData,
    userData: state.userData,
    wishlistItems: state.wishlistData,
  };
};

export default connect(mapStateToProps)(LeftSidebar);
