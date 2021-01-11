<template>
  <q-page>
    <div style="padding: 1%;">
      <validator-details />
      <div class="flex flex-center">
        <img src="~assets/vscoutlogo5.svg" id="logo">
      </div>
      <div class="flex flex-center q-mt-xl text-white">
        Made with ❤️ for builders everywhere.
      </div>
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
    ValidatorDetails: () => import('components/search/validator-details.vue')
  },
  data () {
    return {
      isStart: false
    }
  },
  computed: {
    ...mapGetters([
      'validator'
    ])
  },
  watch: {
    '$route.params.id': {
      handler: async function (id) {
        this.isStart = true
        await this.setValidator({ id })
      },
      deep: true,
      immediate: true
    }
  },
  // async created () {
  //   if (this.isStart || this.validator.nodeID === this.$route.params.id) return
  //   await this.setValidator({ id: this.$route.params.id })
  // },
  methods: {
    ...mapActions({
      setValidator: SET_VALIDATOR
    })
  }
}
</script>
<style scoped>
 #logo {
  width: 190vw;
  max-width: 190px;
 }
</style>
