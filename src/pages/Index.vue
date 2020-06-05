<template>
  <q-page class="q-pa-xl">
     <div class="row justify-end q-pb-xl">
      <div class="col-4">
        <q-img basic src="~assets/small-logo.png" id="toolbar-logo"/>
      </div>
      <div class="col-md-2 col-xs-8">
        <q-btn push no-caps flat id="logo-sim" icon="img:statics/rwc.svg">
          <q-popup-proxy>
            <q-banner class="q-pa-md" dense style="width: 430px;">
              <div class="q-pb-md">Reward Calculator</div>
              <div class="q-pa-md absolute-top-right"><q-badge outline size="xs" color="accent" :label="'Y ' + percentReward.toFixed(2) + '%'" /></div>
              <q-input
                label-color="negative"
                outlined
                v-model="stakeAmount"
                label="Staking Amount"
                mask="#"
                input-class="text-right"
                suffix="$AVA"
                precision= '2'
                reverse-fill-mask
                color="accent"
                @input="calculate"
                class="q-pb-xl"
                :rules="[value => value >= 2000 || 'Stake Amount must be greater or equal to 2000 $AVA']"
              />
              <q-slider
                class="q-ml-xs q-mr-xs"
                v-model="stakeTime"
                :min="2"
                :max="52"
                :step="1"
                :label-value="'Staking Time ' + stakeTime + ' weeks'"
                label-always
                @input="calculate"
                label-text-color="negative"
                label-color="white"
                color="negative"
              />
              <div class="row">
                <div class="col-4">
                  <small>Monthly Earning</small>
                  <div><span class="text-accent">{{ (monthly).toFixed(2) }}</span> $AVA</div>
                </div>
                <div class="col-4 q-pl-xs">
                  <small>{{ stakeTime }} Weekly Earning  </small>
                  <div><span class="text-accent">{{ (weekly * stakeTime).toFixed(2) }}</span> $AVA</div>
                </div>
                <div class="col-4 q-pl-md">
                  <small>Yearly Earning </small>
                  <div><span class="text-accent">{{ yearly.toFixed(2) }}</span> $AVA</div>
                </div>
              </div>
            </q-banner>
          </q-popup-proxy>
        </q-btn>
        <q-btn-dropdown
          flat
          dropdown-icon="img:statics/blockchain-black.svg"
        >
          <div class="no-wrap q-pa-md text-negative">Blockchains</div>
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
          id="target-el"
        >
          <div class="no-wrap q-pa-md text-negative">Switch To Endpoint</div>
          <q-list v-for="(endpoint, i) in endpoints" v-bind:key="i">
            <q-item clickable v-close-popup @click="onSelectEndpoint(endpoint, false)">
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
              <q-btn round dense flat icon="send" @click="onSelectEndpoint(customEndpoint, true)"/>
            </template>
          </q-input>
          <div style="cursor: pointer;" class="q-pl-md q-pb-xs" v-for="s in suggestions" v-bind:key="s" @click="customEndpoint = s; suggestions = [];">
            <q-badge color="grey">
              <span class="q-pr-xs">{{ s }}</span>
              <q-icon @click="onRemoveFromMem(s, $event)" name="clear" color="white" />
            </q-badge>
          </div>
        </q-btn-dropdown>
        <q-tooltip :target="switchNet" content-class="bg-white text-black">
          <div>Connected with <q-icon name="router"/></div>
          <div class="text-negative">{{ networkEndpoint }}</div>
        </q-tooltip>
      </div>
    </div>
    <stak-item />
    <transactions-item />
    <blockchain-item />

    <table-item @getValidators="getValidatorsV" />
    <faqs-item />
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

import FaqsItem from './../components/panels/faqs-item'
import StakItem from './../components/panels/stak-item'
import BlockchainItem from './../components/panels/blockchain-item'
import TableItem from './../components/panels/table-item'
import TransactionsItem from './../components/panels/transactions-item'

import {
  GET_VALIDATORS,
  SET_ENDPOINT,
  SET_NODE_ID,
  SET_ENDPOINTS_MEMORY,
  REMOVE_ENDPOINTS_MEMORY,
  GET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN,
  GET_ASSETS_BY_BLOCKCHAINS
} from '../store/app/types'

import { testConnection } from './../modules/network'

export default {
  name: 'PageIndex',
  components: {
    FaqsItem,
    StakItem,
    BlockchainItem,
    TableItem,
    TransactionsItem
  },
  computed: {
    ...mapGetters([
      'ui',
      'validators',
      'pendingValidators',
      'blockchains',
      'currentBlockchain',
      'networkEndpoint',
      'endpointsMemory'
    ])
  },
  data () {
    return {
      btnNetwork: false,
      stakeAmount: 2000,
      stakeTime: 2,
      result: 0.00,
      yearly: 0.00,
      weekly: 0.00,
      monthly: 0.00,
      percentReward: 12,
      customEndpoint: '',
      isCustom: false,
      endpoints: network.endpointUrls,
      suggestions: [],
      switchNet: '#target-el'
    }
  },
  mounted () {
    this.calculate()
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getAssets: GET_ASSETS_BY_BLOCKCHAINS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    onRemoveFromMem (endpoint, event) {
      event.stopImmediatePropagation()
      this.$store.commit(REMOVE_ENDPOINTS_MEMORY, { endpoint })
      this.takeSuggestion()
    },
    takeSuggestion () {
      this.suggestions = this.endpointsMemory.filter(a => a.includes(this.customEndpoint))
    },
    calculate () {
      this.stakeTime = Math.round(this.stakeTime)
      this.yearly = (this.stakeAmount * this.percentReward) / 100
      this.monthly = (this.stakeAmount * (this.percentReward / 12)) / 100
      this.weekly = (this.stakeAmount * (this.percentReward / 52)) / 100
    },
    async onSelectNetwork (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
      await Promise.all([
        this.getAssets(),
        this.getValidators({ subnetID: blockchain.subnetID })
      ])
    },
    onSelectEndpoint (endpoint, isCustom) {
      testConnection({ endpoint })
        .then((nodeID) => {
          this.$store.commit(SET_ENDPOINT, { endpoint })
          this.$store.commit(SET_NODE_ID, { nodeID })
          if (isCustom) {
            this.$store.commit(SET_ENDPOINTS_MEMORY, { endpoint })
            this.customEndpoint = ''
          }
          this.getValidators({ subnetID: this.currentBlockchain.subnetID })
        })
        .catch((err) => {
          this.$q.notify({
            message: err.message,
            color: 'radial-gradient(circle, #FFFFFF 0%, #000709 70%)',
            position: 'top',
            timeout: 2000,
            icon: 'warning'
          })
        })
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
