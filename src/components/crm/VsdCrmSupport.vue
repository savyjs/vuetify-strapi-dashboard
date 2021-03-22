<template>
  <span v-if="supportLink" class="text-center mx-2">
        <v-btn
          small
          text
          @click="supportLink"
        >
          <v-icon small color="white">fa-support</v-icon>
          <span class="mx-1">{{$t('support')}}</span>
          </v-btn>
  </span>
</template>
<i18n>
  {"en":{
  "support" : "Support"
  },
  "fa" : {
  "support" : "پشتیبانی"
  }}
</i18n>
<script>
  export default {
    data() {
      return {
        menu: false,
        sms: "",
        count: 1,
      }
    },
    computed: {
      supportLink() {
        return this.vsd.crm.support || false;
      }
    }
  }
</script>
