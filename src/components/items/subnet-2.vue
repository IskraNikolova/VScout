<template>
  <div>
    <div id="f-size12" class="q-pb-md">SUBNETWORK</div>
    <div>
      <small>Subntet ID</small>
      <div class="text-h6 q-pb-md text-orange" v-if="isDefaultSubnetID">
        Default Subnet
      </div>
      <div v-else class="q-pb-md q-pt-xs text-orange" style="font-size: 19px;" >
        <small>{{ currentSubnet.id }}</small>
      </div>
    </div>
    <div id="f-size12">
      Threshold:
      <span class="text-h7 text-grey"> {{ currentSubnet.threshold }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Subnet2',
  computed: {
    ...mapGetters([
      'currentSubnet',
      'isDefaultSubnetID'
    ])
  }
}
</script>
