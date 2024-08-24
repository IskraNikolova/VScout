<template>
  <q-card
    class="q-mt-xs q-pt-md q-pr-xs q-ml-xs q-pl-xl q-pb-md panel2"
    id="custom-card"
    style="min-height: 160px;"
  >
    <div class="row">
      <div v-if="isBlockchainView" class="col-md-5 col-xs-10">
        <div class="q-pb-md text-medium label-title">
          BLOCKCHAIN
        </div>
        <div class="q-mb-md">
          <div class="q-pb-md q-pr-md ">
            <span class="text-panel text-title1">{{ currentBlockchain.name }}</span>
            <span style="text-transform: uppercase; font-size: 85%;" :class="'q-ml-md text-' + getColor(currentBlockchain.status)">{{ currentBlockchain.status }}</span>
            <tooltip-style v-bind:text="getStatusInfo(currentBlockchain.status)" />
          </div>
        </div>
        <div v-if="isDefaultSubnetID(currentBlockchain.id)">
          <span class="text-medium">Height</span>
          <span class="text-panel">
            {{ height }}
          </span>
        </div>
        <div>
          <span class="text-medium label-title">Blockchain ID</span>
          <span class="text-panel label-title" style="cursor:pointer;" @click="$router.push(`/blockchain/${currentBlockchain.id}`)">
            {{ currentBlockchain.id }}
          </span>
        </div>
      </div>
      <subnet-blockchains v-else class="col-md-3 col-xs-10" />
      <div class="col-md-1 q-pt-md icon">
        <img src="~assets/blockchain-grey.svg" id="logo">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div v-if="isBlockchainView" class="col-md-5 col-xs-10">
        <div class="q-pb-md text-medium label-title">
          SUBNET ID
        </div>
        <div class="q-pt-xs" style="cursor: pointer;font-size: max(0.73vw, 12px);" v-if="isDefaultSubnetID(currentBlockchain.subnetID)">
          Default Subnet
        </div>
        <div class="q-pb-md text-panel" style="cursor: pointer;font-size: max(0.73vw, 12px);" @click="$router.push(`/subnet/${currentBlockchain.subnetID}`)">
          <small>{{ currentBlockchain.subnetID }}</small>
        </div>
        <div>
          <span class="text-medium label-title">VM ID</span>
          <div class="text-panel label-title" style="cursor: pointer;" @click="goToDoc(currentBlockchain.vmDocumentation)">
            {{ currentBlockchain.vmID }} ({{ currentBlockchain.vmName }})
          </div>
        </div>
      </div>
      <div v-else class="col-md-3 col-xs-10">
        <div class="q-pb-md text-medium label-title">SUBNETWORK (ID)</div>
        <div>
          <div class="q-pt-xs label-title" style="cursor: pointer;" v-if="isDefaultSubnetID(currentSubnet.id)">
            Default Subnet
          </div>
          <div class="q-pb-md label-title" style="cursor: pointer;" @click="$router.push(`/subnet/${currentSubnet.id}`)">
            <span class="text-panel">{{ currentSubnet.id }}</span>
          </div>
        </div>
      </div>
      <div v-if="isBlockchainView" class="col-1 q-pt-md icon">
        <img src="~assets/network.svg" id="logo2">
      </div>
      <div v-else class="col-1 q-pt-md q-mb-md icon">
        <img src="~assets/network.svg" id="logo2">
      </div>
      <q-separator class="q-mt-md q-mb-md lt-md"/>
      <div class="col-md-3 col-xs-10">
        <div v-if="!isBlockchainView">
          <div class="q-pb-md text-medium label-title">CONTROL KEYS</div>
          <div >
            <div class="col-4 q-mt-xs" id="f-size12">
              <span class="text-panel label-title"> {{ currentSubnet.threshold }}</span> Threshold
            </div>
            <q-btn-dropdown
              size="xs" no-caps
              label="Control Keys"
              outline
            >
              <q-list v-for="key in currentSubnet.controlKeys" v-bind:key="key">
                <q-item>
                  <q-item-section side>
                    <q-icon size="xs" name="img:statics/key.svg" />
                  </q-item-section>
                  <q-item-section>
                    <span>{{ key }}</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </div>
      <div class="col-1 q-pt-md icon">
        <img src="~assets/key-digital.svg" style=" width:40vw;max-width:40px;" v-if="!isBlockchainView">
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  openURL
} from 'quasar'

const colors = {
  Validating: 'accent',
  Created: 'positive',
  Preferred: 'grey',
  Unknown: 'negative'
}

const statusInfo = {
  Validating: 'The blockchain is being validated by this node.',
  Created: 'The blockchain exists but isn’t being validated by this node.',
  Preferred: 'The blockchain was proposed to be created and is likely to be created but the transaction isn’t yet accepted.',
  Unknown: 'The blockchain either wasn’t proposed or the proposal to create it isn’t preferred. The proposal may be resubmitted.'
}
import SubnetBlockchains from './../items/subnet-blockchains'
export default {
  name: 'Network',
  components: {
    SubnetBlockchains,
    TooltipStyle: () => import('components/tooltip-style.vue')
  },
  computed: {
    ...mapGetters([
      'height',
      'appTheme',
      'currentSubnet',
      'isBlockchainView',
      'currentBlockchain',
      'isDefaultSubnetID'
    ])
  },
  methods: {
    format (value) {
      return `${Math.round(value)}`
    },
    getColor (status) {
      return colors[status]
    },
    getStatusInfo (status) {
      if (!statusInfo[status]) return ''
      return statusInfo[status]
    },
    goToDoc (url) {
      openURL(url)
    }
  }
}
</script>

<style scoped>
  #custom-card {
    border-right: 2px solid #86b9b0;
  }
  #logo {
    width:45vw;
    max-width:45px;
  }
  .label-title {
    font-size: max(0.7vw, 12px);
   }
  .label-title2 {
    font-size: max(0.55vw, 12px);
  }
  .text-title1 {
    font-size: max(0.8vw, 16px);
  }
</style>
