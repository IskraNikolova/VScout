<template>
  <q-page>
    <div style="padding: 1%;">
      <validator-details v-bind:id="getID()" />
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
  name: 'PageValidator',
  components: {
    ValidatorDetails: () => import('components/search/validator-details.vue')
  },
  methods: {
    getID () {
      if (!this.$route.params.id) return ''
      return this.$route.params.id
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
