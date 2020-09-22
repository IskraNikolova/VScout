<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pb-md"
    id="custom-card"
  >
    <div class="row">
      <div v-if="isBlockchainView" class="col-md-4 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">
          BLOCKCHAIN
        </div>
        <div class="q-mb-md">
          <div class="q-pb-md q-pr-md ">
            <span class="text-h6 text-orange">{{ currentBlockchain.name }}</span>
            <span style="text-transform: uppercase; font-size: 85%;" :class="'q-ml-md text-' + getColor(currentBlockchain.status)">{{ currentBlockchain.status }}</span>
            <q-tooltip content-class="bg-white text-grey" content-style="font-size: 14px;border-style: solid;border-width: 0.1px;">{{ getStatusInfo(currentBlockchain.status) }}</q-tooltip>
          </div>
        </div>
        <div id="f-size12" v-if="isDefaultSubnetID(currentBlockchain.id)">
          <span class="text-medium">Height</span>
          <span class="text-grey">
            {{ height }}
          </span>
        </div>
        <div id="f-size12" style="max-width: 340px;">
          <span class="text-medium">Blockchain ID</span>
          <span class="text-grey" style="cursor:pointer;" @click="$router.push(`/search/${currentBlockchain.id}`)">
            {{ currentBlockchain.id }}
          </span>
        </div>
      </div>
      <subnet-blockchains v-else class="col-md-3 col-xs-10" />
      <div class="col-1 q-pt-md">
        <img src="~assets/blockchain-grey.svg" id="logo">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div v-if="isBlockchainView" class="col-md-3 col-xs-10">
        <div id="f-size12"  class="q-pb-md text-medium">
          SUBNET ID
        </div>
        <div class="q-pt-xs" style="cursor: pointer;" v-if="isDefaultSubnetID(currentBlockchain.subnetID)">
          Default Subnet
        </div>
        <div class="q-pb-md text-orange" style="font-size: 17px;cursor: pointer;max-width: 300px;" @click="$router.push(`/search/${currentBlockchain.subnetID}`)">
          <small>{{ currentBlockchain.subnetID }}</small>
        </div>
        <div id="f-size12">
          <span class="text-medium">VM ID</span>
          <div class="text-grey" style="max-width: 360px;cursor: pointer;" @click="goToDoc(currentBlockchain.vmDocumentation)">
            {{ currentBlockchain.vmID ?  currentBlockchain.vmID : currentBlockchain.vmName }}
          </div>
        </div>
      </div>
      <div v-else class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">SUBNETWORK (ID)</div>
        <div>
          <div class="q-pt-xs" style="cursor: pointer;" v-if="isDefaultSubnetID(currentSubnet.id)">
            Default Subnet
          </div>
          <div class="q-pb-md" style="cursor: pointer;" @click="$router.push(`/search/${currentSubnet.id}`)">
            <span class="text-orange">{{ currentSubnet.id }}</span>
          </div>
        </div>
      </div>
      <div v-if="isBlockchainView" class="col-1 q-pt-md">
        <img src="~assets/network.svg" id="logo2">
      </div>
      <div v-else class="col-2 q-pt-md q-mb-md">
        <img src="~assets/network.svg" id="logo2">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-2 col-xs-10">
        <div v-if="isBlockchainView">
          <div id="f-size12" class="q-pb-md text-medium">ASSETS</div>
            <div class="q-pb-md q-pr-md ">
              <span class="text-h6 text-orange">
                <animated-number
                  :value="assetsCount"
                  :formatValue="format"
                  :duration="3000"
                />
              </span><span> on X-Chain</span>
            </div>
          <div class="q-pt-xs">
            <q-btn-dropdown
              color="grey"
              outline
              size="xs"
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
          <div id="f-size12" class="q-pb-md text-medium">CONTROL KEYS</div>
          <div >
            <div class="col-4 q-mt-xs" id="f-size12">
              <span class="text-h6 text-orange"> {{ currentSubnet.threshold }}</span> Threshold
            </div>
            <q-btn-dropdown
              size="xs" no-caps
              label="Control Keys"
              outline
              color="grey"
            >
              <q-list v-for="key in currentSubnet.controlKeys" v-bind:key="key">
                <q-item>
                  <q-item-section side>
                    <q-icon size="xs" name="img:statics/key.svg" color="grey" />
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
      <div class="col-1 q-pt-md">
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
  Created: 'green',
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
    AssetInfoDialog: () => import('components/dialogs/asset-info-dialog')
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
      return statusInfo[status]
    },
    goToDoc (url) {
      openURL(url)
    },
    async onLoad (index, done) {
      if (this.items.length < 7) done()

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
    border-right: 2px solid #ff6000;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
</style>
