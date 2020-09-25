<template>
  <q-btn
    push
    flat
    id="logo-sim"
    label="calculator"
    @click="calculate"
  >
    <q-popup-proxy>
        <q-banner class="q-pa-md" dense style="width: 340px;">
        <div class="q-pb-md row">
            <div class="col-6 text-medium">Reward Calculator</div>
            <div class="col-6 q-mt-md" style="margin-bottom: -10px;padding-left: 12px;">
            <small class="q-pr-xs">Current Supply </small>
            <q-badge outline size="xs" color="accent" :label="getCurrentSupply() + 'M'" />
            </div>
        </div>
        <small><q-option-group
            v-model="type"
            :options="options"
            color="accent"
            inline
          /></small>
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
          class="q-pb-md"
          :rules="[value => value >= 2 || 'The minimum delegation fee rate is 2%']"
        />
        <div class="row q-mt-md">
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
        <div>
            <small>{{ stakeTime }} Days Earning </small>
            <div>
            <span class="text-accent">
                {{ rewardAvax.toLocaleString() }}
            </span> AVAX
            (<small class="text-grey">
                {{ reward.toLocaleString() }} <span class="text-accent">nAVAX</span>
            </small>)
            </div>
        </div>
        </q-banner>
    </q-popup-proxy>
  </q-btn>
</template>

<script>
import { mapGetters } from 'vuex'

const {
  Avax,
  maximumStakingDuration,
  stakeDurationMs
} = require('./../../utils/constants.js')

import { reward } from './../../modules/reward.js'
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
  data () {
    return {
      stakeTime: 14,
      delegationFee: 0,
      reward: 0.00,
      rewardAvax: 0.00,
      percentReward: 4,
      stakeAmount: 2000,
      //   yearReward: 0,
      //   yearRewardnAvax: 0,
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
  computed: {
    ...mapGetters([
      'currentSupply'
    ])
  },
  methods: {
    calculate () {
      const durationMs = stakeDurationMs(this.stakeTime)
      let rewardNAvax = reward(
        durationMs,
        this.stakeAmount * Avax,
        this.currentSupply,
        maximumStakingDuration
      )

      if (this.delegationFee > 0) {
        const percent = (rewardNAvax * this.delegationFee) / 100
        rewardNAvax -= percent
      }

      this.reward = round(rewardNAvax, 100)
      this.rewardAvax = round(getAvaFromnAva(rewardNAvax), 10000)
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
    }
  }
}
</script>
