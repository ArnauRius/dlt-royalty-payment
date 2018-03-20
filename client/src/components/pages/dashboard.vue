<template>
  <div class="">
    <h1>ARTISTS DASHBOARD</h1>
  </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'

  export default {
    components: {
    },

    computed: {

      // Vuex getters
      ...mapGetters({
        'user': 'user/user',
      })

    },

  }
</script>

<style>

</style>
