/**
 * you can copy this file for your custom API server and change it to fit your need.
 */
export default {
  methods: {
    loadData() {
      console.log('hi from strapi');
      this.loading = true;

      let filters = this.filter || {};
      let search = this.search || {};
      let report = this.report || {};
      let sort = _.get(this.options, 'sortBy.0', 'id');
      let sortDESC = _.get(this.options, 'sortDesc.0', true) ? 'DESC' : 'ASC';
      let page = _.get(this.options, 'page', this.page);
      let perPage = _.get(this.options, 'itemsPerPage', this.perPage);

      let meta = {
        report,
        ...filters,
        ...search
      };

      // check if this path exists
      this.$axios.$get(this.resource + '/count', {params: meta}).then(res => {
        this.length = res;
      });

      // strapi API
      let _sort = sort + ':' + sortDESC;
      meta._sort = _sort;
      if (perPage > 0) {
        meta._limit = perPage
        meta._start = (page - 1) * perPage
      }

      this.$axios.$get(this.resource, {params: meta}).then(res => {
        this.list = res;
        if (this.length < 1 && res.length > 0) {
          this.length = res.length;
        }
      }).catch(error => {
        this.$notifWarning(error);
      }).finally((res) => {
        this.loading = false;
      })
    },
    doFilter(val) {
      // TODO: customize filter
      setTimeout(() => {
        this.loadData();
      }, 500)
    },
    doExcel(val) {
      return this.doExcel(val, true)
    },
    doReport(val, excel = false) {
      //console.log({val})
      this.loading = true;

    },
    doSearch(val) {
      this.searchText = val;
      this.search = {};
      if (val) {
        // Strapi API
        _.forEach(this.fields, (field) => {
          if (_.get(field, 'searchable', true)) _.set(this.search, _.get(field, 'value', 'title') + '_contains', val);
        })
      }

      // search after 1 second's
      setTimeout(() => {
        if (this.searchText == val) {
          this.loadData();
        }
      }, 500)
    },
    update(id, property, val) {
      let data = {};
      data[property] = val;
      return this.$axios.$put(this.resource + '/' + id, data).then(res => {
        this.loadData();
        this.$notifSuccess('با موفقیت بروز شد.')
      }).catch(err => {
        this.$notifError(err)
      })
    },
    toggle(id, val) {
      return this.$strapi.update()
    },
    delete(id, reload = true) {
      this.loading = true;
      return this.$axios.$delete(this.resource + '/' + id).then(res => {
        if (reload) {
          this.loadData();
        }
        return true;
      }).catch(err => {
        this.$Helper.showError(err, this.$swal, this.$router)
        return false;
      }).finally(() => {
        this.loading = false;
      })
    },
  }
}
