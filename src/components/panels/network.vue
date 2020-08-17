<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pb-md"
    id="custom-card"
  >
    <div class="row">
      <blockchain v-if="isBlockchainView" class="col-md-3 col-xs-10" />
      <subnet-blockchains v-else class="col-md-2 col-xs-10"/>
      <div class="col-1 q-pt-md">
        <img src="~assets/network-nodes.svg" id="logo">
      </div>
      <q-separator class="q-mt-md q-mb-md xs sm md"/>
      <subnet v-if="isBlockchainView" class="col-md-3 col-xs-10"/>
      <subnetwork v-else class="col-md-3 col-xs-10" />
      <div v-if="isBlockchainView" class="col-1 q-pt-md">
        <img src="~assets/network-grey.svg" id="logo2">
      </div>
      <div v-else class="col-2 q-pt-md q-mb-md">
        <img src="~assets/network-grey.svg" id="logo2">
      </div>
      <q-separator class="q-mt-md q-mb-md xs sm md"/>
      <node-connection class="col-md-3 col-xs-10" />
      <div class="col-1 q-pt-md">
        <img src="~assets/connection.svg" id="logo2">
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import Subnet from './../items/subnet'
import Blockchain from './../items/blockchain'
import Subnetwork from './../items/subnetwork'
import NodeConnection from './../items/node-connection'
import SubnetBlockchains from './../items/subnet-blockchains'

export default {
  name: 'Network',
  components: {
    Subnet,
    Subnetwork,
    Blockchain,
    NodeConnection,
    SubnetBlockchains
  },
  computed: {
    ...mapGetters([
      'currentSubnet',
      'isBlockchainView',
      'currentBlockchain'
    ])
  }
}
</script>

<style scoped>
  #custom-card {
    border-right: 2px solid #ff6000;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
  #logo2 {
    width:40vw;
    max-width:40px;
  }
</style>
