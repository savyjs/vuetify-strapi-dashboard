<template>
  <v-row>
    <v-col v-if="hasSearch!==false" cols="12">
      <div>
        <v-text-field
          clearable
          dense
          v-model="search"
          outlined
          :label="$t('search')"
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
        :outlined="true"
        :has-label="true"
        :field="field"
        v-model="data[field.value]"
      />
    </v-col>
    <v-col cols="12" lg="12" class="text-left">
      <v-btn small color="info" @click="doSearch">
        <v-icon class="mx-1">search</v-icon>
        {{$t("search")}}
      </v-btn>
      <v-btn v-if="hasFilter" small color="success darken-3" @click="filter">
        <v-icon class="mx-1">move_to_inbox</v-icon>
        {{$t("filter")}}
      </v-btn>
      <v-btn small class="pull-right" color="warning" @click="clearFilter">
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
  "filter":"filter"
  },
  "fa":{
  "search":"جست و جو",
  "filter":"فیلتر"
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

    computed: {
      formData() {
        let filters = _.omitBy(this.data, v => (_.isBoolean(v) || _.isFinite(v)) ? false : _.isEmpty(v));
        return filters;
      }
    },
    created() {
      this._ = _;
    },
    methods: {
      clearSearch() {
        this.$emit('search', {});
        return false;
      },
      clearFilter() {
        this.clearSearch();
        this.$emit('input', {});
        return false;
      },
      filter() {
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
