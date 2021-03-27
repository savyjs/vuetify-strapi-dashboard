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
        <v-card @click="doAction(item)" dark :color="item.color || 'success darken-2'">
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
  export default {
    props: {
      items: Array,
      cols: {
        type: Number,
        default: '12'
      },
      sm: {
        type: Number,
        default: '6'
      },
      md: {
        type: Number,
        default: '4'
      },
      lg: {
        type: Number,
        default: '3'
      },
      xl: {
        type: Number,
        default: '2'
      },
    },
    data() {
      return {
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
