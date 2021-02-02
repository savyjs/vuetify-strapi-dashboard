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
          <v-icon color="white">account_circle</v-icon>
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
                    <p class="font-12 pt-1">{{_.get(user, 'name', '')}} {{_.get(user, 'lastname', '')}} ({{_.get(user, 'username', 'نام کاربر')}})</p>
                    <p class="font-12 pt-1">{{_.get(user, 'email', '')}}</p>
                                   <small class="font-11 py-1">{{_.get(user, 'role.name', 'مدیر سیستم')}}</small>
           </v-list-item-content>
         </v-list-item>
          <v-divider/>
         <v-list-item to="/admin/system/profile/">
           <v-list-item-title>
             <v-icon>account_box</v-icon>
             پروفایل من
           </v-list-item-title>
         </v-list-item>
         <v-list-item to="/admin/system/profile/logout">
           <v-list-item-title>
             <v-icon>lock</v-icon>
             خروج
           </v-list-item-title>
         </v-list-item>
        </v-list>
    </v-menu>
  </span>
</template>
<script>
  let CONSTANTS;
  try {
    CONSTANTS = require('~/assets/js/constants').default;
  } catch (e) {
    console.warn('add constant file in module settings');
  }
  const DEFAULT_PHOTO = CONSTANTS.DEFAULT_PHOTO

  export default {
    components: {},
    data() {
      return {
        menu: false,
        sms: "",
        count: 1,
        defaultPhoto: DEFAULT_PHOTO
      }
    },
    computed: {
      user() {
        return this.$auth.user;
      }
    },
    methods: {
      logout() {
        this.$strapi.logout()
      }
    }
  }
</script>
