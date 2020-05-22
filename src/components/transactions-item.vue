<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl"
    dark flat id="custom-card"
  >
    <div class="row">
      <div class="col-md-3 col-xs-12">
        <div style="font-size: 11px;" class="q-pb-md">TRANSACTIONS (24Hr)</div>
        <div class="col text-h5 text-positive q-pb-xl">
          <img src="~assets/arrow-down.png" class="custom-icon arrow" v-if="prevTxsFor24H.transactionCount > txsFor24H.transactionCount">
          <img src="~assets/arrow-up.png" class="custom-icon arrow" v-else>
          {{ txsFor24H.transactionCount }}
          <small>({{ tps }} TPS)</small>
        </div>
        <div style="font-size: 11px;" class="q-pb-md">TOTAL TRANSACTIONS</div>
        <div class="text-h5"><span class="text-positive">{{ totalTxsCount.toLocaleString() }}</span></div>
      </div>
      <div class="col-md-9 col-xs-12">
        <q-btn-toggle
          v-model="interval"
          outline
          no-caps
          size="xs"
          color="positive"
          toggle-color="white"
          @click.native="onGetData"
          :options="[
            {label: 'Yr', value: 'year'},
            {label: 'Mo', value: 'month'},
            {label: 'Wk', value: 'week'},
            {label: '24h', value: 'day'},
            {label: '2h', value: 'hourTwo'},
            {label: '30m', value: 'minute'}
          ]"
        />
        <canvas id="myChart" height="70%"></canvas>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import Chart from 'chart.js'
import { getChartLabel } from './../utils/commons'

import { SET_KEY_TXH, GET_TXS_HISTORY } from './../store/app/types'

export default {
  name: 'TransactionsItem',
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
    await this.getTxHistory()
    this.interval = this.txHKey
    this.arr = await this.txsHistory(this.txHKey)
    this.getChart()
    this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === 'SET_TOTAL_TXS') {
        if (this.prevTotalTxs < this.totalTxsCount ||
        moment().seconds() % 59 === 0) {
          await this.updateChart()
        }
      }
    })
  },
  data () {
    return {
      arr: [],
      interval: 'day',
      myChart: {},
      label: 15
    }
  },
  methods: {
    ...mapActions({
      getTxHistory: GET_TXS_HISTORY
    }),
    async onGetData () {
      const txHKey = this.interval
      this.$store.commit(SET_KEY_TXH, { txHKey })
      await this.updateChart()
    },
    async updateChart () {
      await this.getTxHistory()
      this.arr = this.txsHistory(this.txHKey)
      const data = this.getChartData()
      this.myChart.data = data
      this.myChart.update()
    },
    getSec (endT, start) {
      const now = moment(endT)
      const end = moment(start)
      const duration = moment.duration(now.diff(end))
      const sec = duration.asSeconds()
      return sec
    },
    getTps () {
      return this.arr.intervals.map(a => {
        const sec = this.getSec(a.endTime, a.startTime)
        return (a.transactionCount / sec).toFixed(2)
      })
    },
    getVolumes () {
      return this.arr.intervals.map(a => a.transactionCount)
    },
    getLabels () {
      return this.arr.intervals.map(a => getChartLabel(a, this.arr.key))
    },
    getChartData () {
      const volumesData = {
        label: 'Tx Volume',
        data: this.getVolumes(),
        borderColor: 'white'
      }

      const tpsData = {
        label: `TPS History - ${this.arr.label} Ø`,
        data: this.getTps(),
        borderColor: 'rgba(146, 255, 96)'
      }

      const data = {
        labels: this.getLabels(),
        datasets: [volumesData, tpsData]
      }
      return data
    },
    getChart () {
      const ctx = window.document.getElementById('myChart').getContext('2d')

      const data = this.getChartData()

      this.myChart = new Chart(ctx, {
        type: 'line',
        data,
        options: {
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
      })
    }
  }
}
</script>
<style scoped>
#custom-card {
  border-right: 3px solid #92FF60;
  background: radial-gradient(circle, #344245 0%, #000709 70%);
  opacity:0.98;
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
