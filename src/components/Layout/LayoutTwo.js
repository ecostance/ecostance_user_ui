import { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { HeaderOne } from "../Header";
import { FooterTwo } from "../Footer";
import { addOrder } from "../../redux/actions/orderActions";

const LayoutTwo = ({
  children,
  aboutOverlay,
  footerBgClass,
  userData,
  addOrder,
  noHeader = false,
  setDebounce,
  removeDebounce,
}) => {
  return (
    <Fragment>
      {!noHeader && (
        <HeaderOne
          setDebounce={setDebounce}
          removeDebounce={removeDebounce}
          aboutOverlay={false}
        />
      )}
      {children}
      <FooterTwo footerBgClass={footerBgClass} />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addOrder: (isOrder, item) => {
      dispatch(addOrder(isOrder, item));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutTwo);
