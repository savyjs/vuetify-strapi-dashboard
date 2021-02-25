<template>
  <div>
    <label>{{label}}</label>
    <v-row>
      <v-col cols="12" sm="4">
        <v-overflow-btn
          v-model="from"
          class="my-2"
          :items="select_from_list"
          :label="$t('save_from')"
          item-value="value"
          item-text="text"
        ></v-overflow-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-overflow-btn
          v-model="choosedType"
          class="my-2"
          :items="select_type_list"
          :label="$t('file_format')"
          item-value="value"
          item-text="text"
        ></v-overflow-btn>
      </v-col>
      <v-col cols="12" sm="12" v-if="choosedType && from">
        <media-uploader
          v-if="from=='upload'"
          :label="label"
          :get-id="getId"
          :get-obj="getObj"
          :type="choosedType"
          v-model="file"
        />
        <strapi-media-list
          v-else-if="from=='gallery'"
          :label="label"
          :get-id="getId"
          :get-obj="getObj"
          :type="choosedType"
          v-model="file"
        />
      </v-col>
    </v-row>
  </div>
</template>
<i18n>
  {
  "en":{
  "select_type":"select file type",
  "select_file":"select file",
  "save_from":"save from",
  "file_format":"file format",
  "upload_success":"uploaded successfully",
  "search":"search",
  "close":"close",
  "select_from_gallery":"select from gallery",
  "image":"image",
  "audio":"audio",
  "video":"video",
  "files":"files",
  "new":"close",
  "close":"close"
  },
  "fa":{
  "select_from_gallery":"انتخاب از گالری",
  "save_from":"ذخیره سازی از",
  "file_format":"فرمت فایل",
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
  import _ from 'lodash'

  export default {
    props: ['value', 'label', 'type', 'getId', 'getObj'],
    data() {
      return {
        file: null,
        from: null,
        choosedType: null,
      }
    },
    computed: {
      select_from_list() {
        return [
          {text: this.$t('upload'), value: 'upload'},
          {text: this.$t('select_from_gallery'), value: 'gallery'},
        ]
      },
      select_type_list() {
        return [
          {text: this.$t('image'), value: 'photo'},
          {text: this.$t('audio'), value: 'audio'},
          {text: this.$t('video'), value: 'video'},
          {text: this.$t('files'), value: 'file'},
        ]
      },
    },
    created() {
      this._ = _;
    },
    watch: {
      from() {
        this.file = null
      },
      choosedType() {
        this.file = null
      },
      file: {
        handler(val) {
          return this.$emit('input', val);
        },
        deep: true,
      }
    }
  }
</script>
