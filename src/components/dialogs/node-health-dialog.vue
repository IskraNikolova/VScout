<template>
  <q-dialog
    no-focus persistent
    v-model="ui.nodeHealth.isOpen"
  >
    <q-card style="min-width: 40%!important;" class="panel">
      <q-card-section class="row items-center">
        <q-item  :dark="appTheme==='dark'">
          <q-item-section avatar>
            <q-avatar>
              <img src="./../../statics/blockchain.svg" />
            </q-avatar>
            </q-item-section>
            <q-item-section>
            <q-item-label>
              {{ nodeID }}
            </q-item-label>
            <q-item-label caption>
              Health check on this node
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>
      <q-card-section>
        <q-item :dark="appTheme==='dark'">
          <q-item-section>
            <span v-if="healthy"><span>Healthy: </span> <span class="text-positive">Yes</span></span>
            <span v-else><span>Healthy: </span>  <span class="text-negative">No</span></span>
            <div v-if="upTime">
              <span>Up Time: </span>
              <q-badge :color="getColorUptime(upTime)">
                {{ upTime }} %
              </q-badge>
              <div>
                <span>Connected:</span>
                <span v-if="connected" class="text-positive"> Yes</span>
                <span v-else class="text-negative"> No</span>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item :dark="appTheme==='dark'">
          <q-item-section>
            <span>Network Validators Heartbeat</span>
            <div class="q-pt-md">
              <small>Heartbeat: </small>
              <span class="text-panel">{{ heartbeat }}</span>
              <tooltip-style v-bind:text="'Heartbeat is the unix timestamp of the last time the network handled a message.'" />
            </div>
            <div>
              <small>Duration: </small>
              <span class="text-panel">{{ duration }}</span>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check in milliseconds.'" />
            </div>
            <div>
              <small>Time Of First Failure: </small>
              <span class="text-panel">{{ timeOfFirstFailure }}</span>
              <tooltip-style v-bind:text="'Time of first failure is the time of the initial transitional failure.'" />
            </div>
            <div>
              <small>Contiguous Failures: </small>
              <span class="text-panel">{{ contiguousFailures }}</span>
              <tooltip-style v-bind:text="'Contiguous failures is the number of fails that occurred in a row.'" />
            </div>
          </q-item-section>
          <q-separator vertical :dark="appTheme==='dark'" />
          <q-item-section class="q-pl-md">
            <span class="q-mb-md">Chains Default Bootstrapped</span>
            <div>
              <small>Error: </small>
              <span class="text-negative" v-if="error">{{ error }}</span>
              <span class="text-negative" v-else> --- </span>
            </div>
             <div>
              <small>Duration: </small>
              <span class="text-panel">{{ duration2 }}</span>
            </div>
            <div>
              <small>Time Of First Failure: </small>
              <span class="text-panel">{{ timeOfFirstFailure2 }}</span>
            </div>
            <div>
              <small>Contiguous Failures: </small>
              <span class="text-panel">{{ contiguousFailures2 }}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-separator :dark="appTheme==='dark'" />
        <q-item v-if="c" :dark="appTheme==='dark'">
          <q-item-section>
            <span>C-Chain</span>
            <div v-if="c.error">
              <small>Error: </small>
              <span class="text-negative">{{ c.error.message }}</span>
            </div>
            <div class="q-pt-md">
              <small>Timestamp: </small>
              <span class="text-panel">{{ getDateFormat(c.timestamp) }}</span>
              <tooltip-style v-bind:text="'Timestamp is the timestamp of the last health check.'" />
            </div>
            <div>
              <small>Duration: </small>
              <span class="text-panel">{{ c.duration }}</span>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check.'" />
            </div>
            <div>
              <small>Time Of First Failure: </small>
              <span class="text-panel">{{ c.timeOfFirstFailure }}</span>
              <tooltip-style v-bind:text="'Time of first failure is the time of the initial transitional failure.'" />
            </div>
            <div>
              <small>Contiguous Failures: </small>
              <span class="text-panel">{{ c.contiguousFailures }}</span>
              <tooltip-style v-bind:text="'Contiguous failures is the number of fails that occurred in a row.'" />
            </div>
          </q-item-section>
          <q-separator vertical :dark="appTheme==='dark'" />
          <q-item-section class="q-pl-md">
            <span>X-Chain</span>
            <div class="q-pt-md">
              <small>Timestamp: </small>
              <span class="text-panel">{{ getDateFormat(x.timestamp) }}</span>
              <tooltip-style v-bind:text="'Timestamp is the timestamp of the last health check.'" />
            </div>
            <div v-if="x.error">
              <small>Error: </small>
              <span class="text-negative">{{ x.error.message }}</span>
            </div>
             <div>
              <small>Duration: </small>
              <span class="text-panel">{{ x.duration }}</span>
            </div>
            <div>
              <small>Time Of First Failure: </small>
              <span class="text-panel">{{ x.timeOfFirstFailure }}</span>
            </div>
            <div>
              <small>Contiguous Failures: </small>
              <span class="text-panel">{{ x.contiguousFailures }}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-separator :dark="appTheme==='dark'" />
        <q-item v-if="p" :dark="appTheme==='dark'">
          <q-item-section>
            <span>P-Chain</span>
              <div>
                <small>Percent Connected: </small> <span class="text-panel">{{ getPercent(p.message.percentConnected) }}</span> %
                <q-linear-progress stripe size="15px" :value="p.message.percentConnected" color="purple">
                </q-linear-progress>
              </div>
            <div v-if="p.error">
              <small>Error: </small>
              <span class="text-negative">{{ p.error.message }}</span>
            </div>
            <div class="q-pt-md">
              <small>Timestamp: </small>
              <span class="text-panel">{{ getDateFormat(p.timestamp) }}</span>
              <tooltip-style v-bind:text="'Timestamp is the timestamp of the last health check.'" />
            </div>
            <div>
              <small>Duration: </small>
              <span class="text-panel">{{ p.duration }}</span>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check.'" />
            </div>
            <div>
              <small>Time Of First Failure: </small>
              <span class="text-panel">{{ p.timeOfFirstFailure }}</span>
              <tooltip-style v-bind:text="'Time of first failure is the time of the initial transitional failure.'" />
            </div>
            <div>
              <small>Contiguous Failures: </small>
              <span class="text-panel">{{ p.contiguousFailures }}</span>
              <tooltip-style v-bind:text="'Contiguous failures is the number of fails that occurred in a row.'" />
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { datePickerFormat } from './../../modules/time.js'
import { round } from './../../utils/commons.js'

