<template>
  <div>
    <div class="q-ml-xs q-mb-md">
      <span class="text-medium">Cumulative Stake: </span>
      <span class="text-orange">
        {{ 100 - Math.round(100 - (percentAll), 2) }} %
      </span>
    </div>
   <canvas :id="name" width="400px" height="400px"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'CumulativeStakeChart',
  props: {
    percentAll: {
      type: Number,
      required: true
    },
    percent: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    nameC: function () {
      return this.name
    }
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    getChart () {
      const el = document
        .getElementById(`${this.nameC}`)
      if (el === null) return
      const ctx = el.getContext('2d')

      let percentAll = this.percentAll
      if (!percentAll) percentAll = 0

      const dataArray = [
        Math.round(percentAll - this.percent, 2),
        Math.round(this.percent, 2),
        Math.round(100 - (percentAll), 2)
      ]

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            labels: ['', 'Network Share', ''],
            data: dataArray,
            backgroundColor: ['#32353b', '#ff6000', '#ffffff'],
            borderColor: ['#32353b', '#ff6000', '#32353b']
          }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const label = data.datasets[0].labels[tooltipItem.index] + ': ' + data.datasets[0].data[tooltipItem.index] + '%'
                return label
              }
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
    }
  },
  mounted () {
    this.getChart()
  }
}
</script>
