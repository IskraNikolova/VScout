<template>
  <q-page>
    <error class="q-pr-sm" />
    <div class="row q-pt-sm q-pr-sm">
      <div class="col-md-2 col-xs-12">
        <div class="q-pt-sm q-pl-sm">
          <div class="q-pb-md text-medium text-white label-title">NETWORK</div>
          <div style="text-transform: uppercase;font-size: max(1.1vw, 12px);" class="text-purple">
            {{ nodeInfo.networkName }}
          </div>
          <div class="q-pt-md label-title">
            <span class="text-medium text-white">Network ID</span>
            <span class="text-purple label-title">
              {{ nodeInfo.networkID }}
            </span>
          </div>
          <div>
            <span class="text-medium text-white label-title">Version</span>
            <span class="text-purple label-title">
              {{ nodeInfo.version ? nodeInfo.version : nodeInfo.nodeVersion }}
            </span>
          </div>
          <div class="q-pb-md q-pt-md text-medium text-white label-title">PEERS</div>
          <div @click="$router.push('/peers/' + nodeID)"><MapChart
            style="z-index: 30;"
            :countryData="peersMap"
            highColor="#aa7dc9"
            defaultCountryFillColor="#ffffff"
            legendBoxShadowCss="0px 0px 15px #fff"
            :showLegend="true"
            :currencyAdd="false"
            :showEmptyValue="false"
          /></div>
        </div>
        <q-separator class="q-mt-sm q-mb-sm" />
        <div class="q-pl-sm q-pb-sm q-pt-md text-medium text-white label-title">VERSION DISTRIBUTION</div>
        <div style="max-width: 250px!important;"><node-version-chart /></div>
      </div>
      <div class="col-md-10 col-xs-12">
        <node />
        <network />
        <wrap-market />
        <wrap-stake />
      </div>
    </div>
    <div class="q-pl-sm q-pr-sm">
      <table-validators
        v-if="ui.typeAccount.isValidators"
        @getDefaultValidators="getDefaultValidators"
      />
      <table-delegators v-else />
      <div class="flex flex-center q-mt-xl">
        <faqs id="faqs"/>
      </div>
      <div class="flex flex-center">
        <img src="~assets/vscout-logo-full.svg" id="logo">
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

import MapChart from 'vue-chart-map'

import {
  GET_STAKING
} from '../store/app/types'

const { network } = require('./../modules/config.js')
  .default

export default {
  name: 'PageIndex',
  components: {
    MapChart,
    NodeVersionChart: () => import('components/node-version-chart.vue'),
    Node: () => import('components/panels/node.vue'),
    Network: () => import('components/panels/network.vue'),
    WrapMarket: () => import('components/panels/wrap-market.vue'),
    WrapStake: () => import('components/panels/wrap-stake.vue'),
    Error: () => import('components/panels/error.vue'),
    TableValidators: () => import('components/panels/table-validators.vue'),
    Faqs: () => import('components/panels/faqs.vue'),
    TableDelegators: () => import('components/panels/table-delegators.vue')
  },
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'appTheme',
      'subnetID',
      'validators',
      'nodeInfo',
      'delegators',
      'peersMap',
      'networkEndpoint'
    ])
  },
  data () {
    return {
      price: null
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING
    }),
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
 .label-title {
  font-size: max(0.7vw, 12px);
 }
  .label-title2 {
    font-size: max(0.55vw, 12px);
  }
</style>
