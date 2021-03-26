<template>
    <q-card
        class="q-mt-xs q-ml-xs q-pb-md q-pt-md panel2"
        id="custom-card"
    >
        <stake class="q-pl-xl q-pr-sm"/>
          <q-separator class="q-mt-md q-mb-md" />
        <stats class="q-pl-xl q-pr-sm" />
    </q-card>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import Stake from './stake.vue'
import Stats from './stats.vue'

export default {
  name: 'WrapStake',
  components: {
    Stake,
    Stats
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
    border-right: 2px solid #aa7dc9;
  }
</style>
