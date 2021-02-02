<template>
  <v-row>
    <v-col v-if="hasSearch!==false" cols="12">
      <div>
        <v-text-field
          clearable
          dense
          v-model="search"
          outlined
          label="جست و جو"
          @keydown.enter="doSearch"
          @change="doSearch"
          append-icon="search"
        />
      </div>
    </v-col>
    <v-col
      v-if="hasFilter!==false && _.get(field,'filterable',undefined)!==false"
      v-for="field in fields"
      :key="field.value"
      cols="12" md="6" lg="4" @keydown.enter="filter">
      <common-types-filter-field
        :field="field"
        v-model="data[field.value]"
      />
    </v-col>
    <v-col cols="12" lg="12" class="text-left">
      <v-btn small color="info" @click="filter">
        <v-icon class="mx-1">search</v-icon>
        جست و جو
      </v-btn>
      <v-btn v-if="hasReport" small color="success darken-3" @click="filter">
        <v-icon class="mx-1">move_to_inbox</v-icon>
        گزارش
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
  import CommonTypesFilterField from "./CommonTypesFilterField";

  export default {
    components: {CommonTypesFilterField},
    props: ['value', 'isQuery', 'hasSearch', 'hasReport', 'hasFilter', 'fields'],
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
        console.log(1, this.formData, this.data)
        this.$emit('input', this.formData);
        return false;
      },
      doSearch(val) {
        // search after 1 second's
        setTimeout(() => {
          if (this.search == val) {
            this.$emit('search', this.search);
          }
        }, 500)
      }
    }
  }
</script>
