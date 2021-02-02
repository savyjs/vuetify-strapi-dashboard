<template>
  <div>
    <v-select :items="chooseListValues" filled dense :label="label" v-model="choose"/>
    <template v-if="choose=='gallery'">
      <strapi-media-audio-list :label="label" :getId="true" v-model="data"/>
    </template>
    <template v-if="choose=='upload'">
      <media-uploader type="audio" :label="label" :getId="true" v-model="data"/>
    </template>
  </div>
</template>
<script>
  import StrapiMediaAudioList from "./StrapiMediaAudioList";
  import MediaUploader from "./mediaUploader";

  export default {
    components: {MediaUploader, StrapiMediaAudioList},
    props: ['value', 'main', 'label', 'type', 'getObj', 'id', 'url'],
    data() {
      return {
        data: {},
        choose: 'upload',
        chooseListValues: [
          {text: 'انتخاب از گالری', value: 'gallery'},
          {text: 'آپلود', value: 'upload'},
        ],
      }
    },
    watch: {
      value: {
        handler(val) {
          this.data = val
        },
        deep: true
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
