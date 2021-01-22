<template>
  <div v-if="isEnabled" class="text-center">
    <v-dialog
      :value="dialog || showLoading"
      hide-overlay
      persistent
      eager
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text class="text-center">
          در حال بارگذاری
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        dialog: false,
      }
    },
    computed: {
      showLoading() {
        return this.$store.state.navigation.loading;
      },
      isEnabled() {
        return this.C.LOADER
      },
      page() {
        return this.$route.path;
      }
    },
    mounted() {
      this.dialog = true;
    },
    watch: {
      page() {
        this.dialog = true;
      },
      dialog(val) {
        if (!val) return
        setTimeout(() => (this.dialog = false), 1000)
      },
    },
  }
</script>
