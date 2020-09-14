<template>
    <q-card flat>
      <q-card-section>
        <div v-if="identity !== name"><span class="text-grey text-medium">Name: </span><a :href="link" v-if="link">{{ name }}</a><span v-else>{{ name }}</span></div>
        <span class="text-grey text-medium">Node ID:</span> [{{ identity }}]
        <small>
          <q-icon
            @click="copyToClipboard(identity)"
            name="file_copy"
          />
        </small>
        <div v-if="address">
          <span class="text-grey text-medium">Owner (P-Chain Account): </span>{{ address }}
          <small>
            <q-icon
              @click="copyToClipboard(address)"
              name="file_copy"
            />
          </small>
        </div>
        <div v-if="weight"><span class="text-grey text-medium">Weight:</span> {{ weight }}</div>
        <div v-if="delegatorsCount">
          <span class="text-grey text-medium">Delegations:</span>
          <span class="text-accent text-h7" style="cursor: pointer;" @click="onGetDelegations">
            {{ delegatorsCount }}
          </span>
        </div>
        <div><span class="text-grey text-medium">Stake Period:</span>   {{ validatePeriod }} - Reward:  $AVAX</div>
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
    avatar: {
      type: String,
      required: true
    },
    identity: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      required: true
    },
    delegatorsCount: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    stakeAmount: {
      type: Number,
      required: true
    }
  },
  computed: {
    startDate: function () {
      return date(this.startTime)
    },
    endDate: function () {
      return date(this.endTime)
    },
    fromNowGet: function () {
      return fromNow(this.startTime)
    },
    validatePeriod: function () {
      return getDurationHumanize(this.startTime, this.endTime)
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
