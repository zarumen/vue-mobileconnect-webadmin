// import 'chart.js'
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  data () {
    return {
      datacollection: {
        labels: ['KEYWORD1', 'KEYWORD2', 'KEYWORD3', 'KEYWORD4'],
        datasets: [
          {
            backgroundColor: [
              '#41B883',
              '#E46651',
              '#00D8FF',
              '#DD1B16'
            ],
            data: [40, 20, 80, 10]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted () {
    this.renderChart(this.datacollection, this.options)
  }
}
