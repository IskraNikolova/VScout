<template>
  <q-card
    class="q-mt-md q-pt-md q-pb-md q-pl-xl"
    id="custom-card">
    <div class="row">
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md">BLOCKCHAIN</div>
        <div class="row">
          <div class="text-h6 text-orange q-pb-md">{{ currentBlockchain.name }}</div>
          <div class="q-pl-md q-pt-xs">
            <q-btn-dropdown outline v-if="assets(currentBlockchain.id)" size="xs" no-caps label="Smart Digital Assets">
                <div class="q-pa-md">
                  <small><img src="~assets/coins.svg" id="small-logo">Assets on {{ currentBlockchain.name }}</small>
                  <q-separator />
                </div>
                <q-list v-for="asset in assets(currentBlockchain.id)" v-bind:key="asset.id">
                  <q-item clickable v-close-popup @click="onOpenAssetInfo(asset)">
                    <q-item-section><span>{{ asset.symbol }}</span></q-item-section>
                    <q-item-section side>
                      <q-icon size="xs" name="info" color="grey" />
                    </q-item-section>
                  </q-item>
                </q-list>
            </q-btn-dropdown>
            <div v-else class="text-h6 q-pb-md text-orange" >
              None
            </div>
            <asset-info-item ref="assetDialog"/>
          </div>
          </div>
        <div id="f-size12">Blockchain ID <div class="text-grey">{{ currentBlockchain.id }}</div></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/network-nodes.svg" id="logo">
      </div>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md">SUBNET ID</div>
        <div class="text-h6 q-pb-md text-orange" v-if="currentBlockchain.subnetID === '11111111111111111111111111111111LpoYY'">
          Default Subnet
        </div>
        <div v-else class="text-orange subId">{{ currentBlockchain.subnetID }}</div>
        <div id="f-size12">VM ID <div class="text-grey">{{ currentBlockchain.vmID }}</div></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/computer-network.svg" id="logo">
      </div>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md">NETWORK</div>
        <small>Connected with</small>
        <div class="text-h7 q-pb-md text-orange" >
          {{ networkEndpoint }}
        </div>
        <div id="f-size12">Node ID <div class="text-grey">{{ nodeID }}</div></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/connection.svg" id="logo2">
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import AssetInfoItem from './../asset-info-item'

export default {
  name: 'BlockchainItem',
  components: {
    AssetInfoItem
  },
  computed: {
    ...mapGetters([
      'currentBlockchain',
      'networkEndpoint',
      'assets',
      'nodeID'
    ])
  },
  methods: {
    onOpenAssetInfo (asset) {
      this.$refs.assetDialog.open({ asset })
    }
  }
}
</script>
<style scoped>
  #custom-card {
    border-right: 2px solid #ffa959;
  }
  #f-size11 {
    font-size: 82%;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
  #logo2 {
    width:40vw;
    max-width:40px;
  }
  #small-logo {
    width:15vw;
    max-width:15px;
  }
</style>
