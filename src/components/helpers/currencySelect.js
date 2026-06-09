import React from 'react'

const CurrencySelect = ({
  handleSelect,
  selectedCurrency,
  placeholderChange = false,
  className = '',
  name,
}) => {
  return (
    <div>
      <select name={name} className={className} onChange={handleSelect}>
        <option hidden selected={selectedCurrency === ''} value=""></option>
        {/* {placeholderChange ? (
          <option selected={selectedCurrency === ''} value=""></option>
        ) : (
          ''
        )} */}
        <option selected={selectedCurrency === 'USD'} value="USD">
          {!placeholderChange ? 'USD$' : 'USD($)'}
        </option>
        <option selected={selectedCurrency === 'CAD'} value="CAD">
          {!placeholderChange ? 'CAD$' : 'CAD($)'}
        </option>
        <option selected={selectedCurrency === 'INR'} value="INR">
          {!placeholderChange ? 'INR₹' : 'INR(₹)'}
        </option>
        <option selected={selectedCurrency === 'GBP'} value="GBP">
          {!placeholderChange ? 'GBP£' : 'GBP(£)'}
        </option>
        <option selected={selectedCurrency === 'EUR'} value="EUR">
          {!placeholderChange ? 'EUR€' : 'EUR(€)'}
        </option>
        <option selected={selectedCurrency === 'JPY'} value="JPY">
          {!placeholderChange ? 'JPY ¥' : 'JPY(¥)'}
        </option>
        <option selected={selectedCurrency === 'CNY'} value="CNY">
          {!placeholderChange ? 'CNY¥' : 'CNY(¥)'}
        </option>
      </select>
    </div>
  )
}

export default CurrencySelect
