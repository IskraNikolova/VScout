<template>
  <q-card
   flat
  >
    <q-card-section>
      <div class="q-mb-md text-medium text-purple">REWARD (AVAX)</div>
      <div>
      <div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">POTENTIAL REWARD</small></span>
          <span class="on-right text-h6">{{ getFormatAva(validator.potentialReward) }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
      </div>
      <div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATIONS FEES REWARD</small></span>
          <span class="on-right">{{ potentialRewardFromDelegators() }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
      </div>
      <q-separator class="q-mt-xs q-mb-xs" dark />
      <div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
          <span class="on-right">{{ totalReward() }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span> /
          <span>  {{ totalRewardUsd() }}</span>
          <span class="text-accent text-medium"><small> {{ getISO(currentCurrency) }}</small></span>
      </div>
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
        this.validator.delegatePotentialReward,
        this.validator.delegationFee
      )
      this.delReward = percent
      return getAvaFromnAva(percent).toLocaleString()
    },
    getTotal () {
      const total = this.delReward + parseFloat(this.validator.potentialReward)
      return total
    },
    totalRewardUsd () {
      const total = this.getTotal()
      return this.getFormatRewardUsd(total)
    },
    totalReward () {
      const total = this.getTotal()
      return this.getFormatAva(total)
    },
    getFormatRewardUsd (val) {
      if (!val) return 0
      const usd = getPriceFromnAvax(val, this.currenciesPriceList[`${this.currentCurrency}`])
      return round(usd, 100)
        .toLocaleString()
    }
  }
}
</script>
