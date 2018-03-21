<template>
  <div class="modal fade"
       tabindex="-1"
       role="dialog"
       aria-labelledby="Sign Up"
       aria-hidden="true"
       @keyup.enter="signUp">

    <div class="modal-dialog modal-dialog-centered"
         role="document">

      <div class="modal-content">

        <!-- Modal's header -->
        <div class="modal-header">
          <h3>Sign Up</h3>
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

            <!-- Name input -->
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                            <span class="input-group-text">
                                <span class="fa fa-user-o"></span>
                            </span>
              </div>
              <input type="text"
                     class="form-control"
                     placeholder="Name"
                     ref="name">
            </div>

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

            <!-- Sign Up button -->
            <button @click="signUp"
                    type="button"
                    class="btn btn-primary pull-right">
              Sign Up
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  // Vuex imports
  import {mapActions} from 'vuex'

  // Api Import
  import api from '../../api'

  // Utils Import
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
       * Checks if the user has filled correctly the sign up form and tries to sign up him
       */
      signUp: function () {

        this.isError = !(this.checkValidName() && this.checkValidPassword() && this.checkValidEmail())

        if (!this.isError) {
          const user = {
            name: this.$refs.name.value,
            email: this.$refs.email.value,
            password: this.$refs.password.value,
            artistRef: null
          }

          api.signUp(user)
            .then((user) => {
            this.SIGN_IN_USER({email: user.email, password: user.password})
              .then(() => {
                this.$refs.closeButton.click()
              })
              .catch((error) => {
                this.showError(error+" (While singing in)")
              })
            })
            .catch((error) => {
              this.showError(error)
            })
        }
      },

      /**
       * Checks if the user has entered a valid name. Shows an error otherwise.
       * Returns a boolean to define is the name is valid or not
       * @return bool
       */
      checkValidName: function () {
        if (this.$refs.name.value === "") {
          this.errorMessage = 'Please, introduce a valid name to sign up.'
          return false
        }
        return true
      },

      /**
       * Checks if the user has entered a valid email. Shows an error otherwise.
       * Returns a boolean to define if the email is valid or not
       * @return bool
       */
      checkValidEmail: function () {
        if (!utils.checkValidEmail(this.$refs.email.value)) {
          this.errorMessage = 'Please, introduce a valid email to sign up.'
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
          this.errorMessage = 'Please, introduce the password to sign up.'
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

</style>
