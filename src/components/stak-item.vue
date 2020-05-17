<template>
  <q-card
    class="q-pa-md q-pl-xl"
    dark flat id="custom-card" >
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <!--<div style="font-size: 11px;" class="q-pb-md">STAKING APR</div>
        <div class="text-h5 text-secondary q-pb-md"><b>0%</b></div>
        <div style="font-size: 12px;"><span class="text-secondary">0%</span> staking APR</div>-->
        <div style="font-size: 11px;" class="q-pb-md">NUMBERS OF VALIDATORS</div>
        <div class="text-h5 text-secondary q-pb-md">{{ validators.length }}</div>
        <div style="font-size: 12px;">Pending Valitarors: <span class="text-secondary">{{ pendingValidators.length }}</span></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/validators.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
        <div style="font-size: 11px;" class="q-pb-md">STAKED AVA</div>
        <div class="text-h5 q-pb-md">
            <span class="text-secondary"><small>{{stake().toLocaleString()}}</small> </span>
            <span style="font-size: 13px;">/360M</span>
        </div>
        <!--todo dynamic take it-->
        <div style="font-size: 12px;">Delinquent stake: <span class="text-secondary">0%</span></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/stake-amount.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
       <div style="font-size: 11px;" class="q-pb-md">AVA VOLUME (24h)</div>
       <div class="text-h5 q-pb-md">
            <span class="text-secondary"><small>{{ txsFor24H.transactionVolume.toLocaleString() }}</small></span>
            <span style="font-size: 13px;"> AVA</span>
        </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/output-st-ava.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
       <div style="font-size: 11px;" class="q-pb-md">PRICE</div>
       <div class="text-h5 text-secondary q-pb-md"><small>$0.50<span style="font-size: 13px;"> /AVA</span></small></div>
       <div style="font-size: 12px;">Market Capitalization: <span class="text-secondary">N/A</span></div>
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
   border-right: 3px solid #FFAAF2;
   background: radial-gradient(circle, #344245 0%, #000709 70%);
   opacity:0.8;
 }
 .custom-icon {
   width:30vw;
   max-width:30px;
 }
</style>
