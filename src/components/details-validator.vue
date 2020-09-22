<template>
    <q-card flat>
      <q-card-section>
        <div class="row">
          <div class="col">
            <div v-if="validator.nodeID !== validator.name">
              <span class="text-grey text-medium">Name: </span>
              <a :href="validator.link" v-if="validator.link">{{ validator.name }}</a>
              <span v-else>{{ validator.name }}</span>
            </div>
            <span class="text-grey text-medium">Node ID:</span> [{{ validator.nodeID }}]
            <small>
              <q-icon
                @click="copyToClipboard(validator.nodeID)"
                name="file_copy"
              />
            </small>
            <div><span class="text-grey text-medium">Stake Period:</span>   {{ validatePeriod }} </div>
            <div v-if="validator.potentialReward > 0" class="text-grey text-medium">Potential Reward:  {{ getFormatReward(validator.potentialReward) }} <span class="text-accent">AVAX</span></div>
            <div><span class="text-grey text-medium">Start Time:</span> {{ startDate }} <small>({{ fromNowGet }})</small></div>
            <div><span class="text-grey text-medium">End Time:</span>  {{ endDate }}</div>
          </div>
          <div class="col">
            <div v-if="validator.rewardOwner">
              <span class="text-grey text-medium">Reward Owner: </span>{{ validator.rewardOwner.addresses[0] }}
              <small>
                <q-icon
                  @click="copyToClipboard(validator.rewardOwner.addresses[0])"
                  name="file_copy"
                />
              </small>
            </div>
            <div>
              <span class="text-grey text-medium">Delegations:</span>
              <span class="text-accent text-h7" style="cursor: pointer;" @click="onGetDelegations">
                {{ validator.delegatorsCount }}
              </span>
            </div>
            <div v-if="validator.delegationFee"><span class="text-grey text-medium">
              Delegation Fee:</span>   {{ validator.delegationFee }} %
              <q-tooltip content-class="bg-white text-grey" content-style="font-size: 14px;border-style: solid;border-width: 0.1px;">
                <q-icon name="info" class="q-pb-xs"/>
                <span>
                  Avalanche allows for delegation of stake. This parameter is the percent fee this validator charges when others delegate stake to them. <br />For example, if delegationFeeRate is 1.2345 and someone delegates to this validator, then when the delegation period is over, 1.2345% of the reward <br />goes to the validator and the rest goes to the delegator.
                </span>
              </q-tooltip>
            </div>
            <div><span class="text-grey text-medium">Total Stake:</span> {{ getLocaleString(validator.total) }} <span class="text-accent text-medium">AVAX</span></div>
            <div><span class="text-grey text-medium">Own Stake:</span> {{ getLocaleString(validator.stake) }} <span class="text-accent text-medium">AVAX</span></div>
            <div><span class="text-grey text-medium">Delegate Stake:</span> {{ getLocaleString(validator.delegateStake) }} <span class="text-accent text-medium">AVAX</span></div>
            <div v-if="validator.weight"><span class="text-grey text-medium">Weight:</span> {{ validator.weight }} <span class="text-accent text-medium">AVAX</span></div>
            <div>
          </div>
        </div>
      </div>
      </q-card-section>
    </q-card>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

import { getAvaFromnAva } from './../utils/avax.js'
import { round } from './../utils/commons.js'
import { date, fromNow, getDurationHumanize, getWeeks } from './../modules/time.js'
import { UPDATE_UI } from './../store/ui/types'

export default {
  name: 'DetailsValidator',
  props: {
    validator: {
      type: Object,
      required: true
    }
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
</style>
