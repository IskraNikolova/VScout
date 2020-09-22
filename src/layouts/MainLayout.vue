<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header reveal>
      <div class="gt-xs">
        <q-toolbar class="background-white">
          <q-toolbar-title @click="$router.push('/')" style="cursor:pointer;margin-left: 12px;">
            VScout.io <q-icon name="home" color="grey" />
          </q-toolbar-title>
          <q-btn push flat id="logo-sim" label="calculator" @click="calculate">
            <q-popup-proxy>
              <q-banner class="q-pa-md" dense style="width: 340px;">
                <div class="q-pb-md row">
                  <div class="col-6 text-medium">Reward Calculator</div>
                  <div class="col-6 q-mt-md" style="margin-bottom: -10px;padding-left: 12px;">
                    <small class="q-pr-xs">Current Supply </small>
                    <q-badge outline size="xs" color="accent" :label="getCurrentSupply() + 'M'" />
                  </div>
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
                />
                <!--:rules="[value => value >= 2000 || 'Stake Amount must be greater or equal to 2000 $AVAX']"-->
                <div class="row q-mt-md">
                  <div class="col-10">
                    <q-badge outline color="orange" style="height: 27px;" class="q-pb-xs q-pt-xs q-mb-xs">
                      Staking Time (1 to 365 days)
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
                  :min="1"
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
                      {{ rewardAvax }}
                    </span> AVAX
                    (<small class="text-grey">
                      {{ reward.toLocaleString() }} <span class="text-accent">nAVAX</span>
                    </small>)
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <q-btn
            flat
            label="blockchains"
            class="text-regular text-grey"
            @click="onGetBlockchains"
          >
          <q-menu>
            <div class="no-wrap q-pa-md text-grey">
              Switch To Blockchain
              <q-spinner-dots v-if="blockchains.length < 1" />
            </div>
            <q-separator />
            <list-blockchains />
            </q-menu>
          </q-btn>
          <q-btn
            flat
            label="subnets"
            class="text-regular text-grey"
            @click="onGetSubnets"
          >
          <q-menu>
            <div class="no-wrap q-pa-md text-grey">
              Switch To Subnet
              <q-spinner-dots v-if="subnets.length < 1" />
            </div>
            <q-separator />
            <list-subnets />
          </q-menu>
          </q-btn>
          <a
            id="faq"
            class="text-grey" href="#faqs">
            FAQ
          </a>
          <q-btn
            flat
            no-caps
            icon="img:statics/flash.svg"
            :label="networkEndpoint.name"
            class="text-regular text-grey"
            id="target-el"
          >
            <q-menu>
              <div class="no-wrap q-pa-md text-orange">
                Networks
              </div>
              <q-separator />
              <switch-endpoint />
            </q-menu>
            <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Connect To Node</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-toolbar class="background-orange">
          <q-toolbar-title>
            <img src="~assets/vscoutlogo5.svg" style="width: 200px;">
          </q-toolbar-title>
          <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 450px;"
              placeholder="Search Validator/Blockchain/Subnet"
              clearable v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </q-toolbar>
      </div>
      <div class="xs">
        <div class="background-white row">
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <div class="col" @click="$router.push('/')" style="cursor:pointer;margin-top: 7px;margin-left: 7px;">
            VScout.io
          </div>
          <a style="text-decoration: none;padding-top: 5px;padding-left: 20px;padding-right: 20px;" class="text-grey" href="#faqs">FAQ</a>
        </div>
        <div class="background-orange q-pb-md">
          <div>
            <img src="~assets/vscoutlogo5.svg" style="width: 150px;">
          </div>
          <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 100%;"
              placeholder="Search Validator/Blockchain/Subnet"
              clearable v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </div>
      </div>
    </q-header>
    <q-drawer
      v-model="drawer"
      :width="200"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/rwc.svg" />
            </q-item-section>

            <q-item-section>
              <q-btn push flat no-caps label="Calculator" @click="calculate" style="margin-left: -50px;">
                <q-popup-proxy>
                  <q-banner class="q-pa-md" dense style="width: 350px;">
                    <div class="q-pb-md row">
                      <div class="col-6 text-medium">Reward Calculator</div>
                      <div class="col-6 q-mt-md" style="margin-bottom: -10px;padding-right: -3px;">
                        <small class="q-pr-xs">Current Supply </small>
                        <q-badge outline size="xs" color="accent" :label="getCurrentSupply() + 'M'" />
                      </div>
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
                    />
                    <!--:rules="[value => value >= 2000 || 'Stake Amount must be greater or equal to 2000 $AVAX']"-->
                    <div class="row q-mt-md">
                      <div class="col-10">
                        <q-badge outline color="orange" style="height: 25px;" class="q-pb-xs q-pt-xs q-mb-xs">
                          Staking Time (1 to 365 days)
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
                      :min="1"
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
                          {{ rewardAvax }}
                        </span> AVAX
                         (<small class="text-grey">
                            {{ reward.toLocaleString() }} nAVAX
                          </small>)
                        <div>
                        </div>
                      </div>
                    </div>
                  </q-banner>
                </q-popup-proxy>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/blockchain-black.svg" />
            </q-item-section>

            <q-item-section>
              <span @click="onBlockchainClick">Blockchains</span>
              <q-dialog v-model="isB" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Blockchains</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-spinner-dots v-if="blockchains.length < 1" />
                    <list-blockchains />
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/network.svg" />
            </q-item-section>

            <q-item-section>
              <span @click="onSubnetClick">Subnets</span>
              <q-dialog v-model="isS" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Subnets</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-spinner-dots v-if="subnets.length < 1" />
                    <list-subnets />
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/flash.svg" />
            </q-item-section>

            <q-item-section>
              <span @click="isE=true">{{ networkEndpoint.name }}</span>
              <q-dialog v-model="isE" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Switch To Endpoint</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <switch-endpoint />
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <q-page-sticky
        position="top"
        class="z-max"
        :offset="[0, 18]"
        v-if="!hasNetworkConnection"
      >
        <q-btn
          round
          icon="wifi_off"
          size="lg"
          color="grey"
        />
      </q-page-sticky>
      <keep-alive>
        <router-view />
      </keep-alive>
       <!-- place QPageScroller at end of page -->
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
          <q-btn fab icon="keyboard_arrow_up" color="orange" />
        </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

