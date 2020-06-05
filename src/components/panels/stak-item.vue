<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl q-pb-md" id="custom-card" >
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div style="font-size: 12px;" class="q-pb-md">NUMBERS OF VALIDATORS</div>
        <div class="text-h5 text-negative q-pb-md">{{ validators.length }}</div>
        <div style="font-size: 12px;">Pending Valitarors: <span class="text-accent">{{ pendingValidators.length }}</span></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/validators-grey.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
        <div style="font-size: 12px;" class="q-pb-md">STAKED AVA</div>
        <div class="text-h5 q-pb-md">
            <span class="text-negative"><small>{{stake().toLocaleString()}}</small> </span>
            <span style="font-size: 13px;">/360M</span>
        </div>
        <!--todo dynamic take it-->
        <div style="font-size: 12px;">Delinquent stake: <span class="text-accent">0%</span></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/stake_amount.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
       <div style="font-size: 12px;" class="q-pb-md">AVA VOLUME (24h)</div>
       <div class="text-h5 q-pb-md">
            <span class="text-negative"><small>{{ txsFor24H.transactionVolume.toLocaleString() }}</small></span>
            <span style="font-size: 13px;"> AVA</span>
        </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/ava_price.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
       <div style="font-size: 12px;" class="q-pb-md">PRICE</div>
       <div class="text-h5 text-negative q-pb-md"><small>$0.00<span style="font-size: 13px;"> /AVA</span></small></div>
       <div style="font-size: 12px;">Market Capitalization: <span class="text-accent">N/A</span></div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StakeItem',
  computed: {
    ...mapGetters([
      'validators',
      'pendingValidators',
      'txsFor24H'
    ])
  },
  methods: {
    stake () {
      return this.validators.reduce((a, b) => {
        if (!b.stakenAva) return
        return a + (parseFloat(b.stakenAva) / 10 ** 9)
      }, 0.0)
    }
  }
}
</script>

<style scoped>
 #custom-card {
   border-right: 2px solid grey;
 }
 .custom-icon {
   width:30vw;
   max-width:30px;
 }
</style>
