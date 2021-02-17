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
    <v-col cols="12" lg="12" class="text-left">
      <v-btn small color="info" @click="doSearch">
        <v-icon class="mx-1">search</v-icon>
        {{$t("search")}}
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
    name: 'Search',
    props: ['value', 'isQuery', 'hasSearch', 'fields'],
    data() {
      return {
        id: null,
        search: ''
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
        this.search ='';
        this.$emit('input', "");
        return false;
      },
      doSearch(val) {
        // search after 1 second's
        setTimeout(() => {
          if (this.search == val) {
            this.$emit('input', this.search);
          }
        }, 500)
      }
    }
  }
</script>
