<template>
  <q-dialog
    no-focus persistent
    v-model="ui.nodeInfo.isOpen"
  >
    <q-card style="min-width: 30%!important;">
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
              Information about the node
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
              <small>Network ID: </small>
              <span>{{ nodeInfo.networkID }}</span>
            </div>
            <div>
              <small>Network Name: </small>
              <span>{{ nodeInfo.networkName }}</span>
            </div>
            <div>
              <small>Node Version: </small>
              <span>{{ nodeInfo.nodeVersion }}</span>
            </div>
            <div>
              <small>Peer connections: </small>
              <q-btn-dropdown
                color="accent"
                outline
                size="xs"
                no-caps
                :label="'Peers ' + nodeInfo.peers.length"
              >
                <div class="q-pa-md">
                  Peers
                </div>
                <q-list
                  v-for="peer in nodeInfo.peers"
                  v-bind:key="peer.id"
                >
                  <q-item v-close-popup>
                    <q-item-section>
                      <div><span class="text-grey">IP: </span> {{ peer.ip }}<q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.ip)"/></div>
                      <div><span class="text-grey">Public IP: </span> {{ peer.publicIP }}<q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.publicIP)"/></div>
                      <div><span class="text-grey">ID: </span> {{ peer.id }} <q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.id)"/></div>
                      <div><span class="text-grey">Version: </span> <span class="text=accent">{{ peer.version }}</span></div>
                      <div><span class="text-grey">Last Sent: </span> {{ dateFormat(peer.lastSent) }}</div>
                      <div><span class="text-grey">Last Received: </span> {{ dateFormat(peer.lastReceived) }}</div>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  copyToClipboard
} from 'quasar'

import { datePickerFormat } from './../../modules/time'

import {
  OPEN_NODE_INFO,
  CLOSE_NODE_INFO
} from './../../store/ui/types'

export default {
  name: 'NodeInfoDialog',
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'nodeInfo'
    ])
  },
  methods: {
    ...mapActions({
      open: OPEN_NODE_INFO,
      close: CLOSE_NODE_INFO
    }),
    copyToClipboard (text) {
      copyToClipboard(text)
    },
    dateFormat (date) {
      return datePickerFormat(date)
    }
  }
}
</script>
