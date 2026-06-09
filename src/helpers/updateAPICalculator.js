import { saveCalculatedFields } from 'src/apiClient/carbon';

export const updateAPICarbonCalculator = async (circleSliderData) => {
  const data = {
    houseHoldMembers: circleSliderData?.houseHoldMembers,
    publicTransportationMembers: circleSliderData?.publicTransportationMembers,
    income: circleSliderData?.income,
    houseSize: circleSliderData?.houseSize,
    airTravel: circleSliderData?.airTravel,
    meatConsumption: circleSliderData?.meatConsumption,
    totalCarbonEmissions: circleSliderData?.totalCarbonEmissions,
    countryCode: circleSliderData?.countryCode,
  };

  try {
    await saveCalculatedFields(data);
  } catch (err) {
    console.log(err);
  }
};
