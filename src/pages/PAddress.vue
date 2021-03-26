<template>
  <q-page>
    <div style="padding: 3%;">
      <q-card
        id="custom-card"
      >
        <address-details />
      </q-card>
      <footer-logo />
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'PagePAddress',
  components: {
    FooterLogo: () => import('components/panels/footer-logo.vue'),
    AddressDetails: () => import('components/search/address-details.vue')
  }
}
</script>
