<template>
  <q-page class="q-pr-md q-pl-md">
    <q-card
      class="q-mt-md q-pt-md q-pb-md"
      id="custom-card"
      style="padding-top: 3%;min-height: 400px;"
    >
    <q-btn
      @click="back"
      icon="arrow_back"
      label="Back"
      no-caps
      color="accent"
      flat
    />
    <div class="fixed-center">
      <p class="flex flex-center q-pt-xl">
        <img
          src="~assets/notfound.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-bold text-h6">
        Looks like we don't have any matches for "{{ $route.params.id }}"
      </p>
      <p class="text-faded">
        - Check for typos
      </p>
      <p class="text-faded">
        - Check if your connection endpoint is healthy and synced with the network
      </p>
      <p class="text-faded">
        - Everything is correct, but you are not getting the expected result? <a href="https://chat.avax.network/">Tag us in Avalanche discord!</a>
      </p>
    </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'PageNotFound',
  created () {
    const val = this.validatorById(this.$route.params.id)
    if (val) this.$router.push('/validator/' + this.$route.params.id)
  },
  computed: {
    ...mapGetters([
      'validatorById'
    ])
  },
  methods: {
    back () {
      this.$router.push('/')
    }
  }
}
</script>
