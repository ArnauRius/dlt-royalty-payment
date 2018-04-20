<template>
    <div class="modal fade"
         tabindex="-1"
         role="dialog"
         aria-labelledby="Become Artist"
         aria-hidden="true"
         @keyup.enter="convertToArtist">

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

            <form class="modal-form key-input-form clearfix">

              <!-- Prv Key file input -->
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                      <span class="fa fa-key"></span>
                  </span>
                </div>
                <div class="custom-file">
                  <input type="file"
                         class="custom-file-input"
                         id="prvKeyInput"
                         ref="fileChooser"
                         accept=".key"
                         @change="onFileSelected">
                  <label class="custom-file-label"
                         for="prvKeyInput">
                    {{keyFilename}}
                  </label>
                </div>
              </div>

              <!--Become an artist button -->
              <button @click="convertToArtist"
                      type="button"
                      class="btn btn-primary pull-right">
                Become an artist
              </button>
            </form>

            <!-- Download Key Generator row -->
            <div class="pull-right"
                 style="text-align: left">
              Do not have a key file?

              <a href="generator.dmg" target="_blank">
                <button type="submit"
                        class="btn btn-outline-primary"
                        style="margin-left: 16px">
                  Download the Key Generator
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  // Utils import
  import utils from '../../utils'

  export default {

    data() {
      return {
        isError: false,
        errorMessage: 'Some error occurred. Please, try again later.',
        keyFilename: 'Choose a Private Key file',
        keyFile: undefined
      }
    },

    computed: {

      // Vuex getters
      ...mapGetters({
        'user': 'user/user',
      })

    },

    methods: {

      // Vuex actions
      ...mapActions({
        'CONVERT_TO_ARTIST': 'user/CONVERT_TO_ARTIST',
        'SIGN_IN_ARTIST': 'artist/SIGN_IN_ARTIST'
      }),

      /**
       * Shows an error in a red alert
       * @param error
       */
      showError: function (error) {
        this.errorMessage = error
        this.isError = true
      },

      /**
       * Creates a new artist instance assigned to the current user
       */
      convertToArtist: function (){
        utils.readFile(this.keyFile)
          .then((keyFileContent) => {
            utils.decryptKey(keyFileContent, this.user.email)
              .then((privKey) => {
                this.CONVERT_TO_ARTIST(privKey)
                  .then(() => {
                    this.SIGN_IN_ARTIST(privKey)
                      .then(() => {
                        this.$refs.closeButton.click()
                        this.$router.push({name:'dashboard'})
                      })
                      .catch((error) => {
                        this.showError(error+" (While singing in)")
                      })
                  })
                  .catch((error) => {
                    this.showError(error)
                  })
              })
              .catch((error) => {
                this.showError(error)
              })
          })
          .catch((error) => {
            this.showError(error)
          })
      },

      /**
       * When the user selects a file, shows its name to the file label
       */
      onFileSelected: function(){
        this.isError = false
        this.keyFile = this.$refs.fileChooser.files[0]
        if(this.keyFile){
          this.keyFilename = this.keyFile.name
        }
      }

    }
  }
</script>

<style scoped>

  .key-input-form{
    margin-bottom: 32px;
  }

</style>
