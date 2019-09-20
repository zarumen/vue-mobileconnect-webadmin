// import 'chart.js'
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data () {
    return {
      datacollection: {
      // Data to be represented on x-axis
        labels: ['June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'KEYWORD1',
            borderColor: '#41B883',
            pointBackgroundColor: 'white',
            borderWidth: 3,
            pointBorderColor: '#249EBF',
            // Data to be represented on y-axis
            data: [40, 20, 30, 50, 90, 10, 20]
          },
          {
            label: 'KEYWORD2',
            borderColor: '#05CBE1',
            pointBackgroundColor: 'white',
            pointBorderColor: '#05CBE1',
            borderWidth: 3,
            data: [60, 55, 32, 10, 2, 12, 53]
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted () {
    this.renderChart(this.datacollection, this.options)
  }
}
