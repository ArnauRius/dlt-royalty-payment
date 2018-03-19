<template>

  <div>
    <nav class="navbar navbar-expand-lg navbar-light">

      <!-- Menu tile -->
      <h4 class="m-0">
        <router-link to="/">Roylaty Payment Demo</router-link>
      </h4>

      <!-- Menu for mobile versions button -->
      <button class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="fa fa-bars"></span>
      </button>

      <!-- Full menu -->
      <div class="collapse navbar-collapse"
           id="navbarSupportedContent">

        <!-- Menu options -->
        <ul class="navbar-nav mr-auto">
          <li v-if="isUserLogged"
              v-for="page in pages">
            <a class="nav-link">{{ page }}</a>
          </li>
        </ul>

        <!-- User's Name -->
        <router-link class="nav-link"
                     to="account"
                     v-if="isUserLogged">
          {{ user.name }}
        </router-link>

        <!-- Menu right button -->
        <button class="btn btn-nav-menu"
                type="button"
                data-toggle="modal"
                data-target="#signInModal"
                v-if="!isUserLogged">
          Sign In
        </button>
        <button class="btn btn-nav-menu"
                type="button"
                v-on:click="LOG_OUT_USER()"
                v-else>
          Sign Out
        </button>

      </div>
    </nav>

    <!-- Sign In modal to show -->
    <sign-in-modal id="signInModal"></sign-in-modal>

  </div>

</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  // Components imports
  import SignInModal from './sign-in-modal.vue'

  export default {

    components: {
      SignInModal
    },

    data() {
      return {
        pages: ["Page1", "Page2"]
      }
    },

    computed: {

      // Vuex getters
      ...mapGetters({
        'user': 'user/user',
        'isUserLogged': 'user/isUserLogged'
      })

    },

    methods: {

      // Vuex actions
      ...mapActions({
        'LOG_OUT_USER': 'user/LOG_OUT_USER'
      })

    }
  }
</script>

<style scoped>
  .navbar-light {
    background-color: lightskyblue;
    box-shadow: 0px 2px 8px 0px lightgray;
    position: fixed;
    width: 100%;
    color: white;
  }

  .navbar-light .navbar-toggler {
    border-color: white;
    padding: 8px 16px 8px 16px;
    color: white;
  }

  .btn-nav-menu {
    margin-right: 26px;
    padding-left: 26px;
    padding-right: 26px;
    border-width: 2px;
    color: white;
    background-color: transparent;
    border-color: white;
  }

  .btn-nav-menu:hover, .btn-nav-menu:active {
    background-color: white;
    color: lightskyblue;
  }
</style>
