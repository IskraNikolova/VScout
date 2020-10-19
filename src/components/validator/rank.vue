<template>
  <q-item-label>
    <small class="text-medium">Rank </small>
    <span class="text-accent">
      {{ rank }}
    </span><q-icon name="img:statics/star.svg" size="1.5em" style="margin-bottom: 2px"/>
  </q-item-label>
</template>

<script>
export default {
  name: 'Rank',
  props: {
    rank: {
      type: Number,
      required: false
    }
  }
}
</script>
