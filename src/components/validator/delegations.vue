<template>
  <div
    flat
  >
    <div class="q-mb-md text-medium text-purple">
      <span style="font-size: 18px;">{{ delegatorsCount }} </span>
      DELEGATIONS
    </div>
    <q-scroll-area style="height: 330px;">
    <div class="row q-pl-sm">
      <div class="col-6"><span class="text-subtitle2"><small style="opacity: 0.8;">OWNER</small></span></div>
      <div class="col-3"><span class="text-subtitle2"><small style="opacity: 0.8;">STAKE AMOUNT</small></span></div>
      <div class="col-3"><span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION FEE</small></span></div>
    </div>
    <q-separator class="q-mb-sm q-pl-sm" dark style="width: 100%;"/>
    <div v-for="(delegation, i) in delegators" :key="i" class="row q-pl-sm" style="min-width: 550px;">
      <div class="col-6" @click="copyToClipboard(delegationRewardOwner(delegation.rewardOwner))">
        {{ getFormatSubstr(delegationRewardOwner(delegation.rewardOwner)) }}
      </div>
      <div class="col-3">{{ getFormatAva(delegation.stakeAmount) }}<span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span></div>
      <div class="col-3">{{ potentialRewardFromDelegator(delegation.potentialReward) }}<span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span></div>
    </div>
    </q-scroll-area>
  </div>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { getAvaFromnAva } from './../../utils/avax.js'
import { getDelegationReward } from './../../modules/reward.js'

export default {
  name: 'Delegations',
  props: {
    delegators: {
      type: Array,
      required: true
    },
    fee: {
      type: String,
      required: true
    }
  },
  computed: {
    delegatorsCount: function () {
      if (!this.delegators) return 0
      return this.delegators.length
    }
  },
  methods: {
    delegationRewardOwner: function (owner) {
      if (!owner) return

      return owner.addresses[0]
    },
    potentialRewardFromDelegator (amount) {
      const percent = getDelegationReward(
        amount,
        this.fee
      )

      return getAvaFromnAva(percent).toLocaleString('en-IN', { maximumSignificantDigits: 5 })
    },
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString('en-IN', { maximumSignificantDigits: 5, minimumSignificantDigits: 3 })
    },
    getFormatAva (val) {
      if (!val) return 0
      return this.getLocalString(getAvaFromnAva(val))
    },
    getFormatSubstr (val) {
      if (!val) return
      return `${val.substr(0, 16)}...${val.substr(32)}`
    },
    copyToClipboard (id) {
      if (!id) return

      copyToClipboard(id)
      this.$q.notify({
        message: 'Copied to clipboard!',
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 1000
      })
    }
  }
}
</script>
