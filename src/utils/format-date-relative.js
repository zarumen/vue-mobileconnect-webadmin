// https://date-fns.org/docs/parse
// import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/distanceInWords
import distanceInWords from 'date-fns/distance_in_words'
// https://date-fns.org/docs/isToday
import isToday from 'date-fns/is_today'
import thLocale from 'date-fns/locale/th'

export default function formatDateRelative (fromDate, toDate = new Date()) {
  const t = new Date(1970, 0, 1, 7)
  const a = t.setSeconds(fromDate)
  return distanceInWords(a, toDate, { locale: thLocale }) + (isToday(toDate) ? ' ที่แล้ว' : '')
}
