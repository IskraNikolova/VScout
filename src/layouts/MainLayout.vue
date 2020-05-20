<template>
  <q-layout view="lHh Lpr lFf" class="page-cont">
    <!--<q-img src="~assets/backgrounds/5.png" class="fullscreen" style="z-index: -1;width: 55%;"/>-->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>
