<template>
  <div class="modal fade"
       tabindex="-1"
       role="dialog"
       aria-labelledby="Sign In"
       aria-hidden="true">

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

          <div v-if="isError" class="alert alert-danger"
               role="alert">
            {{ errorMessage }}
          </div>

          <form class="sign-in-form">

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
                    class="btn btn-sign-in pull-right">Sign In</button>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  // Vuex imports
  import {mapActions} from 'vuex'

  export default {

    data () {
      return {
        isError: false,
        errorMessage: 'Some error ocurred. Please, try again later.'
      }
    },

    methods: {

      // Vuex actions
      ...mapActions({
        'LOG_IN_USER': 'user/LOG_IN_USER',
      }),

      /**
       * Checks if the user has filled correctly the sign in form and tries to sign in him
       */
      signIn: function(){

        this.isError = !(this.checkValidPassword() && this.checkValidEmail())

        if(!this.isError){
          //TODO: Check auth in Firebase
          if(this.$refs.email.value === "test@test.com" && this.$refs.password.value === "0000"){
            this.$refs.closeButton.click()
            const user = {
              email: this.$refs.email.value,
              name: "Test",
              pub_key: "this is the pub key"
            }
            this.LOG_IN_USER(user)
          }else{
            this.errorMessage = 'Invalid email or password.'
            this.isError = true
          }
        }
      },

      /**
       * Checks if the user has entered a valid email. Shows an error otherwise.
       * Returns a boolean to define is the email is valid or not
       * @return bool
       */
      checkValidEmail: function() {
        if(this.$refs.email.value === ""){
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
      checkValidPassword: function() {
        if(this.$refs.password.value === ""){
          this.errorMessage = 'Please, introduce the password to sign in.'
          return false
        }
        return true
      }
    }
  }
</script>

<style scoped>
  .modal-header {
    background-color: lightskyblue;
    color: white;
  }

  .sign-in-form {
    padding: 24px 0px 24px 0px;
  }

  .btn-sign-in {
    color: white;
    background-color: lightskyblue;
  }

  .btn-sign-in:hover, .btn-sign-in:active {
    background-color: #3AA6E6;
  }
</style>
