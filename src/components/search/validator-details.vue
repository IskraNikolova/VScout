<template>
  <div>
    <!--gt-xs-->
    <q-card flat class="gt-xs q-pa-xl panel">
      <div class="row">
        <q-item class="col-9">
          <avatar v-bind:avatar="getAvatar()" style="cursor:pointer;" @click="onClick(getLink())"/>
          <q-item-section>
            <rank v-bind:rank="validator.rank" />
            <name v-bind:name="getName()" v-bind:nodeID="validator.nodeID" v-bind:link="getLink()" />
            <owner v-bind:owner="rewardOwner" v-if="rewardOwner"/>
          </q-item-section>
        </q-item>
        <div class="col-3 q-pt-sm">
          <span class="text-subtitle2 q-mr-xs"><small style="opacity: 0.8;">UPTIME</small></span>
          <q-badge :color="getColorUptime(validator.uptime)" class="text-medium q-ml-xs" style="font-size: 16px;padding: 7px">
            <span style="margin: auto;">{{ getUpTime(validator.uptime) }}%</span>
          </q-badge>
          <div class="q-mt-xs">
            <span class="text-subtitle2 q-mr-xs q-mt-sm"><small style="opacity: 0.8;">STATUS</small></span>
            <small class="q-pl-xs text-positive" v-if="status">CONNECTED</small>
            <small class="q-pl-xs text-negative" v-else>DISCONNECTED</small>
          </div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">NETWORK SHARE</small></span>
          <span class="q-pl-xs" v-if="validator.percent !== 'NaN'">
            {{ validator.percent }}<span class="text-accent text-medium"> %</span>
          </span>
          <br />
          <span class="text-subtitle2"><small style="opacity: 0.8;">STAKING PERIOD</small></span>
          <span class="q-pl-xs">
            {{ getDurationL(validator.duration) }}
          </span>
        </div>
      </div>
      <website
        v-if="getWebsite()"
        v-bind:website ="getWebsite()"
        v-bind:link="getLink()"
        v-bind:nodeID="validator.nodeID"
      />
      <div class="q-pl-sm q-pt-sm">
        <i v-if="!more">{{ getLessBio(getBio()) }}</i>
        <i v-else>{{ getBio() }}</i>
        <span v-if="isEnav(getBio()) && !more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"> read more...</span>
        <span v-if="isEnav(getBio()) && more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"><q-icon name="expand_less" /></span>
      </div>
      <div class="row" v-if="validator.version">
        <div class="col-12">
        <info
          class="q-mt-md my-card text-white"
          style="border-radius: 10px;background: radial-gradient(circle, #575b63 0%, #32353b 100%)"
          v-bind:version="validator.version"
          v-bind:country="validator.country"
          v-bind:continent="validator.continent"
          v-bind:countryCode="validator.countryCode"
          v-bind:lastReceived="validator.lastReceived"
          v-bind:lastSent="validator.lastSent"
        />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="q-mr-md">
          <stake
            class="q-mt-md my-card text-white"
            style="border-radius: 10px;background: radial-gradient(circle, #575b63 0%, #32353b 100%)"
            v-bind:stakeAmount="stakeAmount"
            v-bind:delegateStake="delegateStake"
            v-bind:totalStakeAmount="totalStakeAmount"
          />
          <delegate
            class="q-mt-md my-card text-white"
            style="border-radius: 10px;background: radial-gradient(circle, #575b63 0%, #32353b 100%)"
            v-bind:validator="validator"
          />
          <div class="q-mt-md q-pa-md my-card text-white"
          style="border-radius: 10px;background: radial-gradient(circle, #575b63 0%, #32353b 100%)">
            <div class="q-mb-sm">Progress (%)</div>
            <progress-bar-validate-session
              v-bind:startTime="validator.startTime"
              v-bind:endTime="validator.endTime"
            />
            <div class="row">
              <div class="col-6">
                <small class="text-bold">Start Time</small>
                <br />
                <small>{{ formatDate(validator.startTime) }}</small>
              </div>
              <div class="col-6" style="text-align: right;">
                <small class="text-bold">End Time</small>
                <br />
                <small>{{ formatDate(validator.endTime) }}</small>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="col-6">
          <reward
            class="q-mt-md my-card text-white"
            style="border-radius: 10px;background: radial-gradient(circle, #575b63 0%, #32353b 100%)"
            v-bind:validator="validator"
          />
          <delegations
            class="q-mt-md my-card text-white q-pa-md"
            style="border-radius: 10px;background: radial-gradient(circle, #575b63 0%, #32353b 100%);"
            v-bind:delegators="delegators"
          />
        </div>
      </div>
    </q-card>

    <!--lt-sm-->
    <q-card flat class="lt-sm panel">
      <q-item>
        <avatar
          v-bind:avatar="avatar"
          style="cursor:pointer;"
          @click="onClick(validator.link)"
        />
        <q-item-section  class="q-mt-xl">
          <rank v-bind:rank="validator.rank" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <name
            v-bind:name="validator.name"
            v-bind:nodeID="validator.nodeID"
            v-bind:link="validator.link"
          />
          <owner v-bind:owner="rewardOwner" v-if="rewardOwner"/>
          <q-separator class="q-mt-md q-mb-md"/>
          <q-item-label>
            <div>
            <span v-if="validator.uptime > 0">
            <span class="text-subtitle2">
              <small style="opacity: 0.8;">UPTIME</small>
            </span>
            <span class="q-pl-xs">
              <q-badge :color="getColorUptime(validator.uptime)">
                {{ getUpTime(validator.uptime) }} %
              </q-badge>
            </span>
            <br />
            </span>
            <span class="text-subtitle2">
              <small style="opacity: 0.8;">STAKED BY</small>
            </span>
            <span class="q-pl-xs">
              {{ stakedBy(validator.startTime) }}
            </span>
            <br />
            <span class="text-subtitle2">
              <small style="opacity: 0.8;">NETWORK SHARE</small>
            </span>
            <span class="q-pl-xs" v-if="validator.percent !== 'NaN'">
              {{ validator.percent }}
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;"> %</span>
            </span>
          </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator v-if="validator.bio"/>
      <website
        class="q-pr-sm q-pl-sm"
        v-if="validator.website"
        v-bind:website ="validator.website"
        v-bind:link="validator.link"
        v-bind:nodeID="validator.nodeID"
      />
      <div style="max-width: 330px;" class="q-pl-sm q-pt-md q-pb-md">
        <i v-if="!more">{{ getLessBio(validator.bio) }}</i>
        <i v-else>{{ validator.bio }}</i>
        <span v-if="isEnav(validator.bio) && !more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"> read more...</span>
        <span v-if="isEnav(validator.bio) && more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"><q-icon name="expand_less" /></span>
      </div>
      <q-separator v-if="validator.version"/>
      <div class="row" v-if="validator.version">
        <info
          flat
          v-bind:version="validator.version"
          v-bind:country="validator.country"
          v-bind:continent="validator.continent"
          v-bind:countryCode="validator.countryCode"
          v-bind:lastReceived="validator.lastReceived"
          v-bind:lastSent="validator.lastSent"
        />
      </div>
      <q-separator/>
      <div class="row">
        <stake
          flat class="col-12"
          v-bind:stakeAmount="stakeAmount"
          v-bind:delegateStake="delegateStake"
          v-bind:totalStakeAmount="totalStakeAmount"
        />
        <q-separator />
        <delegate
          flat class="col-12"
          v-bind:validator="validator"
        />
        <q-separator />
        <reward
          flat class="col-12"
          v-bind:validator="validator"
        />
      </div>
      <q-separator />
      <div class="row q-pa-md">
        <delegations
          v-bind:delegators="delegators"
          class="col-12"
        />
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
            <q-card-section class="col-6" style="text-align: right;">
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
  openURL
} from 'quasar'

