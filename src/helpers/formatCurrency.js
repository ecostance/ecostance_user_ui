import getLocale from "./getLocale"

const currencySymbol = ['$', 'R$', '₹', '£', '￥', 'kr.', '€', '¥']

export default function formatCurrency(amount, currencyCode) {
    if (amount === undefined || currencyCode === undefined) return ''
    if (isNaN(amount)) return ''
    const localeCode = getLocale(currencyCode)
    if (localeCode === undefined) return amount

    let formattedCurrency = Intl.NumberFormat(localeCode, { style: 'currency', currency: currencyCode }).format(amount)

    currencySymbol.forEach((symbol) => {
        if (formattedCurrency.includes(symbol)) {
            formattedCurrency = formattedCurrency.replace(symbol, '')
        }
    })

    return formattedCurrency.trim()
}