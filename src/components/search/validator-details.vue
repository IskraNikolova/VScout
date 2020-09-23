<template>
  <div>
    <div class="text-bold q-pl-xl">VALIDATOR</div>
    <!--gt-xs-->
    <q-card flat class="gt-xs q-pa-xl">
      <q-item>
        <q-item-section avatar style="cursor:pointer;" @click="onClick(validator.link)">
        <q-avatar>
            <q-img :src="validator.avatar">
            <template v-slot:error>
                <div>
                ?
                </div>
            </template>
            </q-img>
        </q-avatar>
        </q-item-section>
        <q-item-section>
        <q-item-label>
            <small class="text-medium">Rank </small>
            <span class="text-accent">
            {{ validator.rank }}
            </span>
        </q-item-label>
        <q-item-label>
            <span  style="cursor:pointer;" @click="onClick(validator.link)">{{ validator.name }} </span> <small v-if="validator.name !== validator.nodeID" class="text-grey">({{ validator.nodeID }})</small>
            <small>
            <q-icon
                @click="copyToClipboard(validator.nodeID)"
                color="grey"
                name="file_copy"
            />
            </small>
        </q-item-label>
        <q-item-label v-if="rewardOwner">
            <small class="text-grey">
            <span class="text-medium">Owner</span> ({{ getFormatOwner(rewardOwner)}})
            <q-icon
                @click="copyToClipboard(rewardOwner)"
                color="grey"
                name="file_copy"
            />
            </small>
        </q-item-label>
        <q-item-label v-if="validator.weight">
            <small class="text-grey">
            Weight: <span class="text-accent">{{ validator.weight }}</span>
            </small>
        </q-item-label>
        </q-item-section>
        <q-item-section avatar right>
        <!--<span v-if="validator.uptime > 0">
            <span class="q-mr-xs q-mt-xl">Up Time</span>
            <q-badge :color="getColorUptime(validator.uptime)">
            {{ getUpTime(validator.uptime) }} %
            </q-badge>
        </span>-->
        </q-item-section>
    </q-item>

    <q-separator class="q-mb-xl"/>

    <q-card-section horizontal>
        <q-card-section class="col-7 q-mb-xl">
        <div class="q-mb-md text-medium">Stake (AVAX)</div>
        <small class="text-grey">Own</small>
        {{ getLocalString(validator.stake) }}
        <small class="text-accent">AVAX</small>
        <small style="color: grey;">
            ({{ getLocalString(validator.stakenAva) }} nAvax)
        </small>
        <div>
        </div>
        <div>
            <small class="text-grey">Delegated</small>
            {{ validator.delegateStake }}
            <small class="text-accent">AVAX</small>
        </div>
        <div>
            <small class="text-grey">Total</small>
            {{ getLocalString(validator.total) }}
            <small class="text-accent">AVAX</small>
        </div>
        <q-separator class="q-pa-xs q-mb-md q-mt-md"/>
        <div class="text-medium q-mt-md">Network Share (%) </div>
        <span class="text-orange q-pl-xs" v-if="validator.percent !== 'NaN'">
            {{validator.percent }} %
        </span>
        <q-separator class="q-pa-xs q-mb-md q-mt-md" />
        <div class="text-medium q-mt-md">Potential Reward</div>
        <span>
            {{ getFormatAva(validator.potentialReward) }} <span class="text-accent">AVAX</span>
        </span>
        <q-separator class="q-pa-xs q-mb-md q-mt-md" />
        <div class="q-pl-xs q-mt-md">
            <div class="text-medium">
            Delegations: <span class="text-accent">{{ validator.delegatorsCount}}</span>
            </div>
            <div class="text-medium">
            Delegation Fee: <span class="text-accent">{{ validator.delegationFee }} %</span>
            </div>
        </div>
        <q-separator class="q-pa-xs q-mb-md q-mt-md" />
        <div class="q-pl-xs q-mt-md">
            <div class="text-medium">Staked By</div>
            <div class="text-accent">
            <small>{{ validator.fromNowST }}</small>
            </div>
        </div>
        <q-card-section>
            <div class="text-grey q-pt-xl">Progress (%)</div>
            <progress-bar-validate-session
            v-bind:startTime="validator.startTime"
            v-bind:endTime="validator.endTime"
            />
        </q-card-section>
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-5">
        <cumulative-stake-chart
            v-if="validator.cumulativeStake"
            v-bind:name="validator.nodeID"
            v-bind:percent="validator.percent"
            v-bind:percentAll="validator.cumulativeStake ? validator.cumulativeStake : NaN"
        /><div v-else> - </div>
        </q-card-section>
    </q-card-section>
    </q-card>
    <!--lt-sm-->
    <q-card flat class="lt-sm">
    <q-item>
        <q-item-section avatar style="cursor:pointer;" @click="onClick(validator.link)">
        <q-avatar>
            <q-img :src="validator.avatar">
            <template v-slot:error>
                <div>
                  ?
                </div>
            </template>
            </q-img>
        </q-avatar>
        </q-item-section>
        <q-item-section>
        <q-item-label>
            <small class="text-medium">Rank </small>
            <span class="text-accent">
            {{ validator.rank }}
            </span>
        </q-item-label>
        </q-item-section>
    </q-item>
    <q-item>
        <q-item-section>
        <q-item-label>
            <span  style="cursor:pointer;" @click="onClick(validator.link)">{{ validator.name }} </span>
            <small v-if="validator.name !== validator.nodeID" class="text-grey">({{ validator.nodeID }})</small>
            <small>
            <q-icon
                @click="copyToClipboard(validator.nodeID)"
                color="grey"
                name="file_copy"
            />
            </small>
        </q-item-label>
        <q-item-label v-if="rewardOwner">
            <small class="text-grey">
            <span class="text-medium">Owner</span> ({{ getFormatOwner(rewardOwner)}})
            <q-icon
                @click="copyToClipboard(rewardOwner)"
                color="grey"
                name="file_copy"
            />
            </small>
        </q-item-label>
        <q-item-label v-if="validator.weight">
            <small class="text-grey">
            Weight: <span class="text-accent">{{ validator.weight }}</span>
            </small>
        </q-item-label>
        <q-item-label>
            <!--<span v-if="validator.uptime > 0">
            <span class="q-mr-xs q-mt-xl">Up Time</span>
            <q-badge :color="getColorUptime(validator.uptime)">
                {{ getUpTime(validator.uptime) }} %
            </q-badge>
            </span>-->
        </q-item-label>
        </q-item-section>
    </q-item>
    <q-separator class="q-mb-xl"/>

    <q-card-section>
        <q-card-section class="col-7 q-mb-xl">
        <div class="q-mb-md text-medium">Stake (AVAX)</div>
        <small class="text-grey">Own</small>
        {{ getLocalString(validator.stake) }}
        <small class="text-accent">AVAX</small>
        <br />
        <small style="color: grey;">
            ({{ getLocalString(validator.stakenAva) }} nAvax)
        </small>
        <div>
        </div>
        <div>
            <small class="text-grey">Delegated</small>
            {{ validator.delegateStake }}
            <small class="text-accent">AVAX</small>
        </div>
        <div>
            <small class="text-grey">Total</small>
            {{ getLocalString(validator.total)}}
            <small class="text-accent">AVAX</small>
        </div>
        <q-separator class="q-pa-xs q-mb-md q-mt-md"/>
        <div class="text-medium q-mt-md">Network Share (%) </div>
        <span class="text-orange q-pl-xs" v-if="validator.percent !== 'NaN'">
            {{validator.percent }} %
        </span>
        <q-separator class="q-pa-xs q-mb-md q-mt-md" />
            <cumulative-stake-chart
            v-bind:name="validator.nodeID + 2"
            v-bind:percent="validator.percent"
            v-bind:percentAll="validator.cumulativeStake ? validator.cumulativeStake : NaN"
            />
        <div class="q-pl-xs q-mt-md">
            <div class="text-medium q-mt-md">Potential Reward</div>
        <span>
            {{ getFormatAva(validator.potentialReward) }} <span class="text-accent">AVAX</span>
        </span>
        </div>
        <q-separator class="q-pa-xs q-mb-md q-mt-md" />
        <div class="q-pl-xs q-mt-md">
            <div class="text-medium">
            Delegations: <span class="text-accent">{{ validator.delegatorsCount}}</span>
            </div>
            <div class="text-medium">
            Delegation Fee: <span class="text-accent">{{ validator.delegationFee }} %</span>
            </div>
        </div>
        <q-separator class="q-pa-xs q-mb-md q-mt-md" />
        <div class="text-medium">Staked By</div>
        <div class="text-accent">
            <small>{{ validator.fromNowST }}</small>
        </div>
        <q-card-section>
            <div class="text-grey q-pt-xl">Progress (%)</div>
            <progress-bar-validate-session
            v-bind:startTime="validator.startTime"
            v-bind:endTime="validator.endTime"
            />
        </q-card-section>
        </q-card-section>
    </q-card-section>
    </q-card>
    <q-card>
    <q-separator />
    <q-card-section horizontal>
        <q-card-section class="col-6">
        <small class="text-grey text-bold">Start Time</small>
        <br />
        <small>{{ formatDate(validator.startTime) }}</small>
        </q-card-section>
        <q-separator vertical/>
        <q-card-section class="col-6">
        <small class="text-grey text-bold">End Time</small>
        <br />
        <small>{{ formatDate(validator.endTime) }}</small>
        </q-card-section>
    </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import {
  copyToClipboard,
  openURL
} from 'quasar'

