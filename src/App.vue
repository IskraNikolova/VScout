<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  INIT_APP,
  GET_AVAX_PRICE,
  SET_NETWORK_STATUS
} from './store/app/types'

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
  created () {
    try {
      document.querySelector('html').dataset.theme = this.appTheme
    } catch (err) {
      console.log(err.message)
    }
  },
  mounted () {
    try {
      if (!this.$q.platform.is.safari) {
        this.initApp()
      }
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
