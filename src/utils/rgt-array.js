
/**
 * @param  {} startDateTime
 * @param  {} num
 */
export function genTimeSeries (startDateTime, num) {
  const MS_PER_MINUTE = 60000
  const d = startDateTime
  const timeSeries = []
  let count = 1
  let tmpTime = null

  // let stime = d.toLocaleTimeString("th",{hour: '2-digit', minute:'2-digit'})

  for (count = 0; count <= num; count++) {
    tmpTime = new Date(d - count * MS_PER_MINUTE)
    timeSeries[num - count] = tmpTime.toLocaleTimeString('th', { hour: '2-digit', minute: '2-digit' })
  }

  return timeSeries
}
/**
 * @param  {} num: number of array element to create.
 */
export function genEmptyArray (num) {
  const tmp = []

  for (let count = 0; count <= num; count++) {
    tmp[count] = 0
  }

  return tmp
}
