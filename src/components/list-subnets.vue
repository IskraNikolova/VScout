<template>
  <div class="panel">
    <q-list v-for="(subnet, i) in subnets" v-bind:key="i">
      <q-item clickable v-close-popup @click="onSelectSubnet(subnet)" :dark="appTheme==='dark'">
      <q-item-section>
        <q-item-label class="text-panel">
        <img src="~assets/network.svg" id="logo-xs" style="opacity: 0.7;">
        {{ subnet.id.substr(0, 4)}}...{{ subnet.id.substr(30)}}
        </q-item-label>
        <q-item-label caption>
        <small v-if="subnet.blockchainsId">Validated Blockchains: </small>
        <div v-for="(id, i) in subnet.blockchainsId" v-bind:key="i">
          {{ blockchainName(id) }}
        </div>
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
  SET_CURRENT_SUBNET
} from './../store/memory/types'

export default {
  name: 'ListSubnets',
  computed: {
    ...mapGetters([
      'subnets',
      'subnetID',
      'appTheme',
      'blockchains',
      'blockchainByID',
      'networkEndpoint'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING
    }),
    blockchainName (id) {
      if (!id) return
      const blockchain = this.blockchainByID(id)
      if (!blockchain) return
      return blockchain.name
    },
    async onSelectSubnet (subnet) {
      this.$store.commit(SET_CURRENT_SUBNET, { subnet })
      if (this.subnetID === subnet.id) return
      this.$store.commit(SET_SUBNET_ID, { subnetID: subnet.id })
      await this.getValidators({
        subnetID: subnet.id,
        endpoint: this.networkEndpoint.url,
        isInit: false
      })
    }
  }
}
</script>
