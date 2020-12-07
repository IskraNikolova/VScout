<template>
    <q-card
        class="q-mt-xs q-pl-xl q-pr-xs q-ml-xs q-pb-md q-pt-md panel"
        id="custom-card"
    >
        <stake />
          <q-separator class="q-mt-md q-mb-md" :dark="appTheme==='dark'" />
        <stats />
    </q-card>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'WrapStake',
  components: {
    Stake: () => import('components/panels/stake.vue'),
    Stats: () => import('components/panels/stats.vue')
  },
  computed: {
    ...mapGetters([
      'appTheme'
    ])
  }
}
</script>
