<template>
  <v-row>
    <v-col cols="12" md="6" lg="4">
      <v-responsive @keydown.enter="doFilter">
        <v-text-field append-icon="input" dense v-model="id" outlined label="شناسه"></v-text-field>
      </v-responsive>
    </v-col>
    <v-col cols="12" lg="12" class="text-left">
      <v-btn color="info" @click="doFilter()">
        <v-icon class="mx-1">search</v-icon>
        فیلتر
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
  const filterableFields = ['id']; // fields for filter
  export default {
    props: ['value', 'headers'],
    data() {
      return {
        id: null,
        filter: {},
      }
    },
    watch: {
      value(obj) {
        _.forEach(obj, (key, val) => {
          _.set(this, key, val)
        })
      },
      filter(val) {
        let currentQuery = _.omit(_.get(this.$route, 'query', {}) || {}, filterableFields);
        let newQuery = {...currentQuery, ...this.getFilterQuery};
        this.$router.push({query: newQuery});
      }
    },
    computed: {
      getFilterQuery() {
        return this.filter;
      },
      formData() {
        let filters = {};
        if (this.id) {
          filters.id = this.id;
        }
        return filters;
      }
    },
    watchQuery: true,
    mounted() {
      this.setQueryToPage();
    },
    methods: {
      doFilter() {
        this.filter = {};
        this.filter = this.formData;
      },
      setQueryToPage() {
        let query = this.$route.query;
        _.set(this, 'id', _.get(query, 'id', null));
      }
    }
  }
</script>
