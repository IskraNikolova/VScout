<template>
  <q-page>
    <div style="padding: 3%;">
      <q-card
        id="custom-card"
      >
        <address-details />
      </q-card>
      <div class="flex flex-center">
        <img src="~assets/vscout-logo-full-grey.svg" id="logo">
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
  }
}
</script>
