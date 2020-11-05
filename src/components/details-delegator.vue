<template>
    <q-card flat>
      <q-card-section>
        <span class="text-grey text-medium">Node ID:</span> [{{ delegator.nodeID }}]
        <small>
          <q-icon
            @click="copyToClipboard(delegator.nodeID)"
            name="file_copy"
          />
        </small>
        <div v-if="delegator.rewardOwner">
          <span class="text-grey text-medium">Reward Owner: </span>{{ delegator.rewardOwner.addresses[0] }}
          <small>
            <q-icon
              @click="copyToClipboard(delegator.rewardOwner.addresses[0])"
              name="file_copy"
            />
          </small>
        </div>
        <div v-if="delegator.potentialReward > 0" class="text-grey text-medium">Potential Reward:  {{ getAvaxFromNAvax(delegator.potentialReward) }} <span class="text-accent">AVAX</span> | <span class="text-accent">$</span> {{ getUsdFromAvax(delegator.potentialReward) }}</div>
        <div><span class="text-grey text-medium">Stake Period:</span>   {{ validatePeriod }} </div>
        <div><span class="text-grey text-medium">Start Time:</span> {{ startDate }} <small>({{ fromNowGet }})</small></div>
        <div><span class="text-grey text-medium">End Time:</span>  {{ endDate }}</div>
      </q-card-section>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  copyToClipboard
} from 'quasar'

const humanizeDuration = require('humanize-duration')
import { date, fromNow, getWeeks } from './../modules/time.js'
import { getAvaFromnAva, getUsdFromnAvax } from './../utils/avax.js'
import { round } from './../utils/commons'

export default {
  name: 'DetailsDelegator',
  props: {
    delegator: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'avaxUsdPrice'
    ]),
    startDate: function () {
      return date(this.delegator.startTime)
    },
    endDate: function () {
      return date(this.delegator.endTime)
    },
    fromNowGet: function () {
      return fromNow(this.delegator.startTime)
    },
    validatePeriod: function () {
      return this.getDurationL(this.delegator.duration)
    }
  },
  methods: {
    getDurationL (val) {
      if (!val) return
      return humanizeDuration(val, {
        units: ['y', 'mo', 'w', 'd', 'h'],
        round: true
      })
    },
    getAvaxFromNAvax (val) {
      return getAvaFromnAva(val).toLocaleString()
    },
    getUsdFromAvax (val) {
      const usd = getUsdFromnAvax(val, this.avaxUsdPrice)
      if (!usd) return
      return round(usd, 1000).toLocaleString()
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
    },
    getWeeksP () {
      return getWeeks(this.startDate, this.endDate)
    }
  }
}
</script>
<style scoped>
  #identity {
    color: grey;
  }
</style>
