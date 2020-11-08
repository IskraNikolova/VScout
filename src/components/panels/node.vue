<template>
  <q-card
    class="q-pt-md q-pl-xl q-pr-sm q-pb-md" id="custom-card" >
    <!--<div style="text-align: right;font-size: 10px;margin-bottom: 5px;">
      <q-icon name="info" style="font-size: 17px;" color="grey">
        <tooltip-style v-bind:brandColoring="['VScout']" v-bind:bold="[`${nodeID}`, `${networkEndpoint.url}`]" v-bind:text="'On this panel you can get information about node to which the VScout is connected and to which it submits a request for data visualization (health, peers, node version, network name, validators/uptime etc.). You are currently using ' + networkEndpoint.url + ' with ' + nodeID + '. To switch to another node, use the menu at the top right.'" />
      </q-icon>
      <span class="text-orange"> VScout</span> Connection Info
    </div>-->
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium ">NETWORK</div>
        <div style="text-transform: uppercase;" class="text-h6 text-secondary">
          {{ nodeInfo.networkName }}
        </div>
        <div class="q-pt-md" id="f-size12">
          <span class="text-medium">Network ID</span>
          <span class="text-secondary">
            {{ nodeInfo.networkID }}
          </span>
        </div>
        <div id="f-size12">
          <span class="text-medium">Version</span>
          <span class="text-secondary">
            {{ nodeInfo.version ? nodeInfo.version : nodeInfo.nodeVersion}}
          </span>
        </div>
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md" />
      <div class="col-md-3 col-xs-10">
        <div v-if="validatorById(nodeID)" style="cursor: pointer;" @click="copyToClipboard(nodeID)">
          <div id="f-size12" class="q-pb-md text-medium">NODE - VALIDATOR</div>
          <div class="text-h7 text-secondary q-pb-md q-pt-xs">{{ formatNodeID }}</div>
          <tooltip-style v-bind:text="'Copy to Clipboard'" />
        </div>
        <div v-else>
          <div id="f-size12" class="q-pb-md text-medium">NODE</div>
          <div class="text-h7 text-secondary q-pb-md q-pt-xs">{{ formatNodeID }}</div>
        </div>
        <div class="q-pt-md">
          <q-btn :color="color" no-caps outline size="xs" label="Check Health" @click="onOpenHealth"/>
          <node-health-dialog ref="nodeHealthDialog" v-bind:validator="validatorById(nodeID) ? validatorById(nodeID) : {}"/>
        </div>
      </div>
      <div class="col-1 q-pt-md"  style="opacity: 0.3;">
        <img src="~assets/ribbon.svg" v-if="validatorById(nodeID)" id="logo2" />
        <img src="~assets/node1.svg" v-else id="logo2">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md" />
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">PEER CONNECTIONS</div>
        <div class="q-pb-md">
         <small>Connected with</small>
         <div class="text-secondary">
            <animated-number
              :value="peersLength"
              :formatValue="format"
              :duration="3000"
            />
         </div>
        </div>
        <q-btn outline label="Peers" size="xs" @click="$router.push('/peers/' + nodeID)" />
      </div>
      <div class="col-1 q-pt-md" style="opacity: 0.3;">
        <img src="~assets/peers.svg" id="logo2"/>
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">
          ENDPOINT
          <q-spinner-ball v-if="ui.doesItConnect" />
        </div>
        <div class="q-pb-md">
          <div class="text-h7 text-secondary">{{ networkEndpoint.name }}</div>
        </div>
        <div id="f-size12" class="q-mt-md">
          <span class="q-pt-xl">{{ networkEndpoint.urlView }}</span>
        </div>
      </div>
      <div class="col-1 q-pt-md q-pl-md" style="opacity: 0.3;">
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
      'nodeInfo',
      'nodeHealth',
      'validatorById',
      'networkEndpoint'
    ]),
    nodeHealthInfo: function () {
      return this.nodeHealth(this.nodeID)
    },
    peersLength: function () {
      if (this.nodeInfo.peers && this.nodeInfo.peers.peers) return this.nodeInfo.peers.peers.length
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
      if (this.healthy) return 'green'
      return 'negative'
    },
    formatNodeID: function () {
      if (!this.nodeID) return
      return `${this.nodeID.substr(0, 22)}...${this.nodeID.substr(32)}`
    }
  },
  methods: {
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
