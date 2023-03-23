<template>
  <q-card
    flat
    class="panel2"
  >
    <q-card-section>
      <div class="row">
        <div class="q-mb-md text-medium col-9 text-purple">DELEGATION</div>
        <div class="col-auto">
          <span class="text-accent text-medium" v-if="getBorderIsDelegatable()">
            AVAILABLE
            <q-icon name="info">
              <tooltip-style v-bind:text="'The validator has available remaining capacity and enough remaining time for delegations. '" />
            </q-icon>
          </span>
          <span class="text-negative text-medium" v-else>
            UNAVAILABLE
            <q-icon name="info">
              <tooltip-style v-bind:text="'The validator has no available capacity and/or enough remaining time for delegation.'" />
            </q-icon>
          </span>
        </div>
      </div>
      <div class="q-pl-sm">
        <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION FEE</small></span>
        <span class="on-right">{{ getRoundedFee(validator.delegationFee) }}</span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">%</span>
      </div>
      <div class="q-pl-sm">
        <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION CAPACITY</small></span>
        <span class="on-right">{{ getFormatAva(remainingCapacity) }}</span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
      </div>

      <div class="text-subtitle2 q-pl-sm">
        <small style="opacity: 0.8;">REMAINING TIME</small>
        <span  class="on-right"><span v-if="months > 0">
        {{ months }}
        <span class="text-accent"> Months </span>
        </span>
        {{ days }}
        <span class="text-accent"> Days </span>
        <span v-if="months < 1">
        {{ hours }}
        <span class="text-accent"> Hours</span>
        </span><small class="text-panel"> ~ ({{ getRemainingTimeDays }} days)</small></span>
      </div>
      <div class="q-pl-sm">
        <span class="text-subtitle2">
        <small style="opacity: 0.8;">
          <q-icon name="info"><tooltip-style v-bind:text="'Delegation fees is deducted'" /></q-icon>
          POTENTIAL YIELD
        </small></span>
        <span class="text-subtitle2">
        <span class="on-right">{{ potentialYield }}</span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
          <br/>
        <small style="opacity: 0.8;">
          DELEGATIONS FEES REWARD
        </small></span>
        <span class="on-right">{{ potentialReward }}</span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
        <q-list dense class="q-mt-md  q-pt-sm q-pl-xs" style="max-width: 400px;">
          <q-item>
            <q-item-section>
              <q-slider
                v-model="time"
                :min="14"
                :max="getRemainingTimeDays"
                :step="1"
                label
                :disable="remainingCapacity < 25 || getRemainingTimeDays < 14"
                label-always
                @input="calculate"
                :label-value="time + ' days'"
                color="purple"
              />
            </q-item-section>
            <q-item-section side>
              <q-icon name="event" color="purple" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
            <q-input
              :dark="appTheme==='dark'"
              outlined
              type="number"
              v-model="avax"
              label="Staking Amount"
              input-class="text-right"
              suffix="AVAX"
              color="accent"
              :disable="remainingCapacity < 25 || getRemainingTimeDays < 14"
              label-color="accent"
              @input="calculate"
              :rules="[
                value => (value >= 25) || 'The minimum amount that a delegator must stake is 25 AVAX!',
                value => (value <= remainingCapacity) || `The maximum delegation capacity is ${getFormatAva(remainingCapacity)} AVAX!`
              ]"
            >
              <template v-slot:prepend>
                <q-icon size="xs" name="img:statics/avax-accent.png" />
              </template>
            </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import { getAvaFromnAva } from './../../utils/avax.js'
import { round } from './../../utils/commons.js'
const humanizeDuration = require('humanize-duration')
import { countDownDays } from './../../modules/time.js'
import {
  reward,
  substractDelegationFee
} from './../../modules/reward.js'

export default {
  name: 'Delegate',
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  watch: {
    remainingCapacity: function (val) {
      this.time = this.getRemainingTimeDays
      this.avax = val
      this.calculate()
    }
  },
  components: {
    TooltipStyle: () => import('components/tooltip-style')
  },
  created () {
    this.time = this.getRemainingTimeDays
    this.avax = this.remainingCapacity
    this.calculate()
  },
  data () {
    return {
      time: 14,
      avax: 25,
      potentialYield: 0,
      potentialReward: 0
    }
  },
  computed: {
    ...mapGetters([
      'appTheme',
      'currentSupply'
    ]),
    remainingCapacity: function () {
      if (!this.validator.remainingCapacity) return 0

      return round(this.getAvaxCapacity(this.validator.remainingCapacity), 1000)
    },
    delegationFee: function () {
      if (!this.validator.delegationFee) return 0
      return this.validator.delegationFee
    },
    dataArray: function () {
      if (!this.validator.remainingTime) return []
      return this.validator.remainingTime.split(':')
    },
    months: function () {
      return this.dataArray[0]
    },
    days: function () {
      return this.dataArray[1]
    },
    hours: function () {
      return this.dataArray[2]
    },
    getRemainingTimeDays: function () {
      if (!this.validator.endTime) return 0
      const s = countDownDays(this.validator.endTime)
      const days = this.getDurationDay(s)
      if (!days) return
      return Number(days.split(' ')[0])
    }
  },
  methods: {
    getBorderIsDelegatable () {
      if (!this.validator) return
      return this.validator.isMinimumAmountForStake &&
        this.remainingCapacity > 25
    },
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    getAvaxCapacity (val) {
      if (!val) return 0
      return getAvaFromnAva(val)
    },
    getRoundedFee (val) {
      if (!val) return val
      return round(Number(val), 100)
    },
    getDurationDay (val) {
      if (!val) return
      return humanizeDuration(val, {
        units: ['d'],
        round: true
      })
    },
    getFormatAva (val) {
      if (!val) return 0
      return this.getLocalString(val)
    },
    calculate () {
      if (!this.validator.delegationFee) return
      else if (this.currentSupply < 370000000) return

      if (this.avax < 25) {
        this.potentialYield = 0
        return
      }

      let rewardNAvax = reward(
        this.time,
        this.avax,
        this.currentSupply
      )
      const delegation = substractDelegationFee(
        rewardNAvax,
        this.validator.delegationFee
      )

      rewardNAvax = delegation.result
      this.potentialYield = this.getFormatAva(getAvaFromnAva(rewardNAvax))
      this.potentialReward = this.getFormatAva(getAvaFromnAva(delegation.fee))
    }
  }
}
</script>
