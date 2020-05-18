<template>
  <q-page class="q-pa-xl">
     <div class="row justify-end q-pb-xl">
      <div class="col-4 q-pl-xl">
        <q-img src="~assets/AVAVE.png" id="toolbar-logo"/>
      </div>
      <div class="col-2">
        <q-btn push no-caps flat size="md" icon="img:statics/rwc.png">
          <q-popup-proxy>
            <q-banner class="q-pa-md">
             <div class="q-pb-md">Reward Calculator</div>
             <q-input
              label-color="orange" outlined
              v-model="amount"
              label="Staking AVA"
              mask="#"
              input-class="text-right"
              suffix="$AVA"
              precision= '2'
              reverse-fill-mask
              @input="calculate"
              class="q-pb-md"
            />
            <q-input
              label-color="orange" outlined
              v-model="period"
              label="Staking Time"
              input-class="text-right"
              type="number"
              prefix="Days"
              reverse-fill-mask
              @input="calculate"
              class="q-pb-md"
            />
            <div class="row">
              <div><small>Monthly Earning  </small> <span class="text-accent">{{ result.toFixed(2) }}</span> AVA&nbsp;</div>
              <div><small>Yearly Earning </small> <span class="text-accent">{{ (result * 12).toFixed(2) }}</span> AVA </div>
            </div>
            </q-banner>
          </q-popup-proxy>
        </q-btn>
        <q-btn-dropdown
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
      amount: 1000,
      period: 30,
      result: 0.00,
      customEndpoint: '',
      endpoints: network.endpointUrls
    }
  },
  created () {
    this.calculate()
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    calculate () {
      const calc = (this.amount * this.period) * 0.4
      if (Number.isNaN((calc))) this.amount = 0

      this.result = calc
    },
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
  width: 60%;
  max-width: 60%;
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
