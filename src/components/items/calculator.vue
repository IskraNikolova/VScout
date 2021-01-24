<template>
  <q-btn
    push
    flat
    color="purple"
    id="logo-sim"
    label="calculator"
    @click="openCalculator"
  >
    <q-popup-proxy>
        <q-banner class="q-pa-md panel" dense style="width: 370px;">
        <div class="row">
          <div class="col-6 text-medium">Reward Calculator</div>
          <div class="col-6" style="text-align: right;">
            <small>Current Supply
            <q-badge outline color="panel" :label="getCurrentSupplyLable() + ' M'" /> </small>
          </div>
        </div>
        <div class="row">
          <small class="col-9 q-pt-xs" style="text-align: left;">
            <q-option-group
              :dark="appTheme==='dark'"
              v-model="type"
              :options="options"
              color="accent"
              inline
            />
          </small>
          <small class="col-3 q-pt-md" v-if="type!=='delegator'" style="text-align: right;">
            <q-badge outline size="xs" color="accent" :label="percent + '%'" />
            <q-icon name="info" size="xs" class="text-accent q-pl-xs"><tooltip-style v-bind:text="'Reward rate'" /></q-icon>
          </small>
        </div>
        <q-input
          :dark="appTheme==='dark'"
          v-if="type==='validator'"
          outlined
          type="number"
          v-model="stakeAmount"
          label="Staking Amount"
          input-class="text-right"
          suffix="$AVAX"
          color="accent"
          @input="calculate"
          class="q-pb-sm"
          :rules="[
            value => (value >= 2000) || 'The minimum amount that a validator must stake is 2,000 AVAX!',
            value => (value <= 3000000) || 'Invalid amount!'
          ]"
        />
        <q-input
          :dark="appTheme==='dark'"
          v-else
          outlined
          type="number"
          v-model="stakeAmountDel"
          label="Staking Amount"
          input-class="text-right"
          suffix="AVAX"
          color="accent"
          @input="calculateDel"
          class="q-pb-xl"
          :rules="[
            value => (value >= 25) || 'The minimum amount that a delegator must stake is 25 AVAX!',
            value => (value <= 2400000) || 'Invalid amount!'
          ]"
        />
        <q-input
          :dark="appTheme==='dark'"
          v-if="isAdvanced && type === 'validator'"
          outlined
          type="number"
          v-model="delegationFee2"
          label="Delegation Fee"
          input-class="text-right"
          suffix="%"
          color="accent"
          @input="calculatePotentialReward"
          class="q-pb-md"
          :rules="[
            value => value >= 2 || 'The minimum delegation fee rate is 2%',
            value => value <= 100 || 'Invalid delegation fee rate'
          ]"
        />
        <q-input
          :dark="appTheme==='dark'"
          v-if="type==='delegator'"
          outlined
          type="number"
          v-model="delegationFee"
          label="Delegation Fee"
          input-class="text-right"
          suffix="%"
          color="accent"
          @input="calculateDel"
          class="q-pb-md"
          :rules="[
            value => value >= 2 || 'The minimum delegation fee rate is 2%',
            value => value <= 100 || 'Invalid delegation fee rate'
          ]"
        />
        <div class="row q-mt-xs">
          <div class="col-10">
            <q-badge outline style="height: 27px;" class="q-pb-xs q-pt-xs q-mb-xs panel">
              Staking Time (14 to 365 days)
            </q-badge>
          </div>
          <div class="col-2">
            <q-btn icon="event" size="sm" outline>
              <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="model" color="secondary" range>
                  <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" flat v-close-popup />
                  <q-btn label="OK" flat @click="save" v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </div>
        </div>
        <q-slider
          :dark="appTheme==='dark'"
          v-if="type==='validator'"
          class="q-ml-xs q-mr-xs q-mt-xl"
          v-model="stakeTime"
          :min="14"
          :max="365"
          :step="1"
          snap
          :label-value="stakeTime + ' days'"
          label-always
          @input="calculate"
          color="accent"
        />
        <q-slider
          v-else
          :dark="appTheme==='dark'"
          class="q-ml-xs q-mr-xs q-mt-xl"
          v-model="stakeTime"
          :min="14"
          :max="365"
          :step="1"
          snap
          :label-value="stakeTime + ' days'"
          label-always
          @input="calculateDel"
          label-text-color="accent"
          label-color="white"
          color="accent"
        />
        <div class="row">
          <div class="col-9">
            <small style="opacity: 0.5;">{{ stakeTime }} Days Reward </small>
            <div>
              <span>
                {{ getFormat(rewardAvax) }}
              </span>  <span class="text-accent text-medium">AVAX</span> |
                <span class="text-accent text-medium">{{ getSymbol(currentCurrency) }}</span>{{ getFormat(rewardUsd) }}
            </div>
          </div>
          <div @click="onAdvanced" v-if="!isAdvanced && type === 'validator'" style="cursor: pointer;">
            <q-icon name="read_more" /><small> Advanced</small>
          </div>
        </div>

        <div v-if="isAdvanced && type==='validator'" class="dark-panel q-mt-sm" style="padding:10px;border-radius: 5px;">
          <div style="text-align: right;"><small>Advanced</small></div>
          <small style="opacity: 0.5;">Capacity For Delegation</small>
          <div class="q-mb-sm">{{ capacity }} <span class="text-accent text-medium"> AVAX</span></div>
          <small style="opacity: 0.5;">Potential Reward From Delegation with {{delegationFee2}}% Fee</small>
          <div>{{ potentialReward }} <span class="text-accent text-medium"> AVAX</span> <small style="opacity: 0.5;"> /for all period and max capacity/</small></div>
        </div>
      </q-banner>
    </q-popup-proxy>
  </q-btn>