import { date } from './../../modules/time.js'
// import { round } from './../../utils/commons.js'
import { getAvaFromnAva } from './../../utils/avax.js'

export default {
  name: 'ValidatorDetails',
  components: {
    CumulativeStakeChart: () => import('components/cumulative-stake-chart.vue'),
    ProgressBarValidateSession: () => import('components/progress-bar-validatе-session.vue')
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'validatorById'
    ]),
    validator: function () {
      return this.getValidator(this.id)
    },
    rewardOwner: function () {
      const result = this.validator.rewardOwner.addresses
      if (result) return result[0]
      return ''
    }
  },
  methods: {
    getFormatOwner (val) {
      if (!val) return
      return `${val.substr(0, 12)}...${val.substr(22)}`
    },
    getValidator (param) {
      const validator = this.validatorById(param)
      if (!validator) return

      return validator
    },
    // getUpTime (val) {
    //   if (!val) return 0
    //   return round(val * 100, 1000)
    // },
    // getColorUptime (val) {
    //   if (val >= 0.6) return 'green'
    //   return 'negative'
    // },
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
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    getFormatAva (val) {
      if (!val) return
      return this.getLocalString(getAvaFromnAva(val))
    },
    formatDate (time) {
      if (!time) return
      return date(time)
    },
    onClick (link) {
      if (!link) return
      try {
        openURL(link)
      } catch (err) {
      }
    }
  }
}
</script>
