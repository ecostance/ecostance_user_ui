import request from './request';
import axios from 'axios';

export const getCountries = async ({ show, limit }) => {
	const countryResponse = await request.get(`/v1/countries`);
	if (countryResponse.status !== 200) throw 'Failed to load countries';
	
	// Fallback to production API if database returns empty countries list
	if (
		countryResponse.data &&
		(!countryResponse.data.data || countryResponse.data.data.length === 0)
	) {
		try {
			const fallbackResponse = await axios.get(
				`https://api.ecostance.com/v1/countries`
			);
			if (
				fallbackResponse.status === 200 &&
				fallbackResponse.data &&
				fallbackResponse.data.data &&
				fallbackResponse.data.data.length > 0
			) {
				return fallbackResponse.data;
			}
		} catch (fallbackError) {
			console.error('Countries API fallback failed:', fallbackError);
		}
	}
	
	return countryResponse.data;
};
