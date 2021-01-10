<template>
  <div class="q-mt-md" style="max-height: 250px;">
    <canvas id="pie" :style="styleFn()"></canvas>
    <div class="q-pl-md text-panel"><small><q-icon name="info" /><i> S - STAKE (AVAX) | C - COUNT</i></small></div>
  </div>
</template>

<script>
import { Screen } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import Chart from 'chart.js'
import { round } from './../utils/commons.js'
const BigNumber = require('bignumber.js')

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
    },
    '$q.screen.width': function () {
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
    styleFn () {
      if (Screen.xs) return 'margin-left: 40px!important;position:relative;important;position:relative;min-height: 230px; height: 230px; max-height: 230px; max-width: 120%;'
      else if (Screen.sm) return 'margin-left: 40px!important;position:relative;min-height: 230px; height: 230px; max-height: 230px; max-width: 180%;'
      else if (Screen.xl || Screen.lg) return 'margin-left: 40px!important;min-height: 230px; height: 230px; max-height: 230px; max-width: 120%;'
      return 'min-height: 400px; height: 400px; max-height: 400px; max-width: 100%;'
    },
    getFormatStake (val) {
      if (!val) return 'None'
      const stake = new BigNumber(val)
      if (stake.toNumber() > 1000000) {
        return `${Math.round(stake.dividedBy(1000000))}M`
      }
      return `${Math.round(stake.dividedBy(1000))}K`
    },
    start () {
      const el = document.getElementById('pie')
      if (el === null) return
      const ctx = el.getContext('2d')
      const dataArray = this.nodesVersions.map(d => Number(d.count))
      const labels = this.nodesVersions
        .filter(d => d.count > 0 || d.stake !== '0')
        .map(d => `${d.version.split('/')[1] ? 'v' + d.version.split('/')[1] : d.version} | S: ${this.getFormatStake(d.stake)} | C: ${d.count}`)
      const colors = this.nodesVersions.map(d => d.color)
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            labels,
            data: dataArray,
            backgroundColor: colors,
            borderColor: colors
          }]
        },
        options: {
          legend: {
            display: true,
            position: Screen.md ? 'bottom' : 'right',
            align: 'start',
            labels: {
              boxWidth: 10,
              fontColor: '#9c929c',
              fontSize: 11.2,
              padding: 6
            }
          },
          responsive: false,
          maintainAspectRatio: false,
          aspectRatio: Screen.md ? 0.8 : 1.3,
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const dataL = data.datasets[0].labels[tooltipItem.index]
                const dataV = data.datasets[0].data[tooltipItem.index]
                if (!dataL) return
                const l = dataL.split('|')[0]
                const percent = this.getPercent(dataV, this.nodesVersions.all)
                const label = l + ': ' + round(percent, 100) + '% Count: ' + dataV
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