</template>

<script>
import { date } from 'quasar'
import { mapGetters } from 'vuex'
import { currencies } from './../../utils/constants.js'

import {
  reward,
  substractDelegationFee,
  getDelegationReward,
  getYearlyRewardPercent
} from './../../modules/reward.js'

import {
  round
} from './../../utils/commons.js'

import {
  getAvaFromnAva,
  getPriceFromnAvax
} from './../../utils/avax.js'

import {
  getRemainingCapacity
} from './../../utils/stake.js'

const timeStamp = Date.now()
const formattedFrom = date.formatDate(timeStamp, 'YYYY/MM/DD')
let to = new Date(timeStamp)
to = date.addToDate(to, { days: 14 })
const formattedTo = date.formatDate(to, 'YYYY/MM/DD')

export default {
  name: 'Calculator',
  components: {
    TooltipStyle: () => import('components/tooltip-style')
  },
  data () {
    return {
      percent: 0,
      stakeTime: 14,
      delegationFee: 2,
      delegationFee2: 2,
      isAdvanced: false,
      reward: 0.00,
      rewardAvax: 0.00,
      rewardUsd: 0.00,
      percentReward: 4,
      stakeAmount: 2000,
      stakeAmountDel: 25,
      potentialReward: 0,
      feeAmount: 0,
      feeAmountnAvax: 0,
      model: { from: formattedFrom, to: formattedTo },
      date: { from: formattedFrom, to: formattedTo },
      type: 'validator',
      capacity: 0,
      options: [
        {
          label: 'Validator',
          value: 'validator'
        },
        {
          label: 'Delegator',
          value: 'delegator'
        }
      ]
    }
  },
  watch: {
    type: function (newValidators) {
      if (newValidators === 'validator') {
        this.calculate()
      } else {
        this.calculateDel()
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentSupply',
      'appTheme',
      'currenciesPriceList',
      'currentCurrency'
    ])
  },
  methods: {
    getSymbol (val) {
      if (!val) return
      return currencies[`${val}`].symbol
    },
    onAdvanced () {
      this.isAdvanced = true
      event.stopPropagation()
      this.capacity = getRemainingCapacity(this.stakeAmount, 0)
      this.calculatePotentialReward()
    },
    calculatePotentialReward () {
      const rewardNAvax = reward(
        this.stakeTime,
        this.capacity,
        this.currentSupply
      )
      const percent = getDelegationReward(
        rewardNAvax,
        this.delegationFee2
      )
      this.potentialReward = getAvaFromnAva(percent)
        .toLocaleString()
    },
    getPercent () {
      const { percent } = getYearlyRewardPercent(
        this.reward,
        this.stakeTime,
        this.stakeAmount)
      this.percent = this.getFormat(percent)
    },
    async openCalculator () {
      this.calculate()
    },
    calculate () {
      this.isAdvanced = false
      const rewardNAvax = reward(
        this.stakeTime,
        this.stakeAmount,
        this.currentSupply
      )

      this.reward = rewardNAvax
      this.rewardAvax = getAvaFromnAva(rewardNAvax)
      this.rewardUsd = getPriceFromnAvax(rewardNAvax, this.currenciesPriceList[`${this.currentCurrency}`])
      this.getPercent()
    },
    calculateDel () {
      let rewardNAvax = reward(
        this.stakeTime,
        this.stakeAmountDel,
        this.currentSupply
      )

      const delegation = substractDelegationFee(
        rewardNAvax,
        this.delegationFee
      )
      rewardNAvax = delegation.result
      this.feeAmountnAvax = this.getFormat(parseFloat(delegation.fee))
      this.feeAmount = this.getFormat(getAvaFromnAva(delegation.fee))

      this.reward = rewardNAvax
      this.rewardAvax = getAvaFromnAva(rewardNAvax)
      this.rewardUsd = getPriceFromnAvax(rewardNAvax, this.currenciesPriceList[`${this.currentCurrency}`])
      this.getPercent()
    },
    getFormat (val) {
      return round(val, 100).toLocaleString()
    },
    getCurrentSupplyLable () {
      const currentSupply = this.currentSupply.toString()
      const currentSupplyAvax = Math.round(getAvaFromnAva(Number(currentSupply)))
      return Math.round(currentSupplyAvax / 1000000)
    },
    updateProxy () {
      this.model = this.date
    },
    save () {
      const fr = this.model.from.split('/')
      const t = this.model.to.split('/')
      const from = new Date(fr[0], fr[1], fr[2])
      const to = new Date(t[0], t[1], t[2])
      const unit = 'days'

      const diff = date.getDateDiff(to, from, unit)
      if (diff > 365) return

      this.stakeTime = diff
      this.date = this.model
      this.calculate()
    }
  }
}
</script>
<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
