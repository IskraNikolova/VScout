<template>
  <div class="q-mt-md">
    <div class="q-pl-lg q-pb-xs text-panel"><small><q-icon name="info" /><i> C - COUNT (NODES) </i></small></div>
    <div class="q-pl-sm">
      <canvas
        :id="id"
        :style="'position:relative;height:' + height + 'vh; width:' + width + 'vw;max-height: ' + maxHeight + 'px;min-width: ' + minWidth + 'px;min-height:' + minHeight + 'px;max-width:' + maxWidth">
      </canvas>
    </div>
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
  props: {
    id: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    maxHeight: {
      type: Number,
      required: true
    },
    minHeight: {
      type: Number,
      required: true
    },
    maxWidth: {
      type: Number,
      required: true
    },
    minWidth: {
      type: Number,
      required: true
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
    start (bar) {
      if (bar === null) return
      const ctx = bar.getContext('2d')
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
            backgroundColor: 'rgba(50, 53, 59)',
            titleFontColor: '#fff',
            bodyFontColor: '#fff',
            bodyFontSize: 12,
            callbacks: {
              label: (tooltipItem, data) => {
                const dataV = data.datasets[0].data[tooltipItem.index]
                const item = this.nodesVersions[tooltipItem.index]
                if (!item) return ''
                const percent = this.getPercent(dataV, this.nodesVersions.all)
                const label = round(percent, 100) + '%  C: ' + dataV
                return label
              }
            }
          }
        }
      })
    },
    getChart (bar) {
      try {
        this.start(bar)
      } catch (err) {
        // setTimeout(() => {
        //   this.start()
        // }, 5000)
      }
    }
  },
  mounted () {
    const bar = document.getElementById(this.id)
    this.getChart(bar)
  }
}
</script>
