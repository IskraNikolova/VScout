<template>
  <q-page class="q-pr-md q-pl-md">
    <q-card
      v-if="isShow"
      class="q-mt-md q-ml-xl q-mr-xl q-pt-md q-pb-md panel2"
      id="custom-card"
      style="padding-top: 3%;min-height: 400px;"
    >
    <div class="fixed-center">
      <p class="flex flex-center q-pt-xl">
        <img
          src="~assets/not-found.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="flex flex-center text-bold text-h6">
        Looks like we don't have any matches for "{{ $route.params.id }}"
      </p>
      <p class="text-faded">
        - Check for typos
      </p>
      <p class="text-faded">
        - Check if your connection endpoint is healthy and synced with the network
      </p>
      <p class="text-faded">
        - Everything is correct, but you are not getting the expected result? <a class="text-purple" href="https://discord.gg/PPB67JYyAp">Tag us in Avalanche discord!</a>
      </p>
    </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  mapActions
} from 'vuex'

import {
  SET_VALIDATOR
} from './../store/access/types'

export default {
  name: 'PageNotFound',
  async created () {
    const val = await this.setValidator({ id: this.$route.params.id })
    if (val) this.$router.push('/validator/' + this.$route.params.id)
    else this.isShow = true
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    ...mapActions({
      setValidator: SET_VALIDATOR
    })
  }
}
</script>
