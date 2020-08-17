<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl" id="custom-card" >
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">VALIDATORS</div>
        <div>
          <span class="text-h5 text-orange">{{ validators.length }}</span> <span id="f-size12"> active </span>  /  <span class="text-orange"> {{ pendingValidators.length }}</span> <span id="f-size12"> pending</span> </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/validators-grey.png" class="custom-icon">
      </div>
      <q-separator  class="q-mt-md q-mb-md xs sm md"/>
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">DELEGATIONS</div>
        <div>
          <span class="text-h5 text-orange">{{ delegators.length }}</span> <span id="f-size12"> active</span>  /  <span class="text-orange"> {{ pendingDelegators.length }}</span> <span id="f-size12"> pending</span> </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/manage.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md xs sm md"/>
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">TOTAL STAKE</div>
        <div class="text-h5 q-pb-md">
            <span class="text-orange">
              <small>{{ stakedAVA }}</small>
            </span>
            <span style="font-size: 13px;"> AVAX</span>
        </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/stake_amount.png" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md xs sm md"/>
      <div class="col-md-3 col-xs-10">
       <div id="f-size12" class="q-pb-md text-medium">VALIDATION / DELEGATED STAKE</div>
       <div class="text-h5 q-pb-md">
            <span class="text-orange">
             <small>{{ validatedStake }}</small>
            </span>
            /
            <span class="text-orange">
             <small>{{ delegatedStake }}</small>
            </span>
            <span style="font-size: 13px;"> AVAX</span>
        </div>
      </div>
      <!--<div class="col-1 q-pt-md">
        <img src="~assets/ava_price.png" class="custom-icon">
      </div>-->
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Stake',
  computed: {
    ...mapGetters([
      'stakedAVA',
      'delegatedStake',
      'validatedStake',
      'txsFor24H',
      'validators',
      'delegators',
      'pendingValidators',
      'pendingDelegators'
    ])
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
