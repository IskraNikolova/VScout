<template>
  <q-card
    flat
    v-if="error"
    class="q-mt-xs"
    id="custom-card-2"
    align="right"
  >
    <span class="text-purple" v-if="error"><q-icon color="purple" size="md" name="report_problem"/> {{ error }} <q-spinner-dots  color="purple" size="1em"/></span>
    <span class="text-purple" v-else><q-icon color="purple" size="md" name="network_check"/> Connecting <q-spinner-dots  color="purple" size="1em"/></span>
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
      if (!this.nodeHealthInfo) return false
      return this.nodeHealthInfo.healthy
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

<style scoped>
 #custom-card-2 {
   background-image: linear-gradient(45deg, #32353b 41.67%, #1c2a33 41.67%, #1c2a33 50%, #32353b 50%, #32353b 91.67%, #1c2a33 91.67%, #1c2a33 100%);
   background-size: 8.49px 8.49px;
   font-size: 17px;
 }
  #logo {
    width:30vw;
    max-width:30px;
    margin-bottom: -4px;
  }
</style>
