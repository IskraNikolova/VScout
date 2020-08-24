<template>
  <q-page>
    <div style="height: 3px;width: 100%;background: grey;opacity: 0.5;"></div>
    <div style="padding: 3%;">
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
        <faqs class="q-pr-md" />
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
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS
} from '../store/app/types'

export default {
  name: 'PageIndex',
  components: {
    Faqs: () => import('components/panels/faqs'),
    Stake: () => import('components/panels/stake'),
    Network: () => import('components/panels/network'),
    Node: () => import('components/panels/node'),
    TableValidators: () => import('components/panels/table-validators'),
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
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    async getValidatorsV (type) {
      const temp = {
        active: async () => await this.getValidators({
          subnetID: this.subnetID,
          endpoint: this.networkEndpoint
        }),
        pending: async () => await this.getPendingValidators({
          subnetID: this.subnetID
        })
      }

      if (typeof type !== 'undefined') await temp[type]()
    },
    async getDefaultValidators () {
      await this.getValidators({
        endpoint: this.networkEndpoint
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
