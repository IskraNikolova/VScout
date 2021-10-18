<template>
    <q-dialog v-model="ui.assetInfo.isOpen" persistent>
      <q-card class="my-card panel">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ ui.assetInfo.asset.name }} ({{ ui.assetInfo.asset.symbol}})
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            $・Current Supply {{ getCurrentSupply(ui.assetInfo.asset.currentSupply, ui.assetInfo.asset.denomination) }} {{ ui.assetInfo.asset.symbol}}
          </div>
          <div class="text-caption ">
            <span class="text-grey">Denomination:</span> {{ ui.assetInfo.asset.denomination }}
            <br />
            <span class="text-grey">Alias:</span> {{ ui.assetInfo.asset.alias ?  ui.assetInfo.asset.alias : 'None'}}
            <br />
            <span class="text-grey">Asset ID:</span> {{ ui.assetInfo.asset.id }}
            <br />
            <span class="text-grey">Chain ID:</span> {{ ui.assetInfo.asset.chainID }}
          </div>
        </q-card-section>

        <q-separator :dark="appTheme==='dark'"/>

        <q-card-actions align="right">
          <q-btn
            flat
            @click="toUrl(ui.assetInfo.asset.id)"
            no-caps
            label="Asset Genesis"
          />
          <q-btn @click="close()" flat icon="close" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { openURL } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

import {
  OPEN_ASSET_INFO,
  CLOSE_ASSET_INFO
} from './../../store/ui/types'

export default {
  name: 'AssetInfoDialog',
  computed: {
    ...mapGetters([
      'ui',
      'appTheme'
    ])
  },
  methods: {
    ...mapActions({
      open: OPEN_ASSET_INFO,
      close: CLOSE_ASSET_INFO
    }),
    toUrl (url) {
      this.close()
      openURL('https://explorer.avax.network/tx/' + url)
    },
    getCurrentSupply (value, denomination) {
      let returnValue = Number(value)

      if (denomination > 0 && value > 0) {
        returnValue = value / 10 ** denomination
      }

      if (returnValue) return returnValue.toLocaleString()
      return 0
    }
  }
}
</script>
