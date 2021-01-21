<template>
  <div>
    <v-select :items="chooseListValues" filled dense :label="label" v-model="choose"/>
    <template v-if="choose=='gallery'">
      <strapi-media-video-list :label="label" :getId="true"
                               v-model="data"/>
    </template>

    <template v-if="choose=='upload'">
      <media-uploader type="video" :label="label" :getId="true" v-model="data"/>
    </template>

    <template v-else-if="choose=='url'">
      <v-text-field class="ltr" v-model="data"></v-text-field>
    </template>

    <template v-else-if="choose=='build'">
      <v-btn color="success" :loading="videoMergeLoading" class="ma-5"
             :disabled="!(_.get(this.bus, 'audio', null) && _.get(this.bus, 'cover', null))"
             @click="buildVideo">
        <v-icon>call_merge</v-icon>
        ساخت ویدئو
      </v-btn>
    </template>

    <br/>

  </div>
</template>
<script>
  import StrapiMediaPhotoList from "./StrapiMediaPhotoList";
  import StrapiMediaVideoList from "./StrapiMediaVideoList";
  import MediaUploader from "./mediaUploader";

  export default {
    components: {MediaUploader, StrapiMediaVideoList, StrapiMediaPhotoList},
    props: ['value', 'label', 'main', 'type', 'obj', 'id', 'url'],
    data() {
      return {
        // loader
        videoMergeLoading: false,

        data: {},
        choose: 'build',
        chooseListValues: [
          {text: 'ساخت ویدیو', value: 'build'},
          {text: 'انتخاب از گالری', value: 'gallery'},
          {text: 'دانلود از آدرس', value: 'url'},
          {text: 'آپلود', value: 'upload'},
        ],
      }
    },
    computed: {
      extUrl() {
        let url = _.get(this.data, 'url', null)
        if (url) return this.API_URL + url;
      },
      bus() {
        return this.main || {};
      }
    },
    watch: {
      value: {
        handler(val) {
          this.data = val
        }, deep: true
      },
      data: {
        handler(val) {
          return this.$emit('input', val);
        },
        deep: true
      }
    },
    methods: {
      buildVideo() {
        this.data = {};
        this.videoMergeLoading = true;
        let method = 'post'
        let url = '/podcasts/merge'
        let requestConfig = {
          data: {
            audioId: _.get(this.bus, 'audio', null),
            photoId: _.get(this.bus, 'cover', null),
            watermarkId: _.get(this.bus, 'watermark', null),
            position: _.get(this.bus, 'position.value', 'south'),
            afterId: _.get(this.bus, 'after', null),
            beforeId: _.get(this.bus, 'before', null),
          }
        }
        this.strapi.request(method, url, requestConfig).then(res => {
          // repsone format: file : {id , hash , url , name}
          // TODO: shoud fix API
          this.data = res;
        }).catch(err => {
          console.log({err})
          this.$swal({
            title: 'خطایی رخ داد!',
            text: err
          })
        }).finally(() => {
          this.videoMergeLoading = false;
        })
      },
    }
  }
</script>
