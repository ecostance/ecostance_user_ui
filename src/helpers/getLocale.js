const localeMap = {
    ARS: 'es-ar', // Argentine Peso
    USD: 'en-us', // United States dollar
    BRL: 'pt-br', // Brazilian real
    CAD: 'en-ca', // Canadian dollar
    AUD: 'en-au', // Australian dollar
    INR: 'en-in', // Indian Rupee
    GBP: 'en-GB', // British Pound Sterling
    JPY: 'ja-JP', // Japanese yen
    MXN: 'es-MX', // Mexican peso
    DKK: 'da-DK', // Danish Krone
    EUR: 'de-DE', // Euro
    CNY: 'zh-cn'  // Chinese yuan renminbi
}
export default function getLocaleFromCurrency(currencyCode) {
    return localeMap[currencyCode]
} 
