<template>
  <q-card
     class="q-mt-md q-pt-md q-pl-xl q-pr-xl"
     dark flat id="custom-card"
  >
    <div class="row">
      <div class="col-md-3 col-xs-12">
        <div style="font-size: 11px;" class="q-pb-md">TRANSACTIONS (24Hr)</div>
        <div class="text-h5 text-positive q-pb-xl">{{ txsFor24H.transactionCount }} <small>(0.00 TPS)</small></div>
        <div style="font-size: 11px;" class="q-pb-md">TOTAL TRANSACTIONS</div>
        <div class="text-h5"><span class="text-positive">{{ totalTxsCount.toLocaleString() }}</span></div>
      </div>
      <div class="col-md-9 col-xs-12">
        <div>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Yr"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Mo"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Wk"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="D"/>
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
import Chart from 'chart.js'

import { SET_KEY_TXH, GET_TXS_HISTORY } from './../store/app/types'

const temp = {
  Yr: 'year',
  Mo: 'month',
  Wk: 'week',
  D: 'day',
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
    ])
  },
  async mounted () {
    await this.getTxHistory()
    this.arr = await this.txsHistory(this.txHKey)
    this.getChart()
    this.myChart.update()
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
        label: 'Tx Count',
        data: this.arr.intervals.map(a => a.transactionCount),
        backgroundColor: 'rgba(146, 255, 96)'
      }

      // todo tx volume calc
      const dataSecond = {
        label: 'Tx Volume',
        data: this.arr.intervals.map(a => Math.round(a.transactionVolume / 10 ** 15.8923)),
        backgroundColor: 'white'
      }

      const speedData = {
        labels: new Array(this.arr ? this.arr.intervals.length : 0).fill(''),
        datasets: [dataFirst, dataSecond]
      }

      this.myChart = new Chart(ctx, {
        type: 'line',
        data: speedData
      })
    }
  }
}
</script>
<style scoped>
  #custom-card {
    border-right: 2px solid #92FF60;
    background: radial-gradient(circle, #344245 0%, #000709 70%);
    opacity:0.8;
  }
</style>
