<template>
  <q-card
     class="q-mt-md q-pt-md q-pl-xl q-pr-xl"
     dark flat id="custom-card"
  >
    <div class="row">
      <div class="col-md-3 col-xs-12">
        <div style="font-size: 11px;" class="q-pb-md">TRANSACTIONS (24Hr)</div>
        <div class="text-h5 text-positive q-pb-xl"><b>{{ txsFor24H }} <small>(0.00 TPS)</small></b></div>
        <div style="font-size: 12px;" class="q-pb-md">TOTAL TRANSACTIONS</div>
        <div class="text-h5"><b><span class="text-positive">{{ totalTxsCount.toLocaleString() }}</span></b></div>
      </div>
      <div class="col-md-9 col-xs-12">
        <!--todo calc and vuew -->
        <div>
          <q-btn no-caps size="xs" @click="onYear()" outline color="positive" class="q-mr-xs" label="Yr"/>
          <q-btn no-caps size="xs" @click="onMonth()" outline color="positive" class="q-mr-xs" label="Mo"/>
          <q-btn no-caps size="xs" @click="onWeek()" outline color="positive" class="q-mr-xs" label="Wk"/>
          <q-btn no-caps size="xs" @click="onDay()" outline color="positive" class="q-mr-xs" label="D"/>
          <q-btn no-caps size="xs" @click="onSixHours()" outline color="positive" class="q-mr-xs" label="6h"/>
          <q-btn no-caps size="xs" @click="onTwoHours()" outline color="positive" class="q-mr-xs" label="2h"/>
          <q-btn no-caps size="xs" @click="onTreeMin()" outline color="positive" label="30m"/>
        </div>
        <canvas id="myChart" height="70%"></canvas>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import Chart from 'chart.js'
import moment from 'moment'

import { _getAgregates } from './../modules/network'
const lab = {
  1: '1 MIN',
  3: '3 MIN',
  15: '15 SECONDS'
}

export default {
  name: 'TransactionsItem',
  computed: {
    ...mapGetters([
      'txsFor24H',
      'totalTxsCount'
    ])
  },
  async mounted () {
    this.arr = await this.getDataForSixHours()
    this.getChart()
    this.myChart.update()
  },
  data () {
    return {
      totalTxs: 0,
      arr: [],
      myChart: {},
      label: 15
    }
  },
  methods: {
    async onTreeMin () {
      this.label = 15
      this.arr = await this.getDataForMin()
      this.getChart()
    },
    async onTwoHours () {
      this.label = 1
      this.arr = await this.getDataForTwoHours()
      this.getChart()
    },
    async onSixHours () {
      this.label = 3
      this.arr = await this.getDataForSixHours()
      this.getChart()
    },
    async getDataForMin () {
      const txs = []
      const minAgo = moment().subtract(30, 'minutes')
      while (minAgo < moment()) {
        const aggregates = await _getAgregates(minAgo.toISOString(), minAgo.add(15, 'seconds').toISOString())
        txs.push(aggregates)
      }
      return txs
    },
    async getDataForTwoHours () {
      const txs = []
      const minAgo = moment().subtract(2, 'hours')
      while (minAgo < moment()) {
        const aggregates = await _getAgregates(minAgo.toISOString(), minAgo.add(1, 'minutes').toISOString())
        txs.push(aggregates)
      }
      return txs
    },
    async getDataForSixHours () {
      const txs = []
      const minAgo = moment().subtract(6, 'hours')
      while (minAgo < moment()) {
        const aggregates = await _getAgregates(minAgo.toISOString(), minAgo.add(3, 'minutes').toISOString())
        console.log(aggregates)
        txs.push(aggregates)
      }
      return txs
    },
    getChart () {
      const ctx = window.document.getElementById('myChart').getContext('2d')
      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: new Array(133).fill(''),
          datasets: [{
            label: `Transaction History - ${lab[this.label]}`,
            data: this.arr.map(a => a.transactionCount),
            backgroundColor: 'rgba(146, 255, 96)',
            borderColor: 'rgba(146, 255, 96, 0.4)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
          }
        }
      })
    }
  }
}
</script>
<style scoped>
  #custom-card {
    border-right: 2px solid #92FF60;
    background: radial-gradient(circle, #344245 0%, #000709 70%);
    opacity:0.9;
  }
</style>
