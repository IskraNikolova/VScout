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
      'txHKey'
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
    this.myChart.update()
    this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === 'SET_TOTAL_TXS') {
        this.arr = await this.txsHistory(this.txHKey)
        this.getChart()
        this.myChart.update()
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
      this.getChart()
      this.myChart.update()
    },
    getChart () {
      const ctx = window.document.getElementById('myChart').getContext('2d')

      const dataFirst = {
        label: 'Tx Volume',
        data: this.arr.intervals.map(a => a.transactionCount),
        // backgroundColor: 'white',
        borderColor: 'white'
      }

      const dataSecond = {
        label: `TPS History - ${this.arr.label} Ø`,
        data: this.arr.intervals.map(a => {
          const sec = getSec(a.endTime, a.startTime)
          return (a.transactionCount / sec).toFixed(2)
        }),
        // backgroundColor: 'rgba(146, 255, 96)',
        borderColor: 'rgba(146, 255, 96)'
      }
      function getSec (endT, start) {
        var now = moment(endT)
        var end = moment(start)
        var duration = moment.duration(now.diff(end))
        var sec = duration.asSeconds()
        return sec
      }

      const speedData = {
        labels: this.arr.intervals.map(a => getChartLabel(a, this.arr.label)),
        datasets: [dataFirst, dataSecond]
      }

      this.myChart = new Chart(ctx, {
        type: 'line',
        data: speedData,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                // Include a dollar sign in the ticks
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
              // labelColor: function (tooltipItem, chart) {
              //   return {
              //     borderColor: 'rgb(255, 0, 0)',
              //     backgroundColor: 'rgb(255, 0, 0)'
              //   }
              // },
              // labelTextColor: function (tooltipItem, chart) {
              //   return '#543453'
              // },
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
    opacity:0.8;
  }
</style>
