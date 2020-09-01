<template>
  <q-card
    class="q-mt-md q-pt-md q-pl-xl q-pr-xl" id="custom-card" >
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">VALIDATORS</div>
        <div>
          <span class="text-h5 text-orange">
            <animated-number
              :value="validators.length"
              :formatValue="format"
              :duration="3000"
            />
          </span>
          <span id="f-size12"> active </span>  /  <span class="text-orange">
            <animated-number
              :value="pendingValidators.length"
              :formatValue="format"
              :duration="3000"
            />
          </span>
          <span id="f-size12"> pending</span> </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/validators.svg" class="custom-icon">
      </div>
      <q-separator  class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">DELEGATIONS</div>
        <div>
          <span class="text-h5 text-orange">
            <animated-number
              :value="delegators.length"
              :formatValue="format"
              :duration="3000"
            />
          </span> <span id="f-size12"> active</span>  /  <span class="text-orange">
            <animated-number
              :value="pendingDelegators.length"
              :formatValue="format"
              :duration="3000"
            />
          </span> <span id="f-size12"> pending</span> </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/manage.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-2 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">TOTAL STAKE</div>
        <div class="text-h5 q-pb-md">
            <span class="text-orange">
              <small>
                <animated-number
                  :value="stakedAVA"
                  :formatValue="formatToAvax"
                  :duration="3000"
                />
              </small>
            </span>
            <span style="font-size: 13px;"> AVAX</span>
        </div>
      </div>
      <div class="col-1 q-pt-md">
        <img src="~assets/stake-amount.svg" class="custom-icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
       <div id="f-size12" class="q-pb-md text-medium">VALIDATION / DELEGATED STAKE</div>
       <div class="text-h5 q-pb-md">
            <span class="text-orange">
             <small>
                <animated-number
                  :value="validatedStake"
                  :formatValue="formatToAvax"
                  :duration="3000"
                />
             </small>
            </span>
            /
            <span class="text-orange">
             <small>
               <animated-number
                  :value="delegatedStake"
                  :formatValue="formatToAvax"
                  :duration="3000"
                />
             </small>
            </span>
            <span style="font-size: 13px;"> AVAX</span>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import AnimatedNumber from 'animated-number-vue'

export default {
  name: 'Stake',
  components: {
    AnimatedNumber
  },
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
  },
  methods: {
    format (value) {
      return `${Math.round(value)}`
    },
    formatToAvax (value) {
      return `${value.toLocaleString()}`
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
