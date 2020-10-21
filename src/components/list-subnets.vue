<template>
  <div>
    <q-list v-for="(subnet, i) in subnets" v-bind:key="i">
      <q-item clickable v-close-popup @click="onSelectSubnet(subnet)">
      <q-item-section>
        <q-item-label>
        <img src="~assets/network.svg" id="logo-xs">
        {{ subnet.id.substr(0, 4)}}...{{ subnet.id.substr(30)}}
        </q-item-label>
        <q-item-label caption>
        <small v-if="subnet.blockchainsId">Validated Blockchains: </small>
        <div class="text-orange" v-for="(id, i) in subnet.blockchainsId" v-bind:key="i">
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
  SET_SUBNET_ID,
  GET_PENDING_STAKING
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
      'validators',
      'blockchains',
      'blockchainByID',
      'networkEndpoint',
      'pendingValidators'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING,
      getPendingValidators: GET_PENDING_STAKING
    }),
    blockchainName (id) {
      if (!id) return
      const blockchain = this.blockchainByID(id)
      if (!blockchain) return
      return blockchain.name
    },
    async onSelectSubnet (subnet) {
      this.$store.commit(SET_CURRENT_SUBNET, { subnet })
      this.$store.commit(SET_SUBNET_ID, { subnetID: subnet.id })
      await Promise.all([
        this.getValidators({
          subnetID: subnet.id,
          endpoint: this.networkEndpoint.url,
          isInit: false
        }),
        this.getPendingValidators({
          subnetID: subnet.id,
          endpoint: this.networkEndpoint.url
        })
      ])
    }
  }
}
</script>
