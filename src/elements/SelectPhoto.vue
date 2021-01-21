<template>
  <div>
    <v-select :items="chooseListValues" filled dense :label="label" v-model="choose"/>
    <template v-if="choose=='gallery'">
      <strapi-media-photo-list :label="label" :getObj="getObj" :getId="getId===undefined"
                               v-model="data"/>
    </template>
    <template v-if="choose=='upload'">
      <media-uploader :label="label" :getObj="getObj" :getId="getId===undefined" v-model="data"/>
    </template>
  </div>
</template>
<script>
  import StrapiMediaPhotoList from "./StrapiMediaPhotoList";
  import MediaUploader from "./mediaUploader";

  export default {
    components: {MediaUploader, StrapiMediaPhotoList},
    props: ['value', 'label', 'type', 'obj', 'id', 'getObj', 'getId', 'url'],
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
