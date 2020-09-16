<template>
    <q-card flat>
      <q-card-section>
        <div v-if="validator.nodeID !== validator.name">
          <span class="text-grey text-medium">Name: </span>
          <a :href="validator.link" v-if="link">{{ validator.name }}</a>
          <span v-else>{{ validator.name }}</span>
        </div>
        <span class="text-grey text-medium">Node ID:</span> [{{ validator.nodeID }}]
        <small>
          <q-icon
            @click="copyToClipboard(validator.nodeID)"
            name="file_copy"
          />
        </small>
        <!--<div v-if="address">
          <span class="text-grey text-medium">Owner (P-Chain Account): </span>{{ address }}
          <small>
            <q-icon
              @click="copyToClipboard(address)"
              name="file_copy"
            />
          </small>
        </div>-->
        <div v-if="weight"><span class="text-grey text-medium">Weight:</span> {{ validator.weight }}</div>
        <div v-if="delegatorsCount">
          <span class="text-grey text-medium">Delegations:</span>
          <span class="text-accent text-h7" style="cursor: pointer;" @click="onGetDelegations">
            {{ validator.delegatorsCount }}
          </span>
        </div>
        <div><span class="text-grey text-medium">Stake Period:</span>   {{ validatePeriod }} <span v-if="validator.potentialReward > 0">- Potential Reward:  {{ Number(validator.potentialReward).toLocaleString() }} <span class="text-accent">$nAVAX</span></span></div>
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
import { UPDATE_UI } from './../store/ui/types'

export default {
  name: 'DetailsValidator',
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  computed: {
    startDate: function () {
      return date(this.validator.startTime)
    },
    endDate: function () {
      return date(this.validator.endTime)
    },
    fromNowGet: function () {
      return fromNow(this.validator.startTime)
    },
    validatePeriod: function () {
      return getDurationHumanize(this.validator.startTime, this.validator.endTime)
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
    },
    onGetDelegations () {
      this.$store.commit(UPDATE_UI, {
        typeAccount: {
          isValidators: false
        }
      })
    }
  }
}
</script>
<style scoped>
  #identity {
    color: grey;
  }
</style>
