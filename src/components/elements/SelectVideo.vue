<template>
  <div>
    <v-select :items="chooseListValues" filled dense :label="label" v-model="choose"/>
    <template v-if="choose=='gallery'">
      <strapi-media-video-list type="video" :label="label" :getId="true"
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
<i18n>
  {
  "en":{
  "build":"build video",
  "from_url":"download from URL",
  "select_from_gallery":"select from gallery",
  "upload":"upload",
  "error":"Error",
  "select_type":"select file type",
  "select_file":"select file",
  "upload_success":"uploaded successfully",
  "close":"close"
  },
  "fa":{
  "build":"ساخت ویدیو",
  "select_from_gallery":"انتخاب از گالری",
  "from_url":"دانلود از آدرس",
  "upload":"آپلود",
  "error":"خطایی رخ داد!",
  "image":"فایل تصویری",
  "audio":"فایل صوتی",
  "video":"فایل ویدئو",
  "files":"فایل های دیگر",
  "select_type":"نوع فایل را مشخص کنید",
  "select_file":" فایل را مشخص کنید",
  "upload_success":"با موفقیت آپلود شد",
  "close":"بستن"
  }
  }
</i18n>
<script>

  export default {
    props: ['value', 'label', 'main', 'type', 'obj', 'id', 'url'],
    data() {
      return {
        // loader
        videoMergeLoading: false,
        data: {},
        choose: 'build',
      }
    },
    computed: {
      chooseListValues() {
        return [
          {text: this.$t('build'), value: 'build'},
          {text: this.$t('select_from_gallery'), value: 'gallery'},
          {text: this.$t('from_url'), value: 'url'},
          {text: this.$t('upload'), value: 'upload'},
        ]
      },
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
        this.$axios.request(method, url, requestConfig).then(res => {
          this.data = res;
        }).catch(err => {
          console.log({err})
          this.$swal({
            title: this.$t('error'),
            text: err
          })
        }).finally(() => {
          this.videoMergeLoading = false;
        })
      },
    }
  }
</script>
