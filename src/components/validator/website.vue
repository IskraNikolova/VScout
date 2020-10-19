<template>
  <div class="q-pl-sm">
    <q-img style="width: 30vw;max-width: 30px;margin: auto;"  src="~assets/website.svg" />
    <a v-if="link" :href="link">{{website }}</a>
    <a v-else :href="'https://vscout.io/validator/' + nodeID">{{ website }}</a>
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
