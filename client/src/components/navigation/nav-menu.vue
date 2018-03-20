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
        <ul class="navbar-nav ml-auto">
          <li v-if="isUserSigned"
              v-for="page in pages">
            <a class="nav-link">{{ page }}</a>
          </li>
        </ul>
        <div class="ml-auto">
          <!-- User's Name -->
          <router-link class="nav-link"
                       to="account"
                       v-if="isUserSigned">
            {{ user.name }}
          </router-link>

          <!-- Menu right button -->
          <button v-if="!isUserSigned"
                  class="btn btn-nav-menu"
                  type="button"
                  data-toggle="modal"
                  data-target="#signInModal">
            Sign In
          </button>
        </div>
        <!-- Menu right button -->
        <button v-if="!isUserSigned"
                class="btn btn-nav-menu"
                type="button"
                data-toggle="modal"
                data-target="#signUpModal">
          Sign Up
        </button>
        <button v-if="isUserSigned"
                class="btn btn-nav-menu"
                type="button"
                @clickclick="signOut()">
          Sign Out
        </button>

      </div>
    </nav>

    <!-- Sign In modal to show -->
    <sign-in-modal id="signInModal">
      <p slot="open-sign-up-modal"
         class="open-sign-up-modal"
         data-dismiss="modal"
         data-toggle="modal"
         data-target="#signUpModal">Do not have an account yet? Sign Up</p>
    </sign-in-modal>

    <!-- Sign Up modal to show -->
    <sign-up-modal id="signUpModal"></sign-up-modal>

  </div>

</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  // Components imports
  import SignInModal from '../modals/sign-in-modal.vue'
  import SignUpModal from '../modals/sign-up-modal.vue'

  export default {

    components: {
      SignInModal,
      SignUpModal
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
        'isUserSigned': 'user/isUserSigned'
      })

    },

    methods: {

      // Vuex actions
      ...mapActions({
        'SIGN_OUT_USER': 'user/SIGN_OUT_USER'
      }),

      signOut: function () {
        this.$router.go('/')
        this.SIGN_OUT_USER()
      },

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
  .navbar-collapse{
    justify-content: center;
  }
  .navbar-light .navbar-nav .nav-link {
    cursor: pointer;
    color: black !important;
  }

  .navbar-light .navbar-nav .nav-link:hover {
    text-decoration: underline;
  }

</style>
