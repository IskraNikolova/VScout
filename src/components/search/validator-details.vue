<template>
  <div>
    <!--gt-xs-->
    <q-card flat class="gt-xs q-pa-xl panel">
      <div class="row">
        <q-item class="col-9">
          <avatar v-bind:avatar="getAvatar()" style="cursor:pointer;" @click="onClick(getLink())"/>
          <q-item-section>
            <rank v-bind:rank="val.rank" />
            <name v-bind:name="getName()" v-bind:nodeID="val.nodeID" v-bind:link="getLink()" />
            <owner v-bind:owner="rewardOwner" v-if="rewardOwner"/>
          </q-item-section>
        </q-item>
        <div class="col-3 q-pt-xl">
          <span class="text-subtitle2"><small style="opacity: 0.8;">NETWORK SHARE</small></span>
          <span class="q-pl-xs" v-if="val.percent !== 'NaN'">
            {{ val.percent }}<span class="text-accent text-medium"> %</span>
          </span>
          <br />
          <span class="text-subtitle2"><small style="opacity: 0.8;">STAKING PERIOD</small></span>
          <span class="q-pl-xs">
            {{ getDurationL(val.duration) }}
          </span>
        </div>
      </div>
      <website
        v-if="getWebsite()"
        v-bind:website ="getWebsite()"
        v-bind:link="getLink()"
        v-bind:nodeID="val.nodeID"
      />
      <div class="q-pl-sm q-pt-sm">
        <i v-if="!more">{{ getLessBio(getBio()) }}</i>
        <i v-else>{{ getBio() }}</i>
        <span v-if="isEnav(getBio()) && !more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"> read more...</span>
        <span v-if="isEnav(getBio()) && more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"><q-icon name="expand_less" /></span>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="q-mr-md" v-if="val.version">
            <info
              class="q-mt-md my-card dark-panel"
              style="border-radius: 10px;"
              v-bind:role="'VALIDATOR'"
              v-bind:version="val.version"
              v-bind:country="val.country"
              v-bind:isp="val.isp"
              v-bind:countryCode="val.countryCode"
              v-bind:lastReceived="val.lastReceived"
              v-bind:lastSent="val.lastSent"
            />
          </div>
          <div class="q-mr-md">
            <stake
              class="q-mt-md my-card dark-panel"
              style="border-radius: 10px;"
              v-bind:weight="weight"
              v-bind:delegateStake="delegateStake"
              v-bind:txID="txID"
              v-bind:totalStakeAmount="totalStakeAmount"
            />
            <delegate
              class="q-mt-md my-card dark-panel"
              style="border-radius: 10px;"
              v-bind:validator="val"
            />
          </div>
        </div>
        <!--<div v-else  class="col-6">
          <div class="q-mr-md">
          <div class="q-mt-md q-pa-md my-card dark-panel"
              style="border-radius: 10px;">
              <div class="q-mb-sm">Progress (%)</div>
              <progress-bar-validate-session
                v-bind:startTime="startTime"
                v-bind:endTime="endTime"
              />
              <div class="row">
                <div class="col-6">
                  <small class="text-bold">Start Time</small>
                  <br />
                  <small>{{ formatDate(startTime) }}</small>
                </div>
                <div class="col-6" style="text-align: right;">
                  <small class="text-bold">End Time</small>
                  <br />
                  <small>{{ formatDate(endTime) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>-->
        <div class="col-6">
         <uptime
           class="q-mt-md my-card dark-panel"
           style="border-radius: 10px;"
           v-bind:state="state"
           v-bind:uptime="val.uptime"
           v-bind:uptimes="val.uptimes"
         />
          <reward
            class="q-mt-md my-card dark-panel"
            style="border-radius: 10px;"
            v-bind:validator="val"
          />
          <delegations
            class="q-mt-md my-card dark-panel q-pa-md"
            style="border-radius: 10px;"
            v-bind:count="validator.delegatorCount"
            v-bind:weight="validator.delegatorWeight"
            v-bind:fee="validator.delegationFee"
          />
                    <div class="q-mt-md q-pa-md q-mr-md my-card dark-panel"
              style="border-radius: 10px;">
              <div class="q-mb-sm">Progress (%)</div>
              <progress-bar-validate-session
                v-bind:startTime="startTime"
                v-bind:endTime="endTime"
              />
              <div class="row">
                <div class="col-6">
                  <small class="text-bold">Start Time</small>
                  <br />
                  <small>{{ formatDate(startTime) }}</small>
                </div>
                <div class="col-6" style="text-align: right;">
                  <small class="text-bold">End Time</small>
                  <br />
                  <small>{{ formatDate(endTime) }}</small>
                </div>
              </div>
          </div>
        </div>
      </div>
    </q-card>

    <!--lt-sm-->
    <q-card flat class="lt-sm panel2">
      <q-item>
        <avatar
          v-bind:avatar="getAvatar()"
          style="cursor:pointer;"
          @click="onClick(getLink())"
        />
        <q-item-section  class="q-mt-xl">
          <rank v-bind:rank="val.rank" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <name
            v-bind:name="getName()"
            v-bind:nodeID="val.nodeID"
            v-bind:link="getLink()"
          />
          <owner v-bind:owner="rewardOwner" v-if="rewardOwner"/>
        </q-item-section>
      </q-item>
      <q-separator v-if="getBio()"/>
      <website
        class="q-pr-sm q-pl-sm panel2"
        v-if="getWebsite()"
        v-bind:website ="getWebsite()"
        v-bind:link="getLink()"
        v-bind:nodeID="val.nodeID"
      />
      <div style="max-width: 330px;" class="q-pl-sm q-pt-md q-pb-md">
        <i v-if="!more">{{ getLessBio(getBio()) }}</i>
        <i v-else>{{ getBio() }}</i>
        <span v-if="isEnav(getBio()) && !more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"> read more...</span>
        <span v-if="isEnav(getBio()) && more" style="font-style: italic;color:#588da8;cursor:pointer;" @click="more=!more"><q-icon name="expand_less" /></span>
      </div>
      <q-separator />
        <uptime
           class="q-mt-md my-card dark-panel"
           style="border-radius: 10px;"
           v-bind:state="state"
           v-bind:uptime="val.uptime"
           v-bind:uptimes="val.uptimes"
         />
      <q-separator v-if="val.version"/>
      <div class="row" v-if="val.version">
        <info
          flat
          v-bind:role="'VALIDATOR'"
          v-bind:version="val.version"
          v-bind:country="val.country"
          v-bind:isp="val.isp"
          v-bind:countryCode="val.countryCode"
          v-bind:lastReceived="val.lastReceived"
          v-bind:lastSent="val.lastSent"
        />
      </div>
      <q-separator/>
      <div class="row">
        <stake
          flat class="col-12"
          v-bind:weight="weight"
          v-bind:delegateStake="delegateStake"
          v-bind:txID="txID"
          v-bind:totalStakeAmount="totalStakeAmount"
        />
        <q-separator />
        <delegate
          flat class="col-12"
          v-bind:validator="val"
        />
        <q-separator />
        <reward
          flat class="col-12"
          v-bind:validator="val"
        />
      </div>
      <q-separator />
      <div class="row q-pa-md">
        <delegations
          v-bind:count="validator.delegatorCount"
          v-bind:weight="validator.delegatorWeight"
          v-bind:fee="validator.delegationFee"
          class="col-12"
        />
      </div>
      <div class="row">
        <div class="col">
          <q-card-section>
            <div class="text-grey q-pt-xl">Progress (%)</div>
            <progress-bar-validate-session
              v-bind:startTime="startTime"
              v-bind:endTime="endTime"
            />
          </q-card-section>
          <q-card-section horizontal>
            <q-card-section class="col-6">
            <small class="text-grey text-bold">Start Time</small>
            <br />
            <small>{{ formatDate(startTime) }}</small>
            </q-card-section>
            <q-separator vertical/>
            <q-card-section class="col-6" style="text-align: right;">
            <small class="text-grey text-bold">End Time</small>
            <br />
            <small>{{ formatDate(endTime) }}</small>
            </q-card-section>
          </q-card-section>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  openURL
} from 'quasar'

// import {
//   reward,
//   substractDelegationFee
// } from './../../modules/reward.js'

// import {
//   getAvaFromnAva
// } from './../../utils/avax.js'

import {
  date,
  fromNow,
  getDuration
} from './../../modules/time.js'

import {
  round
} from './../../utils/commons.js'

import {
  _getPastRatingEvents
} from './../../modules/networkCChain.js'

const humanizeDuration = require('humanize-duration')

export default {
  name: 'ValidatorDetails',
  components: {
    Name: () => import('components/validator/name.vue'),
    Rank: () => import('components/validator/rank.vue'),
    Info: () => import('components/validator/info.vue'),
    Uptime: () => import('components/validator/uptime.vue'),
    Stake: () => import('components/validator/stake.vue'),
    Delegate: () => import('components/validator/delegate.vue'),
    Delegations: () => import('components/validator/delegations.vue'),
    Reward: () => import('components/validator/reward.vue'),
    Owner: () => import('components/validator/owner.vue'),
    Avatar: () => import('components/validator/avatar.vue'),
    Website: () => import('components/validator/website.vue'),
    ProgressBarValidateSession: () => import('components/progress-bar-validatе-session.vue')
  },
  watch: {
    validator: {
      handler: async function (v) {
        this.val = v
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
      'validator',
      'validatorById',
      'delegators',
      'currentSupply'
    ]),
    delegatorsL: function () {
      if (!this.val.delegators) return []
      if (Array.isArray(this.val.delegators)) return this.val.delegators
      return this.delegators[this.val.nodeID]
    },
    delegateStake: function () {
      if (!this.val.delegatorWeight) return ''
      return this.val
        .delegatorWeight
    },
    startTime: function () {
      if (!this.val.startTime) return ''
      return this.val
        .startTime
    },
    endTime: function () {
      if (!this.val.endTime) return ''
      return this.val
        .endTime
    },
    duration: function () {
      return getDuration(this.startTime, this.endTime)
    },
    txID: function () {
      if (!this.val.txID) return ''
      return this.val
        .txID
    },
    weight: function () {
      if (!this.val.weight) return ''
      return this.val
        .weight
    },
    state: function () {
      if (!this.val.connected) return false
      return this.val
        .connected
    },
    totalStakeAmount: function () {
      if (!this.val.totalStakeAmount) return ''
      return this.val
        .totalStakeAmount
    },
    rewardOwner: function () {
      if (!this.val.rewardOwner) return ''
      const result = this.val.rewardOwner.addresses
      if (result) return result[0]
      return ''
    }
  },
  created () {
    this.val = this.getValidator()
    if (!this.val) this.$router.push('/search/' + this.$route.params.id)
  },
  methods: {
    // calculateDel (duration, amount) {
    //   let rewardNAvax = reward(
    //     getAvaFromnAva(duration),
    //     amount,
    //     this.currentSupply
    //   )

    //   const delReward = substractDelegationFee(
    //     rewardNAvax,
    //     this.validator.delegationFee
    //   )
    //   rewardNAvax = delReward.result
    //   this.feeAmountnAvax = this.getFormat(parseFloat(delReward.fee))
    //   this.feeAmount = this.getFormat(getAvaFromnAva(delReward.fee))

    //   this.reward = rewardNAvax
    //   this.rewardAvax = getAvaFromnAva(rewardNAvax)
    // },
    getValidator () {
      if (this.id) {
        const v = this.validatorById(this.id)
        if (Array.isArrayv.delegators) return v
        const delegators = this.delegators[v.nodeID]
        v.delegators = delegators
        return v
      }
      return this.validator
    },
    getBio () {
      if (this.bio) return this.bio
      return this.val.bio
    },
    getName () {
      if (this.name) return this.name
      return this.val.name
    },
    getLink () {
      if (this.link) return this.link
      return this.val.link
    },
    getAvatar () {
      if (this.avatarUrl) return this.avatarUrl
      return this.val.avatar ? this.val.avatar : this.val.avatarUrl
    },
    getWebsite () {
      if (this.website) return this.website
      return this.val.website
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
    async getRating () {
      const events = await _getPastRatingEvents(this.val.nodeID)
      console.log(events)
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
    },
    getFormat (val) {
      return round(val, 100).toLocaleString()
    }
  },
  data () {
    return {
      reward: 0,
      rewardAvax: 0,
      rewardUsd: 0,
      percent: 0,
      more: false,
      val: {}
    }
  },
  props: {
    id: {
      type: String,
      required: false
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
  }
}
</script>
