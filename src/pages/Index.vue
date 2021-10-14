<template>
  <q-page>
    <!--<div v-if="isNotify" class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded class="bg-info glossy text-white">
        <template v-slot:avatar>
        <q-icon name="info" size="lg"/>
        </template>
        Dear users, the currently displayed uptime might show discrepancies due to the latest VScout update. The issue should be resolved shortly as the node catches up. Thank you for your patience!

        <template v-slot:action>
          <q-btn flat label="Dismiss" @click="dismiss" />
        </template>
      </q-banner>
    </div>-->
    <error class="q-pr-sm" />
    <div class="row q-pt-sm q-pl-xs lt-lg">
      <div class="col-md-2 col-xs-12">
        <div class="q-pt-md q-pl-xl">
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
        </div>
      </div>
      <div class="col-md-3 col-xs-12">
        <div class="q-pb-md q-pt-md text-medium text-white label-title">PEERS</div>
          <div class="q-mr-lg" @click="$router.push('/peers/' + nodeID)">
            <MapChart
              style="z-index: 30;"
              :countryData="peersMap"
              highColor="#aa7dc9"
              defaultCountryFillColor="#ffffff"
              legendBoxShadowCss="0px 0px 15px #fff"
              :showLegend="true"
              :currencyAdd="false"
              :showEmptyValue="false"
            />
          </div>
      </div>
      <div class="col-md-3 col-xs-6">
        <node-version-chart
          v-bind:id="'barUp'"
          v-bind:height="20"
          v-bind:width="2"
          v-bind:minHeight="200"
          v-bind:maxHeight="250"
          v-bind:minWidth="200"
          v-bind:maxWidth="230"
        />
      </div>
      <div class="col-md-3 col-xs-6">
        <stake-by-version-chart
          v-bind:id="'pieUp'"
          v-bind:height="20"
          v-bind:width="7"
          v-bind:minHeight="200"
          v-bind:maxHeight="250"
          v-bind:minWidth="150"
          v-bind:maxWidth="200"
        />
      </div>
    </div>
    <div class="row q-pt-sm q-pr-sm">
      <div class="col-md-2 col-xs-12 gt-md">
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
          <div @click="$router.push('/peers/' + nodeID)">
            <MapChart
              style="z-index: 30;"
              :countryData="peersMap"
              highColor="#aa7dc9"
              defaultCountryFillColor="#ffffff"
              legendBoxShadowCss="0px 0px 15px #fff"
              :showLegend="true"
              :currencyAdd="false"
              :showEmptyValue="false"
            />
          </div>
        </div>
        <q-separator class="q-mt-md q-mb-sm" />
        <div class="q-pl-sm q-pb-sm q-pt-md text-medium text-white label-title">VERSION DISTRIBUTION</div>
        <div style="max-width: 300px!important;">
          <node-version-chart
            v-bind:id="'barDown'"
            v-bind:height="25"
            v-bind:width="2"
            v-bind:minHeight="170"
            v-bind:maxHeight="250"
            v-bind:minWidth="180"
            v-bind:maxWidth="210"
          />
        </div>
        <div style="max-width: 300px!important;">
          <stake-by-version-chart
            v-bind:id="'pieDown'"
            v-bind:height="25"
            v-bind:width="2"
            v-bind:minHeight="200"
            v-bind:maxHeight="250"
            v-bind:minWidth="160"
            v-bind:maxWidth="230"
          />
        </div>
      </div>
      <div class="col-md-12 col-xs-12 lt-lg">
        <node />
        <network />
        <wrap-market />
        <wrap-stake />
      </div>
      <div class="col-md-10 col-xs-12 gt-md">
        <node class="q-mt-xs q-pt-lg q-pb-lg" />
        <network class="q-mt-sm q-pt-lg q-pb-lg" />
        <wrap-market class="q-mt-sm q-pt-lg q-pb-lg" />
        <wrap-stake class="q-mt-sm q-pt-lg q-pb-lg" />
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
      <footer-logo />
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
    Node: () => import('components/panels/node.vue'),
    Faqs: () => import('components/panels/faqs.vue'),
    Error: () => import('components/panels/error.vue'),
    Network: () => import('components/panels/network.vue'),
    WrapStake: () => import('components/panels/wrap-stake.vue'),
    WrapMarket: () => import('components/panels/wrap-market.vue'),
    FooterLogo: () => import('components/panels/footer-logo.vue'),
    NodeVersionChart: () => import('components/node-version-chart.vue'),
    StakeByVersionChart: () => import('components/stake-by-version-chart.vue'),
    TableValidators: () => import('components/panels/table-validators.vue'),
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
      // isNotify: true
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
    // dismiss () {
    //   this.isNotify = false
    // }
  }
}
</script>

<style scoped>
 .label-title {
  font-size: max(0.7vw, 12px);
 }
  .label-title2 {
    font-size: max(0.55vw, 12px);
  }
</style>
