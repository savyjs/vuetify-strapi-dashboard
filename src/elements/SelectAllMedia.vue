<template>
  <div>
    <label>{{label}}</label>
    <v-row>
      <v-col cols="12" sm="4">

        <v-overflow-btn
          v-model="from"
          class="my-2"
          :items="select_from_list"
          label="ذخیره سازی از"
          item-value="value"
          item-text="text"
        ></v-overflow-btn>
      </v-col>

      <v-col cols="12" sm="4">

        <v-overflow-btn
          v-model="choosedType"
          class="my-2"
          :items="select_type_list"
          label="فرمت فایل"
          item-value="value"
          item-text="text"
        ></v-overflow-btn>
      </v-col>

      <v-col cols="12" sm="12" v-if="choosedType && from">
        <media-uploader v-if="from=='upload'" :label="label" :get-id="getId" :get-obj="getObj" :type="choosedType"
                        v-model="file"/>
        <strapi-media-list v-else-if="from=='gallery'" :label="label" :get-id="getId" :get-obj="getObj"
                           :type="choosedType"
                           v-model="file"/>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import MediaUploader from "./mediaUploader";
  import StrapiMediaList from "./StrapiMediaList";

  export default {
    components: {StrapiMediaList, MediaUploader},
    props: ['value', 'label', 'type', 'getId', 'getObj'],
    data() {
      return {
        file: null,
        from: null,
        choosedType: null,
        select_from_list: [
          {text: 'آپلود مستقیم', value: 'upload'},
          {text: 'گالری', value: 'gallery'},
        ],
        select_type_list: [
          {text: 'تصویر', value: 'photo'},
          {text: 'ویدئو', value: 'video'},
          {text: 'صوت', value: 'audio'},
          {text: 'فایل', value: 'file'},
        ]
      }
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
