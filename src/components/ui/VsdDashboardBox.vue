<template>
  <v-container>
    <v-row>
      <v-col
        :cols="cols"
        :sm="sm"
        :md="md"
        :lg="lg"
        :xl="xl"
        v-for="(item,j) in items"
        :key="j"
      >
        <v-card @click="doAction(item)" dark :color="item.color || colors[j%8] || 'success darken-2'">
          <div class="full text-center">
            <v-icon size="40" class="pt-5 pb-1" v-if="item.icon">{{item.icon}}</v-icon>
          </div>
          <v-card-text>
            <div class="full text-center">
              {{$t(item.title)}}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  const colors = [
    'purple',
    'warning',
    'teal',
    'error',
    'info',
    'success',
    'pink',
    'blue-grey lighten-1',
  ];
  export default {
    props: {
      items: Array,
      cols: {
        default: '12'
      },
      sm: {
        default: '6'
      },
      md: {
        default: '4'
      },
      lg: {
        default: '3'
      },
      xl: {
        default: '2'
      },
    },
    data() {
      return {
        colors,
        modal: false,
        main: {},
      }
    },
    methods: {
      doAction(item) {
        if (_.has(item, 'emit')) {
          this.$nuxt.$emit(item.emit, item);
        }
        if (_.has(item, 'to')) {
          this.$router.push(item.to)
        }
      }
    }
  }
</script>
