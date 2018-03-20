<template>
    <div class="modal fade"
         tabindex="-1"
         role="dialog"
         aria-labelledby="Become Artist"
         aria-hidden="true"
         @keyup.enter="submit">

      <div class="modal-dialog modal-dialog-centered"
           role="document">

        <div class="modal-content">

          <!-- Modal's header -->
          <div class="modal-header">
            <h3>Become an Artist</h3>
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

              <!-- Pub Key input -->
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                      <span class="fa fa-key"></span>
                  </span>
                </div>
                <input type="text"
                       class="form-control"
                       placeholder="Public Key"
                       ref="pubkey">
              </div>

              <!-- Sign In button -->
              <button @click="submit"
                      type="button"
                      class="btn btn-success pull-right">
                Start
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

  // Api import
  import api from '../../api'

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

      /**
       * Shows an error in a red alert
       * @param error
       */
      showError: function (error) {
        this.errorMessage = error
        this.isError = true
      },
      submit: function (){
        console.log('modal submited')
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
