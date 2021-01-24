<template>
  <section>
    <v-container grid-list-lg>
      <v-card class="my-1">
        <v-card-header :color="_.get(value,'color','primary')" margin-right="1%" width="98%" classes="pl-5">
          <h3 class="pr-5">
            <v-icon small>{{_.get(value,'icon','archive')}}</v-icon>
            {{ title }}
          </h3>
          <v-spacer/>
          <v-btn v-if="_.get(value,'deleteAll',true)" elevation="5" small class="red--text mx-3" color="white"
                 @click="deleteItems">
            <v-icon>delete</v-icon>
            <b>حذف</b>
          </v-btn>
          <v-btn v-if="_.get(value,'newItem',true)" elevation="5" small class="success--text" color="white"
                 :to="`/admin/${name}/create`">
            <v-icon>note_add</v-icon>
            <b>ثبت جدید</b>
          </v-btn>
          <download-excel :fetch="excelData" :name="title+'.xls'" :title="title">
            <v-btn :disabled="!_.has(list,0)" v-if="_.get(value,'excel',true)" elevation="5" small
                   class="white--text mx-1" color="success">
              دانلود اکسل
              <v-icon>move_to_inbox</v-icon>
            </v-btn>
          </download-excel>
          <v-btn fab icon v-if="_.get(value,'refresh',true)" small class="success--text mx-1" color="white"
                 @click="loadData">
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-card-header>
        <v-card-actions>
          <v-layout wrap row class="pa-1">
            <v-flex xs12 md6 class="pa-1 text-right">
              <span>
                <small class="success--text darken-2">
                <v-icon>info</v-icon>
                تعداد کل:  {{Helper.numberFormat(length)}}
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
            فیلتر و جست و جو
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <filters
              :hasFilter="_.get(value,'filterable',true)"
              :hasSearch="_.get(value,'searchable',true)"
              :hasReport="_.get(value,'report',false)"
              v-model="filter"
              :fields="Fields"
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
            فیلتر گزارش ساز
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <report
              v-model="report"
              :fields="Fields"
              @search="doReport"
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
<script>

  import Filters from "./Filters";
  import TableList from "./TableList";
  import formHelper from "./FormHelper";
  import Report from "./Report";
  //import formHelper from "~/components/admin/common-ssr/laravel";

  export default {
    name: 'ListPage',
    props: ['value'],
    mixins: [formHelper],
    data() {
      return {
        ...this.value,
      }
    },
    components: {Report, TableList, Filters},
  }
</script>
