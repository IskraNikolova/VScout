<template>
  <q-page>
    <div style="padding: 1%;">
      <span v-if="validator && validator.uptime"><validator-details /></span>
      <footer-logo />
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  SET_VALIDATOR
} from './../store/access/types'

export default {
  name: 'PageValidator',
  components: {
    FooterLogo: () => import('components/panels/footer-logo.vue'),
    ValidatorDetails: () => import('components/search/validator-details.vue')
  },
  computed: {
    ...mapGetters([
      'validator'
    ])
  },
  watch: {
    '$route.params.id': {
      handler: async function (id) {
        await this.setValidator({ id })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      setValidator: SET_VALIDATOR
    })
  }
}
</script>
