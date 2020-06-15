<template>
  <q-btn-dropdown
    flat
    dropdown-icon="img:statics/blockchain-black.svg"
  >
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="orange"
      indicator-color="accent"
      align="justify"
      narrow-indicator
    >
      <q-tab name="blockchains" label="Blockchains" />
      <q-tab name="subnets" label="Subnets" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="blockchains">
        <list-blockchains />
      </q-tab-panel>

      <q-tab-panel name="subnets">
        <list-subnets />
      </q-tab-panel>
    </q-tab-panels>
  </q-btn-dropdown>
</template>

<script>
import ListSubnets from './../list-subnets'
import ListBlockchains from './../list-blockchains'

export default {
  name: 'SelectNetworkDropDown',
  components: {
    ListSubnets,
    ListBlockchains
  },
  data () {
    return {
      tab: 'blockchains'
    }
  }
}
</script>
