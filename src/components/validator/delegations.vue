<template>
  <div
    flat
  >
    <div class="q-mb-md text-medium text-purple">
    <span style="font-size: 18px;">{{ delegatorsCount }} </span>
    DELEGATIONS
    </div>
    <q-scroll-area style="height: 230px;">
    <div class="row">
      <div class="col-8"><span class="text-subtitle2"><small style="opacity: 0.8;">OWNER</small></span></div>
      <div class="col-4"><span class="text-subtitle2"><small style="opacity: 0.8;">STAKE AMOUNT</small></span></div>
    </div>
    <q-separator class="q-mb-sm" dark style="width: 100%;"/>
    <div v-for="(delegation, i) in delegators" :key="i" class="row" style="min-width: 550px;">
      <div class="col-8" @click="copyToClipboard(delegationRewardOwner(delegation.rewardOwner))">
        {{ delegationRewardOwner(delegation.rewardOwner) }}
      </div>
      <div class="col-4">{{ getFormatAva(delegation.stakeAmount) }}<span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span></div>
    </div>
    </q-scroll-area>
  </div>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { getAvaFromnAva } from './../../utils/avax.js'

export default {
  name: 'Delegations',
  props: {
    delegators: {
      type: Array,
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
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    getFormatAva (val) {
      if (!val) return 0
      return this.getLocalString(getAvaFromnAva(val))
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
