<template>
  <div>
    <div id="f-size12" class="q-pb-md text-medium">
      BLOCKCHAIN
    </div>
    <div class="q-mb-md">
      <div class="text-h6 text-orange q-pb-md q-pr-md ">
        {{ currentBlockchain.name }}
      </div>
    </div>
    <div id="f-size12">
      <span class="text-medium">Blockchain ID</span>
      <div class="text-grey">
        {{ currentBlockchain.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Blockchain',
  computed: {
    ...mapGetters([
      'currentBlockchain'
    ])
  }
}
</script>
