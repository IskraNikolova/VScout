<template>
  <q-btn
    push
    flat
    id="logo-sim"
    label="calculator"
    @click="calculate"
  >
    <q-popup-proxy>
        <q-banner class="q-pa-md" dense style="width: 370px;">
        <div class="row">
          <div class="col-6 text-medium">Reward Calculator</div>
          <div class="col-6" style="text-align: right;">
            <small>Current Supply
            <q-badge outline color="orange" :label="getCurrentSupply() + ' M'" /> </small>
          </div>
        </div>
        <div class="row">
          <small class="col-9 q-pt-xs" style="text-align: left;">
            <q-option-group
              v-model="type"
              :options="options"
              color="accent"
              inline
            />
          </small>
          <small class="col-3 q-pt-md" v-if="type!=='delegator'" style="text-align: right;">
            <q-badge outline size="xs" color="accent" :label="percent + '%'" />
            <q-icon name="info" size="xs" class="text-accent q-pl-xs"><tooltip-style v-bind:text="'The annual interest rate'" /></q-icon>
          </small>
        </div>
        <q-input
          label-color="orange"
          outlined
          v-model="stakeAmount"
          label="Staking Amount"
          input-class="text-right"
          suffix="AVAX"
          color="accent"
          @input="calculate"
          class="q-pb-md"
          :rules="[value => value >= 1]"
        />
        <q-input
          v-if="type==='delegator'"
          label-color="orange"
          outlined
          v-model="delegationFee"
          label="Delegation Fee"
          input-class="text-right"
          suffix="%"
          color="accent"
          @input="calculate"
          class="q-pb-xs"
          :rules="[value => value >= 2 || 'The minimum delegation fee rate is 2%']"
        />
        <div class="row q-mt-xs">
            <div class="col-10">
            <q-badge outline color="orange" style="height: 27px;" class="q-pb-xs q-pt-xs q-mb-xs">
                Staking Time (14 to 365 days)
            </q-badge>
            </div>
            <div class="col-2">
            <q-btn icon="event" size="sm" outline color="grey">
                <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="model" color="orange" range>
                    <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="grey" flat v-close-popup />
                    <q-btn label="OK" color="grey" flat @click="save" v-close-popup />
                    </div>
                </q-date>
                </q-popup-proxy>
            </q-btn>
            </div>
        </div>
        <q-slider
          class="q-ml-xs q-mr-xs q-mt-xl"
          v-model="stakeTime"
          :min="14"
          :max="365"
          :step="1"
          snap
          :label-value="stakeTime + ' days'"
          label-always
          @input="calculate"
          label-text-color="orange"
          label-color="white"
          color="orange"
        />
        <div class="row">
          <div class="col - 6">
          <small>{{ stakeTime }} Days Earning </small>
          <div>
            <span class="text-accent">
              {{ getFormat(rewardAvax) }}
            </span> AVAX
            <br />
            (<small class="text-grey">
              {{ getFormat(reward) }} <span class="text-accent">nAVAX</span>
            </small>)
          </div>
          </div>
          <div class="col-3" v-if="type!=='delegator'">
            <q-icon name="east" size="xs" class="text-orange"/>
          </div>
          <small class="col-3" v-if="type!=='delegator'">
            <small>Yearly Earning </small><br />
            {{yearly}} <span class="text-accent">AVAX</span>
          </small>
          <div class="col" v-if="type==='delegator'">
            <small>Delegation Fee</small>
            <div>
              <span class="text-negative">
                {{ feeAmount }}
              </span> AVAX
              <br />
              (<small class="text-grey">
                {{ feeAmountnAvax }} <span class="text-accent">nAVAX</span>
              </small>)
            </div>
          </div>
        </div>
        </q-banner>
    </q-popup-proxy>
  </q-btn>
</template>

<script>
import { mapGetters } from 'vuex'

import { reward, substractDelegationFee, getYearlyRewardPercent } from './../../modules/reward.js'
import { round } from './../../utils/commons.js'
import { getAvaFromnAva } from './../../utils/avax.js'
import { date } from 'quasar'

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
      yearly: 0,
      percent: 0,
      stakeTime: 14,
      delegationFee: 0,
      reward: 0.00,
      rewardAvax: 0.00,
      percentReward: 4,
      stakeAmount: 2000,
      feeAmount: 0,
      feeAmountnAvax: 0,
      model: { from: formattedFrom, to: formattedTo },
      date: { from: formattedFrom, to: formattedTo },
      type: 'validator',
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
        this.delegationFee = 0
        this.feeAmount = 0
        this.feeAmountnAvax = 0
        this.calculate()
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentSupply'
    ])
  },
  methods: {
    getPercent () {
      const { percent, yearly } = getYearlyRewardPercent(this.reward, this.stakeTime, this.stakeAmount)
      this.percent = this.getFormat(percent)
      this.yearly = this.getFormat(getAvaFromnAva(yearly))
    },
    calculate () {
      let rewardNAvax = reward(
        this.stakeTime,
        this.stakeAmount,
        this.currentSupply
      )

      if (this.delegationFee > 0) {
        const delegation = substractDelegationFee(rewardNAvax, this.delegationFee)
        rewardNAvax = delegation.result
        this.feeAmountnAvax = this.getFormat(parseFloat(delegation.fee))
        this.feeAmount = this.getFormat(getAvaFromnAva(delegation.fee))
      }

      this.reward = rewardNAvax
      this.rewardAvax = getAvaFromnAva(rewardNAvax)
      this.getPercent()
    },
    getFormat (val) {
      return round(val, 100).toLocaleString()
    },
    getCurrentSupply () {
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
