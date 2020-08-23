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
            @click="onSelectBlockchain(blockchainByID(id))"
          >
            <q-item-section>
              <q-item-label>
                <q-img src="statics/blockchain-black.svg" id="logo-xs"/>
                {{ blockchainByID(id).name }}
              </q-item-label>
              <q-item-label caption>
                <small>VM ID: </small>
                <span class="text-orange">
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
  GET_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN
} from './../../store/app/types'

export default {
  name: 'SubnetBlockchains',
  components: {
  },
  computed: {
    ...mapGetters([
      'currentSubnet',
      'blockchainByID',
      'networkEndpoint'
    ])
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
