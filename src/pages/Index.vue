<template>
  <q-page>
    <error class="q-pr-sm" />
    <div class="row q-pt-sm q-pr-sm">
      <div class="col-md-2 col-xs-12">
        <div class="q-pt-md q-pl-sm">
          <div id="f-size12" class="q-pb-md text-medium text-white">NETWORK</div>
          <div style="text-transform: uppercase;" class="text-h6 text-purple">
            {{ nodeInfo.networkName }}
          </div>
          <div class="q-pt-md" id="f-size12">
            <span class="text-medium text-white">Network ID</span>
            <span class="text-purple">
              {{ nodeInfo.networkID }}
            </span>
          </div>
          <div id="f-size12">
            <span class="text-medium text-white">Version</span>
            <span class="text-purple">
              {{ nodeInfo.version ? nodeInfo.version : nodeInfo.nodeVersion }}
            </span>
          </div>
          <div id="f-size12" class="q-pb-md q-pt-md text-medium text-white">PEERS</div>
          <div @click="$router.push('/peers/' + nodeID)"><MapChart
            style="z-index: 30;"
            :countryData="peersMap"
            highColor="#aa7dc9"
            defaultCountryFillColor="#ffffff"
            legendBoxShadowCss="0px 0px 15px #fff"
            :showLegend="true"
            :currencyAdd="false"
            :showEmptyValue="true"
          /></div>
        </div>
        <q-separator class="q-mt-sm q-pt-xs q-pb-xs" />
        <div id="f-size12" class="q-pl-sm q-pb-md q-pt-md text-medium text-white">
          <div class="row">
            <div class="col-6">STAKERS STATS</div>
            <div
              class="text-medium col-6"
              style="border: solid 0.5px;border-radius: 3px;max-width: 50px;font-size: 9px;color: #9c929c;padding-top: 1px;padding-bottom: 1px;"
              @mouseover="statOver=true"
              @mouseleave="statOver=false"
            >
              <div class="fit flex flex-center text-center non-selectable">
                <span>{{ statsMode }}</span>
                <q-icon v-if="statMenu" name="keyboard_arrow_up" />
                <q-icon v-else name="keyboard_arrow_down" />
              </div>
              <q-menu
                :dark="appTheme==='dark'"
                v-model="statMenu"
                transition-show="scale"
                transition-hide="scale"
              >
              <q-list
                @mouseover="listOver=true"
                @mouseleave="listOver=false"
              >
                <q-item class="panel" v-if="statsMode!=='24H'" clickable v-close-popup @click="statsMode='24H'">
                  <q-item-section>
                    <small class="text-panel">24H</small>
                  </q-item-section>
                </q-item>
                <q-separator color="panel"/>
                <q-item class="panel" v-if="statsMode!=='WEEK'" clickable v-close-popup @click="statsMode='WEEK'">
                  <q-item-section>
                    <small class="text-panel">WEEK</small>
                  </q-item-section>
                </q-item>
                <q-separator color="panel" />
                <q-item class="panel" v-if="statsMode!=='MONTH'" clickable v-close-popup @click="statsMode='MONTH'">
                  <q-item-section>
                    <small class="text-panel">MONTH</small>
                  </q-item-section>
                </q-item>
              </q-list>
              </q-menu>
            </div>
          </div>
        </div>
        <div style="font-size: 11px;" class=" q-pl-md q-pb-xs q-pt-sm text-purple text-medium">NEW STAKING LAST {{ statsMode }}</div>
        <q-separator inset color="secondary" />
        <div class=" q-pl-md q-pt-sm text-white"><span style="font-size: 10px;">VALIDATORS</span> <span class="text-purple"> {{ incomingValidators }}</span></div>
        <div class=" q-pl-md q-pt-sm text-white"><span style="font-size: 10px;">DELEGATIONS</span> <span class="text-purple"> {{ incomingDelegations }}</span></div>
        <div class=" q-pl-md q-pb-xs q-pt-sm text-white"><span style="font-size: 10px;">STAKE </span>
          <span class="text-purple">
            <animated-number
              :value="incomingStake"
              :formatValue="format"
              :duration="3000"
            />
            <span style="color: #9c929c;font-size: 12px;"><small> AVAX</small></span>
          </span>
        </div>
        <div style="font-size: 11px;" class=" q-pl-md q-pb-xs q-pt-md text-purple text-medium">ENDING NEXT {{ statsMode }}</div>
        <q-separator inset color="secondary" />
        <div class=" q-pl-md q-pt-sm text-white"><span style="font-size: 10px;">VALIDATORS</span> <span class="text-purple"> {{ outcomingValidators }}</span></div>
        <div class=" q-pl-md q-pt-sm text-white"><span style="font-size: 10px;">DELEGATIONS</span> <span class="text-purple"> {{ outcomingDelegations }}</span></div>
        <div class=" q-pl-md q-pt-sm text-white"><span style="font-size: 10px;">STAKE </span>
          <span class="text-purple">
            <animated-number
              :value="outcomingStake"
              :formatValue="format"
              :duration="3000"
            />
            <span style="color: #9c929c;font-size: 12px;"><small> AVAX</small></span>
          </span>
        </div>
      </div>
      <div class="col-md-10 col-xs-12">
        <node />
        <network />
        <market-data class="q-mb-sm q-mt-sm" />
        <stake />
      </div>
    </div>
    <div class="q-pl-sm q-pr-sm">
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
import { debounce } from 'quasar'
import MapChart from 'vue-chart-map'
import AnimatedNumber from 'animated-number-vue'

