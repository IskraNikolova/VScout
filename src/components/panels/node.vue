<template>
  <q-card
    class="q-pt-md q-pl-xl q-pr-xs q-ml-xs q-pb-md panel" id="custom-card" >
    <div class="row">
      <div class="col-md-3 col-xs-10">
        <div v-if="isValidatorShow(nodeID)" style="cursor: pointer;" @click="copyToClipboard(nodeID)">
          <div id="f-size12" class="q-pb-md text-medium">NODE - VALIDATOR</div>
          <div class="text-h7 text-panel q-pb-md q-pt-xs">{{ formatNodeID }}</div>
          <tooltip-style v-bind:text="'Copy to Clipboard'" />
        </div>
        <div v-else>
          <div id="f-size12" class="q-pb-md text-medium">NODE</div>
          <div class="text-h7 text-panel q-pb-md q-pt-xs">{{ formatNodeID }}</div>
        </div>
        <div class="q-pt-md">
          <q-btn :color="color" no-caps outline size="xs" label="Check Health" @click="onOpenHealth"/>
          <node-health-dialog ref="nodeHealthDialog" v-bind:validator="validatorById(nodeID) ? validatorById(nodeID) : {}"/>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/ribbon.svg" v-if="isValidatorShow(nodeID)" id="logo2" />
        <img src="~assets/node1.svg" v-else id="logo2">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md" />
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">PEER CONNECTIONS</div>
        <div class="q-pb-md">
         <small>Connected with</small>
         <div class="text-panel">
            <animated-number
              :value="peersLength"
              :formatValue="format"
              :duration="3000"
            />
         </div>
        </div>
        <q-btn outline label="Peers" no-caps size="xs" @click="$router.push('/peers/' + nodeID)" />
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/peers.svg" id="logo2"/>
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">
          ENDPOINT
          <q-spinner-ball v-if="ui.doesItConnect" />
        </div>
        <div class="q-pb-md">
          <div class="text-h7 text-panel">{{ networkEndpoint.name }}</div>
        </div>
        <div id="f-size12" class="q-mt-md">
          <span class="q-pt-xl">{{ networkEndpoint.urlView }}</span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/computer-network.svg" id="logo2">
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import AnimatedNumber from 'animated-number-vue'

import {
  copyToClipboard
} from 'quasar'

export default {
  name: 'Node',
  components: {
    TooltipStyle: () => import('components/tooltip-style'),
    NodeHealthDialog: () => import('components/dialogs/node-health-dialog'),
    AnimatedNumber
  },
  data () {
    return {
      filter: ''
    }
  },
  computed: {
    ...mapGetters([
      'ui',
      'height',
      'nodeID',
      'peers',
      'nodeInfo',
      'nodeHealth',
      'validatorById',
      'networkEndpoint'
    ]),
    nodeHealthInfo: function () {
      return this.nodeHealth(this.nodeID)
    },
    peersLength: function () {
      if (this.peers && this.peers.numPeers) return this.peers.numPeers
      else if (this.peers) return this.peers.length
      return 0
    },
    healthy: function () {
      try {
        return this.nodeHealthInfo.healthy
      } catch (err) {
        return false
      }
    },
    color: function () {
      if (this.healthy) return 'positive'
      return 'negative'
    },
    formatNodeID: function () {
      if (!this.nodeID) return
      return `${this.nodeID.substr(0, 22)}...${this.nodeID.substr(32)}`
    }
  },
  methods: {
    isValidatorShow (id) {
      const isVal = this.validatorById(id)
      if (isVal) {
        return id !== 'NodeID-2KfgS6P7vf9L55fMRTbHPgS4ugVSDW3nj'
      }
      return false
    },
    format (value) {
      return `${Math.round(value)} peers`
    },
    copyToClipboard (text) {
      copyToClipboard(text)
    },
    onOpenHealth () {
      this.$refs.nodeHealthDialog.open()
    }
  }
}
</script>

<style scoped>
 #custom-card {
   border-right: 2px solid grey;
 }
 .custom-icon {
   width:30vw;
   max-width:30px;
 }
</style>
