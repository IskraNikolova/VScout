<template>
    <q-card flat>
      <q-card-section>
        <span class="text-grey text-medium">Node ID:</span> [{{ delegator.nodeID }}]
        <small>
          <q-icon
            @click="copyToClipboard(validator.nodeID)"
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
        <div><span class="text-grey text-medium">Stake Period:</span>   {{ validatePeriod }} </div>
        <div v-if="delegator.potentialReward > 0" class="text-grey text-medium">Potential Reward:  {{ Number(delegator.potentialReward).toLocaleString() }} <span class="text-accent">nAVAX</span></div>
        <div><span class="text-grey text-medium">Start Time:</span> {{ startDate }} <small>({{ fromNowGet }})</small></div>
        <div><span class="text-grey text-medium">End Time:</span>  {{ endDate }}</div>
      </q-card-section>
    </q-card>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { date, fromNow, getDurationHumanize, getWeeks } from './../modules/time.js'

export default {
  name: 'DetailsDelegator',
  props: {
    delegator: {
      type: Object,
      required: true
    }
  },
  computed: {
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
      return getDurationHumanize(this.delegator.startTime, this.delegator.endTime)
    }
  },
  methods: {
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
