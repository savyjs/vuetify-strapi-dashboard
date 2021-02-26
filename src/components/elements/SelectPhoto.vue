<template>
  <div>
    <v-select :items="chooseListValues" filled dense :label="label" v-model="choose"/>
    <template v-if="choose=='gallery'">
      <strapi-media-photo-list
        type="photo" :label="$t(label)" :getObj="getObj" :getId="getId===undefined"
        v-model="data"/>
    </template>
    <template v-if="choose=='upload'">
      <media-uploader type="photo" :label="$t(label)" :getObj="getObj" :getId="getId===undefined" v-model="data"/>
    </template>
  </div>
</template>
<i18n>
  {
  "en":{
  "select_from_gallery":"select from gallery",
  "upload":"upload",
  "select_type":"select file type",
  "select_file":"select file",
  "upload_success":"uploaded successfully",
  "close":"close"
  },
  "fa":{
  "select_from_gallery":"انتخاب از گالری",
  "upload":"آپلود",
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
    props: ['value', 'label', 'type', 'obj', 'id', 'getObj', 'getId', 'url'],
    data() {
      return {
        data: {},
        choose: 'upload',
      }
    },
    computed: {
      chooseListValues() {
        return [
          {text: this.$t('select_from_gallery'), value: 'gallery'},
          {text: this.$t('upload'), value: 'upload'},
        ]
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
    }
  }
</script>
