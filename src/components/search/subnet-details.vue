<template>
  <div class="panel">
    <!--gt-sm-->
    <div class="q-pa-md gt-sm">
      <div class="q-pl-md text-bold" style="opacity: 0.3;">SUBNET ID</div>
      <div class="text-regular q-pl-md q-pb-md">{{ subnet.id }}</div>
      <span class="q-pl-md text-light text-h7" style="opacity: 0.3;">BLOCKCHAINS:</span>
        <div class="row q-pl-md">
          <div class="col" v-for="id in subnet.blockchainsId" v-bind:key="id">
            <br />
            <small style="opacity: 0.3;">NAME: </small>{{ blockchainByID(id).name }}
            <br />
            <small style="opacity: 0.3;">ID: </small><span class="text-light">{{ blockchainByID(id).id }}</span>
            <br />
            <small style="opacity: 0.3;">VM ID: </small><span class="text-light">{{ blockchainByID(id).vmID }}</span>
          </div>
        </div>
    </div>
    <!--lt-md-->
    <div class="q-pa-md lt-md">
      <div class="text-bold" style="opacity: 0.3;">SUBNET ID</div>
      <div class="text-regular q-pb-md">{{ subnet.id }}</div>
      <span class="text-light text-h7" style="opacity: 0.3;">BLOCKCHAINS:</span>
      <div class="text-medium" v-for="id in subnet.blockchainsId" v-bind:key="id">
        <br />
        <small style="opacity: 0.3;">NAME: </small>{{ blockchainByID(id).name }}
        <br />
        <small style="opacity: 0.3;">ID: </small><span class="text-light">{{ blockchainByID(id).id }}</span>
        <br />
        <small style="opacity: 0.3;">VM ID: </small><span class="text-light">{{ blockchainByID(id).vmID }}</span>
      </div>
    </div>
    <q-separator class="q-mt-md q-mb-md"/>
    <div class="q-pa-md">
      <span class="text-light text-h7" style="opacity: 0.3;">THRESHOLD:</span> <span class="text-medium q-pl-xs">{{ subnet.threshold }}</span>
      <br />
      <span class="text-light text-h7" style="opacity: 0.3;">CONTROL KEYS:</span> <div class="text-medium q-pl-xs" v-for="key in subnet.controlKeys" v-bind:key="key">{{ key }}</div>
      <br />
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'SubnetDetails',
  computed: {
    ...mapGetters([
      'blockchainByID',
      'subnetByID'
    ]),
    subnet: function () {
      return this.getSubnet(this.$route.params.id)
    }
  },
  methods: {
    getSubnet (param) {
      const subnet = this.subnetByID(param)
      if (!subnet) return {}

      return subnet
    }
  }
}
</script>
