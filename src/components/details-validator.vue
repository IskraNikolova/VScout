<template>
  <div class="row">
    <div class="col">
      <div>
        Validator ID: <span id="identity">{{ identity }} </span>
        <small>
          <q-icon
            @click="copyToClipboard(identity)"
            color="grey"
            name="file_copy"
          />
        </small>
      </div>
      <div v-if="address">
        P-Chain Account (beneficiary) <span id="identity">{{ address }} </span>
        <small>
          <q-icon
            @click="copyToClipboard(address)"
            color="grey"
            name="file_copy"
          />
        </small>
      </div>
      <div v-else>Weight <span id="identity">{{ weight }}</span></div>
      <div v-if="delegatorsCount" >Delegations <span class="text-orange">{{ delegatorsCount }}</span></div>
      <div>Start <span class="text-accent">{{ startDate }} </span><small>({{ fromNowGet }})</small></div>
      <div>End <span class="text-accent">{{ endDate }}</span></div>
    </div>
  </div>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { date, fromNow } from './../modules/time'

export default {
  name: 'DetailsValidator',
  props: {
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
    }
  }
}
</script>
<style scoped>
  #identity {
    color: #ffa959;
  }
</style>
