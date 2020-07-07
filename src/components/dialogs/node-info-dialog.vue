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
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <img src="~/assets/peers.svg" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        Peers <small class="text-orange">{{ nodeInfo.peers.length}}</small>
                      </q-item-label>
                      <q-item-label caption>
                        Description of peer connections
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <q-item>
                  <q-item-section caption>
                    <q-input
                      color="accent"
                      label="Search by Node ID"
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
                  v-bind:key="peer.id"
                  class="q-pa-md"
                >
                  <q-item v-close-popup>
                    <q-item-section>
                      <div><small class="text-grey">IP: </small> {{ peer.ip }}<q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.ip)"/></div>
                      <div><small class="text-grey">Public IP: </small> {{ peer.publicIP }}<q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.publicIP)"/></div>
                      <div><small class="text-grey">ID: </small> {{ peer.id }} <q-btn icon="file_copy" color="grey" flat size="xs" @click="copyToClipboard(peer.id)"/></div>
                      <div><small class="text-grey">Version: </small> <span class="text-accent">{{ peer.version }}</span></div>
                      <div><small class="text-grey">Last Sent: </small> {{ dateFormat(peer.lastSent) }}</div>
                      <div><small class="text-grey">Last Received: </small> {{ dateFormat(peer.lastReceived) }}</div>
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
    ]),
    filterPeers: function () {
      return this.nodeInfo.peers.filter(a => a.id.toLowerCase().includes(this.filter.toLowerCase()))
    }
  },
  data () {
    return {
      filter: ''
    }
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
