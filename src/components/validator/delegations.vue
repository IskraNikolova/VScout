<template>
  <div
    flat
  >
    <div class="q-mb-md text-medium text-purple">
      <span style="font-size: 18px;">{{ delegatorsCount }} </span>
      DELEGATIONS
    </div>
    <q-separator class="q-mb-sm q-pl-sm" dark style="width: 100%;"/>
    <div class="row q-pl-sm">
      <div class="col-6"><span class="text-subtitle2"><small style="opacity: 0.8;">STAKE AMOUNT</small></span></div>
      <div class="col-6">{{ getFormatAva(weight) }}<span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span></div>
      <!--<div class="col-6"><span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION FEE</small></span></div>-->
    </div>
    <div class="row q-pl-sm">
      <!--<div class="col-6">{{ potentialRewardFromDelegator(weight) }}<span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span></div>-->
    </div>
  </div>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { round } from './../../utils/commons.js'
import { getAvaFromnAva } from './../../utils/avax.js'
import { getDelegationReward } from './../../modules/reward.js'

export default {
  name: 'Delegations',
  props: {
    weight: {
      type: String,
      required: true
    },
    count: {
      type: String,
      required: true
    },
    fee: {
      type: String,
      required: true
    }
  },
  computed: {
    delegatorsCount: function () {
      return this.count
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
      const avax = getAvaFromnAva(val)
      return round(avax, 1000)
        .toLocaleString()
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
