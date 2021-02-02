<template>
  <span>
    <v-container>
      <audio class="full" v-if="url" controls>
       <source :src="baseURL + url">
      </audio>
    </v-container>
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
                src="/imgs/audio.png"
                eager
                :color="active ? 'primary' : 'grey lighten-1'"
                class="ma-1"
                height="100"
                contain
                name="coverValue"
                max-width="200"
                @click="toggle"
        >
          <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
          >
             <p class="full text-center">{{_.get(item,'name','فایل صوتی')}}</p>
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
                return process.env.API_URL;
            }
        },
        mounted() {
            this.loadItems();
        },
        watch: {
            selected(val) {
                this.url = null;
                let item = this.items[val]
                let id = this.id = _.get(item, 'id', null)
                let url = _.get(item, 'url', null)
                setTimeout(() => {
                    this.url = _.get(item, 'url', null)
                })
                if (_.get(this, 'getId', false)) {
                    this.$emit('input', id)
                } else if (_.get(this, 'getObj', false)) {
                    this.$emit('input', item)
                } else {
                    this.$emit('input', this.baseURL + url)
                }
            }
        },
        methods: {
            loadItems() {
                this.loading = true;
                this.$strapi.getFiles().then(res => {
                    this.items = _.values(_.omitBy(res, obj => {
                        //console.log({obj},obj.mime)
                        return !_.startsWith(obj.mime, 'audio')
                    }));
                    //console.log({res})
                }).catch(err => {
                    console.log({err})
                }).finally(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
