<template>
  <span class="text-center mx-2">
        <v-btn
          text
          fab
          icon
          :to="`/admin/${envName}/settings`"
        >
          <v-icon color="white">settings</v-icon>
          </v-btn>
  </span>
</template>

<script>
  const envName = process.env.envName || 'system';
  export default {
    data() {
      return {
        menu: false,
        count: 1,
        envName,
      }
    },
  }
</script>
