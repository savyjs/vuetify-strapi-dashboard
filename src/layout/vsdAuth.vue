<template>
  <v-app>
    <v-main>
      <nuxt/>
      <VsdSnackbar/>
      <VsdSnackbar />
    </v-main>
  </v-app>
</template>
<script>

  export default {
    created() {
      // this.$store.commit('admin/updateToken', null);
    },
    components: {}
  }
</script>
