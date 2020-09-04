<template>
  <q-page>
    <div style="height: 3px;width: 100%;background: grey;opacity: 0.5;" id="up"></div>
    <div style="padding: 3%;">
      <error class="q-pr-md" />
      <node class="q-pr-md" />
      <network class="q-pr-md"/>
      <stake class="q-pr-md"/>
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
  INIT_APP,
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS
} from '../store/app/types'

export default {
  name: 'PageIndex',
  components: {
    Node: () => import('components/panels/node'),
    Network: () => import('components/panels/network'),
    Stake: () => import('components/panels/stake'),
    Error: () => import('components/panels/error'),
    TableValidators: () => import('components/panels/table-validators'),
    Faqs: () => import('components/panels/faqs'),
    TableDelegators: () => import('components/panels/table-delegators')
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
  async created () {
    await this.initApp()
  },
  methods: {
    ...mapActions({
      initApp: INIT_APP,
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS
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
        subnetID: '11111111111111111111111111111111LpoYY',
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
