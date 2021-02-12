<template>
  <v-container>
    <v-card elevation="5" :loading="loading">
      <v-card-header align="center" justify="center" margin-right="1%" width="98%" margin-left="1%" classes="pr-2">
        <h3 class="text-center">
          <v-icon>lock</v-icon>
          {{$t("logout")}}
        </h3>
      </v-card-header>
      <v-card-text style="height: 250px;align-items:center;text-align: center">
        <v-row class="text-center full" style="justify-content: center;text-align: center; align-content: center;">
          <v-col sm="8" xs="12" md="5">
            <v-alert type="warning" dense class="my-5">
              {{$t("quit_alert")}}
            </v-alert>
            <v-btn @click="logout" color="success" class="my-5">
              <v-icon small class="mr-1">security</v-icon>
              {{$t("sure")}}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<i18n>
  {"en":{
  "logout" : "Logout",
  "sure" : "Yes, I'm Sure",
  "quit_alert" : "Are you sure you want to logout?"
  },
  "fa" : {
  "logout" : "خروج از پروفایل",
  "sure" : "بله می خواهم خارج شوم",
  "quit_alert" : "آیا مطمئنید که می خواهید از سایت خارج شوید؟"
  }}
</i18n>
<script>
  // import VCardHeader from "~/components/admin/ui/VCardHeader";

  export default {
    name: 'VsdLogout',
    data() {
      return {
        loading: false
      }
    },
    methods: {
      logout() {
        this.loading = true;
        this.$strapi.clearToken();
        this.$auth.logout();
      }
    },
    computed: {
      user() {
        return _.get(this.$store.state, 'admin.profile', {})
      }
    },
  }
</script>
