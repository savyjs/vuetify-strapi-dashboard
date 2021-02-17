<template>
  <v-row>
    <v-col
      v-if="hasFilter!==false && _.get(field,'filterable',undefined)!==false"
      v-for="field in fields"
      :key="field.value"
      cols="12" md="6" lg="4" @keydown.enter="doFilter">
      <common-types-filter-field
        :outlined="true"
        :has-label="true"
        :field="field"
        v-model="data[field.value]"
      />
    </v-col>
    <v-col cols="12" lg="12" class="text-left">
      <v-btn v-if="hasFilter" small color="success darken-3" @click="doFilter">
        <v-icon class="mx-1">move_to_inbox</v-icon>
        {{$t("filter")}}
      </v-btn>
      <v-btn small absolute right  class="pull-right" color="warning" @click="clear">
        <v-icon class="mx-1">close</v-icon>
        {{$t("clear")}}
      </v-btn>
    </v-col>
  </v-row>
</template>
<i18n>
  {
  "en":{
  "search":"search",
  "clear":"clear",
  "filter":"filter"
  },
  "fa":{
  "search":"جست و جو",
  "filter":"فیلتر",
  "clear":"پاک کردن"
  }
  }
</i18n>
<script>
  import _ from 'lodash'

  export default {
    name: 'Filters',
    props: ['value', 'isQuery', 'hasSearch', 'hasFilter', 'fields'],
    data() {
      return {
        id: null,
        search: '',
        data: {}
      }
    },
    watch: {
      value: {
        handler(val) {
          this.data = val;
        },
        deep: true
      },
    },
    created() {
      this._ = _;
    },
    methods: {
      clear() {
        this.data =[];
        this.$emit('input', {});
        return false;
      },
      doFilter() {
        this.$emit('input', this.data);
        return false;
      }
    }
  }
</script>
