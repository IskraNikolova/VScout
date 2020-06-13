<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl q-pb-md" id="custom-card" >
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md">VALIDATORS</div>
        <div class="text-h5 text-orange q-pb-md">
          {{ validators.length }}
        </div>
        <div id="f-size12">Pending Valitarors: <span class="text-accent">{{ pendingValidators.length }}</span></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/validators-grey.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md">DELEGATORS</div>
        <div class="text-h5 text-orange q-pb-md">
          {{ delegators.length }}
        </div>
        <div id="f-size12">Pending Delegators: <span class="text-accent">{{ pendingDelegators.length }}</span></div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/manage.svg" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md">STAKED AVA</div>
        <div class="text-h5 q-pb-md">
            <span class="text-orange"><small>{{stake().toLocaleString()}}</small> </span>
            <span style="font-size: 13px;">/360M</span>
        </div>
        <!--todo dynamic take it
        <div id="f-size12">Delinquent stake: <span class="text-accent">0%</span></div>-->
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/stake_amount.png" class="custom-icon">
      </div>
      <div class="col-md-2 col-xs-10">
       <div id="f-size12" class="q-pb-md">AVA VOLUME (24h)</div>
       <div class="text-h5 q-pb-md">
            <span class="text-orange"><small>{{ txsFor24H.transactionVolume.toLocaleString() }}</small></span>
            <span style="font-size: 13px;"> AVA</span>
        </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/ava_price.png" class="custom-icon">
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
      'delegators',
      'pendingValidators',
      'pendingDelegators',
      'txsFor24H'
    ])
  },
  methods: {
    stake () {
      const stake = this.validators.reduce((a, b) => {
        if (!b.stakenAva) return
        return a + (parseFloat(b.stakenAva) / 10 ** 9)
      }, 0.0)
      if (!stake) return 0
      return stake
    }
  }
}
</script>

<style scoped>
 #custom-card {
   border-right: 2px solid grey;
   padding-top: 3%;
   padding-bottom: 3%;
 }
 .custom-icon {
   width:30vw;
   max-width:30px;
 }
</style>
