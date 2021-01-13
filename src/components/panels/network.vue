<template>
  <q-card
    class="q-mt-xs q-pt-md q-pr-xs q-ml-xs q-pl-xl q-pb-md panel2"
    id="custom-card"
    style="min-height: 160px;"
  >
    <div class="row">
      <div v-if="isBlockchainView" class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">
          BLOCKCHAIN
        </div>
        <div class="q-mb-md">
          <div class="q-pb-md q-pr-md ">
            <span class="text-panel text-title1">{{ currentBlockchain.name }}</span>
            <span style="text-transform: uppercase; font-size: 85%;" :class="'q-ml-md text-' + getColor(currentBlockchain.status)">{{ currentBlockchain.status }}</span>
            <tooltip-style v-bind:text="getStatusInfo(currentBlockchain.status)" />
          </div>
        </div>
        <div v-if="isDefaultSubnetID(currentBlockchain.id)">
          <span class="text-medium">Height</span>
          <span class="text-panel">
            {{ height }}
          </span>
        </div>
        <div>
          <span class="text-medium label-title">Blockchain ID</span>
          <span class="text-panel label-title" style="cursor:pointer;" @click="$router.push(`/blockchain/${currentBlockchain.id}`)">
            {{ currentBlockchain.id }}
          </span>
        </div>
      </div>
      <subnet-blockchains v-else class="col-md-3 col-xs-10" />
      <div class="col-md-1 q-pt-md icon">
        <img src="~assets/blockchain-grey.svg" id="logo">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div v-if="isBlockchainView" class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">
          SUBNET ID
        </div>
        <div class="q-pt-xs" style="cursor: pointer;font-size: max(0.73vw, 12px);" v-if="isDefaultSubnetID(currentBlockchain.subnetID)">
          Default Subnet
        </div>
        <div class="q-pb-md text-panel" style="cursor: pointer;font-size: max(0.73vw, 12px);" @click="$router.push(`/subnet/${currentBlockchain.subnetID}`)">
          <small>{{ currentBlockchain.subnetID }}</small>
        </div>
        <div>
          <span class="text-medium label-title">VM ID</span>
          <div class="text-panel label-title" style="cursor: pointer;" @click="goToDoc(currentBlockchain.vmDocumentation)">
            {{ currentBlockchain.vmID }} ({{ currentBlockchain.vmName }})
          </div>
        </div>
      </div>
      <div v-else class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">SUBNETWORK (ID)</div>
        <div>
          <div class="q-pt-xs label-title" style="cursor: pointer;" v-if="isDefaultSubnetID(currentSubnet.id)">
            Default Subnet
          </div>
          <div class="q-pb-md label-title" style="cursor: pointer;" @click="$router.push(`/subnet/${currentSubnet.id}`)">
            <span class="text-panel">{{ currentSubnet.id }}</span>
          </div>
        </div>
      </div>
      <div v-if="isBlockchainView" class="col-1 q-pt-md icon">
        <img src="~assets/network.svg" id="logo2">
      </div>
      <div v-else class="col-1 q-pt-md q-mb-md icon">
        <img src="~assets/network.svg" id="logo2">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div v-if="isBlockchainView">
          <!--<EVM-info v-bind:bcID="currentBlockchain.id" v-if="currentBlockchain.vmName === 'evm'"/>-->
          <div class="q-pb-md text-medium label-title">ASSETS</div>
            <div class="q-pb-md q-pr-md ">
              <span class="text-h6 text-panel">
                <animated-number
                  :value="assetsCount"
                  :formatValue="format"
                  :duration="3000"
                />
              </span><span> on X-Chain</span>
            </div>
          <div class="q-pt-xs">
            <q-btn-dropdown
              outline
              size="sm"
              no-caps
              label="Smart Digital Assets"
            >
              <div class="q-pa-md">
                <q-input v-model="search" label="Search..." @input="onSearch"/>
              </div>
              <q-item v-if="assetSearch" clickable v-close-popup @click="onOpenAssetInfo(assetSearch)">
                <q-item-section avatar>
                  <q-badge color="accent">{{ assetSearch.symbol }}</q-badge>
                </q-item-section>
                <q-item-section>{{ assetSearch.name }}</q-item-section>
              </q-item>
              <q-infinite-scroll @load="onLoad" :offset="250">
                <div v-for="(asset, index) in items" :key="index" class="caption">
                  <q-item clickable v-close-popup style="max-width: 200px;" @click="onOpenAssetInfo(asset)">
                    <q-item-section avatar>
                      <q-badge color="accent">{{ asset.symbol }}</q-badge>
                    </q-item-section>
                   <q-item-section>{{ asset.name }}</q-item-section>
                  </q-item>
                </div>
                <template v-slot:loading>
                  <div class="row justify-center q-my-md">
                    <q-spinner-dots color="primary" size="40px" />
                  </div>
                </template>
              </q-infinite-scroll>
            </q-btn-dropdown>
            <asset-info-dialog ref="assetDialog"/>
          </div>
        </div>
        <div v-else>
          <div class="q-pb-md text-medium label-title">CONTROL KEYS</div>
          <div >
            <div class="col-4 q-mt-xs" id="f-size12">
              <span class="text-panel label-title"> {{ currentSubnet.threshold }}</span> Threshold
            </div>
            <q-btn-dropdown
              size="xs" no-caps
              label="Control Keys"
              outline
            >
              <q-list v-for="key in currentSubnet.controlKeys" v-bind:key="key">
                <q-item>
                  <q-item-section side>
                    <q-icon size="xs" name="img:statics/key.svg" />
                  </q-item-section>
                  <q-item-section>
                    <span>{{ key }}</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/coins.svg" style=" width:40vw;max-width:40px;" v-if="isBlockchainView">
        <img src="~assets/key-digital.svg" style=" width:40vw;max-width:40px;" v-else>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import AnimatedNumber from 'animated-number-vue'

