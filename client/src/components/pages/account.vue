<template>
  <div>
    <div class="card">
        <div class="card-header">
            <h4>Account</h4>
        </div>
        <div class="card-body mt-1">
          <h5>Name:</h5>
          <p>{{ user.name }}</p>
          <h5>Email: </h5>
          <p>{{ user.email }}</p>
          <h5>Public key:</h5>
          <p>{{ user.signer.getPublicKey().asHex() }}</p>
          <h5>Artist:</h5>
          <p>{{ isArtist }}</p>
        <!-- Menu right button -->
        <button
          v-if="isArtist"
          class="btn btn-primary mt-5"
          type="button"
          data-toggle="modal"
          data-target="#signAsArtistModal">
          Go to Dashboard
        </button>
        <button
          v-else
          class="btn btn-primary mt-5"
          type="button"
          data-toggle="modal"
          data-target="#becomeArtistModal">
          Become an Artist
        </button>
      </div>
      <become-artist-modal id="becomeArtistModal"></become-artist-modal>
      <sign-as-artist-modal id="signAsArtistModal"></sign-as-artist-modal>
    </div>
  </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'

  // Compontents imports
  import BecomeArtistModal from '../modals/become-artist-modal.vue'
  import SignAsArtistModal from '../modals/sign-as-artist-modal.vue'

  export default {
    components: {
      BecomeArtistModal,
      SignAsArtistModal
    },

    computed: {

      // Vuex getters
      ...mapGetters({
        'user': 'user/user',
        'isArtist': 'user/isArtist'
      })

    },

  }
</script>

<style>

</style>
