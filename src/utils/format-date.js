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
/**
 * @param  {} startDateTime
 * @param  {} num
 */
export function genTimeSeries(startDateTime,num) {
  let MS_PER_MINUTE = 60000;
  let d = startDateTime
  let timeSeries = []
  let count = 1
  let tmpTime = null

  let stime = d.toLocaleTimeString()
  timeSeries[num] = stime
  num = num-1 
  for(count = 0; count <= num; count++){
    tmpTime = new Date(d - count * MS_PER_MINUTE)
    timeSeries[num-count] = tmpTime.toLocaleTimeString()
  }

  return timeSeries
}