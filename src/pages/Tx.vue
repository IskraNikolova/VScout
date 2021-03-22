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
        <tx-details />
      </q-card>
      <div class="flex flex-center">
        <img src="~assets/vscout-logo-full.svg" id="logo">
      </div>
      <div class="flex flex-center q-mt-xl text-white">
        Made with ❤️ for builders everywhere.
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'PageTx',
  components: {
    TxDetails: () => import('components/search/tx-details.vue')
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
