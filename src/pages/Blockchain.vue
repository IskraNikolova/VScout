<template>
  <q-page>
    <div style="padding: 1%;">
      <q-card
        class="q-mt-md q-pt-md q-pb-md panel2 q-ml-xl q-mr-xl"
        id="custom-card"
        style="padding-top: 3%;min-height: 400px;"
      >
        <blockchain-details class="q-pr-md"/>
      </q-card>
      <footer-logo />
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'PageBlockchain',
  components: {
    BlockchainDetails: () => import('components/search/blockchain-details.vue'),
    FooterLogo: () => import('components/panels/footer-logo.vue')
  }
}
</script>
