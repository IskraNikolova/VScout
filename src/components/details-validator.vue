<template>
  <q-card flat class="panel q-pb-md">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div v-if="validator.nodeID !== validator.name">
            <span id="font15"><small>NAME </small></span>
            <span id="nodeID" class="text-medium" @click="$router.push(`/validator/${validator.nodeID}`)" v-html="validator.name">
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
              class="text-panel"
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
              <span class="text-panel" style="cursor: pointer;" @click="$router.push(`/address/${rewardOwner}`)">{{ rewardOwner }} </span>
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
            <span class="text-panel">
              {{ getDurationL(validator.duration) }}
            </span>
          </div>
          <div class="row">
            <div class="col">
              <span id="font15">
                <small>START TIME </small>
              </span>
              <span class="text-panel">
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
              <span class="text-panel">
                {{ endDate }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <div class="q-gutter-md q-pl-md parent-container">
      <!-- STAKE PANEL-->
      <q-card class="my-card dark-panel">
        <q-card-section>
          <div class="text-h6">Stake</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">
            <small class="text-panel">OWN </small>
            <span> {{ getFormatReward(validator.weight) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
          <div class="text-subtitle2">
            <small class="text-panel">DELEGATED </small>
            <span> {{ getFormatReward(validator.delegatorWeight) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
        </q-card-section>

        <q-separator :dark="appTheme==='dark'" />

        <q-card-actions>
          <div class="text-subtitle2">
            <small class="text-panel">TOTAL </small>
            <span> {{ getFormatReward(validator.totalStakeAmount) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
        </q-card-actions>
      </q-card>

      <!-- REWARD PANEL-->
      <q-card class="my-card dark-panel">
        <q-card-section>
          <div class="text-h6">Reward</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">
            <small class="text-panel">POTENTIAL REWARD </small>
            <span> {{ getFormatReward(validator.potentialReward) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span> /
            <span>  {{ totalRewardUsd() }}</span>
            <span class="text-accent text-medium"><small> {{ getISO(currentCurrency) }} </small></span>
          </div>
          <div class="text-subtitle2">
            <small class="text-panel">DELEGATION FEES REWARD</small>
            <!--<span> {{ potentialRewardFromDelegators() }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>-->
          </div>
        </q-card-section>

        <q-separator :dark="appTheme==='dark'" />

        <q-card-actions class="q-pl-md">
          <div class="text-subtitle2">
            <small class="text-panel">TOTAL </small>
            <!--<span> {{ totalReward() }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
            <span>  {{ totalRewardUsd() }}</span>
            <span class="text-accent text-medium"><small> {{ getISO(currentCurrency) }} </small></span>-->
          </div>
        </q-card-actions>
      </q-card>

      <!-- DELEGATE PANEL-->
      <q-card class="my-card dark-panel">
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
            <small class="text-panel">DELEGATION FEE  </small>
            <span> {{ formatValue(validator.delegationFee) }}</span>
            <span class="text-accent"> %</span>
          </div>
          <div class="text-subtitle2">
            <small class="text-panel">DELEGATIONS CAPACITY</small>
            <span> {{ getFormatReward(validator.remainingCapacity) }}</span>
            <span class="text-accent text-medium"><small> AVAX</small></span>
          </div>
          <div class="text-subtitle2 q-mt-md">
            <small class="text-panel">REMAINING TIME</small>
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
      <q-card class="my-card dark-panel">
        <q-card-section>
          <div class="text-h6">
            <span class="text-panel">{{ delegatorsCount }}</span>
            Delegations
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">
            <small class="text-panel">RANK  </small>
            <q-icon name="img:statics/star.svg" size="1.5em" />
            <span>{{ validator.rank }}</span>
          </div>
          <div class="text-subtitle2">
            <small class="text-panel">NETWORK SHARE </small>
            <span>{{ formatValue(validator.percent) }}</span>
            <span class="text-accent"> %</span>
          </div>
          <div class="text-subtitle2">
            <small class="text-panel">CUMULATIVE STAKE </small>
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
      'currenciesPriceList',
      'appTheme'
    ]),
    delegatorsCount: function () {
      return this.validator.delegatorCount
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
  .parent-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.my-card {
   flex: 1 1 250px;
    max-width: 450px;
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
