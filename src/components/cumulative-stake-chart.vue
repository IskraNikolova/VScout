<template>
 <div>
    <div class="q-ml-xs q-mb-md">
      Cumulative stake:  <span class="text-accent">{{ 100 - Math.round(100 - (this.precentAll), 2) }} %</span>
    </div>
   <canvas :id="name" width="400" height="400"></canvas>
 </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'CumulativeStakeChart',
  data () {
    return {
      chart: {}
    }
  },
  props: {
    precentAll: {
      type: Number,
      required: true
    },
    precent: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  mounted () {
    const ctx = document.getElementById(`${this.name}`).getContext('2d')
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          data: [Math.round(this.precentAll - this.precent, 2), Math.round(this.precent, 2), Math.round(100 - (this.precentAll), 2)],
          backgroundColor: ['Grey', '#87C5D6', 'black'],
          borderColor: ['Grey', '#87C5D6', 'black']
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const label = data.datasets[0].data[tooltipItem.index] + '%'

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
}
</script>
