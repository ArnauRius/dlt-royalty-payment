<template>
  <div class="flex">
    <nav-menu></nav-menu>
    <router-view class="container mt-nav"></router-view>
  </div>
</template>

<script>
  // Components imports
  import NavMenu from './navigation/nav-menu.vue'

  export default {

    components: {
      NavMenu
    }
  }
</script>

<style>
  .mt-nav{
    margin-top: 54px;
  }
</style>
