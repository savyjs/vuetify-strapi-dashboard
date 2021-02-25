<template>
  <span>
    <template v-if="_.isArray(getTypes)">
      <v-select item-text="text" item-value="value" :items="getTypes" dense :label="$t('select_type')"
                v-model="choosedType"/>
    </template>

  <v-file-input
    dense
    :loading="loader"
    :placeholder="placeholder || null "
    v-if="!url"
    filled
    :label="$t('select_file')"
    v-model="file"
  />

     <v-subheader>{{label}}</v-subheader>
      <audio style="max-width: 90%" v-if="canPlay('audio')" controls>
          <source :src="baseURL + url">
        </audio>
      <video style="max-width: 90%" v-if="canPlay('video')" controls>
          <source :src="baseURL + url">
        </video>
      <v-avatar
        v-if="canPlay('photo')"
        color="deep-purple darker-4"
        size="40"
      ><v-img contain :src="baseURL + url" fab/>
    </v-avatar>

    <v-banner single-line v-if="url">
    {{$t("upload_success")}}
    <template v-slot:actions>
      <v-btn
        text
        icon
        @click="file=null"
        color="red accent-4"
      >
        <v-icon>delete</v-icon>
      </v-btn>
    </template>
  </v-banner>
    </span>
</template>

<i18n>
  {
  "en":{
  "select_type":"select file type",
  "select_file":"select file",
  "upload_success":"uploaded successfully",
  "operation":"Operation",
  "search":"search",
  "close":"close",
  "image":"image",
  "audio":"audio",
  "video":"video",
  "files":"files",
  "new":"close",
  "confirmation":"are you sure?",
  "edit":"close",
  "reload":"reload",
  "value":"value",
  "save":"save",
  "name":"name",
  "new":"new item",
  "close":"close"
  },
  "fa":{
  "image":"فایل تصویری",
  "audio":"فایل صوتی",
  "video":"فایل ویدئو",
  "files":"فایل های دیگر",
  "select_type":"نوع فایل را مشخص کنید",
  "select_file":" فایل را مشخص کنید",
  "upload_success":"با موفقیت آپلود شد",
  "operation":"عملیات",
  "search":"جست و جو",
  "close":"لغو",
  "new":"جدید",
  "confirmation":"آیا مطمئن هستید که می خواهید این مورد را حذف کنید؟",
  "edit":"ویرایش",
  "reload":"بازنشانی",
  "value":"مقدار",
  "save":"ذخیره",
  "name":"نام",
  "new":"گزینه جدید",
  "close":"بستن"
  }
  }
</i18n>
<script>
  import _ from 'lodash'

  export default {
    props: ['value', 'label', 'getId', 'getObj', 'type', 'types', 'placeholder'],
    data() {
      return {
        choosedType: null,
        file: null,
        data: null,
        loader: false
      }
    },
    computed: {
      defaultTypes() {
        return [
          {text: this.$t('image'), value: 'photo'},
          {text: this.$t('audio'), value: 'audio'},
          {text: this.$t('video'), value: 'video'},
          {text: this.$t('files'), value: 'file'},
        ]
      },
      url() {
        return _.get(this.data, 'url', null);
      },
      baseURL() {
        return process.env.API_URL;
      },
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
    created() {
      this._ = _;
    },
    mounted() {
      if (this.value) {
        if (_.has(this.value, 'id')) {
          this.data = this.value;
        }
      }
    },
    watch: {
      file(val) {
        if (val == null) return this.data = null;
        this.loader = true;
        let formData = new FormData();
        formData.append('files', val);
        this.$axios.post('upload',formData).then(result => {
          let res = _.get(result, 0, {});
          this.data = res;
          this.$notifSuccess(this.$t('upload_success'))
        }).catch(err => {
          this.data = null;
          this.$notifError(err);
        }).finally(() => {
          if (_.get(this, 'getId', undefined) !== undefined) {
            this.$emit('input', this.data.id)
          } else if (_.get(this, 'getObj', undefined) !== undefined) {
            this.$emit('input', this.data)
          } else {
            this.$emit('input', this.data.url)
          }
          this.loader = false;
        })
      },
      getType() {
        this.file = null;
        this.data = null;
      }
    },
    methods: {
      canPlay(val) {
        if (!_.has(this.data, 'id', null)) {
          return false;
        } else if (!this.type) {
          return false;
        } else if (_.isArray(this.type)) {
          return this.choosedType == val;
        } else {
          return this.type == val;
        }
      }
    }
  }
</script>
