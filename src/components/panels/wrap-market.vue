<template>
    <q-card
      class="q-mt-xs q-ml-xs q-pb-md q-pt-md panel2"
      id="custom-card"
    >
        <market-data class="q-mb-xs q-mt-xs q-pl-xl q-pr-xs" />
        <q-separator class="q-mt-md q-mb-md" />
        <stake-info class="q-pl-xl q-pr-xs"/>
    </q-card>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'WrapMarket',
  components: {
    MarketData: () => import('components/panels/market-data.vue'),
    StakeInfo: () => import('components/panels/stake-info.vue')
  },
  computed: {
    ...mapGetters([
      'appTheme'
    ])
  }
}
</script>

<style scoped>
 #custom-card {
  border-right: 2px solid #3f424a;
 }
</style>
