<template>
    <div>
      <div class="q-pa-md gt-xs">
        <div class="text-bold q-pl-md">BLOCKCHAIN ID</div>
        <div class="text-regular text-orange q-pl-md q-pt-md">{{ blockchain.id }}</div>
        <div class="row q-pt-xl q-pl-md">
          <div class="col-6">
            <span class="text-light text-h7">NAME:</span> <div class="text-medium">{{ blockchain.name }}</div>
            <br />
            <span class="text-light text-h7">VM (Virtual Machine):</span>
            <div class="q-pl-xs"><small class="text-grey">ID: </small> <span class="text-medium">{{ blockchain.vmID }}</span></div>
            <div class="q-pl-xs"><small class="text-grey">NAME: </small> <span class="text-medium">{{ blockchain.vmName }}</span></div>
          </div>
          <div class="col-6">
            <span class="text-light text-h7">SUBNET ID:</span> <div class="text-medium">{{ blockchain.subnetID }}</div>
            <br />
            <span class="text-light text-h7">STATUS:</span>
            <div :class="'text-medium text-' + getColor(blockchain.status)">
              {{ blockchain.status }}
              <q-tooltip>{{ getStatusInfo(blockchain.status )}}</q-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="q-pa-md lt-sm">
        <div class="text-bold">BLOCKCHAIN ID</div>
        <div class="text-regular text-orange q-pl-xs q-pt-md">{{ blockchain.id }}</div>
        <div class="row q-pt-xl">
          <div class="col-6">
            <span class="text-light text-h7">NAME:</span> <div class="text-medium">{{ blockchain.name }}</div>
            <br />
            <span class="text-light text-h7">VM (Virtual Machine):</span>
            <div class="q-pl-xs"><small class="text-grey">ID: </small> <span class="text-medium">{{ blockchain.vmID }}</span></div>
            <div class="q-pl-xs"><small class="text-grey">NAME: </small> <span class="text-medium">{{ blockchain.vmName }}</span></div>
          </div>
          <div class="col-6">
            <span class="text-light text-h7">SUBNET ID:</span> <div class="text-medium">{{ blockchain.subnetID }}</div>
            <br />
            <span class="text-light text-h7">STATUS:</span>
            <div :class="'text-medium text-' + getColor(blockchain.status)">
              {{ blockchain.status }}
              <q-tooltip>{{ getStatusInfo(blockchain.status )}}</q-tooltip>
            </div>
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
  computed: {
    ...mapGetters([
      'blockchainByID',
      'blockchainByName'
    ]),
    blockchain: function () {
      return this.getBlockchain(this.$route.params.id)
    }
  },
  methods: {
    getBlockchain (param) {
      let blockchain = this.blockchainByID(param)
      if (!blockchain) {
        blockchain = this.blockchainByName(param)
      }

      if (!blockchain) return

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
      return statusInfo[status]
    }
  }
}
</script>
