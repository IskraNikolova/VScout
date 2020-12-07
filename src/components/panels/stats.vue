<template>
  <div class="row">
    <div class="col-md-3 col-xs-10">
    <div id="f-size12" class="q-pb-md text-medium">STAKERS STATS</div>
        <div class="text-h6">
        <div
          class="text-medium q-mt-xs"
          style="border: solid 0.5px;border-radius: 3px;max-width: 60px;font-size: 13.9px;color: #9c929c;"
          @mouseover="statOver=true"
          @mouseleave="statOver=false"
        >
        <div class="fit flex flex-center text-center non-selectable">
            <span>{{ statsMode }}</span>
            <q-icon v-if="statMenu" name="keyboard_arrow_up" />
            <q-icon v-else name="keyboard_arrow_down" />
        </div>
        <q-menu
            :dark="appTheme==='dark'"
            v-model="statMenu"
            transition-show="scale"
            transition-hide="scale"
        >
        <q-list
            @mouseover="listOver=true"
            @mouseleave="listOver=false"
        >
            <q-item class="panel" v-if="statsMode!=='24H'" clickable v-close-popup @click="statsMode='24H'">
            <q-item-section>
                <small class="text-panel">24H</small>
            </q-item-section>
            </q-item>
            <q-separator color="panel"/>
            <q-item class="panel" v-if="statsMode!=='WEEK'" clickable v-close-popup @click="statsMode='WEEK'">
            <q-item-section>
                <small class="text-panel">WEEK</small>
            </q-item-section>
            </q-item>
            <q-separator color="panel" />
            <q-item class="panel" v-if="statsMode!=='MONTH'" clickable v-close-popup @click="statsMode='MONTH'">
            <q-item-section>
                <small class="text-panel">MONTH</small>
            </q-item-section>
            </q-item>
        </q-list>
        </q-menu>
        </div>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">NEW STAKING LAST {{ statsMode }}</div>
        <div>
          <span class="text-h6">
            <span class="text-panel"><small>{{ incomingValidators }}</small></span><span style="font-size: 10px;"><small> VALIDATORS</small></span> /
             <span class="text-panel"><small>{{ incomingDelegations }}</small></span><span style="font-size: 10px;"><small> DELEGATIONS</small></span>
          </span>
        </div>
        <div>
          <span style="font-size: 10px;">STAKE </span>
          <animated-number
            class="text-purple"
            :value="incomingStake"
            :formatValue="format"
            :duration="3000"
          />
          <span style="font-size: 12px;"><small> AVAX</small></span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div id="f-size12" class="q-pb-md text-medium">ENDING NEXT {{ statsMode }}</div>
        <div>
          <span class="text-h6">
            <span class="text-panel"><small>{{ outcomingValidators }}</small></span><span style="font-size: 10px;"><small> VALIDATORS</small></span> /
             <span class="text-panel"><small>{{ outcomingDelegations }}</small></span><span style="font-size: 10px;"><small> DELEGATIONS</small></span>
          </span>
        </div>
        <div>
          <span style="font-size: 10px;">STAKE </span>
          <animated-number
            class="text-purple"
            :value="outcomingStake"
            :formatValue="format"
            :duration="3000"
          />
          <span style="font-size: 12px;"><small> AVAX</small></span>
        </div>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { debounce } from 'quasar'
// const BigNumber = require('bignumber.js')

import AnimatedNumber from 'animated-number-vue'

import {
  getAvaFromnAva
} from './../../utils/avax.js'

import {
  round
} from './../../utils/commons.js'

