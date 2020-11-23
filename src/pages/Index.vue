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
        <div id="f-size12" class=" q-pl-sm q-pb-md q-pt-md text-medium text-white">STAKERS STATS</div>
        <div style="font-size: 11px;" class=" q-pl-md q-pb-xs q-pt-sm text-purple text-medium">NEW STAKING LAST 24H</div>
        <q-separator inset color="secondary" />
        <div class=" q-pl-md q-pb-xs q-pt-sm text-white"><span style="font-size: 10px;">VALIDATORS</span> <span class="text-purple"> {{ inData.incomingVal }}</span></div>
        <div class=" q-pl-md q-pb-sm q-pt-sm text-white"><span style="font-size: 10px;">DELEGATIONS</span> <span class="text-purple"> {{ inData.incomingDel }}</span></div>
        <div style="font-size: 11px;" class=" q-pl-md q-pb-xs q-pt-md text-purple text-medium">ENDING NEXT 24H</div>
        <q-separator inset color="secondary" />
        <div class=" q-pl-md q-pb-xs q-pt-sm text-white"><span style="font-size: 10px;">VALIDATORS</span> <span class="text-purple"> {{ inData.outcomingVal }}</span></div>
        <div class=" q-pl-md q-pb-xs q-pt-sm text-white"><span style="font-size: 10px;">DELEGATIONS</span> <span class="text-purple"> {{ inData.outcomingDel }}</span></div>
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
import MapChart from 'vue-chart-map'
import {
  GET_STAKING,
  GET_PENDING_STAKING
} from '../store/app/types'
const { network } = require('./../modules/config')
  .default
export default {
  name: 'PageIndex',
  components: {
    MapChart,
    Node: () => import('components/panels/node.vue'),
    Network: () => import('components/panels/network.vue'),
    MarketData: () => import('components/panels/market-data.vue'),
    Stake: () => import('components/panels/stake.vue'),
    Error: () => import('components/panels/error.vue'),
    TableValidators: () => import('components/panels/table-validators.vue'),
    Faqs: () => import('components/panels/faqs.vue'),
    TableDelegators: () => import('components/panels/table-delegators.vue')
  },
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'inData',
      'subnetID',
      'validators',
      'nodeInfo',
      'delegators',
      'peersMap',
      'networkEndpoint',
      'pendingValidators'
    ])
  },
  data () {
    return {
      price: null,
      startIndex: null
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING,
      getPendingValidators: GET_PENDING_STAKING
    }),
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
