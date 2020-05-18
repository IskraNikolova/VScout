<template>
  <q-page class="q-pa-xl">
     <div class="q-gutter-y-md column q-pb-xl">
      <q-toolbar style="padding-left: 600px;">
        <q-separator color="orange" vertical class="q-mb-xs q-mr-xs"/>
        <q-img src="~assets/ava-black.png" id="logo" class="q-mr-sm"/>
        <div class="q-pt-md">Validator Explorer</div>
        <q-btn-dropdown
          style="margin-left: 170px;"
          flat
          dropdown-icon="img:statics/blockchain-black.svg"
        >
          <q-list v-for="(blockchain, i) in blockchains" v-bind:key="i">
            <q-item clickable v-close-popup @click="onSelectNetwork(blockchain)">
              <q-item-section>
                <q-item-label><q-img src="statics/blockchain-black.svg" id="logo-xs"/> {{ blockchain.name }}</q-item-label>
                <q-item-label caption><small>Subnet ID: </small><span class="text-negative">{{ blockchain.subnetID.substr(0, 4)}}...{{ blockchain.subnetID.substr(30)}}</span></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown
          flat
          dropdown-icon="img:statics/node.svg"
        >
          <q-list>
            <div class="no-wrap q-pa-md text-negative">Switch To Endpoint</div>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>bootstrap.ava.network:21000</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>127.0.0.1:9650</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-input
                label="http(s)://yourAddress"
                v-model="customEndpoint"
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
     </div>
    <blockchain-item />
    <stak-item />
    <transactions-item />
    <table-item v-bind:validators="validators" v-bind:pendingValidators="pendingValidators" @getValidators="getValidatorsV" />
    <faqs />
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

import Faqs from './../components/faqs'
import StakItem from './../components/stak-item'
import BlockchainItem from './../components/blockchain-item'
import TableItem from './../components/table-item'
import TransactionsItem from './../components/transactions-item'

import {
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN
} from '../store/app/types'

export default {
  name: 'PageIndex',
  components: {
    Faqs,
    StakItem,
    BlockchainItem,
    TableItem,
    TransactionsItem
  },
  computed: {
    ...mapGetters([
      'validators',
      'pendingValidators',
      'blockchains',
      'currentBlockchain'
    ])
  },
  data () {
    return {
      customEndpoint: ''
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    onSelectNetwork (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
      this.getValidators({ subnetID: blockchain.subnetID })
    },
    async getValidatorsV (type) {
      const temp = {
        active: async () => await this.getValidators({ subnetID: this.currentBlockchain.subnetID }),
        pending: async () => await this.getPendingValidators({ subnetID: this.currentBlockchain.subnetID })
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
 #logo-s {
  width: 28vw;
  max-width: 28px;
 }
 #logo-xs {
  width: 18vw;
  max-width: 18px;
  opacity: 0.3;
 }
</style>
