<template>
  <div class="modal fade"
       tabindex="-1"
       role="dialog"
       aria-labelledby="Upload Song"
       aria-hidden="true"
       @keyup.enter="">

    <div class="modal-dialog modal-dialog-centered"
         role="document">

      <div class="modal-content">

        <!-- Modal's header -->
        <div class="modal-header">
          <h3>Upload a Song</h3>
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

            <!-- song name input -->
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                  <span class="input-group-text">
                      Name
                  </span>
              </div>
              <input type="text"
                     class="form-control"
                     placeholder="Enter the song name here..."
                     ref="name">
            </div>


            <table class="table">
              <tr>
                <th>Paypal email</th>
                <th>Percentage</th>
                <th></th>
              </tr>
              <tr v-for="account in accounts">
                <th>{{ account.email }}</th>
                <th>{{ account.percentage }}</th>
                <th >
                  <button class="btn btn-outline-warning mt-1"
                    @click="editAccount(account.email, account.percentage)"
                    >Edit
                  </button>
                </th>
              </tr>
            </table>
            <hr>
            <p>Add a new receiver</p>
            <!-- new receiver -->
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                  <span class="input-group-text">
                      <span class="fa fa-paypal"></span>
                  </span>
              </div>
              <input type="text"
                     class="form-control"
                     placeholder="Enter the paypal account here..."
                     ref="paypal">
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                  <span class="input-group-text">
                     <span class="fa fa-percent"></span>
                  </span>
              </div>
              <input type="text"
                     class="form-control"
                     placeholder="Enter the percentage here..."
                     ref="percentage">
            </div>
            <!-- Edit Percentage -->
            <div v-if="isEdit">
              <button
                      @click="editAccount"
                      type="button"
                      class="btn btn-info pull-right">
                Save
              </button>
              <button
                @click="undoEditAccount"
                type="button"
                class="btn btn-danger pull-right mr-2">
                Cancel
              </button>
            </div>
            <!-- Add Percentage -->
            <button v-else
                    @click="addAccount"
                    type="button"
                    class="btn btn-primary pull-right">
              Add
            </button>
          </form>
        </div>
        <!-- Modal's footer -->
        <div class="modal-footer">
          <!--Become an artist button -->
          <button @click="createSong()"
                  type="button"
                  class="btn btn-success pull-right">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  // Vuex imports
  import {mapActions} from 'vuex'

  // Utils Import
  import utils from '../../utils'

  export default {

    data() {
      return {
        isError: false,
        isEdit: false,
        errorMessage: 'Some error occurred. Please, try again later.',
        accounts: [
          {email: 'arnau@monkignme.com', percentage: 45},
          {email: 'arnau@monkignme.com', percentage: 55}
        ], // TODO: Fetch from blockchain

      }
    },

    methods: {

      // Vuex actions
      ...mapActions({
        'CREATE_SONG': 'artist/CREATE_SONG'
      }),

      /**
       * Creates a new song assigned to the current artist
       */
      createSong() {
        this.isError = !(this.checkValidName() && this.checkSumAmount())
        if (!this.isError) {
          this.CREATE_SONG(this.$refs.name.value)
            .then(() => {
              this.$refs.closeButton.click()
            })
            .catch((error) => {
              this.showError(error)
            })
        }
      },

      //TODO: CHECK FROM HERE
      clearAddAccount() {
        this.$refs.paypal.value = ''
        this.$refs.percentage.value = ''
      },
      addAccount() {
        this.isError = !(this.checkValidEmail() && this.checkValidAmount() && this.checkEmailUnique())
        if (!this.isError) {
          this.accounts.push({email: this.$refs.paypal.value, percentage: this.$refs.percentage.value})
          this.clearAddAccount()
        }
      },
      editAccount(email, percentage) {
        this.$refs.paypal.value = email
        this.$refs.percentage.value = percentage
        this.isEdit = true

      },
      undoEditAccount() {
        this.clearAddAccount()
        this.isEdit = false
      },
      saveEditAccount() {
        // TODO: Save on server
        this.isEdit = false
      },


      /**
       * Checks if the user has entered a valid name. Shows an error otherwise.
       * Returns a boolean to define is the name is valid or not
       * @return bool
       */
      checkSumAmount() {
        const sum = this.accounts.reduce( (acc, currentItem, currentIndex) => acc + currentItem.percentage, 0);
        if(sum === 100) {
          return true
        }
        this.errorMessage = 'The sum of amounts is not 100.'
        return false
      },
      /**
       * Checks if the user has entered a valid name. Shows an error otherwise.
       * Returns a boolean to define is the name is valid or not
       * @return bool
       */
      checkValidName() {
        if (this.$refs.name.value === "") {
          this.errorMessage = 'Please, introduce a valid song name.'
          return false
        }
        return true
      },
      /**
       * Checks if the user has entered a valid email. Shows an error otherwise.
       * Returns a boolean to define if the email is valid or not
       * @return bool
       */
      checkValidEmail() {
        if (!utils.checkValidEmail(this.$refs.paypal.value)) {
          this.errorMessage = 'Please, introduce a valid email.'
          return false
        }
        return true
      },
      checkEmailUnique() {
        if(this.accounts.some( ((account, index, array) => account.email === this.$refs.paypal.value ), this)){
          this.errorMessage = 'Please, introduce a valid email.'
          return false
        }
        return true
      },
      /**
       * Checks if the user has entered a valid amount. Shows an error otherwise.
       * Returns a boolean to define if the email is valid or not
       * @return bool
       */
      checkValidAmount() {
        if (this.$refs.percentage.value > 0 && this.$refs.percentage.value <= 100) {
          return true
        }
        this.errorMessage = 'Please, introduce a valid amount (< 0 && >= 100).'
        return false
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
