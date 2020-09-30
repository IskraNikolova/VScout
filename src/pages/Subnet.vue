<template>
  <q-page>
    <div style="padding: 1%;">
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
          <subnet-details class="q-pr-md" />
        </q-card>
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

export default {
  name: 'PageBlockchain',
  components: {
    SubnetDetails: () => import('components/search/subnet-details.vue')
  },
  methods: {
    back () {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
 #logo {
  width: 190vw;
  max-width: 190px;
 }
</style>
