<template>
  <v-container grid-list-lg>
    <v-layout row wrap d-flex align-center justify-center>
      <v-flex v-for="(item,i) in items" :key="i">
        <v-card :color="item.color || 'primary'" dark class="text-center" height="100%" :to="item.link">
          <v-responsive>
            <v-card-title>
              <v-icon>{{item.icon}}</v-icon>
            </v-card-title>
            <v-card-text>{{item.title}}</v-card-text>
          </v-responsive>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>

  export default {
    data() {
      return {}
    },
    computed:{
      items(){
        return _.get(this.$vsd, 'constants.ADMIN_DASHBOARD', '');
      }
    }
  }
</script>
