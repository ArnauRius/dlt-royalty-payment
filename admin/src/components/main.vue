<template>
  <div class="flex">
    <nav-menu></nav-menu>
    <router-view class="container"></router-view>
  </div>
</template>

<script>
  // Components imports
  import NavMenu from './navigation/nav-menu.vue'
  export default {

    data() {
      return {
      }
    },
    components: {
      NavMenu
    },
  }
</script>

<style>

</style>
