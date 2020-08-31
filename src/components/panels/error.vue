<template>
  <q-card
    v-if="!healthy"
    class="q-mt-md q-pt-md q-pl-xl q-pb-md"
    id="custom-card"
  >
    <span class="text-negative" v-if="error">{{ error }} <q-spinner-dots  color="negative" size="1em"/></span>
    <span class="text-negative" v-else>Connecting <q-spinner-dots  color="negative" size="1em"/></span>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Error',
  computed: {
    ...mapGetters([
      'nodeID',
      'nodeHealth'
    ]),
    nodeHealthInfo: function () {
      return this.nodeHealth(this.nodeID)
    },
    healthy: function () {
      try {
        return this.nodeHealthInfo.healthy
      } catch (err) {
        return false
      }
    },
    error: function () {
      try {
        const error = this.nodeHealthInfo
          .checks['chains.default.bootstrapped']
          .error
          .message
        return error
      } catch (err) {
        return ''
      }
    }
  }
}
</script>
