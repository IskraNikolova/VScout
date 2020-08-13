<template>
    <q-card flat>
      <q-card-section horizontal>
        <q-card-section class="col-6">
          <div v-if="identity !== name"><span class="text-grey ch5">Name: </span><a :href="link" v-if="link">{{ name }}</a><span v-else>{{ name }}</span></div>
          <div>
            <span class="text-grey ch5">Node ID:</span> [{{ identity }}]
              <q-tooltip>Node ID is not blockchain address</q-tooltip>
            <small>
              <q-icon
                @click="copyToClipboard(identity)"
                name="file_copy"
              />
            </small>
          </div>
          <div v-if="address">
            <span class="text-grey ch5">Owner (P-Chain Account): </span>{{ address }}
            <small>
              <q-icon
                @click="copyToClipboard(address)"
                name="file_copy"
              />
            </small>
          </div>
          <div v-else><span class="text-grey ch5">Weight:</span> {{ weight }}</div>
          <div v-if="delegatorsCount">
            <span class="text-grey ch5">Delegations:</span>
            <span class="text-accent text-h7" style="cursor: pointer;" @click="onGetDelegations">
              {{ delegatorsCount }}
            </span>
          </div>
        </q-card-section>

        <q-separator vertical />

        <q-card-section class="col-5">
          <div><span class="text-grey ch5">Stake Period:</span>   {{ validatePeriod }}</div>
          <div><span class="text-grey ch5">Start Time:</span> {{ startDate }} <small>({{ fromNowGet }})</small></div>
          <div><span class="text-grey ch5">End Time:</span>  {{ endDate }}</div>
        </q-card-section>
      </q-card-section>
    </q-card>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { date, fromNow, getDurationHumanize } from './../modules/time'
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
