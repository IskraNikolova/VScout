<template>
  <q-card
    class="q-mt-md q-pa-md q-pl-xl q-pr-xl"
    dark
    flat
    id="custom-card">
    <div class="row">
      <div class="col-md-4 col-xs-10">
        <div id="f-size11" class="q-pb-md">BLOKCHAIN</div>
        <div class="text-h7 text-negative q-pb-md"><b>X-CHAIN</b></div>
        <div id="f-size12">Blockchain ID <span class="text-negative">4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM</span></div>
      </div>
      <div class="col-2 q-pt-md">
        <img src="~assets/blockchain.svg" id="logo">
      </div>
      <div class="col-md-4 col-xs-10">
        <div id="f-size11" class="q-pb-md">SUBNET ID</div>
        <div id="f-size13" class="text-negative q-pb-md"><b>11111111111111111111111111111111LpoYY</b></div>
        <div id="f-size12">VM ID <span class="text-negative">jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq</span></div>
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
  name: 'BlockItem',
  computed: {
    ...mapGetters([
      'lastBlock',
      'blockTime'
    ])
  }
}
</script>
<style scoped>
  #custom-card {
    border-right: 3px solid #FFA146;
    background: radial-gradient(circle, #344245 0%, #000709 70%);
    opacity:0.9;
  }
  #f-size12 {
    font-size: 12px;
  }
  #f-size11 {
    font-size: 11px;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
</style>
