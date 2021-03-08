<template>
  <div v-show="groups.length">
    <v-subheader>
      {{form.title || ''}}
    </v-subheader>
    <div :class="'text-center ' + vsd.rtl ? 'rtl':'ltr'">
      <v-row
        :class="`text-center d-flex align-baseline justify-space-between `"
        v-model="titlePage">
        <v-col class="flex-grow-1 flex-shrink-1" flat tile disabled outlined v-for="(gTitle,i) in getPageTitles"
               :key="i">
          <v-card height="40px" tile outlined :dark="i==page-1" class="d-flex justify-center align-center"
                  :elevation="i==page-1 ? 5 : 0"
                  :color="i==page-1 ? 'warning' : (i<page-1 ? 'success lighten-5' : '')">
            <v-btn absolute disabled :color="i==page-1 ? 'grey lighten-1' : (i<page-1 ? 'success lighten-3' : '')"
                   fab
                   x-small
                   :class="` mx-2`" :style="`opacity: .5;` + vsd.rtl ? `right:0` : 'left:0' ">
              <b>{{parseInt(i)+1}}</b>
            </v-btn>
            <v-icon v-if="false" class="mx-1">info</v-icon>
            {{gTitle}}
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-progress-linear class="my-5" v-if="totalPages > 1"
                       :buffer-value="page*100/totalPages"
                       color="success"
                       stream
                       striped
                       :value="titlePage*100/totalPages"
    ></v-progress-linear>
    <validation-observer
      ref="form"
      v-slot="{ handleSubmit, reset ,invalid}"
    >
      <div v-for="(group,index) in groups" v-if="_.includes(getPages[page-1],group.id)" :key="index">
        <form-elements
          v-model="formData[group.name]"
          :id="group.id"
          :config="config"
        />
      </div>
      <v-card :class="`d-flex justify-space-around py-5 ` + vsd.rtl ? 'rtl':''" tile flat>
        <v-btn depressed :disabled="btnLoading" v-if="page > totalPages" @click="reset(previous)" color="warning">
          <v-icon>edit</v-icon>
          {{$t('reset')}}
        </v-btn>
        <v-btn depressed :disabled="btnLoading" v-if="page > 1 && page <= totalPages" @click="previous" color="warning">
          <v-icon>{{vsd.rtl ? "arrow_right" : "arrow_left"}}</v-icon>
          {{$t('previous')}}
        </v-btn>
        <v-btn @click="handleSubmit(next)" :disabled="!validity" depressed :loading="btnLoading"
               v-if="page < totalPages"
               color="success">
          <v-icon>save</v-icon>
          <v-icon>{{vsd.rtl ? "arrow_left" : "arrow_right"}}</v-icon>
          {{$t('next')}}
        </v-btn>
        <v-btn depressed :disabled="!validity" :loading="btnLoading" @click="next" v-if="page == totalPages"
               color="success">
          <v-icon>assignment</v-icon>
          {{$t('preview')}}
        </v-btn>
        <v-btn depressed :disabled="!validity" :loading="btnLoading" @click="next" v-if="page > totalPages"
               color="success">
          <v-icon>save</v-icon>
          {{$t('save')}}
        </v-btn>
      </v-card>
    </validation-observer>
    <v-pagination
      v-show="false"
      v-model="page"
      v-if="totalPages > 1"
      :length="totalPages"
    ></v-pagination>
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
    props: ['value', 'type', 'validity', 'config'],
    data() {
      return {
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
      previous() {
        this.btnLoading = true;
        this.page--;
        this.btnLoading = false;
      },
      next() {
        this.btnLoading = true;
        this.$refs.form.validate()
        this.$emit('validate')
        this.page++;
        this.btnLoading = false;
      },
      save() {
        this.btnLoading = true;
        this.$emit('validate')
        this.btnLoading = false;
      },
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
    },
    created() {
      this._ = _;
    }
  }
</script>
