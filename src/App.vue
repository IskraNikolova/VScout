<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import { resetState } from '../store'

import {
  INIT_APP,
  GET_NODE_PEERS,
  GET_AVAX_PRICE
} from './store/app/types'

import {
  SET_NETWORK_STATUS
} from './store/access/types'

export default {
  name: 'App',
  methods: {
    ...mapActions({
      initApp: INIT_APP
    })
  },
  watch: {
    appTheme (val) {
      document.querySelector('html').dataset.theme = this.appTheme
    }
  },
  computed: {
    ...mapGetters([
      'appTheme'
    ])
  },
  async created () {
    try {
      document.querySelector('html').dataset.theme = this.appTheme
      this.$store.dispatch(GET_AVAX_PRICE)
      await this.initApp()
      this.$store.dispatch(GET_NODE_PEERS, {})
      setInterval(() => {
        this.$store.commit(SET_NETWORK_STATUS, {
          hasNetworkConnection: window.navigator.onLine
        })
        this.$store.dispatch(GET_AVAX_PRICE)
      }, 10000)
    } catch (err) {
      console.log(err.message)
    }
  }
}
</script>
