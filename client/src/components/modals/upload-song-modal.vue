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
          <h3>Upload Song</h3>
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

            <!-- Song Information -->
            <h5>Song</h5>
            <!-- song name input -->
            <div>
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
            </div>

            <hr>

            <!-- Royalties Information -->
            <h5>Royalties</h5>
            <!-- royalty account -->
            <div class="clearfix">
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
              <!-- royalty percentage -->
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
              <!-- Add royalty button -->
              <button @click="addRoyalty"
                      type="button"
                      class="btn btn-primary pull-right">
                Add
              </button>
            </div>

            <hr>

            <!-- Royalties list -->
            <div class="card border-secondary mb-3">
              <div class="card-body">

                <table class="table table-header-borderless">
                  <thead>
                    <tr>
                      <th>Paypal email</th>
                      <th>%</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(royalty, index) in royalties">
                      <td>{{ royalty.email }}</td>
                      <td>{{ royalty.percentage }}</td>
                      <td>
                        <button class="btn btn-outline-danger"
                                type="button"
                                @click="removeRoyalty(index)">
                          <i class="fa fa-trash-o" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>


        <!-- Modal's footer -->
        <div class="modal-footer">
          <!-- Save song button -->
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
        errorMessage: 'Some error occurred. Please, try again later.',
        royalties: [
          {email: 'arnau@monkignme.com', percentage: 45},
          {email: 'arnau@monkignme.com', percentage: 55}
        ], // TODO: Fetch from blockchain

      }
    },

    methods: {

      // Vuex actions
      ...mapActions({
        'CREATE_SONG': 'artist/CREATE_SONG',
        'FETCH_SONGS_DATA': 'artist/FETCH_SONGS_DATA'
      }),

      /**
       * Creates a new song assigned to the current artist
       */
      createSong() {
        this.isError = !(this.checkValidName() && this.checkSumAmount())
        if (!this.isError) {
          this.CREATE_SONG(this.$refs.name.value) // send as an argument the song name
            .then(() => {
              this.$refs.closeButton.click()
            })
            .catch((error) => {
              this.showError(error)
            })
        }
      },

      /**
       * Adds a new Royalty instance to the song's royalties list
       */
      addRoyalty() {
        this.isError = !(this.checkValidEmail() && this.checkValidPercentage() && this.checkEmailUnique())
        if (!this.isError) {
          this.royalties.push({email: this.$refs.paypal.value, percentage: this.$refs.percentage.value})
          this.clearRoyaltyInput()
        }
      },

      /**
       * Clears the royalty instance input to be able to introduce new royalties
       */
      clearRoyaltyInput() {
        this.$refs.paypal.value = ''
        this.$refs.percentage.value = ''
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

      /**
       * Checks if the user has entered a valid percentage. Shows an error otherwise.
       * Returns a boolean to define if the percentage is valid or not
       * @return bool
       */
      checkValidPercentage() {
        if (this.$refs.percentage.value > 0 && this.$refs.percentage.value <= 100) {
          return true
        }
        this.errorMessage = 'Please, introduce a valid amount (> 0 && <= 100).'
        return false
      },

      /**
       * Checks if the Royalty's instance email is unique. It is, to check if there is not any other
       * Royalty instance with the same email.
       * @return bool
       */
      checkEmailUnique() {
        if (this.royalties.some(((account, index, array) => account.email === this.$refs.paypal.value), this)) {
          this.errorMessage = 'This account has already a percentage assigned. Please, introduce another account.'
          return false
        }
        return true
      },

      /**
       * Removes a royalty instance from the list
       * @param index - Index of the royalty to remove
       */
      removeRoyalty(index) {
        this.royalties.splice(index, 1)
      },

      /**
       * Checks if the sum of all the royalties percentages is 100% or not.
       */
      checkPercentageSum(){
        const sum = this.royalties.reduce((acc, currentItem, currentIndex) => acc + currentItem.percentage, 0);
        if (sum === 100) {
          return true
        }
        this.errorMessage = 'The sum of royalties percentages is not 100.'
        return false
      },


      //TODO: EDIT FROM HEEERE

      /**
       * Checks if the user has entered a valid name. Shows an error otherwise.
       * Returns a boolean to define is the name is valid or not
       * @return bool
       */
      checkSumAmount() {
        const sum = this.royalties.reduce((acc, currentItem, currentIndex) => acc + currentItem.percentage, 0);
        if (sum === 100) {
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

  .table-header-borderless th {
    border: 0;
  }

</style>
