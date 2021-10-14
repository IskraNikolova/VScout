<template>
  <q-card
   flat
   class="panel2"
  >
  <q-card-section>
    <div class="row">
        <div class="q-mb-md text-medium text-purple col-9">
        RESPONSE
        </div>
        <div class="col-auto">
        <span class="text-accent text-medium" v-if="state">CONNECTED</span>
        <span class="text-negative text-medium" v-else>
            DISCONNECTED
            <q-icon name="info" @click="onClick('https://docs.avax.network/learn/platform-overview/staking#why-is-my-uptime-low')"/>
            <tooltip-style v-bind:text="'Why is my uptime low? Read more...'" />
        </span>
        </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="q-pl-sm">
          <span class="text-subtitle2"><small style="opacity: 0.8;">AVERAGE UPTIME</small></span>
          <span class="on-right" style="font-size: 15.7px;">
            <span class="text-medium q-ml-xs">{{ getUpTime(uptime) }} %</span>
          </span>
        </div>
        <div class="q-pl-sm q-pt-sm">
          <span class="text-subtitle2"><small style="opacity: 0.8;">PEERS RESPONSE</small></span>
          <span class="q-pl-sm" v-for="(u, i) in uptimes" v-bind:key="i" style="font-size: 13px;">
            <q-badge @click="onSeeObserver(u.observer)" :color="getColorUptime(u.uptime)" style="font-size: 14px;padding: 5px;cursor: pointer;margin-bottom: 8px;">
              <span style="margin: auto;">{{ getUpTime(u.uptime) }} %</span>
            </q-badge>
            <tooltip-style v-bind:text="'Observed by ' + u.observer" />
          </span>
        </div>
      </div>
    </div>
  </q-card-section>
  </q-card>
</template>

<script>
import {
  openURL
} from 'quasar'

import { round } from './../../utils/commons.js'

export default {
  name: 'Uptime',
  props: {
    uptime: {
      type: String,
      required: false
    },
    uptimes: {
      type: Array,
      required: false
    },
    state: {
      type: Boolean,
      required: false
    }
  },
  components: {
    TooltipStyle: () => import('components/tooltip-style.vue')
  },
  computed: {
  },
  methods: {
    onClick (link) {
      if (!link) return
      try {
        openURL(link)
      } catch (err) {
      }
    },
    onSeeObserver (id) {
      this.$router.push(`/validator/${id}`)
    },
    getUpTime (val) {
      if (!val) return 0
      return round(val * 100, 2)
    },
    getColorUptime (val) {
      if (val > 0.9) return 'positive'
      else if (val >= 0.8) return 'warning'
      return 'negative'
    }
  }
}
</script>
