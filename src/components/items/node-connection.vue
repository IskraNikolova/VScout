<template>
  <div class="col-md-3 col-xs-10">
    <div id="f-size12" class="q-pb-md">
      NETWORK ENDPOINT
      <q-spinner-ball v-if="ui.doesItConnect" />
    </div>
    <div class="row">
      <div class="col">
        <small>Connected with</small>
        <div class="text-h7 q-pb-md text-orange" >
        {{ networkEndpoint }}
        </div>
      </div>
      <div class="q-pl-md q-pt-xs col">
        <q-btn :color="color" no-caps outline size="xs" label="Check Health" @click="onOpenHealth"/>
        <node-health-dialog ref="nodeHealthDialog" />
      </div>
    </div>
    <div id="f-size12" v-if="nodeID">
      Node ID
      <div class="text-grey">
        {{ nodeID }}
        <q-btn class="text-accent" size="xs" flat icon="info" @click="onOpenNodeInfo"/>
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
      if (this.healthy) return 'accent'
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
