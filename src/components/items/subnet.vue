<template>
  <div>
    <div id="f-size12"  class="q-pb-md text-medium">
      SUBNET ID
    </div>
    <div class="row q-mb-md text-h6 q-pb-md text-orange" style="cursor: pointer;" v-if="isDefaultSubnetID" @click="$router.push(`/search/${currentBlockchain.subnetID}`)">
      Default Subnet
    </div>
    <div v-else class="q-mb-md q-pb-xs text-orange subId" style="cursor: pointer;" @click="$router.push(`/search/${currentBlockchain.subnetID}`)">
      {{ currentBlockchain.subnetID }}
    </div>
    <div id="f-size12">
      <span class="text-medium">VM ID</span>
      <div class="text-grey">
        {{ currentBlockchain.vmID }}
      </div>
    </div>
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
