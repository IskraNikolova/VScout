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
          no-caps
          color="accent"
          flat
        />
        <validator-details class="q-pr-md" v-bind:id="$route.params.id"/>
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
  name: 'PageValidator',
  components: {
    ValidatorDetails: () => import('components/search/validator-details.vue')
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
