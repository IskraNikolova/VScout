<template>
  <q-card flat>
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div v-if="validator.nodeID !== validator.name">
            <span tyle="font-size: 15px;" class="text-grey">NAME </span>
            <a :href="validator.link" v-if="validator.link" class="text-grey" style="font-size: 14px;opacity: 0.5;">{{ validator.name }}</a>
            <span v-else class="text-grey" style="font-size: 15px;opacity: 0.5;">{{ validator.name }}</span>
          </div>
          <span style="font-size: 15px;" class="text-grey"><small>NODE ID </small> </span> <span class="text-grey" style="font-size: 14px;opacity: 0.5;">[{{ validator.nodeID }}]</span>
            <small>
              <q-icon
                @click="copyToClipboard(validator.nodeID)"
                name="file_copy"
              />
            </small>
            <div v-if="validator.rewardOwner">
              <span class="text-grey" style="font-size: 15px;"><small>OWNER  </small></span><span style="font-size: 14px;opacity: 0.5;">{{ rewardOwner }}</span>
              <small>
                <q-icon
                  @click="copyToClipboard(rewardOwner)"
                  name="file_copy"
                />
              </small>
            </div>
        </div>
        <div class="col">
          <div><span class="text-grey" style="font-size: 15px;"><small>VALIDATION </small>  </span><span style="font-size: 14px;opacity: 0.5;">{{ validatePeriod }}</span></div>
          <div class="row">
            <div class="col"><span class="text-grey" style="font-size: 15px;"><small>START TIME </small> </span> <span style="font-size: 14px;opacity: 0.5;">{{ startDate }} </span><small>({{ fromNowGet }})</small></div>
            <div class="col"><span class="text-grey" style="font-size: 15px;"><small>END TIME </small> </span>  <span style="font-size: 14px;opacity: 0.5;">{{ endDate }}</span></div>
          </div>
        </div>
      </div>
    </q-card-section>
    <div class="row items-start q-gutter-md q-pl-md">
      <q-card class="my-card bg-grey-1">
        <q-card-section>
          <div class="text-h6">Stake</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2"><small style="opacity: 0.5;">OWN </small> {{ getLocaleString(validator.stake) }} <span class="text-accent">AVAX</span></div>
          <div class="text-subtitle2"><small style="opacity: 0.5;">DELEGATED </small> {{ getLocaleString(validator.delegateStake) }} <span class="text-accent">AVAX</span></div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <div class="text-subtitle2"><small style="opacity: 0.5;">TOTAL </small> {{ getLocaleString(validator.total) }} <span class="text-accent">AVAX</span></div>
        </q-card-actions>
      </q-card>
      <q-card class="my-card bg-grey-1">
        <q-card-section>
          <div class="text-h6">Reward</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2"><small style="opacity: 0.5;">POTENTIAL REWARD </small> {{ getFormatReward(validator.potentialReward) }} <span class="text-accent">AVAX</span></div>
          <div class="text-subtitle2"><small style="opacity: 0.5;">DELEGATION FEES REWARD</small> {{ potentialRewardFromDelegators() }} <span class="text-accent">AVAX</span></div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <div class="text-subtitle2"><small style="opacity: 0.5;">TOTAL </small> {{ totalReward() }} <span class="text-accent">AVAX</span></div>
        </q-card-actions>
      </q-card>
      <q-card class="my-card bg-grey-1">
        <q-card-section>
           <div class="row items-center no-wrap">
              <div class="text-h6 col">Delegate</div>
              <div class="col-auto">
                <span class="text-accent" v-if="getBorderIsDelegatable()">
                  AVAILABLE
                  <q-icon name="info">
                    <tooltip-style v-bind:text="'The validator has available remaining capacity and enough remaining time for delegations. '" />
                  </q-icon>
                </span>
                <span class="text-negative" v-else>
                  UNAVAILABLE
                  <q-icon name="info">
                   <tooltip-style v-bind:text="'The validator has no available capacity and/or enough remaining time for delegation.'" />
                  </q-icon>
                </span>
                <span></span>
              </div>
           </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2"><small style="opacity: 0.5;">DELEGATION FEE  </small> {{ validator.delegationFee }} <span class="text-accent">%</span></div>
          <div class="text-subtitle2"><small style="opacity: 0.5;">DELEGATIONS CAPACITY</small> {{ getFormatReward(validator.remainingCapacity) }} <span class="text-accent">AVAX</span></div>
          <br />
          <div class="text-subtitle2">
            <small style="opacity: 0.5;">REMAINIG TIME </small>
            <span v-if="months > 0">
              <span class="text-accent">Months </span>
              {{ months }}
            </span>
            <span class="text-accent">Days </span>
            {{ days }}
            <span v-if="months < 1">
              <span class="text-accent"> Hours </span>
              {{ hours }}
            </span>
          </div>
        </q-card-section>
      </q-card>
       <q-card class="my-card bg-grey-1">
        <q-card-section>
          <div class="text-h6">{{ validator.delegatorsCount }} Delegations</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2"><small style="opacity: 0.5;">RANK  </small> <q-icon name="img:statics/star.svg" size="1.5em" /> {{ validator.rank }}</div>
          <div class="text-subtitle2"><small style="opacity: 0.5;">NETWORK SHARE </small> {{ validator.percent }} <span class="text-accent">%</span></div>
          <br />
          <div class="text-subtitle2"><small style="opacity: 0.5;">CUMULATIVE STAKE </small> {{ validator.cumulativeStake }} <span class="text-accent">%</span></div>
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { round } from './../utils/commons.js'
import { UPDATE_UI } from './../store/ui/types'
import { getAvaFromnAva } from './../utils/avax.js'
import { getDelegationReward } from './../modules/reward.js'
import { date, fromNow, getDurationHumanize, getWeeks } from './../modules/time.js'

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
      return getDurationHumanize(this.validator.startTime, this.validator.endTime)
    },
    rewardOwner: function () {
      if (!this.validator.rewardOwner) return
      return this.validator.rewardOwner.addresses[0]
    },
    dataArray: function () {
      if (!this.validator.remainingTime) return
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
    }
  },
  data () {
    return {
      delReward: 0
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
    getBorderIsDelegatable () {
      if (!this.validator) return
      return this.validator.isMinimumAmountForStake && this.validator.remainingCapacity > 25
    },
    getFormatReward (val) {
      if (!val) return 0
      const avax = getAvaFromnAva(val)
      return round(avax, 100).toLocaleString()
    },
    getLocaleString (val) {
      if (!val) return 0
      return val.toLocaleString()
    },
    getWeeksP () {
      return getWeeks(this.startDate, this.endDate)
    },
    potentialRewardFromDelegators () {
      if (!this.validator) return
      const percent = getDelegationReward(
        this.validator.delegatePotentialReward,
        this.validator.delegationFee
      )
      this.delReward = percent
      return getAvaFromnAva(percent).toLocaleString()
    },
    totalReward () {
      const total = this.delReward + parseFloat(this.validator.potentialReward)
      return this.getFormatReward(total)
    },
    onGetDelegations () {
      this.$store.commit(UPDATE_UI, {
        typeAccount: {
          isValidators: false
        }
      })
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
</style>
