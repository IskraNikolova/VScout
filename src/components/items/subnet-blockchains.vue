<template>
  <div>
    <div id="f-size12" class="q-pb-md text-medium">
      BLOCKCHAINS
    </div>
    <div class="row">
      <div class="col">
        <div class="q-pb-xs q-pt-xs" >
        <span
          v-if="currentSubnet.blockchainsId"
          class="text-h6 q-pb-md q-pt-xs text-orange"
        >
          {{ currentSubnet.blockchainsId.length }}
        </span>
        <span v-else class="text-h6 text-orange">None <br /></span>
        <small class="text-grey q-pt-xs">Validated by this subnet</small>
        </div>
      </div>
    </div>
    <div id="f-size12">
      <q-btn-dropdown
        color="grey"
        outline
        v-if="currentSubnet.blockchainsId"
        size="xs"
        no-caps
        label="Blockchains For Subnet"
      >
        <div class="q-pa-md">
        <small>Blockchains validated by this subnet</small>
        <q-separator />
        </div>
        <q-list v-for="id in currentSubnet.blockchainsId" v-bind:key="id">
          <q-item
            clickable
            v-close-popup
            @click="onSelectBlockchain(blockchain(id))"
          >
            <q-item-section>
              <q-item-label>
                <q-img src="statics/blockchain-black.svg" id="logo-xs"/>
                {{ blockchainName(id) }}
              </q-item-label>
              <q-item-label caption>
                <small>VM ID: </small>
                <span class="text-orange">
                  {{ vmID(id) }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  GET_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN
} from './../../store/app/types'

export default {
  name: 'SubnetBlockchains',
  computed: {
    ...mapGetters([
      'currentSubnet',
      'blockchainByID',
      'networkEndpoint'
    ]),
    vmID: function (id) {
      if (!this.blockchain(id)) return
      return `${this.blockchain(id).vmID.substr(0, 4)}...${this.blockchain(id).vmID.substr(30)}`
    },
    blockchain: function (id) {
      if (!id) return
      const chain = this.blockchainByID(id)
      if (!chain) return
      return chain
    },
    blockchainName: function (id) {
      if (!this.blockchain(id)) return
      return this.blockchain(id).name
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS
    }),
    onSelectBlockchain (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
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
