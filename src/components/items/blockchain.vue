<template>
  <div>
    <div id="f-size12" class="q-pb-md text-medium">
      BLOCKCHAIN
    </div>
    <div class="row q-mb-md">
      <div class="text-h6 text-orange q-pb-md q-pr-md ">
        {{ currentBlockchain.name }}
      </div>
      <div class="q-pt-xs">
        <q-btn-dropdown
          color="accent"
          outline
          size="xs"
          no-caps
          v-if="assets(currentBlockchain.id)"
          label="Smart Digital Assets"
        >
          <div class="q-pa-md">
            <small>
              <img src="~assets/coins.svg" id="small-logo">
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
    <div id="f-size12">
      <span class="text-medium">Blockchain ID</span>
      <div class="text-grey">
        {{ currentBlockchain.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import AssetInfoDialog from './../dialogs/asset-info-dialog'

export default {
  name: 'Blockchain',
  components: {
    AssetInfoDialog
  },
  computed: {
    ...mapGetters([
      'assets',
      'currentBlockchain'
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
  #small-logo {
    width:15vw;
    max-width:15px;
  }
</style>
