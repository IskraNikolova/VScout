<template>
  <div class="col-md-3 col-xs-10">
    <div id="f-size12" class="q-pb-md">NETWORK</div>
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
    <div id="f-size12">
      Node ID
      <div class="text-grey">{{ nodeID }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import NodeHealthDialog from './../node-health-dialog'

export default {
  name: 'NodeConnection',
  components: {
    NodeHealthDialog
  },
  computed: {
    ...mapGetters([
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
    onOpenHealth () {
      this.$refs.nodeHealthDialog.open()
    }
  }
}
</script>
