<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import {
  SET_NETWORK_STATUS
} from './store/app/types'

export default {
  name: 'App',
  mounted () {
    setInterval(() => {
      this.$store.commit(SET_NETWORK_STATUS, { hasNetworkConnection: window.navigator.onLine })
    }, 1000)
  }
}
</script>
