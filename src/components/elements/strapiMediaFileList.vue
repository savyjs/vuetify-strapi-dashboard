<template>
  <span>
    <v-sheet
      class="mx-auto"
      elevation="8"
      max-width="800"
    >
      <v-progress-circular indeterminate class="ma-5" color="primary" v-if="loading"></v-progress-circular>
    <v-slide-group v-else
                   v-model="selected"
                   class="pa-4"
                   center-active
                   show-arrows
    >
      <v-slide-item
        v-for="item in items"
        :key="item.id"
        v-slot:default="{ active, toggle }"
      >
        <v-img
          lazy-src="/imgs/image.jpg"
          eager
          :src="baseURL + item.url"
          :color="active ? 'primary' : 'grey lighten-1'"
          class="ma-1"
          height="100"
          contain
          max-width="100"
          @click="toggle"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <v-scale-transition>
              <v-icon
                v-if="active"
                color="success"
                size="50"
                v-text="'mdi-check'"
              ></v-icon>
            </v-scale-transition>
          </v-row>
        </v-img>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
    </span>
</template>
<script>

  import _ from 'lodash'

  export default {
    props: ['value', 'label', 'getId', 'getObj', 'placeholder'],
    data() {
      return {
        loading: false,
        selected: null,
        items: [],
        image: null,
        uploaded: null,
        url: null,
        lazy: null,
        xs: null,
        id: null,
        loader: false
      }
    },
    computed: {
      baseURL() {
        return this.vsd.API_URL;
      }
    },
    mounted() {
      this.loadItems();
    },
    watch: {
      selected(val) {
        let item = this.items[val]
        let id = this.id = _.get(item, 'id', null)
        let url = this.url = _.get(item, 'url', null)
        if (_.get(this, 'getId', undefined) !== undefined) {
          this.$emit('input', id)
        } else if (_.get(this, 'getObj', undefined) !== undefined) {
          this.$emit('input', item)
        } else {
          this.$emit('input', this.baseURL + url)
        }
      }
    },
    methods: {
      loadItems() {
        this.loading = true;
        alert('file');
        this.$axios.$get('upload/files?_sort=id:DESC').then(res => {
          this.items = _.values(_.omitBy(res, obj => {
            return (_.startsWith(obj.mime, 'video') || _.startsWith(obj.mime, 'audio') || _.startsWith(obj.mime, 'image'))
          }));
        }).catch(err => {
          console.log({err})
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
