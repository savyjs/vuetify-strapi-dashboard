<template>
  <section>
    <v-container grid-list-lg>
      <v-card>
        <v-card-header class="text-center mb-5">
          <v-icon class="ml-2">{{icon || 'fa-search'}}</v-icon>
          {{title}}
          <v-spacer/>
          <v-btn fab icon x-small class="mx-2" @click="header.show=!header.show">
            <v-icon class="mx-1">fa-angle-{{header.show ? 'up' : 'down'}}</v-icon>
          </v-btn>
        </v-card-header>

        <v-card elevation="0" tile class="pa-5 pb-0">
          <v-scroll-y-transition>
            <filters
              :loading="loading"
              :main="form"
              v-show="header.show"
              v-model="filter"
              :fields="Fields"
              @input="doFilter"
              @search="doSearch"
            ></filters>
          </v-scroll-y-transition>
        </v-card>
      </v-card>
      <v-scroll-x-reverse-transition>
        <v-card v-show="length" class="my-1">
          <v-card-actions>
            <v-layout wrap row class="pa-1">
              <v-flex xs12 md6 class="pa-1 text-right">
              <span>
                <small class="success--text darken-2">
                <v-icon>info</v-icon>
                تعداد کل:  {{$Helper.numberFormat(length)}}
                </small>
              </span>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-scroll-x-reverse-transition>
      <v-scroll-x-reverse-transition>
        <v-card v-show="length" v-if="_.get(form,'search',true)" class="my-1">
          <v-card-actions>
            <v-layout wrap row class="pa-1">
              <v-flex xs12 class="pa-1 text-right">
              <span>
                <v-text-field
                  outlined
                  clearable
                  dense
                  v-model="search"
                  :prepend-icon="_.get(form,'searchIcon','جست و جو')"
                  :label="_.get(form,'searchTxt','جست و جو')"/>
              </span>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-scroll-x-reverse-transition>
      <v-scroll-y-reverse-transition>
        <v-card v-show="length">
          <v-card-text>
            <table-list
              :main="value"
              :search="search"
              :showSelect="false"
              :showExpand="true"
              :length="length"
              :name="name"
              :options="options"
              :loading="loading"
              :headers="headers"
              :title="title"
              :items="list"
              @deleteItem="deleteItem"
              @selected="doSelect"
              @input="doSearch"
              @update="update"
              @options="setOptions"
            />
          </v-card-text>
        </v-card>
      </v-scroll-y-reverse-transition>
    </v-container>
  </section>
</template>
<script>
  // import VCardHeader from "~/components/admin/ui/VCardHeader";

  import Filters from "./Filters";
  import TableList from "./TableList";
  import formHelper from "./strapi";
  //import formHelper from "~/components/admin/common-ssr/laravel";

  export default {
    props: ['value'],
    ...formHelper,
    data() {
      return {
        header: {show: true},
        ...form$Helper.data,
        ...this.value,
      }
    },
    //components: {VCardHeader, TableList, Filters},
  }
</script>
