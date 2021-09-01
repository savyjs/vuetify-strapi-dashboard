<template>
  <v-container>
    <v-alert v-show="$nuxt.isOffline" dense type="warning" dismissible>
      <div class="full text-center">{{ $t("offline") }} <span class="mx-1">{{ loadingDots }}</span></div>
    </v-alert>
  </v-container>
</template>

<i18n>
{
  "en": {
    "offline": "can not connect to server"
  },
  "fa": {
    "offline": "دسترسی به سرور قطع شده است"
  }
}
</i18n>
<script>

export default {
  data() {
    return {
      loadingDots: ''
    }
  },
  async mounted() {
    window.setInterval(() => {
      if (this.loadingDots.length > 3)
        this.loadingDots = ".";
      else
        this.loadingDots += ".";
    }, 1000);

  },
}
</script>
