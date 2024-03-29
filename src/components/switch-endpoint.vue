<template>
 <div class="panel2">
    <q-list v-for="(endpoint, i) in endpoints" v-bind:key="i">
      <q-item
        :dark="appTheme==='dark'"
        clickable
        v-close-popup
        @click="onSelectEndpoint(endpoint, false)"
      >
        <q-item-section>
          <q-item-label class="text-panel">
            {{ endpoint.name }}
            <q-icon
              name="done"
              style="margin-top: -7px;"
              size="md"
              class="text-positive q-pl-md"
              v-if="networkEndpoint.url === endpoint.url"
            />
          </q-item-label>
          <q-item-label caption>
           {{ endpoint.urlView }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-input
      borderless
      clearable
      :dark="appTheme==='dark'"
      class="q-pl-md q-pr-md"
      label="http(s)://yourAddress/"
      v-model="customEndpoint"
      @input="takeSuggestion"
    >
      <template v-slot:after>
        <q-btn
          round
          dense
          flat
          icon="send"
          @click="onSelectEndpoint(customEndpoint, true)"
        />
      </template>
    </q-input>
    <div
      style="cursor: pointer;"
      class="q-pl-md q-pb-xs"
      v-for="s in suggestions"
      v-bind:key="s"
      @click="customEndpoint = s; suggestions = [];"
    >
      <q-badge color="grey">
        <span class="q-pr-xs">{{ s }}</span>
        <q-icon
          @click="onRemoveFromMem(s, $event)"
          name="clear"
          color="white"
        />
      </q-badge>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  GET_STAKING,
  GET_SUBNETS,
  GET_NODE_ID,
  GET_NODE_INFO,
  GET_BLOCKCHAINS
} from '../store/app/types'

import {
  UPDATE_UI
} from '../store/ui/types'

import {
  GET_HEIGHT
} from '../store/access/types'

import {
  SET_ENDPOINT,
  GET_NODE_PEERS,
  SET_ENDPOINTS_MEMORY,
  REMOVE_ENDPOINTS_MEMORY
} from '../store/memory/types'

import {
  _getNodeId
} from './../modules/network.js'

const {
  network
} = require('./../modules/config').default

export default {
  name: 'SwitchEndpoint',
  data () {
    return {
      isCustom: false,
      suggestions: [],
      customEndpoint: '',
      endpoints: network.endpointUrls
    }
  },
  computed: {
    ...mapGetters([
      'subnetID',
      'appTheme',
      'validators',
      'endpointsMemory',
      'networkEndpoint'
    ])
  },
  methods: {
    ...mapActions({
      getHeight: GET_HEIGHT,
      getSubnets: GET_SUBNETS,
      getNodeInfo: GET_NODE_INFO,
      getNodePeers: GET_NODE_PEERS,
      getValidators: GET_STAKING,
      getBlockchains: GET_BLOCKCHAINS
    }),
    onRemoveFromMem (endpoint, event) {
      event.stopImmediatePropagation()
      this.$store.commit(REMOVE_ENDPOINTS_MEMORY, { endpoint })
      this.takeSuggestion()
    },
    takeSuggestion () {
      this.suggestions = this.endpointsMemory
        .filter(a => a.includes(this.customEndpoint))
    },
    async onSelectEndpoint (endpoint, isCustom) {
      this.$store.commit(UPDATE_UI, { doesItConnect: true })

      if (isCustom) {
        endpoint = { name: 'Custom', url: endpoint, urlView: endpoint }
      }

      const response = await _getNodeId({ endpoint: endpoint.url })
      // if (response.data.error.code === -32601) {
      //   response = {
      //     data: {
      //       result: {
      //         nodeID: ''
      //       }
      //     }
      //   }
      // } else
      if (response.data.error) {
        const msg = `${response.data.error.message} with ${endpoint.name} - ${endpoint.url}`
        this.onError(msg)
        return
      }

      if (isCustom) {
        this.$store.commit(SET_ENDPOINTS_MEMORY, { endpoint: endpoint.url })
        this.customEndpoint = ''
      }

      this.$store.commit(SET_ENDPOINT, { endpoint })
      const nodeID = response.data.result.nodeID
      this.$store.commit(GET_NODE_ID, { nodeID })
      await this.onSuccess(endpoint)
    },
    async onSuccess (endpoint) {
      this.$store.commit(UPDATE_UI, { doesItConnect: false })
      try {
        await Promise.all([
          this.getNodeInfo({}),
          this.getNodePeers({}),
          this.getHeight({ endpoint: endpoint.url }),
          this.getValidators({ endpoint: endpoint.url, subnetID: this.subnetID }),
          this.getBlockchains({ endpoint: endpoint.url }),
          this.getSubnets({ endpoint: endpoint.url })
        ])
        this.$q.notify({
          textColor: 'black',
          color: 'white',
          message: `Connected to ${endpoint.name} (${endpoint.url})`,
          position: 'top',
          timeout: 2000,
          icon: 'done'
        })
      } catch (err) {
        console.log(err)
        this.onError()
      }
    },
    onError (message) {
      this.$store.commit(UPDATE_UI, { doesItConnect: false })
      this.$q.notify({
        message,
        color: 'radial-gradient(circle, #FFFFFF 0%, #000709 70%)',
        position: 'top',
        timeout: 2000,
        icon: 'warning'
      })
    }
  }
}
</script>
