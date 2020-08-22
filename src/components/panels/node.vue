<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl q-pb-md" id="custom-card" >
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium ">NETWORK</div>
        <div style="text-transform: uppercase;" class="text-h6 text-orange">
          {{ nodeInfo.networkName }}
        </div>
        <div class="q-pt-md" id="f-size12">
          <span class="text-medium">Network ID</span>
          <span class="text-grey">
            {{ nodeInfo.networkID }}
          </span>
        </div>
        <div id="f-size12">
          <span class="text-medium">Version</span>
          <span class="text-grey">
            {{ nodeInfo.nodeVersion }}
          </span>
        </div>
      </div>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium ">NODE</div>
        <div class="text-h7 text-orange q-pb-md q-pt-xs" style="cursor: pointer;" @click="copyToClipboard(nodeID)">
          {{ nodeID.substr(0, 22) }}...{{nodeID.substr(32)}}
          <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Copy to Clipboard</q-tooltip>
        </div>
        <div class="q-pt-md">
          <q-btn :color="color" no-caps outline size="xs" label="Check Health" @click="onOpenHealth"/>
          <node-health-dialog ref="nodeHealthDialog" />
        </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/node1.svg" id="logo2">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md" />
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">PEER CONNECTIONS</div>
        <div class="q-pb-md">
         <small>Connected with</small>
         <div class="text-orange">{{ nodeInfo.peers.length}} peers</div>
        </div>
        <q-btn-dropdown
          color="grey"
          outline
          size="xs"
          no-caps
          label="List"
        >
          <q-item>
            <q-item-section caption>
              <q-input
                color="accent"
                label="Search Peer..."
                v-model="filter"
              >
                <template v-slot:append>
                  <q-icon name="search" color="accent" />
                </template>
              </q-input>
            </q-item-section>
            </q-item>
          <q-list
            v-for="peer in filterPeers"
            v-bind:key="peer.nodeID"
            class="q-pa-md"
          >
            <q-item v-close-popup>
              <q-item-section>
                <div><small class="text-grey">IP: </small> {{ peer.ip }}<q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.ip)"/></div>
                <div><small class="text-grey">Public IP: </small> {{ peer.publicIP }}<q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.publicIP)"/></div>
                <div><small class="text-grey">ID: </small> {{ peer.nodeID }} <q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.nodeID)"/></div>
                <div><small class="text-grey">Version: </small> <span class="text-accent">{{ peer.version }}</span></div>
                <div><small class="text-grey">Last Sent: </small> {{ dateFormat(peer.lastSent) }}</div>
                <div><small class="text-grey">Last Received: </small> {{ dateFormat(peer.lastReceived) }}</div>
              </q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~/assets/peers.svg" id="logo2"/>
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-2 col-xs-10">
        <node-connection class="col-md-3 col-xs-10" />
      </div>
      <div class="col-1 q-pt-md q-pl-md">
        <img src="~assets/computer-network.svg" id="logo2">
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  copyToClipboard
} from 'quasar'

import { datePickerFormat } from './../../modules/time'

import NodeConnection from './../items/node-connection'
import NodeHealthDialog from './../dialogs/node-health-dialog'

export default {
  name: 'Node',
  components: {
    NodeConnection,
    NodeHealthDialog
  },
  computed: {
    ...mapGetters([
      'nodeInfo',
      'nodeID',
      'nodeHealth'
    ]),
    filterPeers: function () {
      return this.nodeInfo.peers.filter(a => a.nodeID.toLowerCase().includes(this.filter.toLowerCase()) || a.ip.includes(this.filter))
    },
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
    color: function () {
      if (this.healthy) return 'green'
      return 'negative'
    }
  },
  data () {
    return {
      filter: ''
    }
  },
  methods: {
    dateFormat (date) {
      return datePickerFormat(date)
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