<template>
  <q-item-label>
    <small class="text-grey">
    <span class="text-medium">Owner</span> ({{ owner }})
    <q-icon
    @click="copyToClipboard(owner)"
    color="grey"
    name="file_copy"
    />
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
