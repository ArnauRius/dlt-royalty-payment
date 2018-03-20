<template>
  <div id="app">
    <nav-menu></nav-menu>
    <router-view class="container"></router-view>
  </div>
</template>

<script>

  // Components imports
  import NavMenu from './components/nav-menu.vue'

  export default {

    components: {
      NavMenu
    }

  }
</script>

<style>
  @import "css/settings.css"

</style>
