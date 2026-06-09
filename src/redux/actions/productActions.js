export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';

const fetchProductsSuccess = (products) => ({
	type: FETCH_PRODUCTS_SUCCESS,
	payload: products,
});

// fetch products
const fetchProducts = (products) => {
	return (dispatch) => {
		dispatch(fetchProductsSuccess(products));
	};
};

export default fetchProducts;
