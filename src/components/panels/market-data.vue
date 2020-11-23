<template>
  <q-card
    class="q-pl-xl q-pr-xs q-ml-xs q-pb-md panel" id="custom-card" style="min-height: 150px;padding-top: 30px;" >
    <div class="row">
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium ">PRICE</div>
        <div class="text-h5 text-panel q-pb-sm">
          <small>{{ getSymbol(currentCurrency) }} {{ currenciesPriceList[`${currentCurrency}`] }} | AVAX/{{ getISO(currentCurrency) }}</small>
        </div>
        <div v-if="currentCurrency !== 'btc'">
          <small><span style="opacity: 0.7;">{{ getSymbol('btc') }} {{ currenciesPriceList[`${'btc'}`] }} | AVAX/{{ getISO('btc') }}</span>
              <span v-if="changePercentage24h[`${'btc'}`] > 0" class="text-positive text-medium">
                +{{ changePercentage24h[`${'btc'}`] }} %
                <q-icon name="north" />
              </span>
              <span v-else class="text-negative">
                {{ changePercentage24h[`${'btc'}`] }} %
                <q-icon name="south" />
              </span>
            </small>
        </div>
        <div class="text-panel" v-else>
          <small>
            <span style="opacity: 0.7;">{{ getSymbol('usd') }} {{ currenciesPriceList[`${'usd'}`] }} | AVAX/{{ getISO('usd') }}</span>
            <span v-if="changePercentage24h[`${'usd'}`] > 0" class="text-positive text-medium">
              +{{ changePercentage24h[`${'usd'}`] }} %
              <q-icon name="north" />
            </span>
            <span v-else class="text-negative">
              {{ changePercentage24h[`${'usd'}`] }} %
              <q-icon name="south" />
            </span>
          </small>
        </div>
      </div>
      <div class="col-md-1 icon" style="padding-top: 23px;">
        <img src="~/assets/avax.png" id="logo-block"/>
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md" />
      <div class="col-md-3 col-xs-10">
        <div>
          <div id="f-size12" class="q-pb-md text-medium">BLOCK HEIGHT</div>
          <div class="text-h7 text-panel q-pb-md q-pt-xs">
            <animated-number
              :value="height"
              :formatValue="format"
              :duration="3000"
            />
          </div>
          <div id="f-size12">
            <span>Last accepted block on P-Chain</span>
          </div>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~/assets/block.svg" id="logo2"/>
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md" />
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">24H CHANGE</div>
        <div class="q-pb-md">
          <span class="text-positive" v-if="change24h[`${currentCurrency}`] > 0">{{ change24h[`${currentCurrency}`] }}</span>
          <span class="text-negative" v-else>{{ change24h[`${currentCurrency}`] }}</span>
          <span class="text-positive" v-if="changePercentage24h[`${currentCurrency}`] > 0"> +{{ changePercentage24h[`${currentCurrency}`] }} %</span>
          <span class="text-negative" v-else> {{ changePercentage24h[`${currentCurrency}`] }} %</span>
        </div>
        <div id="f-size12">
          <span class="text-positive">24h High</span>
          <span>
            {{ high24h[`${currentCurrency}`] }}
          </span>
          <span class="text-negative q-ml-md">24h Low</span>
          <span>
            {{ low24h[`${currentCurrency}`] }}
          </span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/change.svg" style="width:40vw;max-width:40px;">
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import AnimatedNumber from 'animated-number-vue'
import { currencies } from './../../utils/constants.js'

export default {
  name: 'MarketData',
  components: {
    AnimatedNumber
  },
  computed: {
    ...mapGetters([
      'high24h',
      'low24h',
      'height',
      'change24h',
      'changePercentage24h',
      'currentCurrency',
      'currenciesPriceList'
    ])
  },
  methods: {
    format (value) {
      return `${Math.round(value).toLocaleString()}`
    },
    getSymbol (currency) {
      return currencies[`${currency}`].symbol
    },
    getISO (currency) {
      return currencies[`${currency}`].isoCode
    }
  }
}
</script>

<style scoped>
 #custom-card {
   border-right: 2px solid grey;
 }
 .custom-icon {
   width:30vw;
   max-width:30px;
 }
</style>
