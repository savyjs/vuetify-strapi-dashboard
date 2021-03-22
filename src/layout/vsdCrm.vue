<template>
  <v-app dark>
    <v-app-bar dense clipped-right clipped-left dark color="#0f0c29" elevation="1" app>
      <v-app-bar-nav-icon v-if="!drawer" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="cursor: pointer" @click="$router.push('/crm')">
        <v-img :src="logo" contain max-width="120px"/>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <VsdCrmSupport/>
      <v-divider vertical/>
      <VsdNotifications/>
      <v-divider vertical/>
      <VsdCrmAccount/>
    </v-app-bar>
    <v-navigation-drawer
      color="#0f0c29"
      mini-variant-width="140px"
      mini-variant
      class="pa-0 drawer"
      v-model="drawer" clipped
      :temporary="isMobile" right app>
      <vsd-crm-side-boxes-active :items="items"/>
    </v-navigation-drawer>
    <v-main style="background-color: rgba(0,0,0,.04)">
      <v-container fluid>
        <nuxt/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

  const SYSTEM_LOGO = process.env.SYSTEM_LOGO;
  const CRM_LOGO = process.env.CRM_LOGO;
  const SHOW_USER = process.env.SHOW_USER;
  const SINGLE_TITLE = process.env.SINGLE_TITLE;
  const FOOTER_TITLE = process.env.FOOTER_TITLE;
  const ITEMS =  process.env.PANEL_DRAWER
  const DEFAULT_PHOTO =  process.env.DEFAULT_PHOTO

  export default {
    head() {
      return {
        titleTemplate: '%s - ' + process.env.TITLE,
      }
    },
    data() {
      return {
        tooltip: false,
        drawer: false,
        items: ITEMS,
        logo: CRM_LOGO,
        SYSTEM_LOGO,
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
        return _.get(this.$store.state, 'admin.profile', {})
      }
    },
    // middleware: 'auth',
    methods: {},
    mounted() {
      this.drawer = !this.isMobile;
    },
    // middleware: ['auth']
  }
</script>
