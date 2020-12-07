<template>
    <q-card
        class="q-mt-xs q-ml-xs q-pb-md q-pt-md panel"
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
