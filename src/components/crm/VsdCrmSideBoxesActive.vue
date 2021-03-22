<template>
  <v-item-group wrap row class="boxes pa-0">
    <v-item xs12 v-model="menu" class="pa-0" v-for="item in items" :key="item.title"
            v-slot:default="{toggle ,active}">
      <v-responsive @click="toggle"
                    class="text-center pa-0" style="margin-top: 1px" :aspect-ratio="16/9">
        <v-card
          :color="active ? 'light-blue accent-4' : 'transparent'"
          :to="item.link"
          :class="' d-flex row ma-0 box rounded ' + (active ? 'elevation--5 activeBox' :'elevation--1') "
          style="align-items: center;justify-content: center;justify-items: center;flex-wrap: wrap"
          width="100%"
          height="100%">
          <div>
            <v-scroll-x-transition>
              <v-icon v-show="active" class="caretBox">fa-caret-right</v-icon>
            </v-scroll-x-transition>
            <v-icon class="icon font-25">{{item.icon}}</v-icon>
            <p class="font-12">{{$t(item.title)}}</p>
          </div>
        </v-card>
      </v-responsive>
    </v-item>
  </v-item-group>
</template>
<i18n>
  {"en":{
  "logout" : "Logout"
  },
  "fa" : {
  "logout" : "خروج"
  }}
</i18n>
<script>
  export default {
    props: ['value', 'items'],
    data() {
      return {
        menu: null
      }
    },
    watch: {}
  }
</script>
<style>

  .box p {
    text-shadow: 0 0 0 rgba(255, 255, 255, .3);
  }

  .box .icon, .box p {
    color: rgba(255, 255, 255, .8);
  }

  .nuxt-link-exact-active {
    background: rgba(0, 0, 0, .7);
  }

  .caretBox {
    position: absolute !important;
    left: -1px !important;
    top: 35%;
    color: rgba(0, 0, 0, 0.3) !important;
  }

</style>
