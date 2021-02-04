<template>
  <v-app dark>
    <v-app-bar dark color="blue darken-3" elevation="1" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="cursor: pointer" @click="$router.push('/admin')">داشبورد مدیریت</v-toolbar-title>
      <v-spacer></v-spacer>
      <Notifications/>
      <Settings/>
      <Account/>
    </v-app-bar>

    <v-navigation-drawer class="drawer" color="white" v-model="drawer" fixed :temporary="isMobile" right app>
      <v-list style="display: flex;flex-wrap: wrap;" dense>
        <v-list-item>
          <v-row>
            <template>
              <v-col cols="5" class="pt-0 mt-0">
                <v-avatar size="80">
                  <v-img
                    max-width="100%"
                    contain
                    :src="`${SYSTEM_LOGO}`"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="7" class="pt-0 mt-0">
                <v-list-item-content>
                  <v-list-item-title class="pt-5">
                    <small> سیستم مدیریت </small>
                    <p><b>{{SINGLE_TITLE}}</b></p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-col>
            </template>
            <template v-if="SHOW_USER == 'true'">
              <v-col cols="3" class="pt-0 mt-0">
                <v-hover>
                  <nuxt-link to="/admin/system/profile/edit">
                    <v-list-item-avatar size="45">
                      <v-img
                        contain
                        :src="defaultPhoto"
                      />
                    </v-list-item-avatar>
                  </nuxt-link>
                </v-hover>
              </v-col>
              <v-col cols="9" class="pt-0 mt-0">
                <v-list-item-content>
                  <v-list-item-title>
                    <p>{{_.get(user, 'role.name', 'مدیر سیستم')}}</p>
                    <small>{{_.get(user, 'username', 'نام کاربر')}} ، خوش آمدید</small>
                  </v-list-item-title>
                </v-list-item-content>
              </v-col>
            </template>
          </v-row>
        </v-list-item>
      </v-list>
      <side-menu :items="items"/>

    </v-navigation-drawer>
    <v-main style="background-color: rgba(0,0,0,.04)">
      <v-container>
        <breadcrumb/>
        <Alert/>
        <AccessAlert v-model="items"/>
        <nuxt/>
      </v-container>
    </v-main>
    <v-footer app dense color="blue darken-4" dark class="py-0" inset>
      <v-row class="py-0">
        <v-col cols="12" class="py-0 text-right px-1 pt-1">
          <small class="font-10 pull-right pt-2 ">سامانه ی یکپارچه ی مدیریت {{FOOTER_TITLE}}</small>
          <v-btn x-small outlined class="pull-left mb-1 mx-1 pa-1 mt-1 white--text font-10">ورژن ۰.۵</v-btn>
        </v-col>
      </v-row>
      <loader/>
      <snackbar/>
    </v-footer>
  </v-app>
</template>

<script>
  import CONSTANTS from '~/assets/js/constants'

  const SYSTEM_LOGO = process.env.SYSTEM_LOGO;
  const SHOW_USER = process.env.SHOW_USER;
  const SINGLE_TITLE = process.env.SINGLE_TITLE;
  const FOOTER_TITLE = process.env.FOOTER_TITLE;
  const envName = process.env.envName;

  const ITEMS = CONSTANTS.ADMIN_DRAWER
  const DEFAULT_PHOTO = CONSTANTS.DEFAULT_PHOTO

  export default {
    head() {
      return {
        titleTemplate: '%s - ' + process.env.title,
        title: 'داشبورد',
      }
    },
    data() {
      return {
        envName,
        tooltip: false,
        drawer: false,
        SYSTEM_LOGO,
        items: ITEMS,
        SHOW_USER,
        SINGLE_TITLE,
        FOOTER_TITLE,
        defaultPhoto: DEFAULT_PHOTO
      }
    },
    computed: {

      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      today() {
        return _.get(this.$store.state, 'date.today', '8 آبان 98');
      },
      user() {
        return this.$auth.user
      }
    },
    methods: {},
    mounted() {
      this.drawer = !this.isMobile;
    },
    components: {},
    middleware: ['auth']
  }
</script>
