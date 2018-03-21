<template>
  <div>
    <div class="card">
      <div class="card-body mt-1">
        <h1>ACCOUNT</h1>
        <h5>Name:</h5>
        <p>{{ user.name }}</p>
        <h5>Email: </h5>
        <p>{{ user.email }}</p>
        <h5>Public key:</h5>
        <p>{{ user.signer.getPublicKey().asHex() }}</p>
        <h5>Artist:</h5>
        <p>{{ user.isArtist }}</p>
      </div>
    </div>
    <!-- Menu right button -->
    <button
            v-if="user.isArtist"
            class="btn btn-primary mt-5"
            type="button"
            data-toggle="modal"
            data-target="#becomeArtistModal">
      Go to Dashboard
      </button>
    <button
      class="btn btn-primary mt-5"
      type="button"
      data-toggle="modal"
      data-target="#becomeArtistModal"
      v-else>
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
