<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import {
  INIT_APP,
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
    console.log(process.env.ADMIN_KEY)
    this.initApp()
    setInterval(() => {
      this.$store.commit(SET_NETWORK_STATUS, { hasNetworkConnection: window.navigator.onLine })
    }, 1000)
  }
}
</script>
