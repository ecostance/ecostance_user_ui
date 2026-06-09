import React, { useState } from 'react'
import { useEffect } from 'react'
import { CircleFlag } from 'react-circle-flags'
import { getCountries } from 'src/apiClient/country'
import {
  returnCorrectCode,
  returnReverseCode,
} from 'src/data/countryCodeToISO3'

const CountrySelector = ({
  selectedCountry,
  setSelectedCountry,
  reRender,
  name,
  handleOnBlur = () => console.log(''),
  disabled,
  origin,
}) => {
  const [countryList, setCountryList] = useState([])
  const [userCountry, setUserCountry] = useState({})
  const [countryCodeISO3, setCountryCodeISO3] = useState('')
  const [localSelectedCountry, setLocalSelectedCountry] = useState({
    countryCode: selectedCountry,
  })
  const [countryCurrencyJSX, setCountryCurrencyJSX] = useState()

  useEffect(() => {
    getCountryList().catch((err) => console.log(err))
  }, [])

  const findCountryBasedOnName = (countryCode) => {
    return countryList.find(
      (each) => each?.countryCode?.toUpperCase() === countryCode?.toUpperCase()
    )
  }

  useEffect(() => {
    // console.log("the selectedCountry ran", selectedCountry);
    // const countryCode = returnReverseCode(selectedCountry);
    // console.log("here is countryCode", countryCode);
    const countryData = findCountryBasedOnName(
      localSelectedCountry?.countryCode
    )

    if (!countryData) setUserCountry({ name: '', value: '' })

    const countryName = countryData?.entity
    const countryCode = countryData?.countryCode

    setUserCountry({
      name: countryName,
      value: countryCode,
      preferredName: localSelectedCountry?.preferredName,
    })
    setCountryCodeISO3(returnCorrectCode(countryCode).toLocaleLowerCase())
  }, [localSelectedCountry, countryList])

  const getCountryList = async () => {
    await getCountries({ show: 'yes', limit: 255 })
      .then((data) => {
        const newCountries = data?.data?.filter(
          (each) => each.carbonCountryPerCapita !== '0' && each.countryCode
        )

        newCountries.sort((a, b) =>
          a.entity.localeCompare(b.entity, 'es', { sensitivity: 'base' })
        )

        setCountryList(newCountries)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const mapCurrencyToSymbol = (currency) => {
    const allCurrencies = [
      { currency: 'USD', currencySymbol: '$' },
      { currency: 'CAD', currencySymbol: '$' },
      { currency: 'GBP', currencySymbol: '£' },
      { currency: 'EUR', currencySymbol: '€' },
      { currency: 'INR', currencySymbol: '₹' },
      { currency: 'JPY', currencySymbol: '¥' },
      { currency: 'CNY', currencySymbol: '¥' },
    ]
    const correctCurrency = allCurrencies?.find(
      (each) => each?.currency === currency?.toUpperCase()
    )

    if (correctCurrency) {
      return `${correctCurrency?.currency}(${correctCurrency?.currencySymbol})`
    } else {
      return ''
    }
  }

  const returnCurrencyBasedOnLocation = (countryData) => {
    let currency
    if (countryData?.isCurrencySupported) {
      currency = mapCurrencyToSymbol(countryData?.currencyCode)
    } else {
      currency = 'USD($)'
    }
    return currency
  }

  const handleSelectCountry = (e) => {
    setCountryCodeISO3(returnCorrectCode(e?.target?.value).toLocaleLowerCase())
    const countryData = countryList.find(
      (each) => each?.countryCode === e?.target?.value
    )

    // if (origin === 'profile') {
    //   let currency
    //   if (countryData?.isCurrencySupported) {
    //     currency = mapCurrencyToSymbol(countryData?.currencyCode)
    //   } else {
    //     currency = 'USD $'
    //   }
    //   setLocalSelectedCountry({
    //     name: countryData?.entity,
    //     preferredName: `${countryData?.entity} ${currency}`,
    //   })
    //   return setSelectedCountry(countryData?.entity)
    // }
    setLocalSelectedCountry({ name: countryData?.entity })
    setSelectedCountry(countryData?.entity)
  }

  return (
    <div
      className="sustainability--country-holder--main"
      style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px' }}
    >
      <select
        className="w-100 country--select-sustaintainability"
        onChange={(e) => handleSelectCountry(e)}
        defaultValue={userCountry?.value}
        value={userCountry?.value}
        name={name}
        disabled={disabled}
        // onBlur={handleOnBlur}
      >
        <option hidden selected>
          {countryList.some((item) => item.entity === userCountry.name)
            ? `${userCountry.name} | ${returnCurrencyBasedOnLocation(
                findCountryBasedOnName(userCountry?.name)
              )}`
            : ``}
        </option>
        {countryList &&
          countryList.map((item, index) => {
            return (
              <>
                <option key={index} value={item.countryCode}>
                  {`${item.entity} | ${returnCurrencyBasedOnLocation(item)}`}
                </option>
              </>
            )
          })}
      </select>
      {userCountry.name && (
        <div className="sustainability--flag-holder profile">
          <CircleFlag countryCode={countryCodeISO3} height="35" />
        </div>
      )}
      {countryCurrencyJSX}
    </div>
  )
}

export default CountrySelector
