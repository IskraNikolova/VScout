<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header reveal class="panel">
      <!--gt view-->
      <div class="gt-sm">
        <q-toolbar class="panel">
          <q-toolbar-title
            @click="$router.push('/')"
            id="toolbar-title">
            VScout.io <q-icon name="home" />
          </q-toolbar-title>
          <q-btn
            color="purple"
            flat label="Add Identification"
            icon="perm_identity"
            @click.native="onAddIdentification"
          />
          <calculator />
          <div
            class="q-pa-md"
            @mouseover="blockchainsMenuOver=true"
            @mouseleave="blockchainsMenuOver=false"
          >
            <div class="fit flex flex-center text-center non-selectable" >
              <span v-if="blockchainsMenu" class="text-panel">BLOCKCHAINS</span>
              <span v-else>BLOCKCHAINS</span>
            </div>
            <q-menu
              v-model="blockchainsMenu"
              transition-show="scale"
              transition-hide="scale"
              :dark="appTheme==='dark'"
            >
              <div
                @mouseover="blockchainsListOver=true"
                @mouseleave="blockchainsListOver=false"
                style="border-left: 0.1px solid #9c929c;"
              >
                <list-blockchains />
              </div>
            </q-menu>
          </div>
          <div
            class="q-pa-md"
            @mouseover="subnetMenuOver=true"
            @mouseleave="subnetMenuOver=false"
          >
            <div
             class="fit flex flex-center text-center non-selectable"
            >
              <span v-if="subnetsMenu" class="text-panel">SUBNETS</span>
              <span v-else>SUBNETS</span>
            </div>
            <q-menu
              v-model="subnetsMenu"
              transition-show="scale"
              transition-hide="scale"
              :dark="appTheme==='dark'"
            >
              <div
                @mouseover="subnetsListOver=true"
                @mouseleave="subnetsListOver=false"
                style="border-left: 0.1px solid #9c929c;"
              >
                <list-subnets />
              </div>
            </q-menu>
          </div>
          <a
            id="faq"
            href="#faqs">
            FAQ
          </a>
          <div
            class="q-pa-md"
            @mouseover="networkMenuOver=true"
            @mouseleave="networkMenuOver=false"
          >
            <div class="fit flex flex-center text-center non-selectable text-panel" v-if="networkMenu">
              <q-icon name="flash_on" size="sm" />
              <span>{{ networkEndpoint.name }}</span>
            </div>
            <div class="fit flex flex-center text-center non-selectable" v-else>
              <q-icon name="flash_on" size="sm" />
              <span>{{ networkEndpoint.name }}</span>
            </div>
            <q-menu
              v-model="networkMenu"
              transition-show="scale"
              transition-hide="scale"
              :dark="appTheme==='dark'"
            >
              <div
                @mouseover="inputNetworkOver=true"
                @mouseleave="inputNetworkOver=false"
                style="border-left: 0.1px solid #9c929c;"
              >
                <switch-endpoint />
              </div>
            </q-menu>
          </div>
          <div
            class="q-pa-md text-medium"
            @mouseover="menuOver=true"
            @mouseleave="menuOver=false"
          >
            <div class="fit flex flex-center text-panel text-center non-selectable">
              <span>{{ getISO(currentCurrency) }}</span>
              <q-icon v-if="menu" name="keyboard_arrow_up" />
              <q-icon v-else name="keyboard_arrow_down" />
            </div>
            <q-menu
              v-model="menu"
              transition-show="scale"
              transition-hide="scale"
              :dark="appTheme==='dark'"
            >
              <div style="min-width: 250px;border-left: 0.1px solid #9c929c;" class="panel2" @mouseover="listOver=true" @mouseleave="listOver=false">
                <q-item class="panel">
                  <q-item-section class="text-medium" :dark="appTheme==='dark'">
                    1.00 AVAX = {{ getSymbol(currentCurrency) }} {{ getValue() }}
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                  <q-input :dark="appTheme==='dark'" v-model="val" @input="filterFn" label="Search currency" />
                </q-item>
                <span v-if="allCurrencies.length > 0">
                  <q-list style="min-width: 250px;" v-for="(c, i) in allCurrencies" v-bind:key="i">
                    <q-item :dark="appTheme==='dark'">
                      <q-item-section>
                        <q-item-label>{{ getISO(c) }}</q-item-label>
                        <q-item-label caption lines="2" class="text-panel">{{ getCurrencyName(c) }}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label><small class="text-panel text-medium">{{ getSymbol(c) }}</small> {{ currenciesPriceList[`${c}`] }}</q-item-label>
                        <q-icon size="xs" name="check_box" v-if="c === currentCurrency" />
                        <q-icon size="xs" name="check_box_outline_blank" v-else @click="setCurrentCurrency(c)"/>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section><small>24h High</small> <span style="font-size: 12px;" class="text-medium text-positive">{{ high24h[`${c}`] }}</span></q-item-section>
                      <q-item-section side top><small>24h Low</small> <span style="font-size: 12px;" class="text-medium text-negative">{{ low24h[`${c}`] }}</span></q-item-section>
                    </q-item>
                    <q-separator />
                  </q-list>
                </span>
                <span v-else><q-item>No Results</q-item></span>
              </div>
            </q-menu>
          </div>
          <q-btn flat size="sm" icon="nights_stay" v-if="appTheme === 'default'" @click="switchTheme('dark')" />
          <q-btn flat size="sm" icon="wb_sunny" v-else @click="switchTheme('default')" />
          <notify-btn />
        </q-toolbar>
        <q-toolbar class="background-orange">
          <q-toolbar-title>
            <img src="~assets/vscoutlogo5.svg" style="width: 200px;">
          </q-toolbar-title>
          <span v-if="isValidatorShow(nodeID)" style="min-width: 300px;margin-right: 15%;">
            <countdown class="row" v-bind:color="'#ffffff'" v-bind:textColor="'white'" v-bind:countdown="getRemainigTime()" />
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
      <!--sm view-->
      <div class="sm">
        <q-toolbar class="panel">
          <q-btn
            color="secondary" flat
            icon="perm_identity"
            @click.native="onAddIdentification"
          >
          <tooltip-style v-bind:text="'Add Identification'" />
          </q-btn>
          <calculator />
          <q-btn
            flat
            label="blockchains"
            class="text-regular"
          >
          <q-menu>
              <div
                style="border-left: 0.1px solid #9c929c;"
              >
                <list-blockchains />
              </div>
            </q-menu>
          </q-btn>
          <q-btn
            flat
            label="subnets"
            class="text-regular"
          >
          <q-menu>
            <div
              style="border-left: 0.1px solid #9c929c;"
            >
              <list-subnets />
            </div>
          </q-menu>
          </q-btn>
          <q-btn
            flat
            no-caps
            icon="flash_on"
            :label="networkEndpoint.name"
            class="text-regular"
            id="target-el"
          >
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              :dark="appTheme==='dark'"
            >
               <div
                style="border-left: 0.1px solid #9c929c;"
              >
                <switch-endpoint />
              </div>
            </q-menu>
            <tooltip-style v-bind:text="'Connect To Node'" />
          </q-btn>
          <q-btn
            no-caps
            :label="getISO(currentCurrency)"
            class="text-panel text-medium"
            flat
            id="target-el"
          >
          <q-menu
              transition-show="scale"
              transition-hide="scale"
              :dark="appTheme==='dark'"
            >
              <div style="min-width: 250px;border-left: 0.1px solid #9c929c;" class="panel2">
                <q-item class="panel">
                  <q-item-section class="text-medium" :dark="appTheme==='dark'">
                    1.00 AVAX = {{ getSymbol(currentCurrency) }} {{ getValue() }}
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                  <q-input :dark="appTheme==='dark'" v-model="val" @input="filterFn" label="Search currency" />
                </q-item>
                <span v-if="allCurrencies.length > 0">
                  <q-list style="min-width: 250px;" v-for="(c, i) in allCurrencies" v-bind:key="i">
                    <q-item :dark="appTheme==='dark'">
                      <q-item-section>
                        <q-item-label>{{ getISO(c) }}</q-item-label>
                        <q-item-label caption lines="2" class="text-panel">{{ getCurrencyName(c) }}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label><small class="text-panel text-medium">{{ getSymbol(c) }}</small> {{ currenciesPriceList[`${c}`] }}</q-item-label>
                        <q-icon size="xs" name="check_box" v-if="c === currentCurrency" />
                        <q-icon size="xs" name="check_box_outline_blank" v-else @click="setCurrentCurrency(c)"/>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section><small>24h High</small> <span style="font-size: 12px;" class="text-medium text-positive">{{ high24h[`${c}`] }}</span></q-item-section>
                      <q-item-section side top><small>24h Low</small> <span style="font-size: 12px;" class="text-medium text-negative">{{ low24h[`${c}`] }}</span></q-item-section>
                    </q-item>
                    <q-separator />
                  </q-list>
                </span>
                <span v-else><q-item>No Results</q-item></span>
              </div>
            </q-menu>
          </q-btn>
          <notify-btn />
        </q-toolbar>
        <q-toolbar>
          <q-toolbar-title style="margin-right: 10%;">
            <img src="~assets/vscoutlogo5.svg" style="width: 200px;">
          </q-toolbar-title>
          <div class="q-pb-md">
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
        </q-toolbar>
        <q-toolbar v-if="isValidatorShow(nodeID)">
          <div class="row">
            <div class="col-5 q-pb-md">
              <span>
                <countdown class="row" v-bind:color="'#ffffff'" v-bind:countdown="getRemainigTime()" />
                <tooltip-style v-bind:text="'Remaining validation time for ' + nodeID  + ''" />
              </span>
            </div>
            <div class="col-2"></div>
            <div class="col-3 q-pb-md">
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
      <!--lt-sm view-->
      <div class="lt-sm panel">
        <q-toolbar class="panel">
          <q-toolbar-title>
            <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm />
          </q-toolbar-title>
          <a id="faq2" class="text-panel" href="#faqs">FAQ</a>
          <notify-btn />
        </q-toolbar>
        <div class="q-pb-md">
          <span v-if="isValidatorShow(nodeID)">
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
              <q-icon name="img:statics/currency.svg" size="md"/>
            </q-item-section>

            <q-item-section>
              <span @click="isC=true">Currency ({{ getISO(currentCurrency) }})</span>
              <q-dialog v-model="isC" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section class="text-purple text-medium">
                    1.00 AVAX = {{ getSymbol(currentCurrency) }} {{ getValue() }}
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
                        <q-item-section><small class="text-grey">24h High</small> <span style="font-size: 12px;" class="text-medium text-positive">{{ high24h[`${c}`] }}</span></q-item-section>
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
        <q-btn flat icon="nights_stay" v-if="appTheme === 'default'" @click="switchTheme('dark')" />
        <q-btn flat icon="wb_sunny" v-else @click="switchTheme('default')" />
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
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18,18]">
          <q-btn fab icon="keyboard_arrow_up" color="secondary" />
        </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  SET_BALANCE,
  SET_THEME,
  SET_CURRENT_CURRENCY
} from './../store/app/types'

