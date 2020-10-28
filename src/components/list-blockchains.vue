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
  GET_STAKING,
  SET_SUBNET_ID,
  GET_PENDING_STAKING
} from './../store/app/types'

import {
  SET_CURRENT_BLOCKCHAIN
} from './../store/memory/types'

export default {
  name: 'ListBlockchains',
  computed: {
    ...mapGetters([
      'subnetID',
      'validators',
      'blockchains',
      'networkEndpoint',
      'pendingValidators'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING,
      getPendingValidators: GET_PENDING_STAKING
    }),
    async onSelectBlockchain (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
      if (this.subnetID !== blockchain.subnetID) {
        this.$store.commit(SET_SUBNET_ID, { subnetID: blockchain.subnetID })
        await Promise.all([
          this.getValidators({
            subnetID: blockchain.subnetID,
            endpoint: this.networkEndpoint.url,
            isInit: false
          }),
          this.getPendingValidators({
            subnetID: blockchain.subnetID,
            endpoint: this.networkEndpoint.url
          })
        ])
      }
    }
  }
}
</script>
