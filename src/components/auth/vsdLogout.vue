<template>
  <v-container>
    <v-card elevation="5" :loading="loading">
      <v-card-header margin-right="1%" width="98%" margin-left="1%" classes="pr-2">
        <h3 class="text-center full">
          <v-icon>lock</v-icon>
          خروج از پروفایل
        </h3>
      </v-card-header>
      <v-card-actions>
        <v-avatar></v-avatar>
      </v-card-actions>
      <v-card-text style="height: 250px;display: flex;align-items: start;">
        <div class="text-center full">
          <v-alert type="warning" dense class="my-5">
            {{$t("quit_alert")}}
          </v-alert>
          <v-btn @click="logout" color="success" class="my-5">
            {{$t("sure")}}
            <v-icon class="mx-2">security</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<i18n>
  {"en":{
  "sure" : "yes, I am",
  "quit_alert" : "do you want to exit?"
  },
  "fa" : {
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
