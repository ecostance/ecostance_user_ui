import GLPN from "google-libphonenumber";

export const validatePhoneNumber = (phone) => {
  const phoneUtil = GLPN.PhoneNumberUtil.getInstance();

  try {
    const convertedGooglePhoneNumber = phoneUtil.parseAndKeepRawInput(
      `+${phone}`,
      "US"
    );
    const validPhoneNumber = phoneUtil.isValidNumber(
      convertedGooglePhoneNumber
    );
    return validPhoneNumber;
  } catch (err) {
    console.log("phone number error", err);
    return false;
  }
};
