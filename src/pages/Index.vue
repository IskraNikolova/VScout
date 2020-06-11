<template>
  <q-page class="q-pr-xl q-pl-xl">
    <network  class="q-pr-md"/>
    <transactions-item class="q-pa-md" />
    <stak-item class="q-pr-md"/>
    <table-validators v-if="ui.typeAccount.isValidators" @getValidators="getValidatorsV"/>
    <table-delegators v-else @getDelegators="getValidatorsV"/>
    <faqs-item class="q-pr-md" />

    <div class="flex flex-center q-mt-xl">
      <img src="~assets/ava-black.png" id="logo"/>
    </div>
    <div class="flex flex-center q-mt-xl">
      Made with ❤️ for builders everywhere.
    </div>
  </q-page>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import FaqsItem from './../components/panels/faqs-item'
import StakItem from './../components/panels/stak-item'
import Network from './../components/panels/network'
import TableValidators from './../components/panels/table-validators'
import TableDelegators from './../components/panels/table-delegators'
import TransactionsItem from './../components/panels/transactions-item'

import {
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS
} from '../store/app/types'

export default {
  name: 'PageIndex',
  components: {
    FaqsItem,
    StakItem,
    Network,
    TableValidators,
    TableDelegators,
    TransactionsItem
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
    }
  }
}
</script>

<style scoped>
 #logo {
  width: 70vw;
  max-width: 70px;
 }
</style>
