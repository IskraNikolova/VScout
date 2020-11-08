<template>
  <q-page>
    <div style="padding: 1%;">
      <error class="q-pr-sm" />
      <node />
      <market-data class="q-mb-sm q-mt-sm" />
      <network />
      <stake />
      <table-validators
        v-if="ui.typeAccount.isValidators"
        @getValidators="getValidatorsV"
        @getDefaultValidators="getDefaultValidators"
      />
      <table-delegators
        v-else
        @getDelegators="getValidatorsV"
      />
      <div class="flex flex-center q-mt-xl">
        <faqs id="faqs"/>
      </div>
      <div class="flex flex-center">
        <img src="~assets/vscoutlogo5.svg" id="logo">
      </div>
      <div class="flex flex-center q-mt-xl text-white">
        Made with ❤️ for builders everywhere.
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import {
  GET_STAKING,
  GET_PENDING_STAKING
} from '../store/app/types'

const { network } = require('./../modules/config')
  .default

export default {
  name: 'PageIndex',
  components: {
    Node: () => import('components/panels/node.vue'),
    Network: () => import('components/panels/network.vue'),
    MarketData: () => import('components/panels/market-data.vue'),
    Stake: () => import('components/panels/stake.vue'),
    Error: () => import('components/panels/error.vue'),
    TableValidators: () => import('components/panels/table-validators.vue'),
    Faqs: () => import('components/panels/faqs.vue'),
    TableDelegators: () => import('components/panels/table-delegators.vue')
  },
  computed: {
    ...mapGetters([
      'ui',
      'subnetID',
      'validators',
      'delegators',
      'networkEndpoint',
      'pendingValidators'
    ])
  },
  data () {
    return {
      price: null,
      startIndex: null
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING,
      getPendingValidators: GET_PENDING_STAKING
    }),
    async getValidatorsV (type) {
      const temp = {
        active: async () => await this.getValidators({
          subnetID: this.subnetID,
          endpoint: this.networkEndpoint.url
        }),
        pending: async () => await this.getPendingValidators({
          subnetID: this.subnetID,
          endpoint: this.networkEndpoint.url
        })
      }

      if (typeof type !== 'undefined') await temp[type]()
    },
    async getDefaultValidators () {
      await this.getValidators({
        subnetID: network.defaultSubnetID,
        endpoint: this.networkEndpoint.url
      })
    }
  }
}
</script>

<style scoped>
 #logo {
  width: 190vw;
  max-width: 190px;
 }
</style>
