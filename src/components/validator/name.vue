<template>
  <q-item-label>
    <div class="text-medium q-pb-sm" style="font-size: 20px;" v-if="name !== nodeID">
      <a v-if="link" :href="link" style="text-decoration: none;">{{ name }}</a>
      <span v-else class="text-secondary">{{ name }}</span>
    </div>
    <div>
    [{{ nodeID }}]
    <q-icon
      @click="copyToClipboard(nodeID)"
      color="grey"
      name="file_copy"
    />
    </div>
  </q-item-label>
</template>

<script>
import {
  copyToClipboard
} from 'quasar'

export default {
  name: 'Name',
  props: {
    name: {
      type: String,
      required: false
    },
    nodeID: {
      type: String,
      required: false
    },
    link: {
      type: String,
      required: false
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
