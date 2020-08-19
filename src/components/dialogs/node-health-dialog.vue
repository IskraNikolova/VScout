<template>
  <q-dialog
    no-focus persistent
    v-model="ui.nodeHealth.isOpen"
  >
    <q-card style="min-width: 40%!important;">
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="./../../statics/blockchain.svg" />
            </q-avatar>
            </q-item-section>
            <q-item-section>
            <q-item-label>
              Node ID <small class="text-orange">{{ nodeID }}</small>
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
        <q-item>
          <q-item-section>
            <div>
              Healthy:
              <span v-if="healthy" class="text-accent"> Yes</span>
              <span v-else class="text-negative"> No</span>
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <q-item>
          <q-item-section>
            Network Validators Heartbeat
            <div class="q-pt-md">
              <small>Heartbeat: </small>
              <span>{{ heartbeat }}</span>
              <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Heartbeat is the unix timestamp of the last time the network handled a message.</q-tooltip>
            </div>
            <div>
              <small>Duration: </small>
              <span>{{ duration }}</span>
              <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Duration is the execution duration of the last health check in milliseconds.</q-tooltip>
            </div>
            <div  v-if="timeOfFirstFailure">
              <small>Time Of First Failure: </small>
              <span>{{ timeOfFirstFailure }}</span>
              <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Time of first failure is the time of the initial transitional failure.</q-tooltip>
            </div>
            <div>
              <small>Contiguous Failures: </small>
              <span>{{ contiguousFailures }}</span>
              <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Contiguous failures is the number of fails that occurred in a row.</q-tooltip>
            </div>
          </q-item-section>
          <q-separator vertical />
          <q-item-section class="q-pl-md">
            <div class="q-mb-md">Chains Default Bootstrapped</div>
            <div v-if="error">
              <small>Error: </small>
              <span class="text-negative">{{ error }}</span>
            </div>
             <div>
              <small>Duration: </small>
              <span>{{ duration2 }}</span>
            </div>
            <div>
              <small v-if="timeOfFirstFailure2">Time Of First Failure: </small>
              <span>{{ timeOfFirstFailure2 }}</span>
            </div>
            <div>
              <small>Contiguous Failures: </small>
              <span>{{ contiguousFailures2 }}</span>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { datePickerFormat } from './../../modules/time'

import {
  OPEN_NODE_HEALTH,
  CLOSE_NODE_HEALTH
} from './../../store/ui/types'

export default {
  name: 'NodeHealthDialog',
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'nodeHealth'
    ]),
    nodeHealthInfo: function () {
      return this.nodeHealth(this.nodeID)
    },
    healthy: function () {
      try {
        return this.nodeHealthInfo.healthy
      } catch (err) {
        return true
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
    })
  }
}
</script>
