<template>
  <v-app>
    <v-main>
      <nuxt/>
      <Snackbar/>
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
