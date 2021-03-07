<template>
  <div>
    <v-subheader>
      {{form.title || ''}}
    </v-subheader>
    <div v-for="(group) in groups">
      <form-elements
        v-model="formData[group.name]"
        :id="group.id"
        :config="config"
      />
    </div>
  </div>
</template>
<i18n>
  {
  "en":{
  "FORM_ID_NOT_FOUND": "can not find form id",
  "FORM_LOAD_ERROR": "can not load form"
  },
  "fa":{
  "FORM_ID_NOT_FOUND": "مشکلی در پیدا کردن شناسه فرم رخ داد",
  "FORM_LOAD_ERROR": "مشکلی در بارگذاری فرم رخ داد"
  }
  }
</i18n>
<script>
  import _ from 'lodash'
  // this component gets form config and shows form groups
  export default {
    props: ['value', 'type', 'config'],
    data() {
      return {
        formData: {
          ...this.value
        },
        form: {},
      }
    },
    computed: {
      groups() {
        return _.get(this.form, 'groups', []);
      }
    },
    methods: {
      loadForm(config) {
        let url = this.vsd.builder.form;
        let id = _.get(config, 'formId', null)
        if (id) {
          this.$axios.$get(url + '/' + id).then(res => {
            this.form = res;
          }).catch(err => {
            this.$notifWarning('FORM_LOAD_ERROR')
          })
        } else {
          this.$notifWarning('FORM_ID_NOT_FOUND')
        }
      }
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
    mounted() {
      this.loadForm(this.config);
    }
  }
</script>
