<template>
  <div>
    <!--gt-xs-->
    <q-card flat class="gt-sm q-pr-xl q-pl-xl q-pb-md q-ml-xl q-mr-xs">
      <div class="text-medium row">VALIDATOR</div>
      <div class="row">
        <q-item class="col-9">
          <q-item-section avatar style="cursor:pointer;" @click="onClick(validator.link)">
            <q-avatar>
              <q-img :src="validator.avatar">
                <template v-slot:error>
                  <div>?</div>
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <small class="text-medium">Rank </small>
              <span class="text-accent">
                {{ validator.rank }}
              </span><q-icon name="img:statics/star.svg" size="1.5em" style="margin-bottom: 2px"/>
            </q-item-label>
            <q-item-label>
              <span
                style="cursor:pointer;font-size: 16px;"
                @click="onClick(validator.link)">{{ validator.name }} </span> <small v-if="validator.name !== validator.nodeID" class="text-grey">({{ validator.nodeID }})</small>
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
              <span class="text-medium">Owner</span> ({{ getFormatOwner(rewardOwner, 12, 22)}})
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
        </q-item>
        <div class="col-3 q-mt-md">
          <span class="text-subtitle2 q-mr-xs"><small style="opacity: 0.8;">UP TIME</small></span>
          <q-badge :color="getColorUptime(validator.uptime)" class="text-medium" style="font-size: 16px;padding: 7px;">
            <span style="margin: auto;">{{ getUpTime(validator.uptime) }} %</span>
          </q-badge>
          <br />
          <span class="text-subtitle2"><small style="opacity: 0.8;">STAKED BY</small></span>
          <span class="q-pl-xs">
            {{ validator.fromNowST }}
          </span>
          <br />
          <span class="text-subtitle2"><small style="opacity: 0.8;">NETWORK SHARE</small></span>
          <span class="q-pl-xs" v-if="validator.percent !== 'NaN'">
            {{ validator.percent }} <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">%</span>
          </span>
        </div>
      </div>
      <div class="row">
        <q-card flat bordered class="col-5 q-mt-md">
          <q-card-section>
            <div class="q-mb-md text-medium">STAKE (AVAX)</div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">OWN</small></span>
              <span class="on-right text-medium text-h6">{{ getLocalString(validator.stake) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATED</small></span>
              <span class="on-right">{{ getLocalString(validator.delegateStake) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <q-separator class="q-mt-xs q-mb-xs" style="width: 180px;"/>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
              <span class="on-right">{{ getLocalString(validator.total) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
          </q-card-section>
        </q-card>
        <div class="col-1"></div>
        <q-card flat bordered class="col-5 q-mt-md">
          <div class="q-pa-md text-medium">REWARD (AVAX)</div>
          <div class="q-pl-md"><div>
            <span class="text-subtitle2"><small style="opacity: 0.8;">POTENTIAL REWARD</small></span>
            <span class="on-right text-h6">{{ getFormatAva(validator.potentialReward) }}</span>
            <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
          </div>
          <div>
            <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATIONS FEES REWARD</small></span>
            <span class="on-right">{{ potentialRewardFromDelegators() }}</span>
            <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
          </div>
          <q-separator class="q-mt-xs q-mb-xs" style="width: 180px;"/>
          <div>
            <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
            <span class="on-right">{{ totalReward() }}</span>
            <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
          </div></div>
        </q-card>
        <div class="col-1"></div>
      </div>
      <div class="row">
        <q-card flat bordered class="col-5 q-mt-md">
          <q-card-section>
            <div class="row">
              <div class="q-mb-md text-medium col-9">DELEGATE</div>
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
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION FEE</small></span>
              <span class="on-right">{{ validator.delegationFee }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">%</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION CAPACITY</small></span>
              <span class="on-right">{{ getFormatAva(validator.remainingCapacity) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>

            <div class="text-subtitle2">
              <small style="opacity: 0.8;">REMAINIG TIME </small>
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
        <div class="col-1"></div>
        <div class="col-6 q-pt-md">
          <div class="q-mb-md text-medium">
            <span class="text-orange" style="font-size: 18px;">{{ validator.delegatorsCount }} </span>
            DELEGATIONS
          </div>
          <q-scroll-area style="height: 150px;">
            <div class="row">
              <div class="col-8"><span class="text-subtitle2"><small style="opacity: 0.8;">OWNER</small></span></div>
              <div class="col-4"><span class="text-subtitle2"><small style="opacity: 0.8;">STAKE AMOUNT</small></span></div>
            </div>
            <q-separator class="q-pb-xs" style="width: 80%;"/>
            <div v-for="(delegation, i) in getDelegationsForNode(validator.nodeID)" :key="i" class="q-py-xs row">
              <div class="col-8" @click="copyToClipboard(delegationRewardOwner(delegation.rewardOwner))">
                {{ delegationRewardOwner(delegation.rewardOwner) }}
              </div>
              <div class="col-4">{{ getFormatAva(delegation.stakeAmount) }}<span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span></div>
            </div>
          </q-scroll-area>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="text-grey q-pt-xl">Progress (%)</div>
          <progress-bar-validate-session
            v-bind:startTime="validator.startTime"
            v-bind:endTime="validator.endTime"
          />
          <div class="row">
            <div class="col-6">
              <small class="text-grey text-bold">Start Time</small>
              <br />
              <small>{{ formatDate(validator.startTime) }}</small>
            </div>
            <div class="col-6">
              <small class="text-grey text-bold">End Time</small>
              <br />
              <small>{{ formatDate(validator.endTime) }}</small>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!--lt-sm-->
    <q-card flat class="lt-md">
      <q-item>
        <q-item-section avatar style="cursor:pointer;" @click="onClick(validator.link)">
        <q-avatar>
          <q-img :src="validator.avatar">
            <template v-slot:error>
              <div>?</div>
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
          <q-icon name="img:statics/star.svg" size="1.5em" style="margin-bottom: 2px"/>
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
              <span class="text-medium">Owner</span> ({{ getFormatOwner(rewardOwner, 12, 22)}})
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
            <span v-if="validator.uptime > 0">
              <span class="q-mr-xs q-mt-xl">Up Time</span>
              <q-badge :color="getColorUptime(validator.uptime)">
                  {{ getUpTime(validator.uptime) }} %
              </q-badge>
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator class="q-mb-xl"/>
      <div class="q-pl-md">
        <span class="text-subtitle2"><small style="opacity: 0.8;">STAKED BY</small></span>
        <span class="q-pl-xs">
          {{ validator.fromNowST }}
        </span>
        <br />
        <span class="text-subtitle2"><small style="opacity: 0.8;">NETWORK SHARE</small></span>
        <span class="q-pl-xs" v-if="validator.percent !== 'NaN'">
          {{ validator.percent }} <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">%</span>
        </span>
      </div>
      <q-separator class="q-mb-xl"/>

      <div class="row">
        <q-card flat class="col-12">
          <q-card-section>
            <div class="q-mb-md text-medium">STAKE (AVAX)</div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">OWN</small></span>
              <span class="on-right text-medium text-h6">{{ getLocalString(validator.stake) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATED</small></span>
              <span class="on-right">{{ getLocalString(validator.delegateStake) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <q-separator class="q-mt-xs q-mb-xs" style="width: 180px;"/>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
              <span class="on-right">{{ getLocalString(validator.total) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
          </q-card-section>
        </q-card>
        <q-separator />
        <q-card flat class="col-12">
          <q-card-section>
            <div class="q-mb-md text-medium">DELEGATE</div>
            <div >
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
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION FEE</small></span>
              <span class="on-right">{{ validator.delegationFee }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">%</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION CAPACITY</small></span>
              <span class="on-right">{{ getFormatAva(validator.remainingCapacity) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>

            <div class="text-subtitle2">
              <small style="opacity: 0.8;">REMAINIG TIME </small>
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
        <q-separator />
        <q-card flat class="col-12">
          <q-card-section>
            <div class="q-mb-md text-medium">REWARD (AVAX)</div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">POTENTIAL REWARD</small></span>
              <span class="on-right">{{ getFormatAva(validator.potentialReward) }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATIONS FEES REWARD</small></span>
              <span class="on-right">{{ potentialRewardFromDelegators() }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <q-separator class="q-mt-xs q-mb-xs" style="width: 180px;"/>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
              <span class="on-right">{{ totalReward() }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <q-separator />
      <div class="row q-pa-md">
        <div class="col-12">
          <div class="q-mb-md text-medium"><span class="text-orange" style="font-size: 18px;">{{ validator.delegatorsCount }} </span>DELEGATIONS</div>
          <q-scroll-area style="height: 100px;">
            <div class="row">
              <div class="col-8"><span class="text-subtitle2"><small style="opacity: 0.8;">OWNER</small></span></div>
              <div class="col-4"><span class="text-subtitle2"><small style="opacity: 0.8;">STAKE AMOUNT</small></span></div>
            </div>
            <q-separator />
            <div v-for="(delegation, i) in getDelegationsForNode(validator.nodeID)" :key="i" class="row q-py-xs">
              <div class="col-8" @click="copyToClipboard(delegationRewardOwner(delegation.rewardOwner))">
                {{ getFormatOwner(delegationRewardOwner(delegation.rewardOwner), 12, 34) }}
              </div>
              <div class="col-4">{{ getFormatAva(delegation.stakeAmount) }}
                <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
              </div>
            </div>
          </q-scroll-area>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-card-section>
            <div class="text-grey q-pt-xl">Progress (%)</div>
            <progress-bar-validate-session
              v-bind:startTime="validator.startTime"
              v-bind:endTime="validator.endTime"
            />
          </q-card-section>
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
        </div>
      </div>
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

import { getDelegationReward } from './../../modules/reward.js'
import { date } from './../../modules/time.js'
import { round } from './../../utils/commons.js'
import { getAvaFromnAva } from './../../utils/avax.js'

export default {
  name: 'ValidatorDetails',
  components: {
    TooltipStyle: () => import('components/tooltip-style'),
    ProgressBarValidateSession: () => import('components/progress-bar-validatе-session.vue')
  },
  computed: {
    ...mapGetters([
      'validatorById',
      'getDelegationsForNode'
    ]),
    validator: function () {
      return this.getValidator(this.$route.params.id)
    },
    rewardOwner: function () {
      const result = this.validator.rewardOwner.addresses
      if (result) return result[0]
      return ''
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
    }
  },
  methods: {
    getFormatOwner (val, startIndex, endIndex) {
      if (!val) return
      return `${val.substr(0, startIndex)}...${val.substr(endIndex)}`
    },
    getValidator (param) {
      const validator = this.validatorById(param)
      if (!validator) return { rewardOwner: { addresses: [] }, startTime: '', endTime: '' }

      return validator
    },
    getBorderIsDelegatable () {
      if (!this.validator) return
      return this.validator.isMinimumAmountForStake && this.validator.remainingCapacity > 25
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
      return this.getFormatAva(total)
    },
    getUpTime (val) {
      if (!val) return 0
      return round(val * 100, 1000)
    },
    getColorUptime (val) {
      if (val >= 0.6) return 'green'
      return 'negative'
    },
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
    delegationRewardOwner: function (owner) {
      if (!owner) return

      return owner.addresses[0]
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
