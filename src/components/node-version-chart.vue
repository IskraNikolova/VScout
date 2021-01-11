<template>
  <div class="q-mt-md">
     <div class="q-pl-xl text-panel"><small><q-icon name="info" /><i> S - STAKE (AVAX) | C - COUNT</i></small></div>
    <canvas id="pie" style="position:relative;height:35vh; width:15vw;max-height: 400px;min-width: 210px;"></canvas>
  </div>
</template>

<script>
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
    getFormatStake (val) {
      if (!val) return 'None'
      const stake = new BigNumber(val)
      if (stake.toNumber() > 1000000) {
        return `${Math.round(stake.dividedBy(1000000))} M`
      }
      return `${Math.round(stake.dividedBy(1000))} K`
    },
    start () {
      const el = document.getElementById('pie')
      if (el === null) return
      const ctx = el.getContext('2d')
      const dataArray = this.nodesVersions.map(d => Number(d.count))
      const labels = this.nodesVersions
        .filter(d => d.count > 0 || d.stake !== '0')
        .map(d => `${d.version.split('/')[1] ? 'v' + d.version.split('/')[1] : d.version}`)
      const colors = this.nodesVersions.map(d => d.color)
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: dataArray,
            backgroundColor: colors,
            borderColor: colors
          }]
        },
        options: {
          legend: {
            display: false
          },
          responsive: false,
          tooltips: {
            backgroundColor: 'rgba(255, 255, 255)',
            titleFontColor: '#000',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            callbacks: {
              label: (tooltipItem, data) => {
                const dataV = data.datasets[0].data[tooltipItem.index]
                const item = this.nodesVersions[tooltipItem.index]
                if (!item) return ''
                const stake = item.stake
                const percent = this.getPercent(dataV, this.nodesVersions.all)
                const label = round(percent, 100) + '%  S: ' + this.getFormatStake(stake) + ' | C: ' + dataV
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
