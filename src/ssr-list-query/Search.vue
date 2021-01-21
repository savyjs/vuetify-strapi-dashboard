<template>
  <v-row>
    <v-col cols="12">
      <div>
        <v-text-field
          clearable
          dense
          outlined
          v-model="searchText"
          label="جست و جو"
          append-icon="search"
        />
      </div>
    </v-col>
  </v-row>
</template>
<script>
  const searchableFields = ['id']; // fields for filter

  export default {
    props: ['value', 'headers'],
    data() {
      return {
        searchText: '',
        searchQuery: {}
      }
    },
    watch: {
      searchText(val) {
        this.setSearchQueryWithText(val);
        setTimeout(() => {
          let currentQuery = _.omit(_.get(this.$route, 'query', {}) || {}, searchableFields);
          if (val == this.searchText) {
            let newQuery = {...currentQuery, ...this.searchQuery, searchText: val || ''};
            console.log({newQuery});
            this.$router.push({query:newQuery})
          }
        }, 1000)
      }
    },
    watchQuery: true,
    mounted() {
      this.searchText = this.getSearchQueryText;
    },
    computed: {
      getSearchQueryText() {
        return _.get(this.$route.query, 'searchText', '');
      }
    },
    methods: {
      setSearchQueryWithText(val) {
        this.searchQuery = {};
        _.forEach(this.headers, (field) => {
          if (_.get(field, 'searchable', true)) {
            _.set(this.searchQuery, _.get(field, 'value', 'title') + '_contains', val);
          }
        })
      }
    }
  }
</script>
