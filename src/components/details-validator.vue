<template>
  <q-card flat class="panel">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div v-if="validator.nodeID !== validator.name">
            <span id="font15"><small>NAME </small></span>
            <span id="nodeID" class="text-medium" @click="$router.push(`/validator/${validator.nodeID}`)">
              {{ validator.name }}
            </span>
            <a :href="validator.link" v-if="validator.link" class="text-accent">
              visit
            </a>
            <span
              @click="$router.push('/validator/' + validator.nodeID)" v-else class="text-accent" style="cursor: pointer;text-decoration: underline;">
              visit
            </span>
          </div>
          <span id="font15">
            <small>NODE ID </small> </span>
            <span
              @click="$router.push(`/validator/${validator.nodeID}`)"
              class="text-secondary text-medium"
              id="nodeID"
            >
              [{{ validator.nodeID }}]
            </span>
            <small>
              <q-icon
                @click="copyToClipboard(validator.nodeID)"
                name="file_copy"
              />
            </small>
            <div v-if="validator.rewardOwner">
              <span id="font15">
                <small>OWNER  </small>
              </span>
              <span id="link">{{ rewardOwner }}</span>
              <small>
                <q-icon
                  @click="copyToClipboard(rewardOwner)"
                  name="file_copy"
                />
              </small>
            </div>
        </div>
        <div class="col">
          <div>
            <span id="font15">
              <small>STAKING PERIOD </small>
            </span>
            <span id="link">
              {{ getDurationL(validator.duration) }}
            </span>
          </div>
          <div class="row">
            <div class="col">
              <span id="font15">
                <small>START TIME </small>
              </span>
              <span id="link">
                {{ startDate }}
              </span>
              <small>
                ({{ fromNowGet }})
              </small>
            </div>
            <div class="col">
              <span id="font15">
                <small>END TIME </small>
              </span>
              <span id="link">
                {{ endDate }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <div class="row items-start q-gutter-md q-pl-md">
      <!-- STAKE PANEL-->
      <q-card class="my-card panel col-3">
        <q-card-section>
          <div class="text-h6">Stake</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">
            <small id="label">OWN </small>
            <span> {{ getFormatReward(validator.stakeAmount) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
          <div class="text-subtitle2">
            <small id="label">DELEGATED </small>
            <span> {{ getFormatReward(validator.delegateStake) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <div class="text-subtitle2">
            <small id="label">TOTAL </small>
            <span> {{ getFormatReward(validator.totalStakeAmount) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
        </q-card-actions>
      </q-card>

      <!-- REWARD PANEL-->
      <q-card class="my-card panel col-3">
        <q-card-section>
          <div class="text-h6">Reward</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">
            <small id="label">POTENTIAL REWARD </small>
            <span> {{ getFormatReward(validator.potentialReward) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
          <div class="text-subtitle2">
            <small id="label">DELEGATION FEES REWARD</small>
            <span> {{ potentialRewardFromDelegators() }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <div class="text-subtitle2">
            <small id="label">TOTAL </small>
            <span> {{ totalReward() }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span> /
            <span>  {{ totalRewardUsd() }}</span>
            <span class="text-accent text-medium"><small> {{ getISO(currentCurrency) }} </small></span>
          </div>
        </q-card-actions>
      </q-card>

      <!-- DELEGATE PANEL-->
      <q-card class="my-card panel col-3">
        <q-card-section>
           <div class="row items-center no-wrap">
              <div class="text-h6 col">Delegate</div>
              <div class="col-auto">
                <span class="text-accent" v-if="getBorderIsDelegatable()">
                  AVAILABLE
                  <q-icon name="info">
                    <tooltip-style v-bind:text="available" />
                  </q-icon>
                </span>
                <span class="text-negative" v-else>
                  UNAVAILABLE
                  <q-icon name="info">
                   <tooltip-style v-bind:text="unavailable" />
                  </q-icon>
                </span>
              </div>
           </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">
            <small id="label">DELEGATION FEE  </small>
            <span> {{ formatValue(validator.delegationFee) }}</span>
            <span class="text-accent"> %</span>
          </div>
          <div class="text-subtitle2">
            <small id="label">DELEGATIONS CAPACITY</small>
            <span> {{ getFormatReward(validator.remainingCapacity) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
          <div class="text-subtitle2 q-mt-md">
            <small id="label">REMAINING TIME </small>
            <span v-if="months > 0">
              {{ months }}
              <span class="text-accent"> Months </span>
            </span>
            {{ days }}
            <span class="text-accent">Days </span>
            <span v-if="months < 1">
              {{ hours }}
              <span class="text-accent"> Hours </span>
            </span>
          </div>
        </q-card-section>
      </q-card>

      <!-- DELEGATIONS PANEL-->
      <q-card class="my-card panel col-3">
        <q-card-section>
          <div class="text-h6">
            <span class="text-panel">{{ delegatorsCount }}</span>
            Delegations
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">
            <small id="label">RANK  </small>
            <q-icon name="img:statics/star.svg" size="1.5em" />
            <span>{{ validator.rank }}</span>
          </div>
          <div class="text-subtitle2">
            <small id="label">NETWORK SHARE </small>
            <span>{{ formatValue(validator.percent) }}</span>
            <span class="text-accent"> %</span>
          </div>
          <div class="text-subtitle2">
            <small id="label">CUMULATIVE STAKE </small>
            <span>{{ validator.cumulativeStake }}</span>
            <span class="text-accent"> %</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  copyToClipboard
} from 'quasar'

const humanizeDuration = require('humanize-duration')
import { round } from './../utils/commons.js'
import { currencies } from './../utils/constants.js'
import { getAvaFromnAva, getPriceFromnAvax } from './../utils/avax.js'
import { getDelegationReward } from './../modules/reward.js'

import {
  date,
  fromNow,
  getDurationHumanize
} from './../modules/time.js'

export default {
  name: 'DetailsValidator',
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  components: {
    TooltipStyle: () => import('components/tooltip-style')
  },
  computed: {
    ...mapGetters([
      'currentCurrency',
      'currenciesPriceList'
    ]),
    delegatorsCount: function () {
      if (!this.validator.delegators) return 0
      return this.validator.delegators.length
    },
    startDate: function () {
      return date(this.validator.startTime)
    },
    endDate: function () {
      return date(this.validator.endTime)
    },
    fromNowGet: function () {
      return fromNow(this.validator.startTime)
    },
    validatePeriod: function () {
      return getDurationHumanize(
        this.validator.startTime,
        this.validator.endTime
      )
    },
    rewardOwner: function () {
      if (!this.validator.rewardOwner) return
      return this.validator
        .rewardOwner
        .addresses[0]
    },
    dataArray: function () {
      if (!this.validator.remainingTime) return
      return this.validator
        .remainingTime
        .split(':')
    },
    months: function () {
      return this.dataArray[0]
    },
    days: function () {
      return this.dataArray[1]
    },
    hours: function () {
      return this.dataArray[2]
    }
  },
  data () {
    return {
      delReward: 0,
      available: 'The validator has available remaining capacity and enough remaining time for delegations.',
      unavailable: 'The validator has no available capacity and/or enough remaining time for delegation.'
    }
  },
  methods: {
    copyToClipboard (id) {
      if (!id) return

      copyToClipboard(id)
      this.$q.notify({
        message: 'Copied to clipboard!',
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 1000
      })
    },
    getDurationL (val) {
      if (!val) return
      return humanizeDuration(val, {
        units: ['y', 'mo', 'w', 'd', 'h'],
        round: true
      })
    },
    stakedBy (date) {
      return fromNow(date)
    },
    getBorderIsDelegatable () {
      if (!this.validator) return
      return this.validator
        .isMinimumAmountForStake &&
          this.validator.remainingCapacity > 25
    },
    getFormatReward (val) {
      if (!val) return 0
      const avax = getAvaFromnAva(val)
      return round(avax, 100)
        .toLocaleString()
    },
    getISO (val) {
      if (!val) return
      return currencies[`${val}`].isoCode
    },
    getFormatRewardUsd (val) {
      if (!val) return 0
      const usd = getPriceFromnAvax(val, this.currenciesPriceList[`${this.currentCurrency}`])
      return round(usd, 100)
        .toLocaleString()
    },
    potentialRewardFromDelegators () {
      if (!this.validator) return
      const percent = getDelegationReward(
        this.validator.delegatePotentialReward,
        this.validator.delegationFee
      )
      this.delReward = percent
      return getAvaFromnAva(percent)
        .toLocaleString()
    },
    totalReward () {
      const total = this.getTotal()
      return this.getFormatReward(total)
    },
    totalRewardUsd () {
      const total = this.getTotal()
      return this.getFormatRewardUsd(total)
    },
    getTotal () {
      const pr = parseFloat(this.validator.potentialReward)
      return this.delReward + pr
    },
    formatValue (val) {
      if (!val) return
      return round(parseFloat(val), 100)
    }
  }
}
</script>
<style scoped>
  #identity {
    color: grey;
  }
  .my-card {
    width: 100%;
    max-width: 300px;
  }
  #nodeID {
    cursor: pointer;
    font-size: 14px;
  }
  #link {
    font-size: 14px;
    opacity: 0.5;
  }
  #font15 {
    font-size: 15px;
  }
  #label {
    opacity: 0.5;
  }
</style>
