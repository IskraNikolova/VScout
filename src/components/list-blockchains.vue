<template>
<div class="panel2">
  <q-list v-for="(blockchain, i) in blockchains" v-bind:key="i">
    <q-item clickable v-close-popup @click="onSelectBlockchain(blockchain)" :dark="appTheme==='dark'">
    <q-item-section>
      <q-item-label class="text-panel">
        <q-img src="~assets/blockchain-grey.svg" id="logo-xs" style="opacity: 0.7;"/>
          {{ blockchain.name }}
        </q-item-label>
        <q-item-label caption>
        <small>Subnet ID: </small>
        <span>
          {{ blockchain.subnetID.substr(0, 4)}}...{{ blockchain.subnetID.substr(30)}}
        </span>
      </q-item-label>
    </q-item-section>
    </q-item>
    <q-separator />
  </q-list>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  GET_STAKING,
  SET_SUBNET_ID
} from './../store/app/types'

import {
  SET_CURRENT_BLOCKCHAIN
} from './../store/memory/types'

export default {
  name: 'ListBlockchains',
  computed: {
    ...mapGetters([
      'subnetID',
      'appTheme',
      'blockchains',
      'networkEndpoint'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING
    }),
    async onSelectBlockchain (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
      if (this.subnetID !== blockchain.subnetID) {
        this.$store.commit(SET_SUBNET_ID, { subnetID: blockchain.subnetID })
        await this.getValidators({
          subnetID: blockchain.subnetID,
          endpoint: this.networkEndpoint.url,
          isInit: false
        })
      }
    }
  }
}
</script>
