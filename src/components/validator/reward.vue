<template>
  <q-card
   flat
   class="panel2"
  >
    <q-card-section>
      <div class="q-mb-md text-medium text-purple">REWARD (AVAX)</div>
      <div>
      <div class="q-pl-sm">
        <span class="text-subtitle2"><small style="opacity: 0.8;">POTENTIAL REWARD</small></span>
        <span class="on-right text-h6">{{ getFormatAva(validator.potentialReward) }}</span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
         / <span>  {{ totalRewardCurrentCurency() }}</span>
          <span class="text-accent text-medium"><small> {{ getISO(currentCurrency) }}</small></span>
      </div>
      <div class="q-pl-sm">
        <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATIONS FEES REWARD</small></span>
        <span class="on-right"> - </span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
      </div>
      <q-separator class="q-mt-xs q-mb-xs q-pl-sm" dark />
      <!--<div class="q-pl-sm">
          <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
          <span class="on-right">{{ totalReward() }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span> /
          <span>  {{ totalRewardCurrentCurency() }}</span>
          <span class="text-accent text-medium"><small> {{ getISO(currentCurrency) }}</small></span>
      </div>-->
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import { getAvaFromnAva, getPriceFromnAvax } from './../../utils/avax.js'
import { getDelegationReward } from './../../modules/reward.js'
import { round } from './../../utils/commons.js'
import { currencies } from './../../utils/constants.js'
export default {
  name: 'Reward',
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'currentCurrency',
      'currenciesPriceList'
    ])
  },
  data () {
    return {
      delReward: 0
    }
  },
  methods: {
    getISO (val) {
      if (!val) return
      return currencies[`${val}`].isoCode
    },
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    getFormatAva (val) {
      if (!val) return 0
      return this.getLocalString(getAvaFromnAva(val))
    },
    potentialRewardFromDelegators () {
      if (!this.validator) return

      const percent = getDelegationReward(
        this.validator.rew,
        this.validator.delegationFee
      )
      this.delReward = percent
      return getAvaFromnAva(percent).toLocaleString()
    },
    getTotal () {
      const total = this.delReward + parseFloat(this.validator.potentialReward)
      return total
    },
    totalRewardCurrentCurency () {
      const total = this.getTotal()
      return this.getFormatReward(total)
    },
    totalReward () {
      const total = this.getTotal()
      return this.getFormatAva(total)
    },
    getFormatReward (val) {
      if (!val) return 0
      const amount = getPriceFromnAvax(val, this.currenciesPriceList[`${this.currentCurrency}`])
      return round(amount, 100)
        .toLocaleString()
    }
  }
}
</script>
