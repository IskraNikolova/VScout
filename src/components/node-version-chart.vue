<template>
  <div class="q-mt-md">
   <canvas id="pie" width="300px" height="500px"></canvas>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from 'chart.js'
import { round } from './../utils/commons.js'

export default {
  name: 'NodeVersionChart',
  computed: {
    ...mapGetters([
      'nodesVersions'
    ])
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    getPercent (val, all) {
      if (!val) return
      return (Number(val) / Number(all)) * 100
    },
    start () {
      const el = document.getElementById('pie')
      if (el === null) return
      const ctx = el.getContext('2d')
      const dataArray = this.nodesVersions.map(d => Number(d.count))
      const labels = this.nodesVersions.map(d => `${d.version.split('/')[1] ? 'v' + d.version.split('/')[1] : d.version} | Stake: ${d.stake}`)
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            labels,
            data: dataArray,
            backgroundColor: this.nodesVersions.map(d => d.color),
            borderColor: this.nodesVersions.map(d => d.color)
          }]
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
            fontFamily: 'Rubik',
            padding: 5,
            labels: {
              boxWidth: 15,
              fontColor: '#9c929c',
              textAlign: 'left',
              lineWidth: 4
            }
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const l = data.datasets[0].labels[tooltipItem.index].split('|')[0]
                const percent = this.getPercent(data.datasets[0].data[tooltipItem.index], this.nodesVersions.all)
                const label = l + ': ' + round(percent, 100) + '% Count: ' + data.datasets[0].data[tooltipItem.index]
                return label
              }
            }
          }
        }
      })
    },
    getChart () {
      try {
        this.start()
      } catch (err) {
        setTimeout(() => {
          this.start()
        }, 5000)
      }
    }
  },
  mounted () {
    this.getChart()
  }
}
</script>
