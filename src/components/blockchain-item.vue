<template>
  <q-card
    class="q-mt-md q-pa-md q-pl-xl q-pr-xl dark-background"
    dark
    flat
    id="custom-card">
    <div class="row">
      <div class="col-md-4 col-xs-10">
        <div id="f-size11" class="q-pb-md">BLOKCHAIN</div>
        <div class="text-h5 text-negative q-pb-md">{{ currentBlockchain.name }}</div>
        <div id="f-size12">Blockchain ID <span class="text-negative">{{ currentBlockchain.id }}</span></div>
      </div>
      <div class="col-2 q-pt-md">
        <img src="~assets/blockchain.svg" id="logo">
      </div>
      <div class="col-md-4 col-xs-10">
        <div id="f-size11" class="q-pb-md">SUBNET ID</div>
        <div class="text-h6 q-pb-md text-negative" v-if="currentBlockchain.subnetID === '11111111111111111111111111111111LpoYY'">
          Default Subnet
        </div>
        <div class="text-negative" style="font-size: 18px;letter-spacing: -2px;margin-bottom: 20px;" v-else>{{ currentBlockchain.subnetID }}</div>
        <div id="f-size12">VM ID <div class="text-negative">{{ currentBlockchain.vmID }}</div></div>
      </div>
      <div class="col-2 q-pt-md">
        <img src="~assets/network.svg" id="logo">
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BlockchainItem',
  computed: {
    ...mapGetters([
      'currentBlockchain'
    ])
  }
}
</script>
<style scoped>
  #custom-card {
    border-right: 3px solid #ffa959;
  }
  #f-size12 {
    font-size: 83%;
  }
  #f-size11 {
    font-size: 82%;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
</style>
