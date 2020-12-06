<template>
  <q-card
    class="q-mt-xs q-pl-xl q-pr-xs q-ml-xs q-pb-md q-pt-md panel"
    id="custom-card"
  >
  <div class="row">
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">CURRENT SUPPLY</div>
        <div class="text-h6 text-panel">
          <small>
            <animated-number
              :value="getCurrentSupply()"
              :formatValue="format"
              :duration="3000"
            />
          </small>
          <span style="font-size: 13px;" class="text-medium text-accent"><small> AVAX</small></span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/chain.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">STAKING RATIO</div>
        <div>
          <span class="text-h6 text-panel">
            <small>{{ stakingRatio }} <span class="text-accent"> %</span></small>
          </span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/percent.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">REWARD RATE</div>
        <div>
          <span>
            <small>
              <span style="opacity: 0.7;">MIN </span>
            </small>
            <span class="text-h6 text-panel"><small>{{ minPercent }} <span class="text-accent">%</span></small></span>
            &nbsp;&nbsp;
            <small>
              <span style="opacity: 0.7;">MAX </span>
            </small>
            <span class="text-h6 text-panel"><small>{{ maxPercent }} <span class="text-accent">%</span></small></span>
          </span>
        </div>
      </div>
    </div>
  </q-card>
</template>
<script>
import { mapGetters } from 'vuex'
const BigNumber = require('bignumber.js')

import AnimatedNumber from 'animated-number-vue'

import {
  getAvaFromnAva
} from './../../utils/avax.js'

import {
  reward,
  getYearlyRewardPercent
} from './../../modules/reward.js'

import {
  round
} from './../../utils/commons.js'

export default {
  name: 'StakeInfo',
  components: {
    AnimatedNumber
  },
  computed: {
    ...mapGetters([
      'currentSupply',
      'stakedAVAX'
    ]),
    stakingRatio: function () {
      let ratio = new BigNumber(this.stakedAVAX)
      ratio = ratio.dividedBy(this.currentSupply)
      ratio = ratio.multipliedBy(100)
      return round(ratio.toNumber(), 100)
    },
    minPercent: function () {
      return round(this.getPercent(14, 2000), 100)
    },
    maxPercent: function () {
      return round(this.getPercent(365, 2000), 100)
    }
  },
  methods: {
    getCurrentSupply () {
      const currentSupply = this.currentSupply.toString()
      const currentSupplyAvax = Math.round(getAvaFromnAva(Number(currentSupply)))
      return currentSupplyAvax
    },
    format (val) {
      if (val === 'undefined') return 0
      return `${val.toLocaleString()}`
    },
    getPercent (stakeTime, stakeAmount) {
      const rewardNAvax = reward(stakeTime, stakeAmount, this.currentSupply)
      const { percent } = getYearlyRewardPercent(
        rewardNAvax,
        stakeTime,
        stakeAmount)
      return percent
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
