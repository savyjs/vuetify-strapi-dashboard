<template>
  <section>
    <v-container grid-list-lg>
      <v-card class="my-1">
        <v-card-header :color="_.get(value,'color','primary')" margin-right="1%" width="98%" classes="pl-5">
          <h3 class="pr-5">
            <v-icon class="mx-1">{{headerIcon || _.get(value,'icon','archive')}}</v-icon>
            {{ title }}
          </h3>
          <v-spacer/>
          <v-btn v-if="_.get(value,'deleteAll',true)" elevation="5" small class="red--text mx-2" color="white"
                 @click="deleteItems">
            <v-icon class="mr-1">delete</v-icon>
            <b>{{$t("delete")}}</b>
          </v-btn>
          <v-btn v-if="_.get(value,'backBtn',true)" elevation="5" small class="mx-1 warning--text"
                 color="white"
                 @click="$router.go(-1)">
            <v-icon class="mr-1" small>arrow_back_ios</v-icon>
            <b>{{$t("back")}}</b>
          </v-btn>
          <v-btn v-if="_.get(value,'newItem',true)" elevation="5" small class="mx-1 success--text"
                 color="white" :to="resource + '/create'">
            <v-icon class="mr-1" small>add</v-icon>
            <b>{{$t("create")}}</b>
          </v-btn>
          <download-excel :fetch="excelData" :name="title+'.xls'" :title="title">
            <v-btn :disabled="!_.has(list,0)" v-if="_.get(value,'excel',true)" elevation="5" small
                   class="white--text mx-1" color="success">
              <v-icon class="mr-1">move_to_inbox</v-icon>
              {{$t("download_excel")}}
            </v-btn>
          </download-excel>
          <v-btn fab icon v-if="_.get(value,'refresh',true)" small class="success--text mx-1" color="white"
                 @click="loadData({},{})">
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-card-header>
        <v-card-actions>
          <v-layout wrap row class="pa-1">
            <v-flex xs12 md6 class="pa-1">
              <span>
                <small class="success--text darken-2">
                <v-icon>info</v-icon>
                {{$t("total")}}:  {{$Helper.numberFormat(length)}}
                </small>
              </span>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
      <v-expansion-panels class="my-1" v-if="_.get(value,'filterable',true) || _.get(value,'searchable',true)">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span>
              <v-icon class="mx-1">filter_list</v-icon>
            {{$t("filters")}}
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <filters
              :hasFilter="_.get(value,'filterable',true)"
              :hasSearch="_.get(value,'searchable',true)"
              :hasReport="_.get(value,'report',false)"
              v-model="filter"
              :fields="fields"
              @input="doFilter"
              @search="doSearch"
            ></filters>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels class="my-1" v-if="_.get(value,'reportable',false)">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span>
              <v-icon class="mx-1">filter_list</v-icon>
            {{$t("report_filters")}}
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <report
              v-model="report"
              :fields="fields"
              @input="doReport"
              @excel="doExcel"
            ></report>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <table-list
            :hasFilter="_.get(value,'filterable',true)"
            :hasSort="_.get(value,'sortable',true)"
            :hasSearch="_.get(value,'searchable',true)"
            :showSelect="_.get(value,'deleteAll',true)"
            :showExpand="true"
            :length="length"
            :name="name"
            :resource="resource"
            :options="options"
            :loading="loading"
            :fields="fields"
            :title="title"
            :main="value"
            :items="list"
            @deleteItem="deleteItem"
            @selected="doSelect"
            @input="search"
            @update="update"
            @reload="loadData"
            @options="setOptions"
          />
        </v-card-text>
      </v-card>
    </v-container>
  </section>
</template>
<i18n>
  {
  "en":{
  "delete":"delete",
  "create":"new item",
  "back":"back",
  "success":"done",
  "download_excel":"download excel",
  "total": "total",
  "filters": "search filters",
  "report_filters": "report filters"
  },
  "fa":{
  "delete":"حذف",
  "success":"با موفقیت انجام شد",
  "create":"آیتم جدید",
  "back":"برگشت",
  "download_excel":"دانلود اکسل",
  "total": "تعداد کل",
  "filters": "فیلتر جست و جو",
  "report_filters": "فیلتر گزارش"
  }
  }
</i18n>
<script>

  import formHelper from "./FormHelper";

  export default {
    name: 'ListPage',
    props: ['value'],
    mixins: [formHelper]
  }
</script>
