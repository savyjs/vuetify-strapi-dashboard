<template>
  <v-layout wrap row class="boxes pa-0">
    <v-flex xs12 class="pa-0" v-for="item in items" :key="item.title">
      <v-responsive class="text-center" style="margin-top: 1px" :aspect-ratio="16/9">
        <v-card color="transparent" :to="item.link" class="d-flex row box pr-5"
                style="align-items: center;justify-content: center;justify-items: center;flex-wrap: wrap"
                width="100%" height="100%">
          <div>
            <v-icon class="icon font-25">{{item.icon}}</v-icon>
            <p class="font-12">{{item.title}}</p>
          </div>
        </v-card>
      </v-responsive>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    props: ['value', 'items'],
  }
</script>
<style>

  .box p {
    text-shadow: 0 0 0 rgba(255,255,255,.3) ;
  }
  .box .icon, .box p {
    color: rgba(255, 255, 255, .8);
  }
  .nuxt-link-exact-active {
    background: rgba(0,0,0,.7);
  }
</style>