import { openURL, debounce } from 'quasar'

import { _getTxStatus, _getBalance } from './../modules/network.js'
import { currencies } from './../utils/constants.js'

export default {
  name: 'MainLayout',
  components: {
    NotifyBtn: () => import('components/notify-btn'),
    Calculator: () => import('components/items/calculator.vue'),
    TooltipStyle: () => import('components/tooltip-style.vue'),
    Countdown: () => import('components/items/countdown.vue'),
    ListSubnets: () => import('components/list-subnets.vue'),
    SwitchEndpoint: () => import('components/switch-endpoint.vue'),
    ListBlockchains: () => import('components/list-blockchains.vue'),
    AddIdentificationDialog: () => import('components/dialogs/add-identification-dialog.vue')
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'high24h',
      'appTheme',
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
      'subnetByID',
      'peerById',
      'nonDefvalidatorById'
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
      allCurrencies: [],
      stringOptions: [],
      menu: false,
      networkMenu: false,
      subnetsMenu: false,
      blockchainsMenu: false,
      menuOver: false,
      listOver: false,
      networkMenuOver: false,
      inputNetworkOver: false,
      subnetMenuOver: false,
      subnetsListOver: false,
      blockchainsMenuOver: false,
      blockchainsListOver: false
    }
  },
  watch: {
    currenciesPriceList: {
      handler: function (v) {
        this.allCurrencies = Object.keys(this.currenciesPriceList)
        if (!this.allCurrencies) return
        this.currency = {
          label: `${this.getISO('usd')} - ${this.getISO('usd')} ${this.currenciesPriceList.usd}`,
          value: 'usd'
        }
        this.stringOptions = Object.keys(this.currenciesPriceList)
      },
      deep: true,
      immediate: true
    },
    notifications () {
      this.changeTitle()
    },
    menuOver (val) {
      setTimeout(() => {
        if (this.listOver) return
        this.debounceFunc(this.checkMenu())
      }, 50)
    },
    listOver (val) {
      this.debounceFunc(this.checkMenu())
    },
    networkMenuOver (val) {
      setTimeout(() => {
        if (this.inputNetworkOver) return
        this.debounceFunc(this.checkNetworkMenu())
      }, 50)
    },
    inputNetworkOver (val) {
      this.debounceFunc(this.checkNetworkMenu())
    },
    subnetMenuOver (val) {
      setTimeout(() => {
        if (this.subnetsListOver) return
        this.debounceFunc(this.checkSubnetMenu())
      }, 50)
    },
    subnetsListOver (val) {
      this.debounceFunc(this.checkSubnetMenu())
    },
    blockchainsMenuOver (val) {
      setTimeout(() => {
        if (this.blockchainsListOver) return
        this.debounceFunc(this.checkBlockchainsMenu())
      }, 50)
    },
    blockchainsListOver (val) {
      this.debounceFunc(this.checkBlockchainsMenu())
    }
  },
  methods: {
    ...mapActions({
      setTheme: SET_THEME
    }),
    getValue () {
      if (!this.currenciesPriceList || !this.currentCurrency) return 0
      return this.currenciesPriceList[`${this.currentCurrency}`]
    },
    isValidatorShow (id) {
      if (!id) return
      const isVal = this.validatorById(id)
      if (isVal) {
        return id !== 'NodeID-2KfgS6P7vf9L55fMRTbHPgS4ugVSDW3nj'
      }
      return false
    },
    switchTheme (theme) {
      if (!theme) return
      this.setTheme(theme)
    },
    debounceFunc: (fn) => debounce(function () { fn() }, 300),
    checkMenu () {
      if (this.menuOver || this.listOver) {
        this.menu = true
      } else {
        this.menu = false
      }
    },
    checkNetworkMenu () {
      if (this.networkMenuOver || this.inputNetworkOver) {
        this.networkMenu = true
      } else {
        this.networkMenu = false
      }
    },
    changeTitle () {
      if (this.notifications.length > 0) {
        const newTitle = '(' + this.notifications.length + ') ' + 'VScout'
        document.title = newTitle
      } else {
        document.title = 'VScout'
      }
    },
    checkSubnetMenu () {
      if (this.subnetMenuOver || this.subnetsListOver) {
        this.subnetsMenu = true
      } else {
        this.subnetsMenu = false
      }
    },
    checkBlockchainsMenu () {
      if (this.blockchainsMenuOver || this.blockchainsListOver) {
        this.blockchainsMenu = true
      } else {
        this.blockchainsMenu = false
      }
    },
    toUrl () {
      openURL('https://discord.gg/PPB67JYyAp')
    },
    getSymbol (currency) {
      if (!currency || !currencies[`${currency}`]) return
      return currencies[`${currency}`].symbol
    },
    getISO (currency) {
      if (!currency || !currencies[`${currency}`]) return
      return currencies[`${currency}`].isoCode
    },
    getCurrencyName (currency) {
      if (!currency || !currencies[`${currency}`]) return
      return currencies[`${currency}`].currency
    },
    setCurrentCurrency (currentCurrency) {
      if (!currentCurrency) return
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
      let validator = this.validatorById(this.filter)
      if (!validator) validator = this.nonDefvalidatorById(this.filter)
      if (validator) {
        this.$router.push(`/validator/${this.filter}`)
        this.filter = ''
        return
      }
      const peer = this.peerById(this.filter)
      if (peer) {
        this.$router.push(`/peer/${this.filter}`)
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
    color: #805d96;
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
