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
          <q-btn
            color="secondary"
            flat label="Add Identification"
            icon="perm_identity"
            @click.native="onAddIdentification"
          />
          <calculator />
          <q-btn
            flat
            label="blockchains"
            class="text-regular text-grey"
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
          <q-btn
            flat
            no-caps
            icon="img:statics/settings2.svg"
            class="text-regular text-grey"
            id="target-el"
          >
              <q-menu
              anchor="top right"
              self="top left">
              <div style="min-width: 250px;">
                <div class="no-wrap q-pa-md text-orange">
                  Settings
                </div>
                <q-separator />
                <q-item>
                  <q-item-section>
                    CURRENCY
                  </q-item-section>
                  <q-item-section side right>
                    <q-icon name="expand_more" @click="show=!show"/>
                  </q-item-section>
                </q-item>
                <div v-if="show">
                  <q-separator />
                    <q-item style="background-color: grey;">
                      <q-item-section class="text-white text-medium">
                        1.00 AVAX = {{ getSymbol(currentCurrency) }} {{ currenciesPriceList[`${currentCurrency}`] }}
                      </q-item-section>
                    </q-item>
                  <q-separator />
                  <q-separator />
                  <q-item>
                    <q-input v-model="val" @input="filterFn" label="Search currency" />
                  </q-item>
                  <span v-if="allCurrencies.length > 0">
                    <q-list style="min-width: 250px;" v-for="(c, i) in allCurrencies" v-bind:key="i">
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ getISO(c) }}</q-item-label>
                          <q-item-label caption lines="2">{{ getCurrencyName(c) }}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label><small class="text-purple text-medium">{{ getSymbol(c) }}</small> {{ currenciesPriceList[`${c}`] }}</q-item-label>
                          <q-icon size="xs" name="check_box" v-if="c === currentCurrency" />
                          <q-icon size="xs" name="check_box_outline_blank" v-else @click="setCurrentCurrency(c)"/>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section><small class="text-grey">24h High</small> <span style="font-size: 12px;" class="text-medium text-green">{{ high24h[`${c}`] }}</span></q-item-section>
                        <q-item-section side top><small class="text-grey">24h Low</small> <span style="font-size: 12px;" class="text-medium text-negative">{{ low24h[`${c}`] }}</span></q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </span>
                  <span v-else><q-item>No Results</q-item></span>
                </div>
              </div>
              </q-menu>
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
              color="purple"
              autofocus
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
          <q-btn
            color="secondary" flat
            label="Add Identification"
            @click.native="onAddIdentification"
          />
          <calculator />
          <q-btn
            flat
            label="blockchains"
            class="text-regular text-grey"
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
          <q-btn
            flat
            no-caps
            icon="img:statics/settings2.svg"
            class="text-regular text-grey"
            id="target-el"
          >
              <q-menu
              anchor="top right"
              self="top left">
              <div style="min-width: 250px;">
                <div class="no-wrap q-pa-md text-orange">
                  Settings
                </div>
                <q-separator />
                <q-item>
                  <q-item-section>
                    CURRENCY
                  </q-item-section>
                  <q-item-section side right>
                    <q-icon name="expand_more" @click="show=!show"/>
                  </q-item-section>
                </q-item>
                <div v-if="show">
                  <q-separator />
                    <q-item style="background-color: grey;">
                      <q-item-section class="text-white text-medium">
                        1.00 AVAX = {{ getSymbol(currentCurrency) }} {{ currenciesPriceList[`${currentCurrency}`] }}
                      </q-item-section>
                    </q-item>
                  <q-separator />
                  <q-separator />
                  <q-item>
                    <q-input v-model="val" @input="filterFn" label="Search currency" />
                  </q-item>
                  <span v-if="allCurrencies.length > 0">
                    <q-list style="min-width: 250px;" v-for="(c, i) in allCurrencies" v-bind:key="i">
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ getISO(c) }}</q-item-label>
                          <q-item-label caption lines="2">{{ getCurrencyName(c) }}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label><small class="text-purple text-medium">{{ getSymbol(c) }}</small> {{ currenciesPriceList[`${c}`] }}</q-item-label>
                          <q-icon size="xs" name="check_box" v-if="c === currentCurrency" />
                          <q-icon size="xs" name="check_box_outline_blank" v-else @click="setCurrentCurrency(c)"/>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section><small class="text-grey">24h High</small> <span style="font-size: 12px;" class="text-medium text-green">{{ high24h[`${c}`] }}</span></q-item-section>
                        <q-item-section side top><small class="text-grey">24h Low</small> <span style="font-size: 12px;" class="text-medium text-negative">{{ low24h[`${c}`] }}</span></q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </span>
                  <span v-else><q-item>No Results</q-item></span>
                </div>
              </div>
              </q-menu>
          </q-btn>
        </q-toolbar>
        <q-toolbar>
          <q-toolbar-title style="margin-right: 10%;">
            <img src="~assets/vscoutlogo5.svg" style="width: 200px;">
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar>
          <div class="row">
            <div class="col-5 q-pb-md" v-if="validatorById(nodeID)">
              <span>
                <countdown class="row" v-bind:color="'#ffffff'" v-bind:countdown="getRemainigTime()" />
                <tooltip-style v-bind:text="'Remaining validation time for ' + nodeID  + ''" />
              </span>
            </div>
            <div class="col-2" v-if="validatorById(nodeID)"></div>
            <div class="col-8 q-pb-md" v-else></div>
            <div class="col-4 q-pb-md">
              <q-bar style="min-width: 420px;">
                <q-input
                  outlined
                  dark
                  stack-label
                  color="purple"
                  style="min-width: 390px;"
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
          </div>
          <q-bar class="q-pb-sm">
            <q-input
              outlined
              dark
              stack-label
              color="purple"
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
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/flash.svg" />
            </q-item-section>

            <q-item-section>
              <span @click="isC=true">Currency</span>
              <q-dialog v-model="isC" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section class="text-purple text-medium">
                    1.00 AVAX = {{ getSymbol(currentCurrency) }} {{ currenciesPriceList[`${currentCurrency}`] }}
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-separator />
                  <q-item>
                    <q-input v-model="val" @input="filterFn" label="Search currency" />
                  </q-item>
                  <span v-if="allCurrencies.length > 0">
                    <q-list style="min-width: 250px;" v-for="(c, i) in allCurrencies" v-bind:key="i">
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ getISO(c) }}</q-item-label>
                          <q-item-label caption lines="2">{{ getCurrencyName(c) }}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label><small class="text-purple text-medium">{{ getSymbol(c) }}</small> {{ currenciesPriceList[`${c}`] }}</q-item-label>
                          <q-icon size="xs" name="check_box" v-if="c === currentCurrency" />
                          <q-icon size="xs" name="check_box_outline_blank" v-else @click="setCurrentCurrency(c)"/>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section><small class="text-grey">24h High</small> <span style="font-size: 12px;" class="text-medium text-green">{{ high24h[`${c}`] }}</span></q-item-section>
                        <q-item-section side top><small class="text-grey">24h Low</small> <span style="font-size: 12px;" class="text-medium text-negative">{{ low24h[`${c}`] }}</span></q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </span>
                  <span v-else><q-item>No Results</q-item></span>
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
    <q-footer reveal>
      <q-toolbar class="background-orange">
        <q-toolbar-title class="text-secondary" @click="$router.push('/')" style="cursor: pointer;"><small>VScout.io</small></q-toolbar-title>
        <q-btn @click="toUrl" flat><img src="~assets/discord.svg" id="logo-block"></q-btn>
      </q-toolbar>
    </q-footer>
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
import { mapGetters } from 'vuex'

