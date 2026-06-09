import request from './request';

export const getCountries = async ({ show, limit }) => {
	// const countryResponse = await request.get(
	// 	`/v1/countries?show=${show}&limit=${limit}`
	// );
	const countryResponse = await request.get(`/v1/countries`);
	if (countryResponse.status !== 200) throw 'Failed to load countries';
	else return countryResponse.data;
};
