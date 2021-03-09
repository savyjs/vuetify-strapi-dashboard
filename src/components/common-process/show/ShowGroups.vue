<template>
  <v-expansion-panels multiple v-model="panels">
    <v-expansion-panel v-for="(group,index) in groups" :key="index">
      <v-expansion-panel-header>{{group.title}}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <show-elements
          v-model="formData[group.name]"
          :id="group.id"
          :config="config"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
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
    props: ['value', 'type', 'validity', 'config'],
    data() {
      return {
        panels: [0],
        btnLoading: false,
        formData: {
          ...this.value
        },
        pages: {0: []},
        page: 1,
        form: {},
      }
    },
    computed: {
      titlePage: {
        set(val) {
          this.page = val + 1
        },
        get() {
          return this.page - 1;
        }
      },
      totalPages() {
        return 1 + parseInt((Object.keys(this.getPages)).pop());
      },
      groups() {
        return _.get(this.form, 'groups', []);
      },
      getPages() {
        let pages = {0: []};
        let currentPage = 0;
        _.forEach(this.groups, (group) => {
          if (group.page_break) {
            currentPage++;
            pages[currentPage] = [];
          }
          pages[currentPage].push(group.id);
        })
        return pages;
      },
      getPageTitles() {
        let pages = {0: ""};
        let currentPage = 0;
        _.forEach(this.groups, (group) => {
          if (group.page_break) {
            currentPage++;
            pages[currentPage] = "";
          }
          pages[currentPage] = group.title;
        })
        return pages;
      },
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
      console.log(this.groups.length)
      this.panels = [0, ...Array(this.groups.length).keys()]
    },
    created() {
      this._ = _;
    }
  }
</script>
