<template>
  <div>
   <q-list v-for="(blockchain, i) in blockchains" v-bind:key="i">
    <q-item clickable v-close-popup @click="onSelectBlockchain(blockchain)">
    <q-item-section>
      <q-item-label>
        <q-img src="statics/blockchain-black.svg" id="logo-xs"/>
          {{ blockchain.name }}
        </q-item-label>
        <q-item-label caption>
        <small>Subnet ID: </small>
        <span class="text-orange">
          {{ blockchain.subnetID.substr(0, 4)}}...{{ blockchain.subnetID.substr(30)}}
        </span>
      </q-item-label>
    </q-item-section>
    </q-item>
   </q-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN,
  GET_ASSETS_BY_BLOCKCHAINS
} from './../store/app/types'

export default {
  name: 'ListBlockchains',
  computed: {
    ...mapGetters([
      'subnetID',
      'validators',
      'blockchains',
      'currentSubnet',
      'networkEndpoint',
      'pendingValidators',
      'currentBlockchain'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getAssets: GET_ASSETS_BY_BLOCKCHAINS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    async onSelectBlockchain (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
      await Promise.all([
        this.getAssets(),
        this.getValidators({
          subnetID: blockchain.subnetID,
          endpoint: this.networkEndpoint
        }),
        this.getPendingValidators({
          subnetID: blockchain.subnetID
        })
      ])
    }
  }
}
</script>
