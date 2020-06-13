<template>
  <q-btn-dropdown
    flat
    dropdown-icon="img:statics/blockchain-black.svg"
  >
    <q-tabs
     v-model="tab"
      dense
      class="text-grey"
      active-color="orange"
      indicator-color="accent"
      align="justify"
      narrow-indicator
    >
      <q-tab name="blockchains" label="Blockchains" />
      <q-tab name="subnets" label="Subnets" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="blockchains">
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
        </q-tab-panel>

        <q-tab-panel name="subnets">
        <q-list v-for="(subnet, i) in subnets" v-bind:key="i">
            <q-item clickable v-close-popup @click="onSelectSubnet(subnet)">
            <q-item-section>
                <q-item-label>
                <q-img src="~assets/network-grey.svg" id="logo-xs"/>
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
        </q-tab-panel>
    </q-tab-panels>
    </q-btn-dropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  GET_VALIDATORS,
  SET_CURRENT_SUBNET,
  GET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN,
  GET_ASSETS_BY_BLOCKCHAINS
} from '../../store/app/types'

export default {
  name: 'SelectNetworkDropDown',
  computed: {
    ...mapGetters([
      'subnets',
      'subnetID',
      'validators',
      'blockchains',
      'currentSubnet',
      'blockchainByID',
      'networkEndpoint',
      'pendingValidators',
      'currentBlockchain'
    ])
  },
  data () {
    return {
      tab: 'blockchains'
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getAssets: GET_ASSETS_BY_BLOCKCHAINS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    blockchainName (id) {
      if (!id) return
      const blockchain = this.blockchainByID(id)
      if (!blockchain) return

      return blockchain.name
    },
    async onSelectSubnet (subnet) {
      this.$store.commit(SET_CURRENT_SUBNET, { subnet })
      await this.getValidators({
        subnetID: subnet.id,
        endpoint: this.networkEndpoint
      })
      this.getPendingValidators({
        subnetID: subnet.id
      })
    },
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
