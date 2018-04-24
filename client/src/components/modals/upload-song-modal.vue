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
          <h3 v-if="this.isEdit">Edit Song</h3>
          <h3 v-else>Upload Song</h3>
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
                    <td>{{ royalty.account }}</td>
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
          <button @click="saveSong()"
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

  import {Royalty} from "../../../../rp-txn-family/models"

  // Vuex imports
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  // Utils Import
  import utils from '../../utils'

  export default {

    data() {
      return {
        isEdit: false,
        isError: false,
        errorMessage: 'Some error occurred. Please, try again later.',
        royalties: [],

      }
    },

    props: ["currentSong"],

    computed: {

      // Vuex getters
      ...mapGetters({
        'user': 'user/user',
      }),
    },

    methods: {

      // Vuex actions
      ...mapActions({
        'CREATE_SONG': 'artist/CREATE_SONG',
      }),

      /**
       * Saves the song data by creating a new one or updating an existing one
       */
      saveSong() {
        this.isError = !(this.checkValidName() && this.checkPercentageSum())
        if (!this.isError) {
          if(this.isEdit){
            this.updateSong()
          }else{
            this.createSong()
          }
        }
      },

      /**
       * Creates a new song
       */
      createSong(){
        this.CREATE_SONG({name: this.$refs.name.value, royalties: this.royalties}) // send as an argument the song name
          .then(() => {
            this.$refs.closeButton.click()
          })
          .catch((error) => {
            this.showError(error)
          })
      },

      /**
       * Updates the song with the new data
       */
      updateSong(){
        console.log("SAVING EDITED SONG")
      },

      /**
       * Adds a new Royalty instance to the song's royalties list
       */
      addRoyalty() {
        this.isError = !(this.checkValidEmail() && this.checkValidPercentage() && this.checkEmailUnique())
        if (!this.isError) {
          this.royalties.push(new Royalty(this.$refs.paypal.value, parseInt(this.$refs.percentage.value)))
          this.clearRoyaltyInput()
        }
      },

      /**
       *  Clears the inpot for the song name
       */
      clearNameInput() {
        this.$refs.name.value = ''
      },

      /**
       * Clears the royalty instance input to be able to introduce new royalties
       */
      clearRoyaltyInput() {
        this.$refs.paypal.value = ''
        this.$refs.percentage.value = ''
      },

      /**
       * Clears the whole royalties list
       */
      clearRoyaltyList(){
        this.royalties = []
      },

      /**
       * Clears all the modal's data to return it to its default state
       */
      clearModal(){
        this.clearNameInput()
        this.clearRoyaltyInput()
        this.clearRoyaltyList()
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
        if (this.royalties.some(((royalty, index, array) => royalty.account === this.$refs.paypal.value), this)) {
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
      checkPercentageSum() {
        const sum = this.royalties.reduce((acc, currentItem, currentIndex) => acc + currentItem.percentage, 0);
        if (sum === 100) {
          return true
        }
        this.errorMessage = 'The sum of royalties percentages is not 100.'
        return false
      },

      /**
       * Checks if the user has entered a valid song name. Shows an error otherwise.
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
    },

    mounted() {

      let vueInstance = this

      /**
       * Handles when modal appears
       */
      $(window).on('shown.bs.modal', function (e) {
        if (vueInstance.currentSong) {
          vueInstance.isEdit = true
          vueInstance.$refs.name.value = vueInstance.currentSong.data.name
          console.log(vueInstance.currentSong.data.royalties)
          console.log(vueInstance.royalties)
          vueInstance.royalties = vueInstance.currentSong.data.royalties.slice()
        } else {
          vueInstance.isEdit = false
          vueInstance.royalties.push(new Royalty(vueInstance.user.email, 100))
        }
      })

      /**
       * Handles when modal disappears
       */
      $(window).on('hidden.bs.modal', function (e) {
        vueInstance.clearModal()
      })
    }
  }

</script>

<style scoped>

  .table-header-borderless th {
    border: 0;
  }

</style>
