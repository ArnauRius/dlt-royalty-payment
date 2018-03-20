<template>
  <div id="app" class="app">
    <nav-menu></nav-menu>
    <router-view class="content"></router-view>
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
  .app {
    font-family: "Avenir Next";
  }

  .content {
    padding-top: 70px;
  }

  a {
    color: white;
    text-decoration: none;
  }

  a:hover {
    color: whitesmoke;
    text-decoration: none;
  }
</style>
