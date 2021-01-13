<template>
  <div class="row">
    <div class="col-md-3 col-xs-10">
    <div class="q-pb-md text-medium label-title">STAKERS STATS</div>
        <div>
        <div
          class="text-medium q-mt-sm label-title"
          style="border: solid 0.5px;border-radius: 3px;max-width: 120px;color: #9c929c;text-align: center;padding-bottom: 2px;"
          @mouseover="statOver=true"
          @mouseleave="statOver=false"
        >
        <div>
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
            <q-item class="panel2" v-if="statsMode!=='24H'" clickable v-close-popup @click="statsMode='24H'">
            <q-item-section>
              <small class="text-panel">24H</small>
            </q-item-section>
            </q-item>
            <q-separator color="panel2" />
            <q-item class="panel2" v-if="statsMode!=='WEEK'" clickable v-close-popup @click="statsMode='WEEK'">
            <q-item-section>
              <small class="text-panel">WEEK</small>
            </q-item-section>
            </q-item>
            <q-separator color="panel2" />
            <q-item class="panel2" v-if="statsMode!=='MONTH'" clickable v-close-popup @click="statsMode='MONTH'">
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
        <div class="q-pb-md text-medium label-title">NEW STAKING LAST {{ statsMode }}</div>
        <div>
          <span class="text-panel text-title1">{{ incomingValidators }}</span><span class="label-title2"> VALIDATORS</span>
          <span class="text-panel text-title1"> {{ incomingDelegations }}</span><span class="label-title2"> DELEGATIONS</span>
        </div>
        <div>
          <span class="label-title2"><small>STAKE </small></span>
          <animated-number
            class="text-purple label-title"
            :value="incomingStake"
            :formatValue="format"
            :duration="3000"
          />
          <span class="label-title2"><small> AVAX</small></span>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">ENDING NEXT {{ statsMode }}</div>
        <div>
          <span class="text-panel text-title1">{{ outcomingValidators }}</span><span class="label-title2"> VALIDATORS</span>
          <span class="text-panel text-title1"> {{ outcomingDelegations }}</span><span class="label-title2"> DELEGATIONS</span>
        </div>
        <div>
          <span class="label-title2"><small>STAKE </small></span>
          <animated-number
            class="text-purple label-title"
            :value="outcomingStake"
            :formatValue="format"
            :duration="3000"
          />
          <span class="label-title2"><small> AVAX</small></span>
        </div>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { debounce } from 'quasar'

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
 .label-title {
  font-size: max(0.7vw, 12px);
 }
 .text-title1 {
    font-size: max(0.8vw, 16px);
  }
  .label-title2 {
    font-size: max(0.55vw, 12px);
  }
</style>
