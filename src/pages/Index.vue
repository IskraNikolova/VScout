<template>
  <q-page
    class="q-pr-xl q-pl-xl"
    style="background-color: white;"
  >
  <!--<div class="col-md-2 col-xs-8">
    <q-btn push no-caps flat id="logo-sim" icon="img:statics/rwc.svg">
      <q-popup-proxy>
        <q-banner class="q-pa-md" dense style="width: 430px;">
          <div class="q-pb-md">Reward Calculator</div>
          <div class="q-pa-md absolute-top-right"><q-badge outline size="xs" color="accent" :label="percentReward.toFixed(2) + '%'" /></div>
          <q-input
            label-color="negative"
            outlined
            v-model="stakeAmount"
            label="Staking Amount"
            mask="#"
            input-class="text-right"
            suffix="$AVA"
            precision= '2'
            reverse-fill-mask
            color="accent"
            @input="calculate"
            class="q-pb-xl"
            :rules="[value => value >= 2000 || 'Stake Amount must be greater or equal to 2000 $AVA']"
          />
          <q-slider
            class="q-ml-xs q-mr-xs"
            v-model="stakeTime"
            :min="2"
            :max="52"
            :step="1"
            :label-value="'Staking Time ' + stakeTime + ' weeks'"
            label-always
            @input="calculate"
            label-text-color="negative"
            label-color="white"
            color="negative"
          />
          <div class="row">
            <div class="col q-pl-xs q-mr-xs"><small>Weekly Earning  </small> <span class="text-accent">{{ (result / 52).toFixed(2) }}</span> $AVA&nbsp;</div>
            <div class="col q-pl-xl"><small>Yearly Earning </small> <span class="text-accent">{{ result.toFixed(2) }}</span> $AVA </div>
          </div>
        </q-banner>
      </q-popup-proxy>
    </q-btn>
  </div>-->
    <network class="q-pr-md"/>
    <transactions class="q-pa-md" />
    <stake class="q-pr-md"/>
    <table-validators
      v-if="ui.typeAccount.isValidators"
      @getValidators="getValidatorsV"
    />
    <table-delegators
      v-else
      @getDelegators="getValidatorsV"
    />
    <faqs class="q-pr-md" />

    <div class="flex flex-center q-mt-xl">
      <img src="~assets/ava-black.png" id="logo"/>
    </div>
    <div class="flex flex-center q-mt-xl">
      Made with ❤️ for builders everywhere.
    </div>
  </q-page>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import Faqs from './../components/panels/faqs'
import Stake from './../components/panels/stake'
import Network from './../components/panels/network'
import Transactions from './../components/panels/transactions'
import TableValidators from './../components/panels/table-validators'
import TableDelegators from './../components/panels/table-delegators'

import {
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS
} from '../store/app/types'

export default {
  name: 'PageIndex',
  components: {
    Faqs,
    Stake,
    Network,
    Transactions,
    TableValidators,
    TableDelegators
  },
  computed: {
    ...mapGetters([
      'ui',
      'subnetID',
      'validators',
      'delegators',
      'networkEndpoint',
      'pendingValidators'
    ])
  },
  // data () {
  //   return {
  //     stakeAmount: 2000,
  //     stakeTime: 2,
  //     result: 0.00,
  //     percentReward: 4
  //   }
  // },
  // created () {
  //   this.calculate()
  // },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    async getValidatorsV (type) {
      const temp = {
        active: async () => await this.getValidators({
          subnetID: this.subnetID,
          endpoint: this.networkEndpoint
        }),
        pending: async () => await this.getPendingValidators({
          subnetID: this.subnetID
        })
      }

      if (typeof type !== 'undefined') await temp[type]()
    }
    // calculate () {
    //   this.stakeTime = Math.round(this.stakeTime)
    //   const basePercY = 4
    //   if (this.stakeTime > 2) {
    //     //  additional percent reward; calculate 11.11%  bonus devide 52 weeks
    //     const bonusPercentPerWeek = 0.2136538461538462
    //     this.percentReward = (this.stakeTime * bonusPercentPerWeek) + basePercY
    //     this.result = (this.stakeAmount * this.percentReward) / 100
    //   } else {
    //     this.percentReward = basePercY
    //     this.result = (this.stakeAmount * basePercY) / 100
    //   }
    // }
  }
}
</script>

<style scoped>
 #logo {
  width: 70vw;
  max-width: 70px;
 }
</style>
