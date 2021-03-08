<template>
  <v-row>
    <v-col cols="12">
      <v-subheader>
        {{group.title || ''}}
      </v-subheader>
    </v-col>
    <v-col cols="12">
      <v-alert v-html="group.pre_text" type="info" v-show="_.get(group,'pre_text','')"/>
    </v-col>
    <v-col
      v-for="element in elements"
      v-if="_.get(element,type,undefined)!==false"
      :key="element.value"
      :cols="_.get(element,'cols',12)"
      :sm="_.get(element,'sm',12)"
      :md="_.get(element,'md',6)"
      :lg="_.get(element,'lg',4)"
    >
      <CommonProcessTypeField
        v-model="formData[element.name]"
        :formData="formData"
        :element="element"
        :type="type"
        :errors="errors"
        :config="config"
      />
    </v-col>
    <v-col cols="12">
      <v-alert v-html="group.after_text" type="info" v-show="_.get(group,'after_text','')"/>
    </v-col>
  </v-row>
</template>
<i18n>
  {
  "en":{
  "GROUP_ID_NOT_FOUND": "can not find group id",
  "GROUP_LOAD_ERROR": "can not load group"
  },
  "fa":{
  "GROUP_ID_NOT_FOUND": "مشکلی در پیدا کردن شناسه گروه رخ داد",
  "GROUP_LOAD_ERROR": "مشکلی در بارگذاری گروه رخ داد"
  }
  }
</i18n>
<script>
  import _ from 'lodash'
  // this component gets form config and shows form groups
  export default {
    props: ['value', 'id', 'type', 'config'],
    data() {
      return {
        formData: {...this.value},
        group: {},
      }
    },
    created() {
      this._ = _;
    },
    watch: {
      value: {
        handler(val) {
          _.assign(this.formData, val);
        }, deep: true
      },
      formData: {
        handler(val) {
          this.$emit('input', val)
        }, deep: true
      }
    },
    computed: {
      elements() {
        return _.get(this.group, 'elements', []);
      }
    },
    methods: {
      loadGroup(config) {
        let url = this.vsd.builder.group;
        let id = this.id
        if (id) {
          this.$axios.$get(url + '/' + id).then(res => {
            this.group = res;
          }).catch(err => {
            this.$notifWarning('GROUP_LOAD_ERROR')
          })
        } else {
          this.$notifWarning('GROUP_ID_NOT_FOUND')
        }
      }
    },
    mounted() {
      this.loadGroup(this.config);
    }
  }
</script>