export default {
  name: 'Stats',
  components: {
    AnimatedNumber
  },
  created () {
    this.refreshData(this.statsMode)
  },
  computed: {
    ...mapGetters([
      'currentSupply',
      'stakedAVAX',
      'appTheme',
      'inData'
    ]),
    incomingValidatorsHours: function () {
      if (!this.inData) return 0
      return this.inData.incomingValidatorsHours
    },
    outcomingValidatorsHours: function () {
      if (!this.inData) return 0
      return this.inData.outcomingValidatorsHours
    },
    incomingDelegationsHours: function () {
      if (!this.inData) return 0
      return this.inData.incomingDelegationsHours
    },
    outcomingDelegationsHours: function () {
      if (!this.inData) return 0
      return this.inData.outcomingDelegationsHours
    },
    incomingStakeHours: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.incomingStakeHours)
    },
    outcomingStakeHours: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.outcomingStakeHours)
    },
    incomingValidatorsDays: function () {
      if (!this.inData) return 0
      return this.inData.incomingValidatorsDays
    },
    outcomingValidatorsDays: function () {
      if (!this.inData) return 0
      return this.inData.outcomingValidatorsDays
    },
    incomingDelegationsDays: function () {
      if (!this.inData) return 0
      return this.inData.incomingDelegationsDays
    },
    outcomingDelegationsDays: function () {
      if (!this.inData) return 0
      return this.inData.outcomingDelegationsDays
    },
    incomingStakeDays: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.incomingStakeDays)
    },
    outcomingStakeDays: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.outcomingStakeDays)
    },
    incomingValidatorsMonth: function () {
      if (!this.inData) return 0
      return this.inData.incomingValidatorsMonth
    },
    outcomingValidatorsMonth: function () {
      if (!this.inData) return 0
      return this.inData.outcomingValidatorsMonth
    },
    incomingDelegationsMonth: function () {
      if (!this.inData) return 0
      return this.inData.incomingDelegationsMonth
    },
    outcomingDelegationsMonth: function () {
      if (!this.inData) return 0
      return this.inData.outcomingDelegationsMonth
    },
    incomingStakeMonth: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.incomingStakeMonth)
    },
    outcomingStakeMonth: function () {
      if (!this.inData) return 0
      return getAvaFromnAva(this.inData.outcomingStakeMonth)
    }
  },
  watch: {
    statsMode: function (val) {
      this.refreshData(val)
    },
    inData: function () {
      this.refreshData(this.statsMode)
    },
    statOver (val) {
      setTimeout(() => {
        if (this.listOver) return
        this.debounceFunc(this.checkStatMenu())
      }, 50)
    },
    listOver () {
      this.debounceFunc(this.checkStatMenu())
    }
  },
  data () {
    return {
      statOver: false,
      statMenu: false,
      listOver: false,
      statsMode: '24H',
      incomingValidators: 0,
      outcomingValidators: 0,
      incomingDelegations: 0,
      outcomingDelegations: 0,
      incomingStake: 0,
      outcomingStake: 0
    }
  },
  methods: {
    debounceFunc: (fn) => debounce(function () { fn() }, 300),
    checkStatMenu () {
      if (this.statOver || this.listOver) {
        this.statMenu = true
      } else {
        this.statMenu = false
      }
    },
    format (value) {
      if (!value) return
      return `${round(value, 100).toLocaleString()}`
    },
    refreshData (val) {
      if (val === '24H') {
        this.incomingValidators = this.incomingValidatorsHours
        this.outcomingValidators = this.outcomingValidatorsHours
        this.incomingDelegations = this.incomingDelegationsHours
        this.outcomingDelegations = this.outcomingDelegationsHours
        this.incomingStake = this.incomingStakeHours
        this.outcomingStake = this.outcomingStakeHours
      } else if (val === 'WEEK') {
        this.incomingValidators = this.incomingValidatorsDays
        this.outcomingValidators = this.outcomingValidatorsDays
        this.incomingDelegations = this.incomingDelegationsDays
        this.outcomingDelegations = this.outcomingDelegationsDays
        this.incomingStake = this.incomingStakeDays
        this.outcomingStake = this.outcomingStakeDays
      } else if (val === 'MONTH') {
        this.incomingValidators = this.incomingValidatorsMonth
        this.outcomingValidators = this.outcomingValidatorsMonth
        this.incomingDelegations = this.incomingDelegationsMonth
        this.outcomingDelegations = this.outcomingDelegationsMonth
        this.incomingStake = this.incomingStakeMonth
        this.outcomingStake = this.outcomingStakeMonth
      }
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
