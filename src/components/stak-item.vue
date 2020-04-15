<template>
  <q-card
    class="q-mt-md q-pa-md q-pl-xl"
    dark flat id="custom-card" >
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div style="font-size: 11px;" class="q-pb-md">STAKING APR</div>
        <div class="text-h5 text-secondary q-pb-md"><b>0%</b></div>
        <div style="font-size: 12px;"><span class="text-secondary">0%</span> staking APR</div>
      </div>
      <div class="col-2 q-pt-md">
        <img src="~assets/stake.svg" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
        <div style="font-size: 11px;" class="q-pb-md">STAKED AVA</div>
        <div class="text-h5 q-pb-md">
          <b>
            <span class="text-secondary"><small>100K</small> </span>
            <span style="font-size: 13px;">/360M</span>
          </b>
        </div>
        <!--todo dynamic take it-->
        <div style="font-size: 12px;">Delinquent stake: 0%</div>
      </div>
      <div class="col-2 q-pt-md"><img src="~assets/coins-stack.svg" class="custom-icon"></div>
      <div class="col-md-2 col-xs-10">
       <div style="font-size: 11px;" class="q-pb-md">PRICE</div>
       <div class="text-h5 text-secondary q-pb-md"><b>$0.50<span style="font-size: 13px;"> /AVA</span></b></div>
       <div style="font-size: 12px;">Market Capitalization: <span class="text-secondary">N/A</span></div>
      </div>
      <div class="col-2 q-pt-md">
        <img src="~assets/dollar.svg" class="custom-icon">
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
      'validators'
    ])
  },
  methods: {
    stake () {
      return this.validators.reduce((a, b) => {
        return a + (Number(b.stakeAmount) / 10 ** 9)
      }, 0)
    }
  }
}
</script>

<style scoped>
 #custom-card {
   border-right: 2px solid #FFAAF2;
   background: radial-gradient(circle, #344245 0%, #000709 70%);
   opacity:0.9;
 }
 .custom-icon {
   width:30vw;
   max-width:30px;
 }
</style>
