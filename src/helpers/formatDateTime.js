export const getFormattedDate = (originalDate) => {
  if (new Date(originalDate) == 'Invalid Date') return ''
  const localDate = new Date(originalDate).toLocaleDateString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return localDate.split('/').reverse().join('-')
}

export const getFormattedTime = (originalTime) => {
  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}`
  }
  const padToTwoDigits = (num) => {
    return num.toString().padStart(2, '0')
  }

  const localTime = new Date(originalTime).toLocaleTimeString([], {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const time = localTime.split(':').slice(0, 2).join(':')

  const timezoneAbbreviation = new Date(originalTime)
    .toLocaleDateString([], { day: '2-digit', timeZoneName: 'long' })
    .substring(4)
    .match(/\b(\w)/g)
    .join('')

  let timezoneOffset = new Date().getTimezoneOffset()

  const offsetSign = timezoneOffset < 0 ? '+' : '-'

  timezoneOffset = toHoursAndMinutes(
    Number(timezoneOffset.toString().replace('-', ''))
  )

  return `${time} ${timezoneAbbreviation} (UTC ${offsetSign}${timezoneOffset})`
}

export const returnOneYearForwardDate = (originalDate) => {
  const formattedDate = getFormattedDate(originalDate)
  const dateArray = formattedDate?.split('-')
  dateArray[0] = String(parseInt(++dateArray[0]))
  return dateArray.join('-')
}
