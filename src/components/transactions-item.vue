<template>
  <q-card
     class="q-mt-md q-pt-md q-pl-xl q-pr-xl"
     dark flat id="custom-card"
  >
    <div class="row">
      <div class="col-md-3 col-xs-12">
        <div style="font-size: 11px;" class="q-pb-md">CURRENT TPS</div>
        <div class="text-h5 text-positive q-pb-xl"><b>131</b></div>
        <div style="font-size: 12px;" class="q-pb-md">TOTAL TRANSACTIONS</div>
        <div class="text-h5"><b><span class="text-positive">219,606,845</span></b></div>
      </div>
      <div class="col-md-9 col-xs-12">
        <!--todo calc and vuew -->
        <div>
          <q-btn no-caps size="xs" @click="onTreeMin()" outline color="positive" class="q-mr-xs" label="30m"/>
          <q-btn no-caps size="xs" @click="onTwoHours()" outline color="positive" class="q-mr-xs" label="2h"/>
          <q-btn no-caps size="xs" @click="onSixHours" outline color="positive" label="6h"/>
        </div>
        <canvas id="myChart" height="70%"></canvas>
      </div>
    </div>
  </q-card>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'TransactionsItem',
  mounted () {
    this.getChart()
    // setInterval(() => {
    this.arr.push(Math.floor((Math.random() * 60) + 23))
    this.arr.push(Math.floor((Math.random() * 60) + 23))
    this.arr.push(Math.floor((Math.random() * 60) + 23))
    this.arr.shift()
    this.arr.shift()
    this.arr.shift()
    this.myChart.update()
    // }, 6000)
  },
  data () {
    return {
      arr: [],
      myChart: {},
      label: '15 SECONDS'
    }
  },
  methods: {
    onTreeMin () {
      this.label = '15 SECONDS'
      this.getChart()
    },
    onTwoHours () {
      this.label = '1 MIN'
      this.getChart()
    },
    onSixHours () {
      this.label = '3 MIN'
      this.getChart()
    },
    getChart () {
      this.arr = [
        11, 34, 45, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23,
        11, 34, 45, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23,
        11, 34, 45, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23,
        11, 34, 45, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23,
        11, 34, 45, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23,
        11, 34, 45, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23, 5, 55, 44, 56, 45, 23, 12, 45, 56, 35, 23]
      const ctx = window.document.getElementById('myChart').getContext('2d')
      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: new Array(133).fill(''),
          datasets: [{
            label: `TPS HISTORY - ${this.label} Ø`,
            data: this.arr,
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
