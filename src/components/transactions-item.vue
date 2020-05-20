<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl"
    dark flat id="custom-card"
  >
    <div class="row">
      <div class="col-md-3 col-xs-12">
        <div style="font-size: 11px;" class="q-pb-md">TRANSACTIONS (24Hr)</div>
        <div class="text-h5 text-positive q-pb-xl">{{ txsFor24H.transactionCount }} <small>({{ tps }} TPS)</small></div>
        <div style="font-size: 11px;" class="q-pb-md">TOTAL TRANSACTIONS</div>
        <div class="text-h5"><span class="text-positive">{{ totalTxsCount.toLocaleString() }}</span></div>
      </div>
      <div class="col-md-9 col-xs-12">
        <div>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Yr"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Mo"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Wk"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="24h"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="2h"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="30m"/>
        </div>
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

const temp = {
  Yr: 'year',
  Mo: 'month',
  Wk: 'week',
  '24h': 'day',
  '2h': 'hourTwo',
  '30m': 'minute'
}

export default {
  name: 'TransactionsItem',
  computed: {
    ...mapGetters([
      'txsFor24H',
      'totalTxsCount',
      'txsHistory',
      'txHKey',
      'prevTotalTxs'
    ]),
    tps: function () {
      const t = this.txsFor24H.transactionCount / (24 * 60 * 60)
      return t.toFixed(2)
    }
  },
  async mounted () {
    await this.getTxHistory()
    this.arr = await this.txsHistory(this.txHKey)
    this.getChart()
    this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === 'SET_TOTAL_TXS') {
        if (this.prevTotalTxs < this.totalTxsCount || moment().seconds() % 60 === 0) {
          this.arr = await this.txsHistory(this.txHKey)
          this.updateChart()
        }
      }
    })
  },
  data () {
    return {
      arr: [],
      myChart: {},
      label: 15
    }
  },
  methods: {
    ...mapActions({
      getTxHistory: GET_TXS_HISTORY
    }),
    async onGetData (e) {
      const txHKey = temp[e.target.innerText]
      this.$store.commit(SET_KEY_TXH, { txHKey })
      await this.getTxHistory()
      this.arr = this.txsHistory(this.txHKey)
      this.updateChart()
    },
    updateChart () {
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
</style>
