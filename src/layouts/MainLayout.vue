<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header reveal>
      <div class="gt-sm">
        <q-toolbar class="background-white">
          <q-toolbar-title
            @click="$router.push('/')"
            id="toolbar-title">
            VScout.io <q-icon name="home" color="grey" />
          </q-toolbar-title>
          <q-toolbar-title>
            $
            <small class="text-grey" style="font-size: 15px;">
              {{ avaxPrice }} | AVAX/USD
            </small>
          </q-toolbar-title>
          <img src="~assets/block.svg" id="logo-block"/>
          <small class="text-grey" style="font-size: 15px;">
            {{ height }}
            <tooltip-style v-bind:text="'Last accepted block on P-Chain (Height)'" />
          </small>
          <q-btn color="secondary" flat label="Add Identification" icon="perm_identity" @click.native="onAddIdentification" />
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
              placeholder="Search Validator/Blockchain/Subnet/P-address"
              clearable v-model="filter"
              @keydown.enter.prevent="search"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </q-toolbar>
      </div>
      <div class="sm background-orange">
        <q-toolbar class="background-white">
          <q-btn flat label="Add Identification" @click.native="onAddIdentification" />
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
        <q-toolbar>
          <q-toolbar-title style="margin-right: 10%;">
            <img src="~assets/vscoutlogo5.svg" style="width: 200px;">
          </q-toolbar-title>
          <q-toolbar-title class="text-white">
            $
            <span>
              {{ avaxPrice }} | AVAX/USD
            </span>
          </q-toolbar-title>
          <q-toolbar-title class="text-white">
            <img src="~assets/block.svg" id="logo-block"/>
            <span style="padding-top: -20px;">
              {{ height }}
              <tooltip-style v-bind:text="'Last accepted block on P-Chain (Height)'" />
            </span>
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar>
          <div class="row">
            <div class="col-5" v-if="validatorById(nodeID)">
              <span>
                <countdown class="row" v-bind:color="'#ffffff'" v-bind:countdown="getRemainigTime()" />
                <tooltip-style v-bind:text="'Remaining validation time for ' + nodeID  + ''" />
              </span>
            </div>
            <div class="col-2" v-if="validatorById(nodeID)"></div>
            <div class="col-5">
              <q-bar style="min-width: 380px;">
                <q-input
                  outlined
                  dark
                  stack-label
                  color="white"
                  style="min-width: 350px;"
                  placeholder="Search Validator/Blockchain/Subnet/P-address"
                  clearable v-model="filter"
                  @keydown.enter.prevent="search"
                >
                  <template v-slot:append>
                    <q-icon name="search" @click="search"/>
                  </template>
                </q-input>
              </q-bar>
            </div>
          </div>
        </q-toolbar>
      </div>
      <div class="lt-sm background-white">
        <q-toolbar>
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <q-toolbar-title>
            <img src="~assets/block.svg" id="logo-block"/>
            <small class="text-grey">
              {{ height }}
              <tooltip-style v-bind:text="'Last accepted block on P-Chain (Height)'" />
            </small>
          </q-toolbar-title>
          <a id="faq2" class="text-grey" href="#faqs">FAQ</a>
        </q-toolbar>
        <div class="q-pb-md">
          <span v-if="validatorById(nodeID)">
            <countdown
              class="row"
              v-bind:color="'#32353b'"
              v-bind:countdown="getRemainigTime()"
            />
          </span>
        </div>
        <div class="background-orange q-pb-md">
          <div class="row">
            <div class="col-6 q-pl-md">
              <img src="~assets/vscoutlogo5.svg" style="width: 150px;">
            </div>
            <div class="text-white col-6 q-pr-md" style="text-align: right;margin-top: 7%;font-size: 15px;">
              $
              <small>
                {{ avaxPrice }} | AVAX/USD
              </small>
            </div>
          </div>
          <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 100%;"
              placeholder="Search Validator/Blockchain/Subnet/P-address"
              clearable v-model="filter"
              @keydown.enter.prevent="search"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </div>
      </div>
      <div id="header-line"></div>
      <add-identification-dialog ref="addIdentificationRef" />
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
          color="secondary"
        />
      </q-page-sticky>
      <keep-alive>
        <router-view />
      </keep-alive>
       <!-- place QPageScroller at end of page-->
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
          <q-btn fab icon="keyboard_arrow_up" color="secondary" />
        </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  SET_BALANCE,
  GET_SUBNETS,
  GET_BLOCKCHAINS
} from './../store/app/types'

import { round } from './../utils/commons.js'
import { _getTxStatus, _getBalance } from './../modules/network.js'

export default {
  name: 'MainLayout',
  components: {
    Calculator: () => import('components/items/calculator'),
    TooltipStyle: () => import('components/tooltip-style'),
    Countdown: () => import('components/items/countdown'),
    ListSubnets: () => import('components/list-subnets'),
    SwitchEndpoint: () => import('components/switch-endpoint'),
    ListBlockchains: () => import('components/list-blockchains'),
    AddIdentificationDialog: () => import('components/dialogs/add-identification-dialog')
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'subnets',
      'height',
      'blockchains',
      'avaxUsdPrice',
      'networkEndpoint',
      'hasNetworkConnection',
      'validatorById',
      'blockchainByID',
      'blockchainByName',
      'subnetByID'
    ]),
    avaxPrice: function () {
      if (!this.avaxUsdPrice) return 0

      return round(this.avaxUsdPrice, 10000)
        .toString()
        .padEnd(4, '0')
    }
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
    onAddIdentification () {
      this.$refs.addIdentificationRef.openAddId()
    },
    async search () {
      if (!this.filter || this.filter === 'undefined') return
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

      // const tx = await this.getTx(this.filter)
      // if (tx) {
      //   this.$router.push(`/tx/${this.filter}/${tx}`)
      //   this.filter = ''
      //   return
      // }
      const pAddress = await this.getPAddress(this.filter)
      if (pAddress) {
        this.$router.push(`/address/${this.filter}`)
        this.filter = ''
        return
      }

      // if (tx) {
      //   this.$router.push(`/tx/${this.filter}/${tx}`)
      //   this.filter = ''
      //   return
      // }
      this.$router.push(`/search/${this.filter}`)
      this.filter = ''
    },
    getValidator (param) {
      const validator = this.validatorById(param)
      if (!validator) return

      return validator
    },
    async getTx (param) {
      const tx = await _getTxStatus({ endpoint: this.networkEndpoint.url, params: { txID: param } })
      if (tx.data.error) return null
      return tx.data.result
    },
    async getPAddress (param) {
      try {
        const res = await _getBalance({ endpoint: this.networkEndpoint.url, params: { address: param } })
        if (res.data.error) return

        const response = res.data.result

        this.$store.commit(SET_BALANCE, { addressBalance: response })
        return true
      } catch (err) {
        this.$store.commit(SET_BALANCE, { addressBalance: {} })
        return null
      }
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
   background:#aa7dc9;
   opacity: 0.5;
 }
</style>
