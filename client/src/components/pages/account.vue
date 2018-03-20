<template>
  <div class="pt-5">
    <div class="card">
      <div class="card-body mt-1">
        <h1>THIS IS THE ACCOUNT PAGE</h1>
        <h5>Name:</h5>
        <p>{{ user.name }}</p>
        <h5>Email: </h5>
        <p>{{ user.email }}</p>
        <h5>Public key:</h5>
        <p>{{ user.signer.getPublicKey().asHex() }}</p>
      </div>
    </div>
    <!-- Menu right button -->
    <button
            class="btn btn-primary mt-5"
            type="button"
            data-toggle="modal"
            data-target="#becomeArtistModal">
      Become an Artist
      </button>
    <become-artist-modal id="becomeArtistModal"></become-artist-modal>
  </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'

  import BecomeArtistModal from '../modals/become-artist-modal.vue'

  export default {
    components: {
      BecomeArtistModal,
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