import {
  GET_STAKING,
  GET_PENDING_STAKING
} from '../store/app/types'

const { network } = require('./../modules/config.js')
  .default

import { getAvaFromnAva } from './../utils/avax.js'
import { round } from './../utils/commons.js'
export default {
  name: 'PageIndex',
  components: {
    MapChart,
    AnimatedNumber,
    Node: () => import('components/panels/node.vue'),
    Network: () => import('components/panels/network.vue'),
    MarketData: () => import('components/panels/market-data.vue'),
    Stake: () => import('components/panels/stake.vue'),
    Error: () => import('components/panels/error.vue'),
    TableValidators: () => import('components/panels/table-validators.vue'),
    Faqs: () => import('components/panels/faqs.vue'),
    TableDelegators: () => import('components/panels/table-delegators.vue')
  },
  watch: {
    statsMode: function (val) {
      this.refreshData(val)
    },
    inData: function () {
      this.refreshData(this.statsMode)
    },
    statOver (val) {
      setTimeout(() => {
        if (this.listOver) return
        this.debounceFunc(this.checkStatMenu())
      }, 50)
    },
    listOver () {
      this.debounceFunc(this.checkStatMenu())
    }
  },
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'inData',
      'appTheme',
      'subnetID',
      'validators',
      'nodeInfo',
      'delegators',
      'peersMap',
      'networkEndpoint',
      'pendingValidators'
    ]),
    incomingValidatorsHours: function () {
      if (!this.inData) return 0
      return this.inData.incomingValidatorsHours
    },
    outcomingValidatorsHours: function () {
      if (!this.inData) return 0
      return this.inData.outcomingValidatorsHours
    },
    incomingDelegationsHours: function () {
      if (!this.inData) return 0
      return this.inData.incomingDelegationsHours
    },
    outcomingDelegationsHours: function () {
      if (!this.inData) return 0
      return this.inData.outcomingDelegationsHours
    },
    incomingStakeHours: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.incomingStakeHours)
    },
    outcomingStakeHours: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.outcomingStakeHours)
    },
    incomingValidatorsDays: function () {
      if (!this.inData) return 0
      return this.inData.incomingValidatorsDays
    },
    outcomingValidatorsDays: function () {
      if (!this.inData) return 0
      return this.inData.outcomingValidatorsDays
    },
    incomingDelegationsDays: function () {
      if (!this.inData) return 0
      return this.inData.incomingDelegationsDays
    },
    outcomingDelegationsDays: function () {
      if (!this.inData) return 0
      return this.inData.outcomingDelegationsDays
    },
    incomingStakeDays: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.incomingStakeDays)
    },
    outcomingStakeDays: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.outcomingStakeDays)
    },
    incomingValidatorsMonth: function () {
      if (!this.inData) return 0
      return this.inData.incomingValidatorsMonth
    },
    outcomingValidatorsMonth: function () {
      if (!this.inData) return 0
      return this.inData.outcomingValidatorsMonth
    },
    incomingDelegationsMonth: function () {
      if (!this.inData) return 0
      return this.inData.incomingDelegationsMonth
    },
    outcomingDelegationsMonth: function () {
      if (!this.inData) return 0
      return this.inData.outcomingDelegationsMonth
    },
    incomingStakeMonth: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.incomingStakeMonth)
    },
    outcomingStakeMonth: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.outcomingStakeMonth)
    }
  },
  data () {
    return {
      price: null,
      statOver: false,
      statMenu: false,
      listOver: false,
      statsMode: '24H',
      startIndex: null,
      incomingValidators: 0,
      outcomingValidators: 0,
      incomingDelegations: 0,
      outcomingDelegations: 0,
      incomingStake: 0,
      outcomingStake: 0
    }
  },
  created () {
    this.refreshData(this.statsMode)
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING,
      getPendingValidators: GET_PENDING_STAKING
    }),
    debounceFunc: (fn) => debounce(function () { fn() }, 300),
    checkStatMenu () {
      if (this.statOver || this.listOver) {
        this.statMenu = true
      } else {
        this.statMenu = false
      }
    },
    refreshData (val) {
      if (val === '24H') {
        this.incomingValidators = this.incomingValidatorsHours
        this.outcomingValidators = this.outcomingValidatorsHours
        this.incomingDelegations = this.incomingDelegationsHours
        this.outcomingDelegations = this.outcomingDelegationsHours
        this.incomingStake = this.incomingStakeHours
        this.outcomingStake = this.outcomingStakeHours
      } else if (val === 'WEEK') {
        this.incomingValidators = this.incomingValidatorsDays
        this.outcomingValidators = this.outcomingValidatorsDays
        this.incomingDelegations = this.incomingDelegationsDays
        this.outcomingDelegations = this.outcomingDelegationsDays
        this.incomingStake = this.incomingStakeDays
        this.outcomingStake = this.outcomingStakeDays
      } else if (val === 'MONTH') {
        this.incomingValidators = this.incomingValidatorsMonth
        this.outcomingValidators = this.outcomingValidatorsMonth
        this.incomingDelegations = this.incomingDelegationsMonth
        this.outcomingDelegations = this.outcomingDelegationsMonth
        this.incomingStake = this.incomingStakeMonth
        this.outcomingStake = this.outcomingStakeMonth
      }
    },
    format (value) {
      if (!value) return
      return `${round(value, 100).toLocaleString()}`
    },
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
