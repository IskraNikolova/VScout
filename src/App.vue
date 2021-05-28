<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  INIT_APP
} from './store/app/types'

// import {
//   SET_NETWORK_STATUS
// } from './store/access/types'

// import {
//   GET_NODE_PEERS
// } from './store/memory/types'

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
      // await this.initApp()
      // this.$store.dispatch(GET_NODE_PEERS, {})
      // setInterval(() => {
      //   this.$store.commit(SET_NETWORK_STATUS, {
      //     hasNetworkConnection: window.navigator.onLine
      //   })
      // }, 10000)
    } catch (err) {
      console.log(err.message)
    }
  }
}
</script>