import {
  _getAssetById,
  _getAssetsWithOffset
} from './../../modules/network'

import {
  openURL
} from 'quasar'

const colors = {
  Validating: 'accent',
  Created: 'positive',
  Preferred: 'grey',
  Unknown: 'negative'
}

const statusInfo = {
  Validating: 'The blockchain is being validated by this node.',
  Created: 'The blockchain exists but isn’t being validated by this node.',
  Preferred: 'The blockchain was proposed to be created and is likely to be created but the transaction isn’t yet accepted.',
  Unknown: 'The blockchain either wasn’t proposed or the proposal to create it isn’t preferred. The proposal may be resubmitted.'
}
import SubnetBlockchains from './../items/subnet-blockchains'
export default {
  name: 'Network',
  components: {
    AnimatedNumber,
    SubnetBlockchains,
    // EVMInfo: () => import('components/evm-info.vue'), not work with new instance on EVM
    TooltipStyle: () => import('components/tooltip-style.vue'),
    AssetInfoDialog: () => import('components/dialogs/asset-info-dialog.vue')
  },
  data () {
    return {
      items: [],
      search: '',
      assetSearch: null
    }
  },
  async created () {
    if (!this.assetsCount) return
    const assets = await _getAssetsWithOffset(0)
    this.items = assets
  },
  computed: {
    ...mapGetters([
      'height',
      'assetsCount',
      'currentSubnet',
      'isBlockchainView',
      'currentBlockchain',
      'isDefaultSubnetID'
    ])
  },
  methods: {
    async onSearch () {
      const filter = this.search.toLowerCase()
      if (!filter) {
        const assets = await _getAssetsWithOffset(0)
        this.items = assets
        return
      }

      let result = this.filter(filter)
      if (result) return

      result = await _getAssetById(filter)
      if (!result || !this.search) {
        this.assetSearch = null
      }
      this.assetSearch = result
    },
    filter (filter) {
      const result = this.items.filter(
        a => a.name.toLowerCase().includes(filter) ||
        a.alias.toLowerCase().includes(filter) ||
        a.symbol.toLowerCase().includes(filter)
      )
      if (result.length > 0) {
        this.items = result
        return true
      }
      return false
    },
    format (value) {
      return `${Math.round(value)}`
    },
    onOpenAssetInfo (asset) {
      this.$refs.assetDialog.open({ asset })
    },
    getColor (status) {
      return colors[status]
    },
    getStatusInfo (status) {
      if (!statusInfo[status]) return ''
      return statusInfo[status]
    },
    goToDoc (url) {
      openURL(url)
    },
    async onLoad (index, done) {
      if (this.items.length < 99) done()

      const assets = await _getAssetsWithOffset(index * 100)
      const filter = this.search.toLowerCase()
      if (this.items) {
        this.items = this.items.concat(assets)
        if (filter) this.filter(filter)
        done()
      }
    }
  }
}
</script>

<style scoped>
  #custom-card {
    border-right: 2px solid #86b9b0;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
  .label-title {
    font-size: max(0.7vw, 12px);
   }
  .label-title2 {
    font-size: max(0.55vw, 12px);
  }
  .text-title1 {
    font-size: max(0.8vw, 16px);
  }
</style>
