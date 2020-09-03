<template>
 <div>
    <q-list v-for="(endpoint, i) in endpoints" v-bind:key="i">
      <q-item
        clickable
        v-close-popup
        @click="onSelectEndpoint(endpoint, false)"
      >
        <q-item-section>
          <q-item-label>{{ endpoint.name }}</q-item-label>
          <q-item-label caption>
           {{ endpoint.url }}
            <q-icon name="done" style="margin-top: -7px;" size="md" class="text-green q-ml-md" v-if="networkEndpoint.url === endpoint.url" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-input
      borderless
      clearable
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
  GET_SUBNETS,
  SET_NODE_ID,
  GET_NODE_INFO,
  GET_VALIDATORS,
  GET_BLOCKCHAINS,
  GET_PENDING_VALIDATORS,
  GET_ASSETS_BY_BLOCKCHAINS
} from '../store/app/types'

import {
  UPDATE_UI
} from '../store/ui/types'

import {
  SET_ENDPOINT,
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
      'validators',
      'endpointsMemory',
      'networkEndpoint'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS,
      getNodeInfo: GET_NODE_INFO,
      getBlockchains: GET_BLOCKCHAINS,
      getSubnets: GET_SUBNETS,
      getAssetByBlockchain: GET_ASSETS_BY_BLOCKCHAINS
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
        endpoint = { name: 'Custom', url: endpoint }
      }

      const response = await _getNodeId({ endpoint: endpoint.url })
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
      this.$store.commit(SET_NODE_ID, { nodeID })
      await this.onSuccess(endpoint)
    },
    async onSuccess (endpoint) {
      this.$store.commit(UPDATE_UI, { doesItConnect: false })
      await this.getNodeInfo()
      this.$q.notify({
        textColor: 'black',
        color: 'white',
        message: `Connected to ${endpoint.name} (${endpoint.url})`,
        position: 'top',
        timeout: 2000,
        icon: 'done'
      })
      await this.getValidators({ endpoint: endpoint.url })
      await this.getPendingValidators({ endpoint: endpoint.url })
      await this.getBlockchains({ endpoint: endpoint.url })
      await this.getSubnets({ endpoint: endpoint.url })
      await this.getAssetByBlockchain()
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
