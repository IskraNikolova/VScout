<template>
  <q-dialog
    no-focus
    v-model="ui.nodeHealth.isOpen"
    persistent
  >
    <q-card style="min-width: 500px!important;">
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="./../statics/blockchain.svg" />
            </q-avatar>
            </q-item-section>
            <q-item-section>
            <q-item-label>Node ID <small class="text-orange">{{ nodeID }}</small></q-item-label>
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
            <div><small>Heartbeat: </small> <span>{{ heartbeat }}</span></div>
            <div><small>Healthy: </small><span v-if="healthy" class="text-accent"> Yes</span><span v-else class="text-negative"> No</span></div>
            <div><small>Duration: </small> <span>{{ duration }}</span></div>
            <div v-if="timeOfFirstFailure"><small>Time Of First Failure: </small> <span>{{ timeOfFirstFailure }}</span></div>
            <div><small>Contiguous Failures: </small> <span>{{ contiguousFailures }}</span></div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { datePickerFormat } from './../modules/time'

import {
  OPEN_NODE_HEALTH,
  CLOSE_NODE_HEALTH
} from './../store/ui/types'

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
      return this.nodeHealthInfo.healthy
    },
    heartbeat: function () {
      try {
        const h = this.nodeHealthInfo.checks['network.validators.heartbeat'].message.heartbeat
        return datePickerFormat(h)
      } catch (err) {
        return ''
      }
    },
    duration: function () {
      try {
        const h = this.nodeHealthInfo.checks['network.validators.heartbeat'].duration
        return h
      } catch (err) {
        return ''
      }
    },
    timeOfFirstFailure: function () {
      try {
        const h = this.nodeHealthInfo.checks['network.validators.heartbeat'].timeOfFirstFailure
        return h
      } catch (err) {
        return ''
      }
    },
    contiguousFailures: function () {
      try {
        const h = this.nodeHealthInfo.checks['network.validators.heartbeat'].contiguousFailures
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
