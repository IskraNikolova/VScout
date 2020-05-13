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
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Yr"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Mo"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Wk"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="D"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Hr"/>
          <q-btn no-caps size="xs" @click="onGetData" outline color="positive" class="q-mr-xs" label="Min"/>
          <!--<q-btn no-caps size="xs" @click="onGetData" outline color="positive" label="30m"/>-->
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
  Hr: 'hour',
  Min: 'minute'
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
      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: new Array(this.arr ? this.arr.intervals.length : 0).fill(''),
          datasets: [{
            label: 'Tx Volume',
            data: this.arr ? this.arr.intervals.map(a => a.transactionVolume / 10 ** 9) : [],
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
