import React, { useEffect } from "react";
import PhoneInput from "react-phone-input-2";

function PhoneInputJSX({
  number,
  handleChangeValue,
  country,
  handleKeyPressSubmit,
  handleOnBlur = () => console.log(""),
  name,
  className,
  setPhoneInfo,
}) {
  return (
    <div>
      <PhoneInput
        placeholder="Enter phone number"
        name={name || "phone"}
        className={className}
        country={country}
        onKeyDown={handleKeyPressSubmit}
        value={number}
        withCountryCallingCode={true}
        onChange={(value, data, event, formattedValue) => [
          setPhoneInfo({
            numericCode: data?.dialCode,
            countryCode: data?.countryCode,
            number: value.slice(data.dialCode.length),
            name: "phoneInfo",
            preventDefault: () => null,
          }),
          handleChangeValue({ target: { value, name: "phone" } }),
        ]}
        onBlur={(e) =>
          handleOnBlur({
            relatedTarget: e?.relatedTarget,
            target: { name: "phone", value: number },
          })
        }
      />
    </div>
  );
}

export default PhoneInputJSX;
