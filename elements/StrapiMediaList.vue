<template>
  <span>

    <template v-if="_.isArray(getTypes)">
      <v-select item-text="text" item-value="value" :items="getTypes" dense label="نوع پیوست را انتخاب کنید"
                v-model="choosedType"/>
    </template>
    <strapi-media-video-list v-if="getType=='video'" :label="label" :get-obj="getObj" :get-id="getId"
                             v-model="file"/>
    <strapi-media-audio-list v-else-if="getType=='audio'" :label="label" :get-obj="getObj" :get-id="getId"
                             v-model="file"/>
    <strapi-media-photo-list v-else-if="getType=='photo'" :label="label" :get-obj="getObj" :get-id="getId"
                             v-model="file"/>

    </span>
</template>
<script>

  import StrapiMediaVideoList from "./StrapiMediaVideoList";
  import StrapiMediaAudioList from "./StrapiMediaAudioList";
  import StrapiMediaPhotoList from "./StrapiMediaPhotoList";

  export default {
    components: {StrapiMediaPhotoList, StrapiMediaAudioList, StrapiMediaVideoList},
    props: ['value', 'type', 'label', 'getId', 'getObj', 'placeholder'],
    data() {
      return {
        loading: false,
        file: null,
        choosedType: null,
        defaultTypes: [
          {text: 'تصویر', value: 'photo'},
          {text: 'صوت', value: 'audio'},
          {text: 'ویدئو', value: 'video'},
          // {text: 'فایل', value: 'file'},
        ]
      }
    },
    computed: {
      getTypes() {
        if (!_.isArray(this.type)) return null;
        let types = _.pickBy(this.defaultTypes, (obj) => {
          let status = _.includes(this.type || [], obj.value)
          return status;
        });
        return _.valuesIn(types);
      },
      getType() {
        return (_.isString(this.type)) ? this.type : this.choosedType;
      }
    },
    mounted() {
      this.loadItems();
    },
    watch: {
      file(val) {
        this.$emit('input', val)
      },
      choosedType() {
        this.file = null;
        this.uploaded = null;
        this.url = null;
        this.lazy = null;
        this.xs = null;
        this.obj = null;
        this.id = null;
      }
    },
    methods: {
      loadItems() {
        if (this.value) {
          if (_.has(this.value, 'id')) {
            this.obj = this.value;
            this.url = _.get(this.value, 'url', null)
            this.id = _.get(this.value, 'id', null)
          }
        }
      }
    }
  }
</script>
