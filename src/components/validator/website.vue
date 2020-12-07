<template>
  <div class="q-pl-xs q-pt-md">
    <q-img style="width: 30vw;max-width: 30px;margin: auto;"  src="~assets/hyperlink.svg" />
    <a v-if="link" :href="link" class="text-panel" v-html="website"></a>
    <a v-else :href="website" class="text-panel" v-html="website"></a>
  </div>
</template>

<script>
export default {
  name: 'Website',
  props: {
    website: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: false
    },
    nodeID: {
      type: String,
      required: true
    }
  }
}
</script>
