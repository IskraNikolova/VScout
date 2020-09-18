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
              <q-banner class="q-pa-md" dense style="width: 430px;">
                <div class="q-pb-md">Reward Calculator</div>
                <div class="q-pa-md absolute-top-right">
                  Current Supply
                  <q-badge outline size="xs" color="accent" label="360M" />
                </div>
                <q-input
                  label-color="orange"
                  outlined
                  v-model="stakeAmount"
                  label="Staking Amount"
                  input-class="text-right"
                  suffix="$AVAX"
                  color="accent"
                  @input="calculate"
                  class="q-pb-xl"
                />
                <!--:rules="[value => value >= 2000 || 'Stake Amount must be greater or equal to 2000 $AVAX']"-->
                <q-slider
                  class="q-ml-xs q-mr-xs"
                  v-model="stakeTime"
                  :min="1"
                  :max="365"
                  :step="1"
                  :label-value="'Staking Time ' + stakeTime + ' days'"
                  label-always
                  @input="calculate"
                  label-text-color="orange"
                  label-color="white"
                  color="orange"
                />
                  <div>
                    <small>Reward Earning </small>
                    <div>
                      <span class="text-accent">
                        {{ rewardAvax }}
                      </span> $AVAX
                      (<small class="text-accent">
                        {{ reward }} $nAVAX
                      </small>)
                    </div>
                  </div>
              </q-banner>
            </q-popup-proxy>
            <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Reward Calculator</q-tooltip>
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
          <a style="text-decoration: none;margin-top: -3px;padding-left: 20px;padding-right: 20px;" class="text-grey" href="#faqs">FAQ</a>
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
                Switch To Endpoint
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
              <q-btn push flat no-caps label="Calculator" style="margin-left: -50px;">
                <q-popup-proxy>
                  <q-banner class="q-pa-md" dense style="width: 430px;">
                    <div class="q-pb-md">Reward Calculator</div>
                    <div class="q-pa-md absolute-top-right">
                      <q-badge outline size="xs" color="accent" :label="percentReward.toFixed(2) + '%'" />
                    </div>
                    <q-input
                      label-color="orange"
                      outlined
                      v-model="stakeAmount"
                      label="Staking Amount"
                      mask="#"
                      input-class="text-right"
                      suffix="$AVAX"
                      precision= '2'
                      reverse-fill-mask
                      color="accent"
                      @input="calculate"
                      class="q-pb-xl"
                      :rules="[value => value >= 2000 || 'Stake Amount must be greater or equal to 2000 $AVAX']"
                    />
                    <q-slider
                      class="q-ml-xs q-mr-xs"
                      v-model="stakeTime"
                      :min="2"
                      :max="52"
                      :step="1"
                      :label-value="'Staking Time ' + stakeTime + ' weeks'"
                      label-always
                      @input="calculate"
                      label-text-color="orange"
                      label-color="white"
                      color="orange"
                    />
                    <div class="row">
                      <div class="q-pl-md">
                        <small>Yearly Earning </small>
                        <div>
                          <span class="text-accent">
                            {{ reward }}
                          </span> $nAVAX
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

const units = require('./../utils/constants.js')
import { reward } from './../modules/reward.js'

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
      stakeAmount: 2000
    }
  },
  methods: {
    ...mapActions({
      getSubnets: GET_SUBNETS,
      getBlockchains: GET_BLOCKCHAINS
    }),
    calculate () {
      const rewardNAvax = reward(Math.round(this.stakeTime), this.stakeAmount * units.Avax, 360 * units.MegaAvax, 365)
      this.reward = Math.round(rewardNAvax, 2)
      this.rewardAvax = this.getAvaFromnAva(rewardNAvax)
    },
    getAvaFromnAva (v) {
      return parseFloat(v) / 10 ** 9
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
