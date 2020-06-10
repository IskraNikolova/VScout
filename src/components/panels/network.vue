<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pb-md"
    id="custom-card"
    style="padding-top: 3%;"
  >
    <div class="row">
      <blockchain v-if="isBlockchainView" class="col-md-3 col-xs-10" />
      <subnet-blockchains v-else class="col-md-2 col-xs-10"/>
      <div class="col-1 q-pt-md">
        <img src="~assets/network-nodes.svg" id="logo">
      </div>
      <subnet v-if="isBlockchainView" class="col-md-3 col-xs-10"/>
      <subnet-2 v-else class="col-md-3 col-xs-10" />
      <div v-if="isBlockchainView" class="col-1 q-pt-md">
        <img src="~assets/computer-network.svg" id="logo">
      </div>
      <div v-else class="col-2 q-pt-md">
        <img src="~assets/computer-network.svg" id="logo">
      </div>
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
import Subnet2 from './../items/subnet-2'
import SubnetBlockchains from './../items/subnet-blockchains'
import NodeConnection from './../items/node-connection'

export default {
  name: 'Network',
  components: {
    Subnet,
    Subnet2,
    Blockchain,
    NodeConnection,
    SubnetBlockchains
  },
  computed: {
    ...mapGetters([
      'currentBlockchain',
      'currentSubnet',
      'isBlockchainView'
    ])
  }
}
</script>
<style scoped>
  #custom-card {
    border-right: 2px solid #ffa959;
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
