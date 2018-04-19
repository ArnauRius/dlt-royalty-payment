<template>
  <div class="modal fade"
       tabindex="-1"
       role="dialog"
       aria-labelledby="Sign In"
       aria-hidden="true"
       @keyup.enter.stop="signIn">

    <div class="modal-dialog modal-dialog-centered"
         role="document">

      <div class="modal-content">

        <!-- Modal's header -->
        <div class="modal-header">
          <h3>Sign In</h3>
          <button type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  ref="closeButton">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <!-- Modal's body -->
        <div class="modal-body">

          <div v-if="isError"
               class="alert alert-danger"
               role="alert">
            {{ errorMessage }}
          </div>

          <form class="modal-form">

            <!-- Email input -->
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">
                    <span class="fa fa-at"></span>
                </span>
              </div>
              <input type="email"
                     class="form-control"
                     placeholder="Email"
                     ref="email">
            </div>

            <!-- Password input -->
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">
                    <span class="fa fa-key"></span>
                </span>
              </div>
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                ref="password">
            </div>

            <!-- Sign In button -->
            <button @click="signIn"
                    type="button"
                    class="btn btn-primary pull-right">
              Sign In
            </button>

            <slot name="open-sign-up-modal"></slot>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  // Vuex imports
  import {mapActions} from 'vuex'

  // Utils import
  import utils from '../../utils'

  export default {

    data() {
      return {
        isError: false,
        errorMessage: 'Some error occurred. Please, try again later.'
      }
    },

    methods: {

      // Vuex actions
      ...mapActions({
        'SIGN_IN_USER': 'user/SIGN_IN_USER'
      }),

      /**
       * Checks if the user has filled correctly the sign in form and tries to sign in him
       */
      signIn: function () {

        this.isError = !(this.checkValidPassword() && this.checkValidEmail())

        if (!this.isError) {
          const credentials = {
            email: this.$refs.email.value,
            password: this.$refs.password.value
          }
          this.SIGN_IN_USER(credentials)
            .then(() => {
              this.$refs.closeButton.click()
              this.$router.push({name:'explorer'})
            })
            .catch((error) => {
              this.showError(error)
            })
        }
      },

      /**
       * Checks if the user has entered a valid email. Shows an error otherwise.
       * Returns a boolean to define if the email is valid or not
       * @return bool
       */
      checkValidEmail: function () {
        if (!utils.checkValidEmail(this.$refs.email.value)) {
          this.errorMessage = 'Please, introduce a valid email to sign in.'
          return false
        }
        return true
      },

      /**
       * Checks if the user has entered the password. Shows an error otherwise.
       * Returns a boolean to define is the password is valid or not
       * @return bool
       */
      checkValidPassword: function () {
        if (this.$refs.password.value === "") {
          this.errorMessage = 'Please, introduce the password to sign in.'
          return false
        }
        return true
      },

      /**
       * Shows an error in a red alert
       * @param error
       */
      showError: function (error) {
        this.errorMessage = error
        this.isError = true
      }
    }
  }
</script>

<style scoped>
  /* Style will be applied after the <slot> is replaced with its content */
  .open-sign-up-modal {
    color: black;
  }

  /* Style will be applied after the <slot> is replaced with its content */
  .open-sign-up-modal:hover, .open-sign-up-modal:active {
    color: darkgray;
    cursor: pointer;
  }
</style>
