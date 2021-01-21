<template>
  <v-row>
    <v-col
      v-for="field in fields" v-if="_.get(field,'filterable',undefined)!==false"
      :key="field.value"
      :xl="_.get(field,'xl',12)"
      :lg="_.get(field,'lg',12)"
      :sm="_.get(field,'sm',12)"
      :md="_.get(field,'md',12)"
      @keydown.enter="filter"
    >
      <common-types-filter-field
        :field="field"
        v-model="data[field.value]"
      />
    </v-col>
    <v-col v-if="main.searchBtn" cols="12" lg="12" class="text-left">
      <v-btn
        large
        color="error"
        :loading="loading"
        @click="filter">
        <v-icon small class="mx-1">{{main.searchIcon}}</v-icon>
        {{main.searchText}}
      </v-btn>
      <v-btn
        large
        :loading="loading"
        v-if="main.reportBtn"
        color="success darken-3"
        @click="filter">
        <v-icon class="mx-1">{{main.reportIcon}}</v-icon>
        {{main.reportText}}
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
  import CommonTypesFilterField from "./CommonTypesFilterField";

  export default {
    components: {CommonTypesFilterField},
    props: ['value', 'fields', 'main', 'loading'],
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
    computed: {
      formData() {
        let filters = _.omitBy(this.data, v => (_.isBoolean(v) || _.isFinite(v)) ? false : _.isEmpty(v));
        return filters;
      }
    },
    methods: {
      filter() {
        this.$emit('input', this.formData);
        return false;
      }
    }
  }
</script>
