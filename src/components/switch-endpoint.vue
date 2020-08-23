<template>
 <div>
    <q-list v-for="(endpoint, i) in endpoints" v-bind:key="i">
      <q-item
        clickable
        v-close-popup
        @click="onSelectEndpoint(endpoint, false)"
      >
        <q-item-section>
          <q-item-label>{{ endpoint }}</q-item-label>
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
  SET_NODE_ID,
  SET_ENDPOINT,
  GET_VALIDATORS,
  GET_NODE_INFO,
  SET_ENDPOINTS_MEMORY,
  GET_PENDING_VALIDATORS,
  REMOVE_ENDPOINTS_MEMORY
} from '../store/app/types'

import {
  UPDATE_UI
} from '../store/ui/types'

import { _getNodeId, _getValidators } from './../modules/network'

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
      'endpointsMemory'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS,
      getNodeInfo: GET_NODE_INFO
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

      const response = await _getNodeId({ endpoint })
      if (response.data.error) {
        const test = await _getValidators({ endpoint })
        if (test.data.error) {
          const msg = `${test.data.error.message} with ${endpoint}`
          this.onError(msg)
          return
        }
        this.$store.commit(SET_ENDPOINT, { endpoint })
        this.$store.commit(SET_NODE_ID, { nodeID: '' })
        if (isCustom) {
          this.$store.commit(SET_ENDPOINTS_MEMORY, { endpoint })
          this.customEndpoint = ''
        }
        await this.onSuccess(endpoint)
        return
      }

      const nodeID = response.data.result.nodeID
      this.$store.commit(SET_ENDPOINT, { endpoint })
      this.$store.commit(SET_NODE_ID, { nodeID })
      if (isCustom) {
        this.$store.commit(SET_ENDPOINTS_MEMORY, { endpoint })
        this.customEndpoint = ''
      }
      await this.onSuccess(endpoint)
    },
    async onSuccess (endpoint) {
      this.$store.commit(UPDATE_UI, { doesItConnect: false })
      await this.getNodeInfo()
      this.$q.notify({
        textColor: 'black',
        color: 'white',
        message: `Connected to ${endpoint}`,
        position: 'top',
        timeout: 2000,
        icon: 'done'
      })
      await this.getValidators({ endpoint })
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
