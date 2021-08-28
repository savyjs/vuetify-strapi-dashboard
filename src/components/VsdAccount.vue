<template>
  <span class="text-center mx-2">
     <v-menu
       v-model="menu"
       :close-on-content-click="false"
       :nudge-width="200"
       offset-y
     >
       <template v-slot:activator="{ on }">
         <v-btn
           text
           fab
           icon
           @click="menu=!menu"
         >
          <v-icon>account_circle</v-icon>
          </v-btn>
       </template>
        <v-list>
         <v-list-item>
             <v-list-item-avatar size="45">
                      <v-img
                        contain
                        :src="defaultPhoto"
                      />
                    </v-list-item-avatar>
             <v-list-item-content>
                    <p
                      class="font-12 pt-1">{{ _.get(user, 'name', '') }} {{
                        _.get(user, 'lastname', '')
                      }} ({{ _.get(user, 'username', $t('username')) }})</p>
                    <p class="font-12 pt-1">{{ _.get(user, 'email', '') }}</p>
                                   <small class="font-11 py-1">{{ _.get(user, 'role.name', $t('user')) }}</small>
           </v-list-item-content>
         </v-list-item>
          <v-divider/>
         <v-list-item to="/admin/system/profile/">
           <v-list-item-title>
             <v-icon>account_box</v-icon>
            {{ $t('my_profile') }}
           </v-list-item-title>
         </v-list-item>
          <v-list-item @click="menu=false">
            <v-dialog
              v-model="dialog"
              max-width="290"
            >
            <template v-slot:activator="{ on, attrs }">
             <v-list-item-title
               v-bind="attrs"
               v-on="on">
               <v-icon>lock</v-icon>
               {{ $t('logout') }}
             </v-list-item-title>
              </template>
            <v-card>
              <v-card-text class="pt-5">
                {{ $t('quit_alert') }}
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialog = false"
                >
                  {{ $t('close') }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="warning darken-1"
                  outlined
                  @click="logout"
                >
                  {{ $t('logout') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
         </v-list-item>
        </v-list>
    </v-menu>
  </span>
</template>

<i18n>
{
  "en": {
    "my_profile": "profile",
    "permission_denied": "permission denied",
    "error": "error",
    "logout": "Logout",
    "sure": "Yes, I'm Sure",
    "quit_alert": "Are you sure you want to logout?"
  },
  "fa": {
    "my_profile": "پروفایل کاربری",
    "permission_denied": "شما دسترسی لازم را ندارید!",
    "error": "خطا",
    "logout": "خروج",
    "sure": "بله می خواهم خارج شوم",
    "quit_alert": "آیا مطمئنید که می خواهید از سایت خارج شوید؟"
  }
}
</i18n>
<script>
import _ from 'lodash'


export default {
  components: {},
  data() {
    return {
      dialog: false,
      menu: false,
      sms: "",
      count: 1
    }
  },
  created() {
    this._ = _;
  },
  computed: {
    defaultPhoto() {
      return _.get(this, 'vsd.config.DEFAULT_PHOTO', require('vuetify-strapi-dashboard/src/assets/avatar.png'))
    },
    user() {
      return this.$auth.user;
    }
  },
  methods: {
    logout() {
      this.menu = false;
      this.dialog = false;
      this.loading = true;
      this.$strapi.logout();
      this.$auth.reset();
      this.$router.push('/')
    }
  }
}
</script>