import {
  OPEN_NODE_HEALTH,
  CLOSE_NODE_HEALTH
} from './../../store/ui/types'

export default {
  name: 'NodeHealthDialog',
  components: {
    TooltipStyle: () => import('components/tooltip-style')
  },
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'nodeHealth',
      'validators',
      'appTheme'
    ]),
    upTime: function () {
      const result = this.getUpTime(this.validator.uptime)
      return result
    },
    connected: function () {
      if (!this.validator) return
      return this.validator.connected
    },
    nodeHealthInfo: function () {
      return this.nodeHealth(this.nodeID)
    },
    healthy: function () {
      try {
        return this.nodeHealthInfo.healthy
      } catch (err) {
        return false
      }
    },
    error: function () {
      try {
        const error = this.nodeHealthInfo
          .checks['chains.default.bootstrapped']
          .error
          .message
        return error
      } catch (err) {
        return ''
      }
    },
    heartbeat: function () {
      try {
        const h = this.nodeHealthInfo
          .checks['network.validators.heartbeat']
          .message
          .heartbeat
        return datePickerFormat(h)
      } catch (err) {
        return ''
      }
    },
    c: function () {
      try {
        const res = this.nodeHealthInfo
          .checks
          .C
        return res
      } catch (err) {
        return ''
      }
    },
    p: function () {
      try {
        const res = this.nodeHealthInfo
          .checks
          .P
        return res
      } catch (err) {
        return ''
      }
    },
    x: function () {
      try {
        const res = this.nodeHealthInfo
          .checks
          .X
        return res
      } catch (err) {
        return ''
      }
    },
    duration: function () {
      try {
        const h = this.nodeHealthInfo
          .checks['network.validators.heartbeat']
          .duration
        return h
      } catch (err) {
        return ''
      }
    },
    timeOfFirstFailure: function () {
      try {
        const h = this.nodeHealthInfo
          .checks['network.validators.heartbeat']
          .timeOfFirstFailure
        return datePickerFormat(h)
      } catch (err) {
        return ''
      }
    },
    contiguousFailures: function () {
      try {
        const h = this.nodeHealthInfo
          .checks['network.validators.heartbeat']
          .contiguousFailures
        return h
      } catch (err) {
        return ''
      }
    },
    duration2: function () {
      try {
        const h = this.nodeHealthInfo
          .checks['chains.default.bootstrapped']
          .duration
        return h
      } catch (err) {
        return ''
      }
    },
    timeOfFirstFailure2: function () {
      try {
        const h = this.nodeHealthInfo
          .checks['chains.default.bootstrapped']
          .timeOfFirstFailure
        return datePickerFormat(h)
      } catch (err) {
        return ''
      }
    },
    contiguousFailures2: function () {
      try {
        const h = this.nodeHealthInfo
          .checks['chains.default.bootstrapped']
          .contiguousFailures
        return h
      } catch (err) {
        return ''
      }
    }
  },
  methods: {
    ...mapActions({
      open: OPEN_NODE_HEALTH,
      close: CLOSE_NODE_HEALTH
    }),
    getPercent (val) {
      if (!val) return
      return round(val * 100, 1000)
    },
    getUpTime (val) {
      if (!val) return
      return round(val * 100, 1000)
    },
    getDateFormat (val) {
      return datePickerFormat(val)
    },
    getColorUptime (val) {
      if (val >= 0.6) return 'positive'
      return 'negative'
    }
  }
}
</script>
