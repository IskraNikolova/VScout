<template>
    <div class="q-pa-md panel">
      <div class="text-bold text-panel q-pl-md">BLOCKCHAIN ID</div>
      <div class="text-regular q-pl-md q-pt-md">{{ blockchainID }}</div>
      <div class="row q-pt-xl q-pl-md">
        <div class="col-6">
        <span class="text-panel text-h7">NAME:</span> <div class="text-medium">{{ blockchainName }}</div>
        <br />
        <span class="text-panel text-h7">VM (Virtual Machine):</span>
        <div class="q-pl-xs"><small>ID: </small> <span class="text-medium">{{ blockchainVmID }}</span></div>
        <div class="q-pl-xs"><small>NAME: </small> <span class="text-medium">{{ blockchainVmName }}</span></div>
        </div>
        <div class="col-6">
        <span class="text-panel text-h7">SUBNET ID:</span> <div class="text-medium">{{ blockchainSubnetID }}</div>
        <br />
        <span class="text-panel text-h7">STATUS:</span>
        <div :class="'text-medium text-' + getColor(blockchainStatus)">
            {{ blockchainStatus }}
            <tooltip-style v-bind:text="getStatusInfo(blockchainStatus)" />
        </div>
        </div>
      </div>
    </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import {
  copyToClipboard
} from 'quasar'

const colors = {
  Validating: 'accent',
  Created: 'green',
  Preferred: 'grey',
  Unknown: 'negative'
}

const statusInfo = {
  Validating: 'The blockchain is being validated by this node.',
  Created: 'The blockchain exists but isn’t being validated by this node.',
  Preferred: 'The blockchain was proposed to be created and is likely to be created but the transaction isn’t yet accepted.',
  Unknown: 'The blockchain either wasn’t proposed or the proposal to create it isn’t preferred. The proposal may be resubmitted.'
}

export default {
  name: 'BlockchainDetails',
  components: {
    TooltipStyle: () => import('components/tooltip-style')
  },
  computed: {
    ...mapGetters([
      'blockchainByID',
      'blockchainByName'
    ]),
    blockchain: function () {
      return this.getBlockchain(this.$route.params.id)
    },
    blockchainID: function () {
      if (!this.blockchain) return
      return this.blockchain.id
    },
    blockchainName: function () {
      if (!this.blockchain) return
      return this.blockchain.name
    },
    blockchainVmID: function () {
      if (!this.blockchain) return
      return this.blockchain.vmID
    },
    blockchainVmName: function () {
      if (!this.blockchain) return
      return this.blockchain.vmName
    },
    blockchainStatus: function () {
      if (!this.blockchain) return
      return this.blockchain.status
    },
    blockchainSubnetID: function () {
      if (!this.blockchain) return
      return this.blockchain.subnetID
    }
  },
  methods: {
    getBlockchain (param) {
      let blockchain = this.blockchainByID(param)
      if (!blockchain) {
        blockchain = this.blockchainByName(param)
      }

      if (!blockchain) return {}

      return blockchain
    },
    copyToClipboard (id) {
      if (!id) return

      copyToClipboard(id)
      this.$q.notify({
        message: 'Copied to clipboard!',
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 1000
      })
    },
    getColor (status) {
      return colors[status]
    },
    getStatusInfo (status) {
      const stat = statusInfo[status]
      if (!stat) return ''

      return stat
    }
  }
}
</script>
