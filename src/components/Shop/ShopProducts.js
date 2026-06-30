import { ProductGridListWrapper } from "../../components/ProductThumb";
import { Row } from "react-bootstrap";
const ShopProducts = ({
  products,
  layout,
  setShowComparePopup,
  wishlistItems,
  setDebounce,
  removeDebounce,
}) => {
  return (
    <div className="shop-products">
      <Row className={layout}>
        <ProductGridListWrapper
          products={products}
          layout={layout}
          setDebounce={setDebounce}
          removeDebounce={removeDebounce}
          bottomSpace="space-mb--50"
          setShowComparePopup={setShowComparePopup}
        />
      </Row>
    </div>
  );
};

export default ShopProducts;
