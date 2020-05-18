<template>
  <q-page class="q-pa-xl">
     <div class="row q-pb-xl">
      <div class="col-xl-8 col-md-7 col-xs-1"></div>
      <div class="col-xl-3 col-md-5 col-xs-12">
      <q-toolbar>
        <q-img src="~assets/AVAVE.png" id="toolbar-logo" class="q-mr-sm"/>
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
          <div class="no-wrap q-pa-md text-negative">Switch To Endpoint</div>
          <q-list v-for="(endpoint, i) in endpoints" v-bind:key="i">
            <q-item clickable v-close-popup @click="onSelectEndpoint(endpoint)">
              <q-item-section>
                <q-item-label>{{ endpoint }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-input
            clearable
            class="q-pl-md q-pr-md"
            label="http(s)://yourAddress/"
            v-model="customEndpoint"
          >
            <template v-slot:after>
              <q-btn round dense flat icon="send" @click="onSelectEndpoint(customEndpoint)"/>
            </template>
          </q-input>
        </q-btn-dropdown>
      </q-toolbar>
      </div>
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

const { network } = require('./../modules/config').default

import Faqs from './../components/faqs'
import StakItem from './../components/stak-item'
import BlockchainItem from './../components/blockchain-item'
import TableItem from './../components/table-item'
import TransactionsItem from './../components/transactions-item'

import {
  GET_VALIDATORS,
  SET_ENDPOINT,
  GET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN
} from '../store/app/types'

import { testConnection } from './../modules/network'

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
      'currentBlockchain',
      'networkEndpoint'
    ])
  },
  data () {
    return {
      customEndpoint: '',
      endpoints: network.endpointUrls
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
    async onSelectEndpoint (endpoint) {
      const temp = {
        'Network Error': () => {
          this.$q.notify({
            message: 'Network Error!',
            color: 'radial-gradient(circle, #FFFFFF 0%, #000709 70%)',
            position: 'top',
            timeout: 2000,
            icon: 'warning'
          })
        },
        'Request failed with status code 404': () => {
          this.$q.notify({
            message: 'Invalid network address!',
            color: 'radial-gradient(circle, #FFFFFF 0%, #000709 70%)',
            position: 'top',
            timeout: 2000,
            icon: 'warning'
          })
        },
        200: () => {
          this.$store.commit(SET_ENDPOINT, { endpoint })
          this.customEndpoint = ''
        }
      }
      const connection = await testConnection({ endpoint })
      temp[connection]()
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
 #toolbar-logo {
  width: 40%;
  max-width: 40%;
 }
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
