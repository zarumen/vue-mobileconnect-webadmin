// import 'chart.js'
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data () {
    return {
      datacollection: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'SMS Volume One (Millions)',
            backgroundColor: '#f87979',
            data: [40, 20, 12, 39, 18, 40, 39, 44, 40, 20, 12, 11]
          }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  },
  mounted () {
    //  renderChart function renders the chart with the datacollection and options object.
    this.renderChart(this.datacollection, this.options)
  }
}
