<template>
  <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px;border-style: solid;border-width: 0.1px;">
    <q-icon v-if="icon" :name="icon" class="q-pb-xs" /> {{ text }}
   </q-tooltip>
</template>
<script>
export default {
  name: 'TooltipStyle',
  props: {
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    }
  }
}
</script>
