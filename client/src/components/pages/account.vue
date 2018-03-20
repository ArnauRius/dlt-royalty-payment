<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h1>THIS IS THE ACCOUNT PAGE</h1>
        <h5>Name:</h5>
        <p>{{ user.name }}</p>
        <h5>Email: </h5>
        <p>{{ user.email }}</p>
        <h5>Public key:</h5>
        <p>{{ user.signer.getPublicKey().asHex() }}</p>
      </div>
    </div>
  </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'

  export default {

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
