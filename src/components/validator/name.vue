<template>
  <q-item-label>
    <div class="text-medium q-pb-md" style="font-size: 20px;" v-if="name !== nodeID">
      <a v-if="link" :href="link" style="text-decoration: none;" class="text-purple">{{ name }}</a>
      <span v-else class="text-secondary">{{ name }}</span>
    </div>
    <div>
    <span style="cursor: pointer;" @click="copyToClipboard(nodeID)">
      [{{ nodeID }}]
      <tooltip-style v-bind:text="'Copy To Clipboard'" />
    </span>
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
  components: {
    TooltipStyle: () => import('components/tooltip-style')
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
