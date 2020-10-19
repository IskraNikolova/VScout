<template>
  <q-item-section avatar style="cursor:pointer;">
    <q-img :src="avatar" style="width:80vw; max-width:80px;height: 80px;border-radius: 5px;">
        <template v-slot:error>
        <div style="font-size: 27px;" class="bg-white text-grey absolute-center">
            ?
        </div>
        </template>
    </q-img>
  </q-item-section>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    avatar: {
      type: String,
      required: true
    }
  }
}
</script>
