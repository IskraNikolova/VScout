<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
  mounted () {
    this.initApp()
    this.$store.dispatch(GET_AVAX_PRICE)
    setInterval(() => {
      this.$store.commit(SET_NETWORK_STATUS, {
        hasNetworkConnection: window.navigator.onLine
      })
    }, 1000)
    setInterval(() => {
      this.$store.dispatch(GET_AVAX_PRICE)
    }, 10000)
  }
}
</script>
