<template>
  <q-page>
    <div style="padding: 3%;">
      <q-card
        id="custom-card"
      >
        <q-btn
          @click="back"
          icon="arrow_back"
          no-caps
          color="accent"
          flat
        />
        <address-details />
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
  name: 'PagePAddress',
  components: {
    AddressDetails: () => import('components/search/address-details.vue')
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
