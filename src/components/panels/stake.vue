<template>
  <q-card
    class="q-mt-sm q-pl-xl q-pr-xs q-ml-xs q-pb-md"
    id="custom-card"
    style="min-height: 150px;padding-top: 30px;"
  >
    <div class="row">
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">VALIDATORS / DELEGATIONS</div>
        <div>
          <span class="text-h5 text-secondary">
            <animated-number
              :value="validators.length"
              :formatValue="format"
              :duration="3000"
            /> /
            <animated-number
              :value="delegationsCount"
              :formatValue="format"
              :duration="3000"
            /> <span style="font-size: 13px;" class="text-medium text-accent"> <small> ACTIVE</small></span>
          </span>
        </div>
        <div>
          <span style="opacity: 0.5;" class="text-medium">
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
          /> </span> <span style="font-size: 13px;" class="text-medium text-accent"> <small> PENDING</small></span>
        </div>
      </div>
      <div class="col-1 q-pt-md" style="opacity: 0.5;">
        <img src="~assets/validators.svg" class="custom-icon">
      </div>
      <q-separator  class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">TOTAL STAKE</div>
        <div class="text-h6">
            <span class="text-secondary">
              <small>
                <animated-number
                  :value="allStake"
                  :formatValue="formatToAvax"
                  :duration="3000"
                />
              </small>
            </span>
            <span style="font-size: 13px;" class="text-medium text-accent"><small> AVAX</small></span>
        </div>
        <div style="opacity: 0.5;" class="text-medium">
           <animated-number
              :value="getReward(stakedAVA)"
              :formatValue="getFormatReward"
              :duration="3000"
            />
           <span style="font-size: 13px;" class="text-medium text-accent">
             <small> {{ getISO(currentCurrency) }}</small>
           </span>
        </div>
      </div>
      <div class="col-1 q-pt-md" style="opacity: 0.5;">
        <img src="~assets/stake-amount.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
       <div id="f-size12" class="q-pb-md text-medium">VALIDATION / DELEGATED STAKE</div>
       <div class="text-h6" style="min-width: 320px;">
        <span class="text-secondary">
          <small>
            <animated-number
              :value="valStake"
              :formatValue="formatToAvax"
              :duration="2000"
            />
          </small>
        </span>
        /
        <span class="text-secondary">
          <small>
            <animated-number
              :value="delStake"
              :formatValue="formatToAvax"
              :duration="2000"
            />
          </small>
        </span>
        <span style="font-size: 13px;" class="text-medium text-accent"> <small> AVAX</small></span>
      </div>
      <div style="opacity: 0.5;" class="text-medium">
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
        <span style="font-size: 13px;" class="text-medium text-accent">
          <small> {{ getISO(currentCurrency) }}</small>
        </span>
        </div>
      </div>
    </div>
  </q-card>
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
      'stakedAVA',
      'validators',
      'delegatedStake',
      'validatedStake',
      'delegationsCount',
      'pendingValidators',
      'pendingDelegators',
      'currenciesPriceList',
      'currentCurrency'
    ]),
    delStake: function () {
      if (!this.delegatedStake) return 0
      const toAva = getAvaFromnAva(this.delegatedStake)
      const roundVal = round(toAva, 10)
      return roundVal
    },
    allStake: function () {
      if (!this.stakedAVA) return 0
      const toAva = getAvaFromnAva(this.stakedAVA)
      const roundVal = round(toAva, 10)
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
</style>
