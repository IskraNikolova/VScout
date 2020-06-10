<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header reveal class="bg-white text-black q-pt-md q-pr-xl" style="z-index: 0;">
      <q-toolbar>
      <q-img class="md background-img-s" src="./../statics/img/background.png"/>
      <q-img class="xl background-img-s" src="./../statics/img/background.png"/>
      <q-img class="lg background-img-s" src="./../statics/img/background.png"/>
      <q-img class="md" src="~assets/AVAVE.png" id="toolbar-logo" style="margin-left: -5%;"/>
      <q-img class="xl" src="~assets/AVAVE.png" id="toolbar-logo" style="margin-left: -5%;"/>
      <q-img class="lg" src="~assets/AVAVE.png" id="toolbar-logo" style="margin-left: -5%;"/>
      <q-toolbar-title></q-toolbar-title>
      <q-img class="xs" src="~assets/AVAVE.png" id="toolbar-logo"/>
      <q-img class="sm" src="~assets/AVAVE.png" id="toolbar-logo"/>
      <q-btn push no-caps flat id="logo-sim" icon="img:statics/rwc.svg">
        <q-popup-proxy>
          <q-banner class="q-pa-md" dense style="width: 430px;">
            <div class="q-pb-md">Reward Calculator</div>
            <div class="q-pa-md absolute-top-right">
              <q-badge outline size="xs" color="accent" :label="'Y ' + percentReward.toFixed(2) + '%'" />
            </div>
            <q-input
              label-color="orange"
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
              label-text-color="orange"
              label-color="white"
              color="orange"
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
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="orange"
          indicator-color="accent"
          align="justify"
          narrow-indicator
        >
          <q-tab name="blockchains" label="Blockchains" />
          <q-tab name="subnets" label="Subnets" />
        </q-tabs>

        <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="blockchains">
              <q-list v-for="(blockchain, i) in blockchains" v-bind:key="i">
                <q-item clickable v-close-popup @click="onSelectBlockchain(blockchain)">
                  <q-item-section>
                    <q-item-label>
                      <q-img src="statics/blockchain-black.svg" id="logo-xs"/>
                      {{ blockchain.name }}
                    </q-item-label>
                    <q-item-label caption>
                      <small>Subnet ID: </small>
                      <span class="text-orange">
                        {{ blockchain.subnetID.substr(0, 4)}}...{{ blockchain.subnetID.substr(30)}}
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="subnets">
              <q-list v-for="(subnet, i) in subnets" v-bind:key="i">
                <q-item clickable v-close-popup @click="onSelectSubnet(subnet)">
                  <q-item-section>
                    <q-item-label>
                      <q-img src="~assets/computer-network.svg" id="logo-xs"/>
                      {{ subnet.id.substr(0, 4)}}...{{ subnet.id.substr(30)}}
                    </q-item-label>
                    <q-item-label caption>
                      <small v-if="subnet.blockchainsId">Validated Blockchains: </small>
                      <div class="text-orange" v-for="(id, i) in subnet.blockchainsId" v-bind:key="i">
                        {{ blockchainName(id) }}
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-btn-dropdown>
        <q-btn-dropdown
          flat
          dropdown-icon="img:statics/node.svg"
          id="target-el"
        >
          <div class="no-wrap q-pa-md text-orange">Switch To Endpoint</div>
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
          <div
            style="cursor: pointer;"
            class="q-pl-md q-pb-xs"
            v-for="s in suggestions"
            v-bind:key="s"
            @click="customEndpoint = s; suggestions = [];"
          >
            <q-badge color="grey">
              <span class="q-pr-xs">{{ s }}</span>
              <q-icon @click="onRemoveFromMem(s, $event)" name="clear" color="white" />
            </q-badge>
          </div>
        </q-btn-dropdown>
        </q-toolbar>
    </q-header>
    <q-page-container style="z-index: 10;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

const {
  network
} = require('./../modules/config').default

import {
  _getNodeId
} from './../modules/network'

import {
  SET_NODE_ID,
  SET_ENDPOINT,
  GET_VALIDATORS,
  SET_CURRENT_SUBNET,
  SET_ENDPOINTS_MEMORY,
  GET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN,
  REMOVE_ENDPOINTS_MEMORY,
  GET_ASSETS_BY_BLOCKCHAINS
} from '../store/app/types'

export default {
  name: 'MainLayout',
  computed: {
    ...mapGetters([
      'ui',
      'subnets',
      'subnetID',
      'validators',
      'blockchains',
      'currentSubnet',
      'blockchainByID',
      'networkEndpoint',
      'endpointsMemory',
      'pendingValidators',
      'currentBlockchain'
    ])
  },
  data () {
    return {
      tab: 'blockchains',
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
    blockchainName (id) {
      if (!id) return
      const blockchain = this.blockchainByID(id)
      if (!blockchain) return

      return blockchain.name
    },
    onRemoveFromMem (endpoint, event) {
      event.stopImmediatePropagation()
      this.$store.commit(REMOVE_ENDPOINTS_MEMORY, { endpoint })
      this.takeSuggestion()
    },
    takeSuggestion () {
      this.suggestions = this.endpointsMemory
        .filter(a => a.includes(this.customEndpoint))
    },
    calculate () {
      this.stakeTime = Math.round(this.stakeTime)
      this.yearly = (this.stakeAmount * this.percentReward) / 100
      this.monthly = (this.stakeAmount * (this.percentReward / 12)) / 100
      this.weekly = (this.stakeAmount * (this.percentReward / 52)) / 100
    },
    async onSelectBlockchain (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
      await Promise.all([
        this.getAssets(),
        this.getValidators({
          subnetID: blockchain.subnetID,
          endpoint: this.networkEndpoint
        }),
        this.getPendingValidators({
          subnetID: blockchain.subnetID
        })
      ])
    },
    async onSelectSubnet (subnet) {
      this.$store.commit(SET_CURRENT_SUBNET, { subnet })
      await this.getValidators({
        subnetID: subnet.id,
        endpoint: this.networkEndpoint
      })
      this.getPendingValidators({
        subnetID: subnet.id
      })
    },
    async onSelectEndpoint (endpoint, isCustom) {
      try {
        const response = await _getNodeId({ endpoint })
        if (response.data.error) {
          const result = this.getValidators({
            subnetID: this.subnetID,
            endpoint
          })
          if (result) {
            this.$store.commit(SET_NODE_ID, { nodeID: '' })
            this.$store.commit(SET_ENDPOINT, { endpoint })
            if (isCustom) {
              this.$store.commit(SET_ENDPOINTS_MEMORY, { endpoint })
              this.customEndpoint = ''
            }
            this.onSuccess(endpoint)
          } else {
            this.onError(response.data.error.message)
          }
        }
        const nodeID = response.data.result.nodeID
        this.$store.commit(SET_ENDPOINT, { endpoint })
        this.$store.commit(SET_NODE_ID, { nodeID })
        if (isCustom) {
          this.$store.commit(SET_ENDPOINTS_MEMORY, { endpoint })
          this.customEndpoint = ''
        }
        this.getValidators({
          subnetID: this.subnetID,
          endpoint
        })
        this.onSuccess(endpoint)
      } catch (err) {
        this.onError(err.message)
      }
    },
    onSuccess (endpoint) {
      this.$q.notify({
        textColor: 'black',
        color: 'white',
        message: `Connected to ${endpoint}`,
        position: 'top',
        timeout: 2000,
        icon: 'done'
      })
    },
    onError (message) {
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
