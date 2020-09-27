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
    <div v-if="getSubnet($route.params.id)">
      <subnet-details v-bind:id="$route.params.id"/>
    </div>
    <div v-else-if="getValidator($route.params.id)">
      <validator-details v-bind:id="$route.params.id" />
    </div>
    <div v-else-if="getBlockchain($route.params.id)">
     <blockchain-details v-bind:id="$route.params.id" />
    </div>
    <div v-else class="fixed-center">
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
  name: 'PageSearch',
  components: {
    SubnetDetails: () => import('components/search/subnet-details.vue'),
    ValidatorDetails: () => import('components/search/validator-details.vue'),
    BlockchainDetails: () => import('components/search/blockchain-details.vue')
  },
  meta: {
    title: 'Search Page',
    titleTemplate: title => `${title} - VScout`,
     // meta tags
    meta: {
      description: { name: 'description', content: 'Search page for validators, blockchains and subnets' },
      keywords: { name: 'keywords', content: 'vscout' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
      // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
      ogTitle:  { 
        name: 'og:title', 
        // optional; similar to titleTemplate, but allows templating with other meta properties
        template (ogTitle) {  
          return `${ogTitle} - Vscout`
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'validatorById',
      'blockchainByID',
      'blockchainByName',
      'subnetByID'
    ])
  },
  methods: {
    getValidator (param) {
      const validator = this.validatorById(param)
      if (!validator) return

      return validator
    },
    getBlockchain (param) {
      let blockchain = this.blockchainByID(param)
      if (!blockchain) {
        blockchain = this.blockchainByName(param)
      }

      if (!blockchain) return

      return blockchain
    },
    getSubnet (param) {
      const subnet = this.subnetByID(param)
      if (!subnet) return

      return subnet
    },
    back () {
      this.$router.push('/')
    }
  }
}
</script>
