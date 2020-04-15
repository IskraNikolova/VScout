<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { INIT_APP } from './store/app/types'

export default {
  name: 'App',
  created () {
    this.initApp()
  },
  methods: {
    ...mapActions({
      initApp: INIT_APP
    })
  }
}
</script>
