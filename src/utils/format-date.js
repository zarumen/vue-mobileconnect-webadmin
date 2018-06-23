// https://date-fns.org/docs/parse
// import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/format
import format from 'date-fns/format'

export default function formatDate(date) {
  let t = new Date(1970, 0, 1)
  // date = parseDate(date)
  t.setSeconds(date)
  return format(t, 'MMM Do, YYYY')
}
