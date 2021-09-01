<template>
  <span class="text-center mx-2">
        <v-btn
          :color="color"
          text
          fab
          icon
          :to="`/admin/${envName}/settings`"
        >
          <v-icon>settings</v-icon>
          </v-btn>
  </span>
</template>

<script>
const envName = process.env.envName || 'system';
export default {
  props: ['color'],
  data() {
    return {
      menu: false,
      count: 1,
      envName,
    }
  },
}
</script>
