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
        </q-toolbar>
        <q-toolbar class="dark-panel">
          <q-toolbar-title>
            <img src="~assets/vscout-logo-full.svg" class="q-pt-xs" style="width: 120px;">
          </q-toolbar-title>
          <span v-if="isValidatorShow(nodeID)" style="min-width: 300px;margin-right: 15%;">
            <countdown class="row" v-bind:color="'#ffffff'" v-bind:textColor="'white'" v-bind:countdown="getRemainigTime()" />
            <tooltip-style v-bind:text="'Remaining validation time for ' + nodeID  + ''" />
          </span>
        </q-toolbar>
      </div>
    </q-header>
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
    TooltipStyle: () => import('components/tooltip-style.vue'),
    Countdown: () => import('components/items/countdown.vue')
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
