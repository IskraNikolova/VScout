<template>
  <div>
    <div id="f-size12"  class="q-pb-md">
      SUBNET ID
    </div>
    <div class="row q-mb-md text-h6 q-pb-md text-orange" v-if="isDefaultSubnetID">
      Default Subnet
    </div>
    <div v-else class="q-mb-md q-pb-xs text-orange subId">{{ currentBlockchain.subnetID }}</div>
    <div id="f-size12">VM ID <div class="text-grey">{{ currentBlockchain.vmID }}</div></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Subnet',
  computed: {
    ...mapGetters([
      'currentBlockchain',
      'isDefaultSubnetID'
    ])
  }
}
</script>
