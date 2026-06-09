import { returnReverseCode } from "src/data/countryCodeToISO3";

export const returnPhoneDetails = (phoneInfo) => {
  console.log("here is phone info", phoneInfo);
  let ISO3UserPhoneCode = phoneInfo?.countryCode;
  let numericCode = phoneInfo?.numericCode;
  if (phoneInfo?.countryCode?.length === 2)
    ISO3UserPhoneCode = returnReverseCode(phoneInfo?.countryCode);
  if (typeof numericCode == "string" && numericCode?.[0] == "+")
    numericCode = numericCode.slice(1);

  const phoneDetails = {
    number: phoneInfo.number,
    countryCode: ISO3UserPhoneCode,
    numericCode,
  };
  return phoneDetails;
};
