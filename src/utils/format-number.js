// https://date-fns.org/docs/parse
// import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/format
// import format from 'date-fns/format'

export default function formatCurrency(value) {
  // let val = (value/1).toFixed(2).replace(',', '.') เพิ่มจุดทศนิยม 2 ตำแหน่ง
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
