<template>
  <div class="q-pa-xl">
    <div class="text-h6 q-pb-xl">Transaction Details</div>
    <div><span class="text-subtitle2"><small style="opacity: 0.8;">TRANSACTION ID</small></span> {{ $route.params.txID }}</div>
    <div><span class="text-subtitle2"><small style="opacity: 0.8;">STATUS</small></span> {{ txStatus }}</div>
    <div><span class="text-subtitle2"><small style="opacity: 0.8;">TYPE</small></span> {{ txType }}</div>
    <br />
    {{ tx }}
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import { _getTX, _getTxStatus } from './../../modules/network.js'

import { BinTools } from 'avalanche'
const bintools = BinTools.getInstance()

export default {
  name: 'TxDetails',
  computed: {
    ...mapGetters([
      'networkEndpoint'
    ])
  },
  data () {
    return {
      txStatus: '',
      tx: '',
      txType: ''
    }
  },
  created () {
    Promise.all([
      this.getTxStatus(),
      this.getTX()
    ])
  },
  methods: {
    async getTxStatus () {
      const tx = await _getTxStatus({
        endpoint: this.networkEndpoint.url,
        params: { txID: this.$route.params.txID }
      })

      if (tx.data.error) {
        console.log(tx)
        return
      }
      this.txStatus = tx.data.result
    },
    async getTX () {
      const tx = await _getTX({ endpoint: this.networkEndpoint.url, params: { txID: this.$route.params.txID } })

      if (tx.data.error) {
        console.log(tx)
        return
      }
      const txResponse = tx.data.result.tx
      const b58Str = bintools.b58ToBuffer(txResponse).toString('hex')
      const type = {
        '0x00000000': 'Base Tx',
        '0x00000009': 'SECP256K1 Credential',
        '0x00000017': 'StakeableLockOut',
        '0x00000011': 'Unsigned Import Tx',
        '0x00000012': 'Unsigned Export Tx',
        '0x0000000c': 'Unsigned Add Validator Tx',
        '0x0000000d': 'Unsigned Add Subnet Validator Tx',
        '0x0000000e': 'Unsigned Add Delegator Tx',
        '0x00000010': 'Unsigned Create Subnet Tx',
        '0x00000007': 'SECP256K1 Transfer Output',
        '0x0000000b': 'SECP256K1 Output Owners Output',
        '0x00000005': 'SECP256K1 Transfer Input'

      }

      // const code = '0x' + b58Str.substr(0, 4)
      const typeIndex = '0x' + b58Str.substr(4, 8)
      // const typeBase = '0x' + b58Str.substr(12, 8)
      // console.log(typeBase)
      // const networkID = '0x' + b58Str.substr(20, 8)
      // console.log(networkID)
      // const blockcID = '0x' + b58Str.substr(28, 64)
      // console.log(blockcID)
      // const numberOfOutpust = b58Str.substr(92, 72)
      // console.log(numberOfOutpust)
      // console.log(bintools)
      // console.log(b58Str.substr(228, 40))
      // console.log(b58Str)
      this.txType = type[typeIndex]
      this.tx = txResponse
    }
  },
  beforeDestroy () {
    this.txStatus = ''
    this.tx = ''
    this.txType = ''
  }
}
</script>
