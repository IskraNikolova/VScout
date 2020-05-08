<template>
  <q-layout view="lHh Lpr lFf">
    <!--https://assets-global.website-files.com/5d80307810123f5ffbb34d6e/5e6196765e5f35339572f9b6_BG.svg-->
    <!--./../statics/backgrounds/2.jpg-->
    <q-page-container style="background-image: url(./../statics/backgrounds/1.jpg);background-size: 100%;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>
