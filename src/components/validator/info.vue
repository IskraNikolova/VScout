<template>
  <q-card
   flat
   class="panel2"
  >
  <q-card-section>
    <div class="q-mb-md text-medium text-purple">VALIDATOR (NODE)</div>
    <div class="q-pl-sm">
      <span class="text-subtitle2"><small style="opacity: 0.8;">VERSION</small></span>
      <span class="on-right" style="font-size: 15.7px;">{{ version }}</span>
    </div>
    <div class="q-pl-sm">
      <span class="text-subtitle2"><small style="opacity: 0.8;">LOCATION</small></span>
      <img class="on-right" :src="'./statics/flag/' + countryCode.toLowerCase() + '.png'" id="logo-s" />
      <span class="on-right" style="font-size: 14px;">{{ country }}</span>
    </div>
    <div class="q-pl-sm">
      <span class="text-subtitle2"><small style="opacity: 0.8;">LAST RECEIVE</small></span>
      <span class="on-right" style="font-size: 14px;">{{ timeReceived }}</span>
    </div>
    <div class="q-pl-sm">
      <span class="text-subtitle2"><small style="opacity: 0.8;">LAST SENT</small></span>
      <span class="on-right" style="font-size: 14px;">{{ timeSent }}</span>
    </div>
  </q-card-section>
  </q-card>
</template>

<script>
import { timeago } from './../../modules/time.js'

export default {
  name: 'Info',
  props: {
    country: {
      type: String,
      required: false
    },
    version: {
      type: String,
      required: false
    },
    countryCode: {
      type: String,
      required: false
    },
    lastReceived: {
      type: String,
      required: false
    },
    lastSent: {
      type: String,
      required: false
    }
  },
  computed: {
    timeReceived: function () {
      return timeago(this.lastReceived)
    },
    timeSent: function () {
      return timeago(this.lastSent)
    }
  },
  methods: {
  }
}
</script>
