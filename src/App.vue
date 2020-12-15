<template>
  <div id="q-app">
    {{ error }}
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
  data () {
    return {
      error: ''
    }
  },
  created () {
    document.querySelector('html').dataset.theme = this.appTheme
  },
  mounted () {
    try {
      this.initApp()
      setInterval(() => {
        this.$store.commit(SET_NETWORK_STATUS, {
          hasNetworkConnection: window.navigator.onLine
        })
        this.$store.dispatch(GET_AVAX_PRICE)
      }, 10000)
    } catch (err) {
      this.error = err
    }
  }
}
</script>
