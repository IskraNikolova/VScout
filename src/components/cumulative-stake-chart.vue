<template>
 <div>
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
      type: Number,
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
        labels: ['', '', ''],
        datasets: [{
          label: '#',
          data: [this.precentAll - this.precent, this.precent, 100 - (this.precentAll)],
          backgroundColor: ['Grey', '#87C5D6', 'black'],
          borderColor: ['Grey', '#87C5D6', 'black']
        }]
      },
      options: {
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
