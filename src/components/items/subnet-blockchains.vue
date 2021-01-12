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
          class="q-pb-md q-pt-xs text-panel text-title1"
        >
          {{ currentSubnet.blockchainsId.length }}
        </span>
        <span v-else class="text-panel text-title1">None <br /></span>
        <small class="q-pt-xs">Validated by this subnet</small>
        </div>
      </div>
    </div>
    <div id="f-size12">
      <q-btn-dropdown
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
            @click="onSelectBlockchain(blockchainByID(id))"
          >
            <q-item-section>
              <q-item-label>
                <q-img src="statics/blockchain-black.svg" id="logo-xs"/>
                {{ blockchainByID(id).name }}
              </q-item-label>
              <q-item-label caption>
                <small>VM ID: </small>
                <span>
                  {{ blockchainByID(id).vmID.substr(0, 4)}}...{{blockchainByID(id).vmID.substr(30)}}
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
  GET_STAKING
} from './../../store/app/types'

import {
  SET_CURRENT_BLOCKCHAIN
} from './../../store/memory/types'

export default {
  name: 'SubnetBlockchains',
  computed: {
    ...mapGetters([
      'currentSubnet',
      'blockchainByID'
    ]),
    vmID: function (id) {
      if (!id) return
      const blockchain = this.blockchainByID(id)
      if (!blockchain) return
      return `${blockchain.vmID.substr(0, 4)}...${blockchain.vmID.substr(30)}`
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_STAKING
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
  .text-title1 {
    font-size: max(0.8vw, 16px);
  }
</style>
