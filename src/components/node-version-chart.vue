<template>
  <div class="q-mt-md">
    <q-scroll-area
      style="height: 350px; max-width: 300px;"
    >
      <canvas id="pie" width="300px" height="500px"></canvas>
    </q-scroll-area>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Chart from 'chart.js'
import { round } from './../utils/commons.js'

import {
  GET_NODE_VERSIONS
} from '../store/app/types'

export default {
  name: 'NodeVersionChart',
  computed: {
    ...mapGetters([
      'nodesVersions',
      'stakedAVAX'
    ])
  },
  watch: {
    stakedAVAX: function () {
      this.getNodeVersions()
    },
    nodesVersions: function () {
      this.getChart()
      this.chart.update()
    }
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    ...mapActions({
      getNodeVersions: GET_NODE_VERSIONS
    }),
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
            labels: {
              boxWidth: 15,
              fontColor: '#9c929c',
              textAlign: 'left'
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
