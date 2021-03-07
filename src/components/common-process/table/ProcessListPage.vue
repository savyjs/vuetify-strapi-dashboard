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
            <v-icon class="mx-1">delete</v-icon>
            <b>{{$t("delete")}}</b>
          </v-btn>
          <v-btn v-if="_.get(value,'newItem',true)" elevation="5" small class="mx-1 success--text"
                 color="white" :to="path + '/create'">
            <v-icon class="mx-1" small>add</v-icon>
            <b>{{$t("create")}}</b>
          </v-btn>
          <download-excel :fetch="excelData" :name="title+'.xls'" :title="title">
            <v-btn :disabled="!_.has(list,0)" v-if="_.get(value,'excel',true)" elevation="5" small
                   class="white--text mx-1" color="success">
              <v-icon class="mx-1">move_to_inbox</v-icon>
              {{$t("download_excel")}}
            </v-btn>
          </download-excel>
          <v-btn :title="$t('refresh')" fab icon v-if="_.get(value,'refresh',true)" small class="success--text mx-1"
                 color="white"
                 @click="loadData({},{})">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn :title="$t('previous')" fab icon v-if="_.get(value,'backBtn',true)" small class="success--text mx-1"
                 color="white"
                 @click="$router.go(-1)">
            <v-icon>keyboard_backspace</v-icon>
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
      <v-expansion-panels class="my-1" v-if="_.get(value,'searchable',true)">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span>
              <v-icon class="mx-1">search</v-icon>
            {{$t("search")}}
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <search
              :hasSearch="_.get(value,'searchable',true)"
              v-model="search"
              :fields="fields"
              @input="doSearch"
            ></search>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels class="my-1" v-if="_.get(value,'filterable',true)">
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
              v-model="filter"
              :fields="fields"
              @input="doFilter"
            ></filters>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels class="my-1" v-if="_.get(value,'reportable',false)">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span>
              <v-icon class="mx-1">bolt</v-icon>
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
          <process-table-list
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
            :elements="elements"
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
  "download_excel":"excel",
  "total": "total",
  "search": "Search",
  "filters": "Filters",
  "confirmation":"do you want to delete item(s)?",
  "refresh":"refresh",
  "previous":"previous",
  "report_filters": "Report"
  },
  "fa":{
  "delete":"حذف",
  "success":"با موفقیت انجام شد",
  "create":"آیتم جدید",
  "back":"برگشت",
  "refresh":"بروزرسانی",
  "previous":"قبلی",
  "download_excel":"اکسل",
  "total": "تعداد کل",
  "search": "جست و جو",
  "filters": "فیلتر",
  "edit":"ویرایش",
  "cancel":"لغو",
  "show":"نمایش",
  "delete":"حذف",
  "yes":"بله",
  "confirmation":"آیا مطمئن هستید می خواهید این مورد را حذف کنید؟",
  "report_filters": "فیلتر گزارش"
  }
  }
</i18n>
<script>

  import formHelper from "./helper";

  export default {
    props: ['value'],
    mixins: [formHelper]
  }
</script>
