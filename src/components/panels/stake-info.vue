<template>
  <div class="row">
      <div class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">CURRENT SUPPLY</div>
        <div style="font-size: max(1.1vw, 12px);">
          <span class="text-panel">
            <animated-number
              :value="getCurrentSupply()"
              :formatValue="format"
              :duration="3000"
            />
          </span>
          <span style="font-size: 13px;"><small> AVAX</small></span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/chain.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">STAKING RATIO</div>
        <div>
          <span class="text-panel" style="font-size: max(1.1vw, 12px);">
            {{ stakingRatio }}
          </span><span class="label-title"> %</span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/percent.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">REWARD RATE</div>
        <div>
          <span>
            <span style="opacity: 0.7;" class="label-title2">MIN </span>
            <span class="text-panel" style="font-size: max(1.1vw, 12px);">{{ minPercent }}</span> <span class="label-title"> %</span>
            &nbsp;&nbsp;
            <span style="opacity: 0.7;" class="label-title2">MAX </span>
            <span class="text-panel" style="font-size: max(1.1vw, 12px);">{{ maxPercent }}</span> <span class="label-title"> %</span>
          </span>
        </div>
      </div>
    </div>
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
 .label-title {
    font-size: max(0.7vw, 12px);
  }
  .label-title2 {
    font-size: max(0.55vw, 12px);
  }
</style>