import {
  SET_BALANCE,
  SET_CURRENT_CURRENCY
} from './../store/app/types'
import { openURL } from 'quasar'

import { _getTxStatus, _getBalance } from './../modules/network.js'
import { currencies } from './../utils/constants.js'

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
  created () {
    this.allCurrencies = Object.keys(this.currenciesPriceList)
    this.currency = {
      label: `${currencies.usd.isoCode} - ${currencies.usd.symbol} ${this.currenciesPriceList.usd}`,
      value: 'usd'
    }
    this.stringOptions = Object.keys(this.currenciesPriceList)
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'high24h',
      'low24h',
      'subnets',
      'blockchains',
      'currentCurrency',
      'currenciesPriceList',
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
      val: '',
      show: false,
      filter: '',
      isB: false,
      isS: false,
      isE: false,
      isC: false,
      drawer: false,
      currency: {},
      allCurrencies: []
    }
  },
  methods: {
    toUrl () {
      openURL('https://discord.gg/PPB67JYyAp')
    },
    getSymbol (currency) {
      return currencies[`${currency}`].symbol
    },
    getISO (currency) {
      return currencies[`${currency}`].isoCode
    },
    getCurrencyName (currency) {
      return currencies[`${currency}`].currency
    },
    setCurrentCurrency (currentCurrency) {
      this.$store.commit(SET_CURRENT_CURRENCY, { currentCurrency })
    },
    filterFn (update) {
      if (this.val === '') {
        this.allCurrencies = this.stringOptions
        return
      }
      const needle = this.val.toLowerCase()
      this.allCurrencies = this.stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    },
    getRemainigTime () {
      const validator = this.validatorById(this.nodeID)
      if (!validator) return
      return validator.remainingTime
    },
    onBlockchainClick () {
      this.isB = true
    },
    onSubnetClick () {
      this.isS = true
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
   opacity: 0.75;
 }
</style>
