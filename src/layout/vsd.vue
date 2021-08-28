<template>
  <v-app>
    <v-app-bar dark color="appbar" elevation="1" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="cursor: pointer" @click="$router.push('/admin')">{{ $t("dashboard") }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="text-center mx-2">
        <template v-for="item in navbarMenu">
        <v-menu
          v-if="_.isArray(_.get(item,'items',null))"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on }">
          <v-btn
            fab
            icon
            :to="item.link"
            :target="_.get(item,'target',undefined)"
          >
          <v-icon>{{ _.get(item, 'icon', '') }}</v-icon>
          </v-btn>
          </template>
        <v-list>
         <v-list-item v-for="(subItem,i) in _.get(item,'items',null)" :to="_.get(subItem,'link',undefined)" :key="i">
           <v-list-item-title>{{ _.get(subItem, 'title', '') }}</v-list-item-title>
         </v-list-item>
        </v-list>
    </v-menu>
          <v-btn
            v-else
            fab
            icon
            :to="item.link"
            :target="_.get(item,'target',undefined)"
          >
          <v-icon>{{ _.get(item, 'icon', '') }}</v-icon>
          </v-btn>
          </template>
  </span>
      <VsdNotifications v-if="showNotifications"/>
      <VsdSettings v-if="showSettings"/>
      <VsdAccount/>
    </v-app-bar>
    <v-navigation-drawer
      color="drawer"
      class="drawer"
      v-model="drawer" fixed :right="isRTL" :temporary="isMobile" app>
      <v-list style="display: flex;flex-wrap: wrap;" dense>
        <v-list-item>
          <v-row>
            <template>
              <v-col cols="3" class="pt-1 mt-2">
                <v-avatar>
                  <v-img
                    max-width="100%"
                    contain
                    :src="SYSTEM_LOGO"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="6" class="pt-0 mt-0">
                <v-list-item-content>
                  <v-list-item-title class="pt-5">
                    <small> {{ $t("control_panel") }} </small>
                    <p><b>{{ SINGLE_TITLE }}</b></p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-col>
              <v-col cols="1" v-if="nightModeToggle">
                <v-btn v-if="!nightMode" fab icon class="mt-1" small @click="nightMode=true">
                  <v-icon>brightness_4</v-icon>
                </v-btn>
                <v-btn v-if="nightMode" icon fab class="mt-1" small @click="nightMode=false">
                  <v-icon>brightness_high</v-icon>
                </v-btn>
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
                    <p>{{ _.get(user, 'role.name', 'user') }}</p>
                    <small>{{ _.get(user, 'username', 'name') }} ، welcome</small>
                  </v-list-item-title>
                </v-list-item-content>
              </v-col>
            </template>
          </v-row>
        </v-list-item>
      </v-list>
      <vsd-side-menu :items="items"/>
    </v-navigation-drawer>
    <v-main style="background-color: rgba(0,0,0,.04)">
      <v-container>
        <VsdBreadcrumb/>
        <VsdAlert/>
        <VsdAccessAlert @setAccess="setAccess"/>
        <nuxt v-if="hasAccess"/>
        <Vsdloader/>
        <VsdSnackbar/>
      </v-container>
    </v-main>
    <v-footer color="appbar" dark app class="py-0" inset>
      <v-btn x-small outlined class="mb-1 mx-1 pa-1 mt-1 white--text font-10">{{ FOOTER_TITLE || 'VSD' }} {{ VERSION }}
      </v-btn>
    </v-footer>
  </v-app>
</template>

<i18n>
{
  "en": {
    "dashboard": "Dashboard",
    "welcome": "welcome",
    "control_panel": "Control Panel"
  },
  "fa": {
    "dashboard": "داشبورد",
    "welcome": "خوش آمدید",
    "control_panel": "کنترل پنل"
  }
}
</i18n>
<script>
import _ from 'lodash'

const SYSTEM_LOGO = _.get(process.env, 'LOGO', require('vuetify-strapi-dashboard/src/assets/vsd.png')); // process.env.SYSTEM_LOGO;
const TITLE = _.get(process.env, 'TITLE', undefined); // process.env.SYSTEM_LOGO;
const SHOW_USER = process.env.SHOW_USER;
const SINGLE_TITLE = process.env.SINGLE_TITLE;
const FOOTER_TITLE = process.env.FOOTER_TITLE;
const envName = process.env.envName;
const VERSION = _.get(process.env, 'version', "0.66");

export default {
  head() {
    return TITLE ? {
      titleTemplate: '%s - ' + TITLE,
    } : {}
  },
  created() {
    this._ = _;
    this.nightMode = !!this.$auth.$storage.getUniversal('nightMode');
  },
  data() {
    return {
      hasAccess: true,
      envName,
      tooltip: false,
      drawer: false,
      SYSTEM_LOGO,
      SHOW_USER,
      VERSION,
      SINGLE_TITLE,
      FOOTER_TITLE,
      items: {}
    }
  },
  computed: {
    nightMode: {
      get() {
        return _.get(this.$store.state, 'vsd.nightMode', true)
      },
      set(val) {
        this.$store.commit('vsd/setNightMode', {status: val, $vuetify: this.$vuetify, $auth: this.$auth});
      }
    },
    showNotifications() {
      return !!_.get(this.vsd, 'notifications.show', false)
    },
    nightModeToggle() {
      return !!_.get(this.vsd, 'nightModeToggle', true)
    },
    showSettings() {
      return !!_.get(this.vsd, 'settings.show', false)
    },
    defaultPhoto() {
      return _.get(this, 'vsd.config.DEFAULT_PHOTO', [])
    },
    isRTL() {
      let isRTL = _.get(this, 'vsd.rtl', undefined);
      let dir = _.get(this, '$i18n.localeProperties.dir', 'ltr');
      return isRTL === undefined ? dir === 'rtl' : !!isRTL;
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    today() {
      return _.get(this.$store.state, 'date.today', new Date().toUTCString());
    },
    user() {
      return this.$auth.user
    },
    navbarMenu() {
      return _.get(this, 'vsd.menu.NAVBAR', {})
    }
  },
  methods: {
    setAccess(val) {
      this.hasAccess = val;
    },
    isAllowedMenu(item) {
      if (_.has(item, 'permission')) {
        let permission = item.permission;
        return this.$can(permission);
      } else {
        return true;
      }
    },
  },
  mounted() {
    this.items = _.get(this, 'vsd.menu.ADMIN_DRAWER', [])
    this.drawer = !this.isMobile;
  },
  middleware: ['auth']
}
</script>
