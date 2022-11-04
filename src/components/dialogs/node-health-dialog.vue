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
              <span>Uptime: </span>
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
        <q-separator :dark="appTheme==='dark'" />
        <q-item :dark="appTheme==='dark'">
          <q-item-section>
            <span class="q-mb-md text-pur">Bootstrapped</span>
            <small v-if="bootstrappedMessages.length > 0">Messages: </small>
            <div v-for="msg in bootstrappedMessages" v-bind:key="msg">
              <small class="text-panel">  - {{ msg }} </small>
            </div>
            <div>
              <small>Timestamp: </small>
              <small class="text-panel">{{ timestampBootstrapped }}</small>
              <tooltip-style v-bind:text="'Timestamp is the timestamp of the last health check.'" />
            </div>
            <div>
              <small>Duration: </small>
              <small class="text-panel">{{ durationBootstrapped }} ns</small>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check in milliseconds.'" />
            </div>
          </q-item-section>
        </q-item>
        <q-separator :dark="appTheme==='dark'" />
        <q-item :dark="appTheme==='dark'">
          <q-item-section>
            <span class="q-mb-md text-pur">Network</span>
            <div>
              <small>Timestamp: </small>
              <small class="text-panel">{{ timestampNetwork }}</small>
            </div>
            <div>
              <small>Duration: </small>
              <span class="text-panel"><small>{{ duration }} ns</small></span>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check in milliseconds.'" />
            </div>
            <div>
              <small>Connected Peers: </small>
              <span class="text-panel"><small>{{ connectedPeers }}</small></span>
            </div>
            <div>
              <small>Send Fail Rate: </small>
              <small class="text-panel">{{ sendFailRate }}</small>
            </div>
            <div>
              <small>Last Message Received: </small>
              <small class="text-panel">{{ timeSinceLastMsgReceived }}</small>
              <tooltip-style v-bind:text="'Time since last message received.'" />
            </div>
            <div>
              <small>Last Message Sent: </small>
              <small class="text-panel">{{ timeSinceLastMsgSent }}</small>
              <tooltip-style v-bind:text="'Time since last message sent.'" />
            </div>
          </q-item-section>
          <q-separator vertical :dark="appTheme==='dark'" />
          <q-item-section class="q-pl-md">
            <span class="q-mb-md text-pur">Router</span>
            <div>
              <small>Timestamp: </small>
              <small class="text-panel">{{ timeOfFirstFailure2 }}</small>
            </div>
            <div>
              <small>Duration: </small>
              <small class="text-panel">{{ duration2 }} ns</small>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check, in nanoseconds.'" />
            </div>
            <div>
              <small>Longest Running Request: </small>
              <small class="text-panel">{{ longestRunningRequest }}</small>
            </div>
            <div>
              <small>Outstanding Requests: </small>
              <small class="text-panel">{{ outstandingRequests }}</small>
            </div>
          </q-item-section>
        </q-item>
        <q-separator :dark="appTheme==='dark'" />
        <q-item :dark="appTheme==='dark'">
          <q-item-section>
            <span class="q-mb-md text-pur">Diskspace</span>
            <div>
              <small>Timestamp: </small>
              <small class="text-panel">{{ timestampDiskspace }}</small>
            </div>
            <div>
              <small>Duration: </small>
              <small class="text-panel">{{ durationDiskspace }} ns</small>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check in milliseconds.'" />
            </div>
            <div>
              <small>Available Disk Bytes: </small>
              <small class="text-panel">{{ availableDiskBytes }}</small>
            </div>
          </q-item-section>
          <q-separator vertical :dark="appTheme==='dark'" />
          <q-item-section class="q-pl-md">
            <span class="q-mb-md text-pur">Database</span>
            <div>
              <small>Timestamp: </small>
              <small class="text-panel">{{ timestampDatabase }}</small>
            </div>
            <div>
              <small>Duration: </small>
              <small class="text-panel">{{ durationDatabase }} ns</small>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check, in nanoseconds.'" />
            </div>
          </q-item-section>
        </q-item>
        <q-separator :dark="appTheme==='dark'" />
        <q-item v-if="c" :dark="appTheme==='dark'">
          <q-item-section>
            <span class="q-mb-md text-green">C-Chain</span>
            <div v-if="c.error">
              <small>Error: </small>
              <span class="text-negative">{{ c.error.message }}</span>
            </div>
            <div class="q-pt-md">
              <small>Timestamp: </small>
              <small class="text-panel">{{ getDateFormat(c.timestamp) }}</small>
              <tooltip-style v-bind:text="'Timestamp is the timestamp of the last health check.'" />
            </div>
            <div>
              <small>Duration: </small>
              <small class="text-panel">{{ c.duration }} ns</small>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check.'" />
            </div>
          </q-item-section>
          <q-separator vertical :dark="appTheme==='dark'" />
          <q-item-section class="q-pl-md">
            <span class="q-mb-md text-green">X-Chain</span>
            <div class="q-pt-md">
              <small>Timestamp: </small>
              <small class="text-panel">{{ getDateFormat(x.timestamp) }}</small>
              <tooltip-style v-bind:text="'Timestamp is the timestamp of the last health check.'" />
            </div>
            <div v-if="x.error">
              <small>Error: </small>
              <span class="text-negative">{{ x.error.message }}</span>
            </div>
             <div>
              <small>Duration: </small>
              <small class="text-panel">{{ x.duration }} ns</small>
            </div>
          </q-item-section>
        </q-item>
        <q-separator :dark="appTheme==='dark'" />
        <q-item v-if="p" :dark="appTheme==='dark'">
          <q-item-section>
            <span class="q-mb-md text-green">P-Chain</span>
              <div>
                <small>Primary - percent Connected: </small> <span class="text-panel">{{ getPercent(p.message) }}</span> %
                <q-linear-progress stripe size="15px" :value="getPercentL(p.message)" color="purple">
                </q-linear-progress>
              </div>
            <div v-if="p.error">
              <small>Error: </small>
              <span class="text-negative">{{ p.error.message }}</span>
            </div>
            <div class="q-pt-md">
              <small>Timestamp: </small>
              <small class="text-panel">{{ getDateFormat(p.timestamp) }}</small>
              <tooltip-style v-bind:text="'Timestamp is the timestamp of the last health check.'" />
            </div>
            <div>
              <small>Duration: </small>
              <small class="text-panel">{{ p.duration }} ns</small>
              <tooltip-style v-bind:text="'Duration is the execution duration of the last health check.'" />
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
    timestampDiskspace: function () {
      try {
        const timestampD = this.nodeHealthInfo
          .checks
          .diskspace
          .timestamp
        return datePickerFormat(timestampD)
      } catch (err) {
        return ''
      }
    },
    durationDiskspace: function () {
      try {
        const durationD = this.nodeHealthInfo
          .checks
          .diskspace
          .duration
        return durationD
      } catch (err) {
        return ''
      }
    },
    availableDiskBytes: function () {
      try {
        const diskBytes = this.nodeHealthInfo
          .checks
          .diskspace
          .message
          .availableDiskBytes
        return diskBytes
      } catch (err) {
        return ''
      }
    },
    timestampDatabase: function () {
      try {
        const timestampDb = this.nodeHealthInfo
          .checks
          .database
          .timestamp
        return datePickerFormat(timestampDb)
      } catch (err) {
        return ''
      }
    },
    durationDatabase: function () {
      try {
        const durationDb = this.nodeHealthInfo
          .checks
          .database
          .duration
        return durationDb
      } catch (err) {
        return ''
      }
    },
    durationBootstrapped: function () {
      try {
        const h = this.nodeHealthInfo
          .checks
          .bootstrapped
          .duration
        return h
      } catch (err) {
        return ''
      }
    },
    timestampBootstrapped: function () {
      try {
        const timestampN = this.nodeHealthInfo
          .checks
          .bootstrapped
          .timestamp
        return datePickerFormat(timestampN)
      } catch (err) {
        return ''
      }
    },
    bootstrappedMessages: function () {
      try {
        const msgs = this.nodeHealthInfo
          .checks
          .bootstrapped
          .message
        return msgs
      } catch (err) {
        return []
      }
    },
    duration: function () {
      try {
        const h = this.nodeHealthInfo
          .checks
          .network
          .duration
        return h
      } catch (err) {
        return ''
      }
    },
    timestampNetwork: function () {
      try {
        const timestampN = this.nodeHealthInfo
          .checks
          .network
          .timestamp
        return datePickerFormat(timestampN)
      } catch (err) {
        return ''
      }
    },
    connectedPeers: function () {
      try {
        const peers = this.nodeHealthInfo
          .checks
          .network
          .message
          .connectedPeers
        return peers
      } catch (err) {
        return ''
      }
    },
    sendFailRate: function () {
      try {
        const sfr = this.nodeHealthInfo
          .checks
          .network
          .message
          .sendFailRate
        return sfr
      } catch (err) {
        return ''
      }
    },
    timeSinceLastMsgReceived: function () {
      try {
        const tR = this.nodeHealthInfo
          .checks
          .network
          .message
          .timeSinceLastMsgReceived
        return tR
      } catch (err) {
        return ''
      }
    },
    timeSinceLastMsgSent: function () {
      try {
        const tS = this.nodeHealthInfo
          .checks
          .network
          .message
          .timeSinceLastMsgSent
        return tS
      } catch (err) {
        return ''
      }
    },
    contiguousFailures: function () {
      try {
        const h = this.nodeHealthInfo
          .checks
          .network
          .contiguousFailures
        return h
      } catch (err) {
        return ''
      }
    },
    duration2: function () {
      try {
        const h = this.nodeHealthInfo
          .checks
          .router
          .duration
        return h
      } catch (err) {
        return ''
      }
    },
    timeOfFirstFailure2: function () {
      try {
        const h = this.nodeHealthInfo
          .checks
          .router
          .timestamp
        return datePickerFormat(h)
      } catch (err) {
        return ''
      }
    },
    longestRunningRequest: function () {
      try {
        const h = this.nodeHealthInfo
          .checks
          .router
          .message
          .longestRunningRequest
        return h
      } catch (err) {
        return ''
      }
    },
    outstandingRequests: function () {
      try {
        const request = this.nodeHealthInfo
          .checks
          .router
          .message
          .outstandingRequests
        return request
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
    getPercent (p) {
      if (!p || !p.vm) return
      const percent = p.vm['primary-percentConnected']
      return round(percent * 100, 1000)
    },
    getPercentL (p) {
      if (!p || !p.vm) return
      return p.vm['primary-percentConnected']
    },
    getUpTime (val) {
      if (!val) return
      return round(val * 100, 1000)
    },
    getDateFormat (val) {
      return datePickerFormat(val)
    },
    getColorUptime (val) {
      if (val >= 60) return 'positive'
      return 'negative'
    }
  }
}
</script>
