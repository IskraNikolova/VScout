<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header reveal>
      <div class="gt-xs">
        <q-toolbar class="background-white">
          <q-toolbar-title
            @click="$router.push('/')"
            id="toolbar-title">
            VScout.io <q-icon name="home" color="grey" />
          </q-toolbar-title>

          <img src="~assets/block.svg" id="logo-block"/>
          <span class="q-pl-xs q-pr-xl text-grey">
            {{ height }}
            <tooltip-style v-bind:text="'Last accepted block on P-Chain (Height)'" />
          </span>
          <calculator />
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
            <tooltip-style v-bind:text="'Connect To Node'" />
          </q-btn>
        </q-toolbar>
        <q-toolbar class="background-orange">
          <q-toolbar-title>
            <img src="~assets/vscoutlogo5.svg" style="width: 200px;">
          </q-toolbar-title>
          <span v-if="validatorById(nodeID)" style="min-width: 300px;margin-right: 15%;">
            <countdown class="row" v-bind:color="'#ffffff'" v-bind:countdown="getRemainigTime()" />
            <tooltip-style v-bind:text="'Remaining validation time for ' + nodeID  + ''" />
          </span>
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
      <div class="lt-sm">
        <div class="background-white row">
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <div class="col" @click="$router.push('/')" style="cursor:pointer;margin-top: 7px;margin-left: 7px;">
            VScout.io
          </div>
          <a id="faq2" class="text-grey" href="#faqs">FAQ</a>
        </div>
        <div class="background-white q-pb-md">
          <span v-if="validatorById(nodeID)">
            <countdown
              class="row"
              v-bind:color="'#32353b'"
              v-bind:countdown="getRemainigTime()"
            />
          </span>
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
      <div id="header-line"></div>
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
              <calculator style="margin-left: -30px;" />
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
       <!-- place QPageScroller at end of page-->
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
          <q-btn fab icon="keyboard_arrow_up" color="orange" />
        </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  GET_SUBNETS,
  GET_BLOCKCHAINS
} from './../store/app/types'

export default {
  name: 'MainLayout',
  components: {
    Calculator: () => import('components/items/calculator'),
    TooltipStyle: () => import('components/tooltip-style'),
    Countdown: () => import('components/items/countdown'),
    ListSubnets: () => import('components/list-subnets'),
    SwitchEndpoint: () => import('components/switch-endpoint'),
    ListBlockchains: () => import('components/list-blockchains')
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'subnets',
      'height',
      'blockchains',
      'networkEndpoint',
      'hasNetworkConnection',
      'validatorById',
      'blockchainByID',
      'blockchainByName',
      'subnetByID'
    ])
  },
  data () {
    return {
      filter: '',
      isB: false,
      isS: false,
      isE: false,
      drawer: false
    }
  },
  methods: {
    ...mapActions({
      getSubnets: GET_SUBNETS,
      getBlockchains: GET_BLOCKCHAINS
    }),
    getRemainigTime () {
      const validator = this.validatorById(this.nodeID)
      if (!validator) return
      return validator.remainingTime
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
      const validator = this.getValidator(this.filter)
      if (validator) {
        this.$router.push(`/validator/${this.filter}`)
        this.filter = ''
        return
      }

      const subnet = this.getSubnet(this.filter)
      if (subnet) {
        this.$router.push(`/subnet/${this.filter}`)
        this.filter = ''
        return
      }

      const blockchain = this.getBlockchain(this.filter)
      if (blockchain) {
        this.$router.push(`/blockchain/${this.filter}`)
        this.filter = ''
        return
      }
      this.$router.push(`/search/${this.filter}`)
      this.filter = ''
    },
    getValidator (param) {
      const validator = this.validatorById(param)
      if (!validator) return

      return validator
    },
    getBlockchain (param) {
      let blockchain = this.blockchainByID(param)
      if (!blockchain) {
        blockchain = this.blockchainByName(param)
      }

      if (!blockchain) return

      return blockchain
    },
    getSubnet (param) {
      const subnet = this.subnetByID(param)
      if (!subnet) return

      return subnet
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
  #faq2 {
    text-decoration: none;
    padding-top: 5px;
    padding-left: 20px;
    padding-right: 20px;
  }
  #toolbar-title {
    cursor:pointer;
    margin-left: 12px;
  }
  #header-line {
   height: 3px;
   width: 100%;
   background: #32353b;
   opacity: 0.5;
 }
</style>
