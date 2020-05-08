<template>
  <q-page class="q-pa-xl">
    <div class="flex flex-center q-pb-xl">
      <q-img src="~assets/ava.png" id="b-logo" />
    </div>
    <div class="flex flex-right">
      <q-select
        @input="onGetValodators(model.value.subnetID)"
        :display-value="`Blockchain Name: ${model.value.name}`"
        color="accent" dark v-model="model"
        :options="options"
      />
    </div>
    <!--<block-item />-->
    <stak-item />
    <!--<transactions-item />-->
        <transition
      appear
      enter-active-class="animated bounceInLeft"
      leave-active-class="animated bounceInUp"
    >
    <table-item v-bind:validators="validators" />
        </transition>
    <faqs />
    <div class="flex flex-center q-mt-xl">
      <img src="~assets/ava-white.png" id="logo"/>
    </div>
    <div class="flex flex-center q-mt-xl">
      Made with ❤️ for builders everywhere.
    </div>
  </q-page>
</template>

<script>

import {
  mapGetters,
  mapActions
} from 'vuex'

import Faqs from './../components/faqs'
import StakItem from './../components/stak-item'
// import BlockItem from './../components/block-item'
import TableItem from './../components/table-item'
// import TransactionsItem from './../components/transactions-item'

import {
  SET_SUBNETID,
  GET_VALIDATORS
} from '../store/app/types'

export default {
  name: 'PageIndex',
  components: {
    Faqs,
    StakItem,
    // BlockItem,
    TableItem
    // TransactionsItem
  },
  data () {
    return {
      options: [],
      model: {}
    }
  },
  computed: {
    ...mapGetters([
      'validators',
      'blockchains'
    ])
  },
  created () {
    this.options = this.blockchains.map(i => {
      const res = {
        label: `<div
          class="q-pa-xs"
          style="height: 47px;margin: -13px;background: radial-gradient(circle, #344245 0%, #000709 70%);">
            ${i.name}
          </div>`,
        value: i
      }
      return res
    })
    this.model = this.options[0]
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS
    }),
    onGetValodators (subnetID) {
      this.$store.commit(SET_SUBNETID, { subnetID })
      this.getValidators({ subnetID })
    }
  }
}
</script>

<style scoped>
 #logo {
  width:30vw;
  max-width:50px;
 }
 #b-logo {
  width: 200px!important;
 }
</style>