import {
  date,
  fromNow
} from './../../modules/time.js'

import {
  _getPastRatingEvents
} from './../../modules/networkCChain.js'

import { round } from './../../utils/commons.js'
const humanizeDuration = require('humanize-duration')

export default {
  name: 'ValidatorDetails',
  components: {
    Name: () => import('components/validator/name.vue'),
    Rank: () => import('components/validator/rank.vue'),
    Info: () => import('components/validator/info.vue'),
    Stake: () => import('components/validator/stake.vue'),
    Delegate: () => import('components/validator/delegate.vue'),
    Delegations: () => import('components/validator/delegations.vue'),
    Reward: () => import('components/validator/reward.vue'),
    Owner: () => import('components/validator/owner.vue'),
    Avatar: () => import('components/validator/avatar.vue'),
    Website: () => import('components/validator/website.vue'),
    ProgressBarValidateSession: () => import('components/progress-bar-validatе-session.vue')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false
    },
    avatarUrl: {
      type: String,
      required: false
    },
    bio: {
      type: String,
      required: false
    },
    link: {
      type: String,
      required: false
    },
    website: {
      type: String,
      required: false
    }
  },
  computed: {
    ...mapGetters([
      'validatorById'
    ]),
    validator: function () {
      const validator = this.getValidator(this.getId())
      if (!validator) return {}

      return validator
    },
    delegators: function () {
      if (!this.validator.delegators) return []
      return this.validator.delegators
    },
    delegateStake: function () {
      if (!this.validator.delegateStake) return ''
      return this.validator
        .delegateStake
    },
    avatar: function () {
      if (!this.validator.avatar) return ''
      return this.validator
        .avatar
    },
    stakeAmount: function () {
      if (!this.validator.stakeAmount) return ''
      return this.validator
        .stakeAmount
    },
    status: function () {
      if (!this.validator.connected) return ''
      return this.validator
        .connected
    },
    totalStakeAmount: function () {
      if (!this.validator.totalStakeAmount) return ''
      return this.validator
        .totalStakeAmount
    },
    rewardOwner: function () {
      if (!this.validator.rewardOwner) return ''
      const result = this.validator.rewardOwner.addresses
      if (result) return result[0]
      return ''
    }
  },
  created () {
    if (!this.validator.nodeID) this.$router.push('/search/' + this.$route.params.id)
  },
  methods: {
    getId () {
      if (!this.id) return ''
      return this.id
    },
    getBio () {
      if (!this.bio) {
        return this.validator.bio
      }
      return this.bio
    },
    getAvatar () {
      if (!this.avatarUrl) {
        return this.avatar
      }
      return this.avatarUrl
    },
    getName () {
      if (!this.name) {
        return this.validator.name
      }
      return this.name
    },
    getLink () {
      if (!this.link) {
        return this.validator.link
      }
      return this.link
    },
    getWebsite () {
      if (!this.website) {
        return this.validator.website
      }
      return this.website
    },
    getDurationL (val) {
      if (!val) return
      return humanizeDuration(val, {
        units: ['y', 'mo', 'd'],
        round: true
      })
    },
    getLessBio (val) {
      if (!val) return ''
      return val.substr(0, 240)
    },
    isEnav (val) {
      if (!val) return false
      return val.length > 240
    },
    stakedBy (date) {
      return fromNow(date)
    },
    getValidator (param) {
      const validator = this.validatorById(param)
      if (!validator) return { rewardOwner: { addresses: [] }, startTime: '', endTime: '' }

      return validator
    },
    async getRating () {
      const events = await _getPastRatingEvents(this.validator.nodeID)
      console.log(events)
    },
    getUpTime (val) {
      if (!val) return 0
      return round(val * 100, 1000)
    },
    getColorUptime (val) {
      if (val >= 0.6) return 'positive'
      return 'negative'
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
  },
  data () {
    return {
      more: false
    }
  }
}
</script>
