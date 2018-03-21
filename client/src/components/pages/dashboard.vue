<template>
  <div class="row">
    <div class="col-sm-6"><h4>Dashboard</h4></div>
    <div class="col-sm-6 text-right"><div class="btn btn-primary ">Upload Song</div></div>
  </div>
  <!--<div class="row" v-for="song in songs">
      <div class="card col-sm-6 col-md-3">
        <h5 class="card-title">{{ song.name }}</h5>
        <div class="btn btn-primary">Edit</div>

      </div>
  </div>-->
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
