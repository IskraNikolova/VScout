<template>
  <q-item-section avatar style="cursor:pointer;">
    <q-img :src="avatar" style="width:90vw; max-width:90px;height: 90px;border-radius: 5px;">
        <template v-slot:error>
        <div style="font-size: 27px;" class="bg-white text-grey absolute-center">
          <q-img src="~assets/image.jpg" style="width:90vw; max-width:90px;height: 90px;border-radius: 5px;" />
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
