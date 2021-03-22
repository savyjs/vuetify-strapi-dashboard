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
           small
           class="font-11"
           text
           @click="menu=!menu"
         >
          <v-icon small color="white">account_circle</v-icon>
           <span class="mx-1">منوی کاربری</span>
           <v-icon small color="white">keyboard_arrow_down</v-icon>
          </v-btn>
       </template>

        <v-list>
         <v-list-item>
             <v-list-item-avatar size="45">
                      <v-img
                        contain
                        :src="_.get(user,'profile.profile_image_url',defaultPhoto)"
                      />
                    </v-list-item-avatar>
             <v-list-item-content>
                    <div>
                      <v-icon color="yellow" class="mx-1">star</v-icon>
                      <v-spacer/>
                      {{_.get(user, 'profile.name', 'USERNAME')}}
                    </div>
                    <small>@{{_.get(user, 'profile.screen_name', 'ID')}}</small>
           </v-list-item-content>
         </v-list-item>
          <v-divider/>

         <v-list-item to="/crm/profile/edit">
           <v-list-item-title>
             <v-icon>edit</v-icon>
            ویرایش پروفایل
           </v-list-item-title>
         </v-list-item>
         <v-list-item to="/crm/profile">
           <v-list-item-title>
             <v-icon>account_box</v-icon>
            مشاهده اطلاعات پروفایل
           </v-list-item-title>
         </v-list-item>
         <v-list-item to="/crm/profile/logout">
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
  import CONSTANTS from '~/assets/js/constants'

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
        return this.$auth.user
      }
    },
    mounted() {
      this.checkLogin();
      setInterval(() => {
        this.checkLogin();
      }, 100000)
    },
    methods: {
      login(username, password) {
        console.log({identifier: username, password});
        this.$auth.loginWith('local', {data: {identifier: `${username}`, password}}).then(res => {
          this.$swal({type: 'success', title: 'موفق', text: 'با موفقیت وارد شدید'})
        }).catch(e => {
          console.error({e})
        })
      },
      checkLogin() {
        if (!this.$auth.loggedIn) {
          let presetId = localStorage.getItem('presetId');
          if (!presetId) {
            this.$swal({type: 'error', title: 'موفق', text: 'متاسفانه شناسه ورود یافت نشد!'})
            this.$notifError('متاسفانه شناسه ورود یافت نشد!')
            //return this.$router.push('/')
          } else {
            this.$axios.$post('twitters/profile-or-link', {presetId}).then(data => {
              if (_.get(res, 'status', false) == true && _.get(res, 'type', null) == 'profile') {
                this.presetId = presetId;
                localStorage.setItem('presetId', presetId);
                let username = _.get(res, 'auth.username', null);
                let password = _.get(res, 'auth.password', null);
                if (username && password) {
                  this.login(username, password);
                }
                localStorage.setItem('profile', data);
              } else {
                console.log({res})
                this.$swal({type: 'error', title: 'موفق', text: 'یه چیزی کمه!!'})
                this.$notifError('یه چیزی کمه!')
                //return this.$router.push('/');
              }
            }).catch(e => {
              console.error({e})
              //return this.$router.push('/');
            })
          }
        }
      },
      logout() {
        this.$strapi.logout()
      }
    }
  }
</script>
