<template>
  <v-container grid-list-xs>
    <v-subheader>
      {{label}}
      <v-icon class="px-1">collections</v-icon>
    </v-subheader>
    <v-layout row wrap>
      <v-flex>
        <v-file-input
          placeholder="فایل را انتخاب کنید"
          filled
          dense
          clearable
          id="file"
          ref="file"
          type="file"
          @change="handleFileUpload()"/>
      </v-flex>
      <v-flex>
        <v-btn :loading="fileLoading" color="success" :disabled="!hasFile"
               @click="submitFile()">
          <span>
           <v-icon class="px-1">cloud_upload</v-icon>
          آپلود
          </span>
        </v-btn>
      </v-flex>
      <v-flex xs12 v-if="url">
        <v-text-field filled dense v-model="url" readonly/>
        <v-btn
          v-clipboard:copy="url" v-clipboard:success="handleCopyStatus(true)"
          v-clipboard:error="handleCopyStatus(false)" :loading="loading" ripple
          class="elevation-2"
          color="success"
          @click="copy"
          round
        >
          <v-icon>file_copy</v-icon>
          <span class="px-1">کپی کردن آدرس</span>
        </v-btn>
      </v-flex>
      <v-flex v-if="uploadPercentage < 100 && uploadPercentage > 0 " xs12>
        <v-progress-linear v-model="uploadPercentage" color="success"/>
      </v-flex>
      <v-divider color="black"/>
    </v-layout>
    <br/>
  </v-container>
</template>
<script>

  const root = process.env.API_URL
  export default {
    props: ["value", 'label', 'type'],
    /*
           Defines the data used by the component
           */
    data() {
      return {
        loading: false,
        showUploader: true,
        root,
        file: "",
        url: null,
        id: null,
        copySucceeded: false,
        hasFile: false,
        fileLoading: false,
        uploadPercentage: 0
      }
    },
    computed: {
      getType() {
        return 'admin'
      },
      getMethod() {
        return "/videos";
      },
      getAuthorization() {
        return true;
      },
    },
    watch: {
      url(val) {
        this.$emit("input", val)
      }
    },
    methods: {
      copy() {
        this.loading = true
        // send to API
        setTimeout(() => {
          this.loading = false
        }, 1000)
      },
      handleCopyStatus(status) {
        this.copySucceeded = status
      },
      remove() {
        this.file = null
        this.url = null
      },
      handleFileUpload() {
        this.hasFile = true
        this.file = this.$refs.file.files[0]
      },
      /*
               Submits the file to the server
               */
      submitFile: function () {
        this.fileLoading = true
        /*
                   Initialize the form data
                   */
        let formData = new FormData()
        let data = {title: null};
        /*  Add the form data we need to submit‌ */

        formData.append("files[0]", this.file)
        formData.append("data", JSON.stringify(data))

        /*
                   Make the request to the POST /single-file URL
                   */

        let method = this.getMethod;

        this.$axios
          .$post(method, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            }.bind(this)
          })
          .then((res) => {
            console.log(res, res.data)
            this.url = _.get(res, 'data.url', '-')
            this.id = _.get(res, 'data.id', '-')
            this.hasFile = false
            this.file = null
            this.fileLoading = false
          })
          .catch(() => {
            this.hasFile = false
            this.file = null
            this.fileLoading = false
          })
      }
    }
  }
</script>
