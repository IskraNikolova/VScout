<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pb-md"
    id="custom-card"
  >
    <div class="row">
      <div v-if="isBlockchainView">
        <div id="f-size12" class="q-pb-md text-medium">
          BLOCKCHAIN
        </div>
        <div class="q-mb-md">
          <div class="text-h6 text-orange q-pb-md q-pr-md ">
            {{ currentBlockchain.name }}
          </div>
        </div>
        <div id="f-size12">
          <span class="text-medium">Blockchain ID</span>
          <div class="text-grey">
            {{ currentBlockchain.id }}
          </div>
        </div>
      </div>
      <subnet-blockchains v-else class="col-md-2 col-xs-10"/>
      <div class="col-1 q-pt-md">
        <img src="~assets/blockchain-grey.svg" id="logo">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div v-if="isBlockchainView">
        <div id="f-size12"  class="q-pb-md text-medium">
          SUBNET ID
        </div>
        <div class="q-pt-xs" style="cursor: pointer;" v-if="isDefaultBSubnetID">
          Default Subnet
        </div>
        <div class="q-pb-md text-orange" style="font-size: 19px;cursor: pointer;" @click="$router.push(`/search/${currentBlockchain.subnetID}`)">
          <small>{{ currentBlockchain.subnetID }}</small>
        </div>
        <div id="f-size12">
          <span class="text-medium">VM ID</span>
          <div class="text-grey">
            {{ currentBlockchain.vmID }}
          </div>
        </div>
      </div>
      <div v-else class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">SUBNETWORK</div>
        <div>
          <div class="q-pt-xs" style="cursor: pointer;" v-if="isDefaultSubnetID">
            Default Subnet
          </div>
          <div class="q-pb-md text-orange" style="font-size: 19px;cursor: pointer;" @click="$router.push(`/search/${currentSubnet.id}`)">
            <small>{{ currentSubnet.id }}</small>
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
          <div class="q-mb-md" v-if="this.assetsLength">
            <div class="q-pb-md q-pr-md ">
              <span class="text-h6 text-orange">{{ assetsLength }}</span><span> on {{ currentBlockchain.name }}</span>
            </div>
          </div>
          <div v-else class="q-mb-md">
            <div class="q-pb-md q-pr-md ">
              <span class="text-h6 text-orange">None</span>
            </div>
          </div>
          <div class="q-pt-xs">
            <q-btn-dropdown
              color="grey"
              outline
              size="xs"
              no-caps
              label="Smart Digital Assets"
            >
              <div class="q-pa-md" v-if="assets(currentBlockchain.id)">
                <small>
                  Assets on {{ currentBlockchain.name }}
                </small>
                <q-separator />
              </div>
              <q-list
                v-for="asset in assets(currentBlockchain.id)"
                v-bind:key="asset.id"
              >
                <q-item clickable v-close-popup @click="onOpenAssetInfo(asset)">
                  <q-item-section><span>{{ asset.symbol }}</span></q-item-section>
                  <q-item-section side>
                  <q-icon size="xs" name="info" color="grey" />
                  </q-item-section>
                </q-item>
              </q-list>
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

export default {
  name: 'Network',
  components: {
    SubnetBlockchains: () => import('components/items/subnet-blockchains'),
    AssetInfoDialog: () => import('components/dialogs/asset-info-dialog')
  },
  computed: {
    ...mapGetters([
      'assets',
      'currentSubnet',
      'blockchainByID',
      'isBlockchainView',
      'currentBlockchain',
      'isDefaultSubnetID',
      'isDefaultBSubnetID'
    ]),
    assetsLength: function () {
      if (!this.assets(this.currentBlockchain.id)) return
      return this.assets(this.currentBlockchain.id).length
    }
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
    border-right: 2px solid #ff6000;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
</style>
