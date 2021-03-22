<template>
  <span class="text-center mx-2">
        <v-btn
          small
          text
          @click="menu=!menu"
        >
          <v-icon small color="white">fa-support</v-icon>
          <span class="mx-1">پشتیبانی</span>
          </v-btn>
  </span>
</template>
<script>
  export default {
    data() {
      return {
        menu: false,
        sms: "",
        count: 1,
      }
    },
  }
</script>
