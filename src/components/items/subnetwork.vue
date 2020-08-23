<template>
  <div>
    <div id="f-size12" class="q-pb-md text-medium">SUBNETWORK</div>
    <div>
      <div class="q-pt-xs" style="cursor: pointer;" v-if="isDefaultSubnetID">
        Default Subnet
      </div>
      <div class="q-pb-md text-orange" style="font-size: 19px;cursor: pointer;" @click="$router.push(`/search/${currentSubnet.id}`)">
        <small>{{ currentSubnet.id }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Subnetwork',
  computed: {
    ...mapGetters([
      'currentSubnet',
      'isDefaultSubnetID'
    ])
  }
}
</script>
