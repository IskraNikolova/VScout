<template>
  <q-item-label>
    <small @click="copyToClipboard(owner)" style="cursor: pointer;opacity: 0.5;">
      <span class="text-medium">Owner</span> ({{ owner }})
    </small>
  </q-item-label>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

export default {
  name: 'Owner',
  props: {
    owner: {
      type: String,
      required: true
    }
  },
  methods: {
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
    }
  }
}
</script>
