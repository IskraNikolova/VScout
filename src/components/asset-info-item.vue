<template>
    <q-dialog v-model="ui.assetInfo.isOpen" persistent>
      <q-card class="my-card">
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
          <div class="text-caption text-grey">
            - Denomination {{ ui.assetInfo.asset.denomination }}
            <br />
            - Alias {{ ui.assetInfo.asset.alias }}
            <br />
            -Asset ID {{ ui.assetInfo.asset.id }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="negative" @click="toUrl(ui.assetInfo.asset.id)" no-caps label="Asset Genesis" />
          <q-btn @click="close()" color="negative" flat icon="close" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { openURL } from 'quasar'

import { CLOSE_ASSET_INFO, OPEN_ASSET_INFO } from './../store/ui/types'

export default {
  name: 'AssetInfoItem',
  computed: {
    ...mapGetters([
      'ui'
    ])
  },
  methods: {
    ...mapActions({
      open: OPEN_ASSET_INFO,
      close: CLOSE_ASSET_INFO
    }),
    toUrl (url) {
      this.close()
      openURL('https://ava-explorer.herokuapp.com/tx/' + url)
    },
    getCurrentSupply (value, denomination) {
      let returnValue = Number(value)

      if (denomination > 0 && value > 0) {
        returnValue = value / 10 ** denomination
      }

      if (!returnValue) return

      return returnValue.toLocaleString()
    }
  }
}
</script>