const { Avax, maximumStakingDuration, stakeDurationMs } = require('./../utils/constants.js')
import { reward } from './../modules/reward.js'
import { round } from './../utils/commons.js'
import { getAvaFromnAva } from './../utils/avax.js'

import { date } from 'quasar'

const timeStamp = Date.now()
const formattedFrom = date.formatDate(timeStamp, 'YYYY/MM/DD')

let to = new Date(timeStamp)
to = date.addToDate(to, { days: 14 })
const formattedTo = date.formatDate(to, 'YYYY/MM/DD')

import {
  GET_SUBNETS,
  GET_BLOCKCHAINS
} from './../store/app/types'

export default {
  name: 'MainLayout',
  components: {
    ListSubnets: () => import('components/list-subnets'),
    SwitchEndpoint: () => import('components/switch-endpoint'),
    ListBlockchains: () => import('components/list-blockchains')
  },
  computed: {
    ...mapGetters([
      'subnets',
      'blockchains',
      'currentSupply',
      'networkEndpoint',
      'hasNetworkConnection'
    ])
  },
  data () {
    return {
      filter: '',
      isB: false,
      isS: false,
      isE: false,
      stakeTime: 1,
      reward: 0.00,
      rewardAvax: 0.00,
      drawer: false,
      percentReward: 4,
      stakeAmount: 2000,
      yearReward: 0,
      yearRewardnAvax: 0,
      model: { from: formattedFrom, to: formattedTo },
      date: { from: formattedFrom, to: formattedTo }
    }
  },
  methods: {
    ...mapActions({
      getSubnets: GET_SUBNETS,
      getBlockchains: GET_BLOCKCHAINS
    }),
    updateProxy () {
      this.model = this.date
    },
    getCurrentSupply () {
      const currentSupply = this.currentSupply.toString()
      const currentSupplyAvax = Math.round(getAvaFromnAva(Number(currentSupply)))
      return Math.round(currentSupplyAvax / 1000000)
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
    },
    calculate () {
      const durationMs = stakeDurationMs(this.stakeTime)
      const rewardNAvax = reward(
        durationMs,
        this.stakeAmount * Avax,
        this.currentSupply,
        maximumStakingDuration
      )

      this.reward = round(rewardNAvax, 100)
      this.rewardAvax = round(getAvaFromnAva(rewardNAvax), 10000)
      this.yearRewardnAvax = round((rewardNAvax / this.stakeTime) * 365, 100)
      this.yearReward = round(getAvaFromnAva(this.yearRewardnAvax), 10000)
    },
    async onGetBlockchains () {
      await this.getBlockchains({})
    },
    async onGetSubnets () {
      await this.getSubnets({})
    },
    async onBlockchainClick () {
      this.isB = true
      await this.getBlockchains({})
    },
    async onSubnetClick () {
      this.isS = true
      await this.getSubnets({})
    },
    search () {
      if (!this.filter) return
      this.$router.push(`/search/${this.filter}`)
      this.filter = ''
    }
  }
}
</script>

<style scoped>
  #faq {
    text-decoration: none;
    margin-top: -3px;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
