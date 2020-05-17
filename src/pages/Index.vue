<template>
  <q-page class="q-pa-xl">
    <div class="row q-pb-xl" style="margin-top: -22px;">
      <div class="col">
        <div><q-img src="~assets/ava-black.png" id="b-logo" /></div>
        <div>AVA P-Explorer</div>
      </div>
      <div class="">
        <q-select
          @input="onGetValodators(model.value.subnetID)"
          :display-value="`${model.value.name}`"
          color="accent" v-model="model"
          :options="options"
          hide-bottom-space
          borderless
        />
      </div>
    </div>
    <!--<block-item />-->
    <stak-item />
    <transactions-item />
    <table-item v-bind:validators="validators" v-bind:pendingValidators="pendingValidators" @getValidators="getValidatorsV" />
    <faqs />
    <div class="flex flex-center q-mt-xl">
      <img src="~assets/ava-black.png" id="logo"/>
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
import TransactionsItem from './../components/transactions-item'

import {
  SET_SUBNETID,
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS
} from '../store/app/types'

export default {
  name: 'PageIndex',
  components: {
    Faqs,
    StakItem,
    // BlockItem,
    TableItem,
    TransactionsItem
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
      'pendingValidators',
      'blockchains',
      'subnetID'
    ])
  },
  created () {
    this.options = this.blockchains.map(i => {
      const res = {
        label: i.name,
        value: i
      }
      return res
    })
    this.model = this.options[0]
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    onGetValodators (subnetID) {
      this.$store.commit(SET_SUBNETID, { subnetID })
      this.getValidators({ subnetID })
    },
    async getValidatorsV (type) {
      const temp = {
        active: async () => await this.getValidators({ subnetID: this.subnetID }),
        pending: async () => await this.getPendingValidators({ subnetID: this.subnetID })
      }

      if (typeof type !== 'undefined') await temp[type]()
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
  width: 60px!important;
 }
</style>
