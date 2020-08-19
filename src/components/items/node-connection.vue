<template>
  <div class="col-md-3 col-xs-10">
    <div id="f-size12" class="q-pb-md text-medium">
      NODE CONNECTION
      <q-spinner-ball v-if="ui.doesItConnect" />
    </div>
    <div class="row">
      <div class="col">
        <small>Connected with</small>
        <div class="text-h7 q-pb-md text-orange" >
        {{ networkEndpoint.substr(0, 19)}}...
        <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">{{ networkEndpoint}}</q-tooltip>
        </div>
      </div>
      <div class="q-pl-md q-pt-xs col">
        <q-btn :color="color" no-caps outline size="xs" label="Check Health" @click="onOpenHealth"/>
        <node-health-dialog ref="nodeHealthDialog" />
      </div>
    </div>
    <div id="f-size12" v-if="nodeID">
      <span class="text-medium">Node ID</span>
      <div class="text-grey">
        {{ nodeID }}
        <q-btn class="text-accent" size="xs" flat icon="info" @click="onOpenNodeInfo">
          <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Information about the node</q-tooltip>
        </q-btn>
        <node-info-dialog ref="nodeInfoDialog" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { GET_NODE_INFO } from './../../store/app/types'

import NodeHealthDialog from './../dialogs/node-health-dialog'
import NodeInfoDialog from './../dialogs/node-info-dialog'

export default {
  name: 'NodeConnection',
  components: {
    NodeInfoDialog,
    NodeHealthDialog
  },
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'nodeHealth',
      'networkEndpoint'
    ]),
    nodeHealthInfo: function () {
      return this.nodeHealth(this.nodeID)
    },
    healthy: function () {
      try {
        return this.nodeHealthInfo.healthy
      } catch (err) {
        return ''
      }
    },
    color: function () {
      if (this.healthy) return 'green'
      return 'negative'
    }
  },
  methods: {
    ...mapActions({
      getNodeInfo: GET_NODE_INFO
    }),
    onOpenHealth () {
      this.$refs.nodeHealthDialog.open()
    },
    async onOpenNodeInfo () {
      await this.getNodeInfo()
      this.$refs.nodeInfoDialog.open()
    }
  }
}
</script>
