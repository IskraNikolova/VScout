<template>
    <div class="row">
      <div class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">VALIDATORS / DELEGATIONS</div>
        <div>
          <span class="text-panel text-title1">
            <animated-number
              :value="validatorsCount"
              :formatValue="format"
              :duration="3000"
            /> /
            <animated-number
              :value="delegationsCount"
              :formatValue="format"
              :duration="3000"
            />
          </span>
          <span class="label-title2"> <small> ACTIVE</small></span>
        </div>
        <small>
          <span class="label-title text-panel">
            <animated-number
              :value="pendingValidators.length"
              :formatValue="format"
              :duration="3000"
            />
          /
          <animated-number
            :value="pendingDelegators.length"
            :formatValue="format"
            :duration="3000"
          /> </span> <span class="label-title2"> <small> PENDING</small></span>
        </small>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/validators.png" class="custom-icon">
      </div>
      <q-separator  class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">TOTAL STAKE</div>
        <div class="text-title1">
            <span class="text-panel">
              <animated-number
                :value="allStake"
                :formatValue="formatToAvax"
                :duration="3000"
              />
            </span>
            <span class="label-title2"><small> AVAX</small></span>
        </div>
        <span class="text-panel label-title2"><animated-number
          :value="getReward(stakedAVAX)"
          :formatValue="getFormatReward"
          :duration="3000"
        /></span>
        <span class="label-title2">
          <small> {{ getISO(currentCurrency) }}</small>
        </span>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/stake.png" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
       <div class="q-pb-md text-medium label-title">VALIDATION / DELEGATED STAKE</div>
       <div class="text-title1" style="min-width: 320px;">
        <span class="text-panel">
            <animated-number
              :value="valStake"
              :formatValue="formatToAvax"
              :duration="2000"
            />
          /
            <animated-number
              :value="delStake"
              :formatValue="formatToAvax"
              :duration="2000"
            />
         </span>
        <span class="label-title2"> <small> AVAX</small></span>
      </div>
      <span class="text-panel label-title2">
        <animated-number
          :value="getReward(validatedStake)"
          :formatValue="getFormatReward"
          :duration="3000"
        /> /
        <animated-number
          :value="getReward(delegatedStake)"
          :formatValue="getFormatReward"
          :duration="3000"
        />
      </span>
      <span class="label-title2">
        <small> {{ getISO(currentCurrency) }}</small>
      </span>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import AnimatedNumber from 'animated-number-vue'

import { round } from './../../utils/commons.js'
import { currencies } from './../../utils/constants.js'
import { getAvaFromnAva, getPriceFromnAvax } from './../../utils/avax.js'

export default {
  name: 'Stake',
  components: {
    AnimatedNumber
  },
  computed: {
    ...mapGetters([
      'ui',
      'stakedAVAX',
      'validators',
      'delegatedStake',
      'validatedStake',
      'delegationsCount',
      'subnetID',
      'isDefaultSubnetID',
      'pendingValidators',
      'defaultValidators',
      'pendingDelegators',
      'currenciesPriceList',
      'currentCurrency'
    ]),
    validatorsCount: function () {
      if (this.isDefaultSubnetID(this.subnetID)) return this.defaultValidators.length
      return this.validators.length
    },
    delStake: function () {
      if (!this.delegatedStake) return 0
      const toAvax = getAvaFromnAva(this.delegatedStake)
      const roundVal = round(toAvax, 10)
      return roundVal
    },
    allStake: function () {
      if (!this.stakedAVAX) return 0
      const toAvax = getAvaFromnAva(this.stakedAVAX)
      const roundVal = round(toAvax, 10)
      return roundVal
    },
    valStake: function () {
      if (!this.validatedStake) return 0
      const toAva = getAvaFromnAva(this.validatedStake)
      const roundVal = round(toAva, 10)
      return roundVal
    }
  },
  methods: {
    getISO (currency) {
      return currencies[`${currency}`].isoCode
    },
    format (value) {
      if (value === 'undefined') return
      return `${Math.round(value)}`
    },
    formatToAvax (value) {
      if (!value) return 0

      return `${value.toLocaleString()}`
    },
    getReward (val) {
      if (!val) return 0
      const currencyValue = this.currenciesPriceList[`${this.currentCurrency}`]
      const amount = getPriceFromnAvax(val, currencyValue)
      return amount
    },
    getFormatReward (val) {
      if (!val) return 0
      return round(val, 100)
        .toLocaleString()
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
 .label-title {
  font-size: max(0.7vw, 12px);
 }
 .text-title1 {
    font-size: max(0.8vw, 16px);
  }
  .label-title2 {
    font-size: max(0.55vw, 12px);
  }
</style>
