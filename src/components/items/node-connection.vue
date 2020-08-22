<template>
  <div class="col-md-2 col-xs-10">
    <div id="f-size12" class="q-pb-md text-medium">
      ENDPOINT
      <q-spinner-ball v-if="ui.doesItConnect" />
    </div>
    <div class="q-pb-md">
      <div class="text-h7 text-orange">{{ networkEndpoint }}</div>
    </div>
    <div id="f-size12" class="q-mt-md">
      <q-icon name="info" color="accent" size="md"/>
      <span class="q-pt-xl">You can switch to other node</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NodeConnection',
  computed: {
    ...mapGetters([
      'ui',
      'networkEndpoint'
    ])
  }
}
</script>
