<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl"
    id="custom-card"
  >
    <div class="row">
      <div class="col-md-3 col-xs-12" style="padding-top: 2.5%;">
        <div id="f-size12" class="q-pb-md">TRANSACTIONS (24Hr)</div>
        <div class="col text-h5 text-accent q-pb-xl">
          <img
            src="~assets/arrow-down.png"
            class="custom-icon arrow"
            v-if="prevTxsFor24H.transactionCount > txsFor24H.transactionCount"
          >
          <img src="~assets/arrow-up.png" class="custom-icon arrow" v-else>
          {{ txsFor24H.transactionCount }}
          <small>({{ tps }} TPS)</small>
        </div>
        <div id="f-size12" class="q-pb-md">TOTAL TRANSACTIONS</div>
        <div class="text-h5"><span class="text-accent">{{ totalTxsCount.toLocaleString() }}</span></div>
        <div><small>AVA X-CHAIN</small></div>
      </div>
      <div class="col-md-9 col-xs-12">
        <div style="max-width: 250px;"><q-btn-toggle
          v-model="interval"
          outline
          no-caps
          size="xs"
          spread
          toggle-color="accent"
          @click.native="onGetData"
          :options="[
            {label: 'Yr', value: 'year'},
            {label: 'Mo', value: 'month'},
            {label: 'Wk', value: 'week'},
            {label: '24h', value: 'day'},
            {label: '2h', value: 'hourTwo'},
            {label: '30m', value: 'minute'}
          ]"
        /></div>
        <div class="row">
          <div class="col-md-6 col-xs-12"><canvas id="chartVol"></canvas></div>
          <div class="col-md-6 col-xs-12"><canvas id="chartTps"></canvas></div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import Chart from 'chart.js'
import { getChartLabel } from './../../utils/commons'

import { GET_TXS_HISTORY } from './../../store/app/types'

export default {
  name: 'TransactionsItem',
  data () {
    return {
      labels: [],
      chartVol: {},
      chartTps: {},
      interval: 'minute'
    }
  },
  computed: {
    ...mapGetters([
      'txsFor24H',
      'totalTxsCount',
      'txsHistory',
      'txHKey',
      'prevTotalTxs',
      'prevTxsFor24H'
    ]),
    tps: function () {
      const t = this.txsFor24H.transactionCount / (24 * 60 * 60)
      return t.toFixed(2)
    }
  },
  async mounted () {
    this.interval = this.txHKey
    this.initCharts()
    this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === 'SET_TOTAL_TXS') {
        if (this.prevTotalTxs < this.totalTxsCount ||
        moment().seconds() % 59 === 0) {
          await this.update()
        }
      } else if (mutation.type === 'SET_TXS_HISTORY') {
        await this.update()
      }
    })
  },
  methods: {
    ...mapActions({
      getTxHistory: GET_TXS_HISTORY
    }),
    initCharts () {
      this.getLabels()
      this.getVolumeChart()
      this.getTpsChart()
    },
    async onGetData () {
      this.update()
      const response = await this.getTxHistory({ txHKey: this.interval })
      if (response === null) return

      this.update()
    },
    options () {
      return {
        animation: {
          duration: 0
        },
        hover: { mode: null },
        mousemove: { mode: null },
        mouseout: { mode: null },
        scales: {
          yAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value
              }
            }
          }],
          xAxes: [{
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return value
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              if (!data || !data.datasets || !data.datasets[tooltipItem.datasetIndex]) return
              let label = data.datasets[tooltipItem.datasetIndex].label || ''

              if (label) {
                label += ': '
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100
              return label
            }
          }
        }
      }
    },
    update () {
      this.getLabels()
      this.chartVol.data = this.getVolChartData()
      this.chartTps.data = this.getTpsChartData()
      if (!this.chartVol.data) return
      this.chartVol.update()
      this.chartTps.update()
    },
    getSec (e, s) {
      const duration = moment.duration(moment(e).diff(moment(s)))
      return duration.asSeconds()
    },
    getLabels () {
      const data = this.txsHistory(this.interval)
      if (!data) {
        this.labels = []
        return
      }
      this.labels = data.intervals.map(a => getChartLabel(a, data.key))
    },
    getVolChartData () {
      let data = this.txsHistory(this.interval)
      if (!data) data = { label: '', intervals: [] }
      const volumesData = {
        label: `Tx Volume  - ${data.label} Ø`,
        data: data.intervals.map(a => a.transactionCount),
        borderColor: 'black',
        backgroundColor: 'black'
      }

      return {
        labels: this.labels,
        datasets: [volumesData]
      }
    },
    getTpsChartData () {
      let data = this.txsHistory(this.interval)
      if (!data) data = { label: '', intervals: [] }
      const tpsData = {
        label: `TPS History - ${data.label} Ø`,
        data: data.intervals.map(a => {
          const sec = this.getSec(a.endTime, a.startTime)
          return (a.transactionCount / sec).toFixed(2)
        }),
        borderColor: '#87C5D6',
        backgroundColor: '#87C5D6'
      }

      return {
        labels: this.labels,
        datasets: [tpsData]
      }
    },
    getVolumeChart () {
      const ctx = window.document.getElementById('chartVol').getContext('2d')
      this.chartVol = new Chart(ctx, {
        type: 'bar',
        data: this.getVolChartData(),
        options: this.options()
      })
    },
    getTpsChart () {
      const ctx = window.document.getElementById('chartTps').getContext('2d')
      this.chartTps = new Chart(ctx, {
        type: 'bar',
        data: this.getTpsChartData(),
        options: this.options()
      })
    }
  }
}
</script>
<style scoped>
#custom-card {
  border-right: 2px solid #87C5D6;
}
.custom-icon {
  width:30vw;
  max-width:30px;
}
.arrow {
  width: 23px;
  margin-bottom: -3px;
  margin-right: -10px;
  margin-left: -9px;
}
</style>
