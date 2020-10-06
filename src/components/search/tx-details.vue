<template>
  <div class="q-pa-xl">
    <div class="text-h6 q-pb-xl">Transaction Details</div>
    <div><span class="text-subtitle2"><small style="opacity: 0.8;">TRANSACTION ID</small></span> {{ txId }}</div>
    <div><span class="text-subtitle2"><small style="opacity: 0.8;">STATUS</small></span> {{txStatus}}</div>
    <br />
    {{ tx }}
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import { _getTX } from './../../modules/network.js'

export default {
  name: 'TxDetails',
  computed: {
    ...mapGetters([
      'networkEndpoint'
    ]),
    txId: function () {
      return this.$route.params.id
    },
    txStatus: function () {
      return this.$route.params.status
    }
  },
  data () {
    return {
      tx: {}
    }
  },
  // async created () {
  //   this.tx = await this.getTx()
  //   const utxos = await _getUTXOs({ endpoint: 'https://api.avax-test.network:443/', params: { addresses: ['P-fuji1upsnah92xs77qf5c2v500r0yjq87q90dphetem'] } })
  //   if (utxos.data.error) {
  //     console.log(utxos.data.error)
  //     return
  //   }
  //   console.log(utxos.data.result)
  // },
  methods: {
    async getTx () {
      const tx = await _getTX({ endpoint: 'https://api.avax-test.network:443/', params: { txID: this.txId } })

      if (tx.data.error) {
        console.log(tx)
        return
      }
      return tx.data.result
    }
  }
}
</script>
